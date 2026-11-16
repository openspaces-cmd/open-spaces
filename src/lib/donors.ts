// Donor report data, read live from the Open Spaces HubSpot portal.
//
// Gifts come in through HubSpot payment links (see /give), which create
// Commerce Payment records; monthly gifts also create Subscription records.
// This module pulls a year of payments, joins them to their contacts (name,
// email, mailing address), and rolls them up per donor.
//
// Requires a HubSpot Service Key in HUBSPOT_SERVICE_KEY with read
// scopes for contacts, commerce payments and subscriptions. Server-only.

const API = "https://api.hubapi.com";
const token = () => process.env.HUBSPOT_SERVICE_KEY || "";

export const isDonorReportConfigured = () => token() !== "";

export type Gift = {
  id: string;
  date: string; // ISO
  amount: number; // net of refunds
  currency: string;
  status: string;
  donorKey: string;
  billing: BillingAddress;
};

export type BillingAddress = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type Donor = {
  key: string;
  contactId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  /** Where the mailing address came from. "zip-only" = no street on file. */
  addressSource: "gift" | "contact" | "zip-only" | "none";
  total: number;
  giftCount: number;
  firstGift: string;
  lastGift: string;
  monthlyAmount: number; // active recurring amount (0 if none)
  frequency: "Monthly" | "Repeat" | "One-time";
  gifts: Gift[];
};

export type DonorReport = {
  year: number;
  donors: Donor[];
  gifts: Gift[];
  totals: {
    amount: number;
    gifts: number;
    donors: number;
    monthlyDonors: number;
    monthlyRecurring: number;
    byMonth: number[]; // 12 entries
  };
};

// Payments in these states never moved money.
const NOT_RECEIVED = new Set([
  "failed",
  "canceled",
  "cancelled",
  "processing",
  "pending",
  "requires_action",
  "voided",
]);

async function hs<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HubSpot ${res.status} on ${path}: ${text.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

type SearchResult = {
  results: { id: string; properties: Record<string, string | null> }[];
  paging?: { next?: { after: string } };
};

async function searchAll(
  objectType: string,
  filters: Record<string, unknown>[],
  properties: string[],
) {
  const out: SearchResult["results"] = [];
  let after: string | undefined;
  do {
    const page = await hs<SearchResult>(`/crm/v3/objects/${objectType}/search`, {
      filterGroups: [{ filters }],
      properties,
      limit: 200,
      ...(after ? { after } : {}),
    });
    out.push(...page.results);
    after = page.paging?.next?.after;
  } while (after);
  return out;
}

const chunk = <T,>(arr: T[], n: number) =>
  Array.from({ length: Math.ceil(arr.length / n) }, (_, i) =>
    arr.slice(i * n, i * n + n),
  );

/** fromId -> first associated contact id */
async function contactsFor(fromType: string, ids: string[]) {
  const map = new Map<string, string>();
  for (const batch of chunk(ids, 100)) {
    const res = await hs<{
      results: { from: { id: string }; to: { toObjectId: number | string }[] }[];
    }>(`/crm/v4/associations/${fromType}/contacts/batch/read`, {
      inputs: batch.map((id) => ({ id })),
    });
    for (const r of res.results) {
      if (r.to?.[0]) map.set(String(r.from.id), String(r.to[0].toObjectId));
    }
  }
  return map;
}

const CONTACT_PROPS = [
  "firstname",
  "lastname",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "zip",
  "country",
];

async function readContacts(ids: string[]) {
  const map = new Map<string, Record<string, string | null>>();
  for (const batch of chunk([...new Set(ids)], 100)) {
    const res = await hs<SearchResult>(`/crm/v3/objects/contacts/batch/read`, {
      properties: CONTACT_PROPS,
      inputs: batch.map((id) => ({ id })),
    });
    for (const r of res.results) map.set(r.id, r.properties);
  }
  return map;
}

const num = (v: string | null | undefined) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const toIso = (v: string | null | undefined) => {
  if (!v) return "";
  const d = /^\d+$/.test(v) ? new Date(Number(v)) : new Date(v);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
};

// Year boundaries in US Eastern time (Atlanta) — fixed -05:00 is close enough
// for a Jan 1 cutoff.
const yearStart = (y: number) => Date.UTC(y, 0, 1, 5);

export async function getDonorReport(year: number): Promise<DonorReport> {
  // 1) Payments in the year.
  const payments = await searchAll(
    "commerce_payments",
    [
      {
        propertyName: "hs_initiated_date",
        operator: "BETWEEN",
        value: String(yearStart(year)),
        highValue: String(yearStart(year + 1) - 1),
      },
    ],
    [
      "hs_initial_amount",
      "hs_refunds_amount",
      "hs_currency_code",
      "hs_latest_status",
      "hs_customer_email",
      "hs_initiated_date",
      "createdate",
      // Billing details entered at checkout. The monthly payment link asks
      // for a full address; the one-time link may only ask for ZIP.
      "hs_billing_bill_to_name",
      "hs_billing_address_line_1",
      "hs_billing_address_line_2",
      "hs_billing_address_city",
      "hs_billing_address_state",
      "hs_billing_address_zip",
      "hs_billing_address_country",
    ],
  );

  const received = payments.filter(
    (p) => !NOT_RECEIVED.has(String(p.properties.hs_latest_status ?? "").toLowerCase()),
  );

  // 2) Active monthly gifts.
  const subs = await searchAll(
    "subscriptions",
    [{ propertyName: "hs_status", operator: "EQ", value: "active" }],
    ["hs_status", "hs_mrr", "hs_currency_code"],
  ).catch((err) => {
    console.error("[donors] subscriptions unavailable:", err);
    return [] as SearchResult["results"];
  });

  // 3) Join to contacts.
  const [payContacts, subContacts] = await Promise.all([
    contactsFor("commerce_payments", received.map((p) => p.id)),
    contactsFor("subscriptions", subs.map((s) => s.id)).catch(
      () => new Map<string, string>(),
    ),
  ]);
  const contacts = await readContacts([
    ...payContacts.values(),
    ...subContacts.values(),
  ]);

  const donors = new Map<string, Donor>();
  const ensureDonor = (contactId: string | undefined, fallbackEmail: string) => {
    const key = contactId ? `c:${contactId}` : `e:${fallbackEmail.toLowerCase() || "unknown"}`;
    let d = donors.get(key);
    if (!d) {
      const c = (contactId && contacts.get(contactId)) || {};
      const s = (k: string) => String(c[k] ?? "").trim();
      d = {
        key,
        contactId,
        firstName: s("firstname"),
        lastName: s("lastname"),
        email: s("email") || fallbackEmail,
        phone: s("phone"),
        address: s("address"),
        city: s("city"),
        state: s("state"),
        zip: s("zip"),
        country: s("country"),
        addressSource: s("address") ? "contact" : "none",
        total: 0,
        giftCount: 0,
        firstGift: "",
        lastGift: "",
        monthlyAmount: 0,
        frequency: "One-time",
        gifts: [],
      };
      donors.set(key, d);
    }
    return d;
  };

  const gifts: Gift[] = [];
  for (const p of received) {
    const pr = p.properties;
    const donor = ensureDonor(payContacts.get(p.id), String(pr.hs_customer_email ?? ""));
    const gift: Gift = {
      id: p.id,
      date: toIso(pr.hs_initiated_date) || toIso(pr.createdate),
      amount: Math.max(0, num(pr.hs_initial_amount) - num(pr.hs_refunds_amount)),
      currency: String(pr.hs_currency_code ?? "USD"),
      status: String(pr.hs_latest_status ?? ""),
      donorKey: donor.key,
      billing: {
        name: String(pr.hs_billing_bill_to_name ?? "").trim(),
        line1: String(pr.hs_billing_address_line_1 ?? "").trim(),
        line2: String(pr.hs_billing_address_line_2 ?? "").trim(),
        city: String(pr.hs_billing_address_city ?? "").trim(),
        state: String(pr.hs_billing_address_state ?? "").trim(),
        zip: String(pr.hs_billing_address_zip ?? "").trim(),
        country: String(pr.hs_billing_address_country ?? "").trim(),
      },
    };
    gifts.push(gift);
    donor.gifts.push(gift);
  }

  for (const s of subs) {
    const contactId = subContacts.get(s.id);
    if (!contactId) continue;
    const donor = ensureDonor(contactId, "");
    donor.monthlyAmount += num(s.properties.hs_mrr);
  }

  const byMonth = Array(12).fill(0) as number[];
  for (const d of donors.values()) {
    d.gifts.sort((a, b) => a.date.localeCompare(b.date));
    d.total = d.gifts.reduce((sum, g) => sum + g.amount, 0);
    d.giftCount = d.gifts.length;
    d.firstGift = d.gifts[0]?.date ?? "";
    d.lastGift = d.gifts.at(-1)?.date ?? "";
    d.frequency = d.monthlyAmount > 0 ? "Monthly" : d.giftCount > 1 ? "Repeat" : "One-time";
    applyBillingDetails(d);
  }
  for (const g of gifts) {
    // Month in Eastern time.
    const m = new Date(new Date(g.date).getTime() - 5 * 3600_000).getUTCMonth();
    if (g.date) byMonth[m] += g.amount;
  }

  const list = [...donors.values()]
    // Active monthly donors with no gift yet this year still belong on the
    // list (they're givers), but sort below everyone by total.
    .sort((a, b) => b.total - a.total || b.monthlyAmount - a.monthlyAmount);

  return {
    year,
    donors: list,
    gifts: gifts.sort((a, b) => a.date.localeCompare(b.date)),
    totals: {
      amount: gifts.reduce((s, g) => s + g.amount, 0),
      gifts: gifts.length,
      donors: list.filter((d) => d.giftCount > 0).length,
      monthlyDonors: list.filter((d) => d.monthlyAmount > 0).length,
      monthlyRecurring: list.reduce((s, d) => s + d.monthlyAmount, 0),
      byMonth,
    },
  };
}

export const donorName = (d: Donor) =>
  [d.firstName, d.lastName].filter(Boolean).join(" ") || d.email || "Unknown donor";

export const donorAddress = (d: Donor) =>
  [d.address, [d.city, d.state].filter(Boolean).join(", "), d.zip, d.country]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ");

/**
 * Fill in the donor's mailing address (and name, if the contact has none)
 * from what they typed at checkout. HubSpot payment links store the billing
 * address on the payment, not the contact, so the contact is usually blank.
 * Prefers the most recent gift with a street address; keeps a ZIP-only
 * address when that's all there is.
 */
function applyBillingDetails(d: Donor) {
  const newestFirst = [...d.gifts].reverse();

  if (!d.firstName && !d.lastName) {
    const name = newestFirst.find((g) => g.billing.name)?.billing.name ?? "";
    const [first, ...rest] = name.split(/\s+/);
    d.firstName = first ?? "";
    d.lastName = rest.join(" ");
  }

  if (d.addressSource === "contact") return;

  const full = newestFirst.find((g) => g.billing.line1);
  const partial = full ?? newestFirst.find((g) => g.billing.zip || g.billing.city);
  if (!partial) return;

  const b = partial.billing;
  d.address = [b.line1, b.line2].filter(Boolean).join(", ");
  d.city = b.city;
  d.state = b.state;
  d.zip = b.zip;
  d.country = b.country;
  d.addressSource = full ? "gift" : "zip-only";
}
