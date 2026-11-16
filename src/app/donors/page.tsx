import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  DONOR_COOKIE,
  checkPassword,
  hashPassword,
  isDonorAuthConfigured,
  isDonorAuthed,
} from "@/lib/donorAuth";
import {
  type DonorReport,
  donorAddress,
  donorName,
  getDonorReport,
  isDonorReportConfigured,
} from "@/lib/donors";

export const metadata: Metadata = {
  title: "Donor Report",
  robots: { index: false, follow: false },
};

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const day = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "America/New_York",
      })
    : "—";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function login(formData: FormData) {
  "use server";
  const attempt = String(formData.get("password") ?? "");
  if (!checkPassword(attempt)) redirect("/donors?error=1");
  (await cookies()).set(DONOR_COOKIE, hashPassword(attempt), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/donors",
    maxAge: 60 * 60 * 12,
  });
  redirect("/donors");
}

async function logout() {
  "use server";
  (await cookies()).delete({ name: DONOR_COOKIE, path: "/donors" });
  redirect("/donors");
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-ivory">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">{children}</div>
    </main>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Shell>
      <div className="mx-auto max-w-md rounded-2xl bg-ivory-light p-8 ring-1 ring-tan/70">
        <p className="eyebrow text-camel">Open Spaces · Internal</p>
        <h1 className="mt-2 font-display text-4xl text-midnight">{title}</h1>
        <div className="mt-4 text-sm leading-relaxed text-charcoal">{children}</div>
      </div>
    </Shell>
  );
}

export default async function DonorsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; error?: string }>;
}) {
  const params = await searchParams;

  if (!isDonorAuthConfigured()) {
    return (
      <Notice title="Donor report not set up">
        Add a <code>DONOR_REPORT_PASSWORD</code> (8+ characters) environment
        variable in Vercel to turn this page on.
      </Notice>
    );
  }

  if (!(await isDonorAuthed())) {
    return (
      <Notice title="Donor Report">
        <form action={login} className="flex flex-col gap-3">
          <label htmlFor="password" className="font-mono text-[11px] uppercase tracking-[0.18em] text-stormy">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="w-full rounded-sm border border-tan bg-ivory px-4 py-3 text-sm text-midnight focus:border-camel focus:outline-none"
          />
          {params.error ? <p className="text-sm text-red-700">That password didn&apos;t match.</p> : null}
          <button className="mt-2 self-start rounded-sm bg-camel px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light hover:bg-camel/85">
            View report
          </button>
        </form>
      </Notice>
    );
  }

  if (!isDonorReportConfigured()) {
    return (
      <Notice title="Connect HubSpot">
        Add a HubSpot private app token as <code>HUBSPOT_PRIVATE_APP_TOKEN</code>{" "}
        in Vercel (read access to contacts, commerce payments and
        subscriptions) to load giving data.
      </Notice>
    );
  }

  const thisYear = new Date().getFullYear();
  const year = Math.min(thisYear, Math.max(2020, Number(params.year) || thisYear));

  let report: DonorReport;
  try {
    report = await getDonorReport(year);
  } catch (err) {
    console.error("[donors] report failed:", err);
    return (
      <Notice title="Couldn't load giving data">
        HubSpot returned an error. Check that the private app token is valid and
        has read access to contacts, commerce payments and subscriptions.
        <pre className="mt-4 whitespace-pre-wrap text-xs text-stormy">
          {String(err instanceof Error ? err.message : err).slice(0, 400)}
        </pre>
      </Notice>
    );
  }

  const { totals, donors } = report;
  const maxMonth = Math.max(1, ...totals.byMonth);
  const years = Array.from({ length: thisYear - 2023 }, (_, i) => thisYear - i);

  const tiles = [
    { label: `Given in ${year}`, value: usd(totals.amount) },
    { label: "Donors", value: String(totals.donors) },
    { label: "Gifts", value: String(totals.gifts) },
    { label: "Monthly donors", value: `${totals.monthlyDonors} · ${usd(totals.monthlyRecurring)}/mo` },
  ];

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-camel">Open Spaces · Internal</p>
          <h1 className="mt-2 font-display text-6xl text-midnight">Donor Report</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex gap-1 rounded-sm bg-ivory-light p-1 ring-1 ring-tan/70">
            {years.map((y) => (
              <Link
                key={y}
                href={`/donors?year=${y}`}
                className={`rounded-sm px-3 py-1.5 font-mono text-xs ${y === year ? "bg-midnight text-ivory-light" : "text-charcoal hover:text-camel"}`}
              >
                {y}
              </Link>
            ))}
          </nav>
          <a
            href={`/donors/export?year=${year}&type=donors`}
            className="rounded-sm bg-camel px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ivory-light hover:bg-camel/85"
          >
            Year-end CSV
          </a>
          <a
            href={`/donors/export?year=${year}&type=gifts`}
            className="rounded-sm border border-midnight/30 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-midnight hover:border-camel hover:text-camel"
          >
            All gifts CSV
          </a>
          <form action={logout}>
            <button className="px-2 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-stormy hover:text-midnight">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-2xl bg-ivory-light p-5 ring-1 ring-tan/70">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stormy">{t.label}</p>
            <p className="mt-2 text-2xl font-semibold text-midnight tabular-nums">{t.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-2xl bg-ivory-light p-5 ring-1 ring-tan/70">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-stormy">Given by month</h2>
        <div className="mt-4 grid grid-cols-12 items-end gap-2" style={{ height: 140 }}>
          {totals.byMonth.map((amt, i) => (
            <div key={i} className="flex h-full flex-col justify-end" title={`${MONTHS[i]}: ${usd(amt)}`}>
              <div className="rounded-t-sm bg-camel" style={{ height: `${(amt / maxMonth) * 100}%`, minHeight: amt ? 2 : 0 }} />
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-12 gap-2 text-center font-mono text-[10px] text-stormy">
          {MONTHS.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </section>

      <section className="mt-8 overflow-x-auto rounded-2xl bg-ivory-light ring-1 ring-tan/70">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-tan/70 font-mono text-[10px] uppercase tracking-[0.16em] text-stormy">
            <tr>
              <th className="px-4 py-3">Donor</th>
              <th className="px-4 py-3">Mailing address</th>
              <th className="px-4 py-3">Frequency</th>
              <th className="px-4 py-3 text-right">Gifts</th>
              <th className="px-4 py-3 text-right">Total {year}</th>
              <th className="px-4 py-3">First gift</th>
              <th className="px-4 py-3">Last gift</th>
            </tr>
          </thead>
          <tbody>
            {donors.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-stormy">
                  No gifts recorded in {year}.
                </td>
              </tr>
            ) : (
              donors.map((d) => (
                <tr key={d.key} className="border-b border-tan/40 align-top last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-midnight">{donorName(d)}</p>
                    <p className="text-xs text-stormy">{d.email}</p>
                  </td>
                  <td className="max-w-[260px] px-4 py-3 text-charcoal">
                    {donorAddress(d) || <span className="text-xs text-red-700">Missing address</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
                        d.frequency === "Monthly"
                          ? "bg-midnight text-ivory-light"
                          : d.frequency === "Repeat"
                            ? "bg-camel/20 text-midnight"
                            : "bg-tan/50 text-charcoal"
                      }`}
                    >
                      {d.frequency}
                    </span>
                    {d.monthlyAmount > 0 ? (
                      <p className="mt-1 text-xs text-stormy">{usd(d.monthlyAmount)}/mo</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{d.giftCount}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-midnight">{usd(d.total)}</td>
                  <td className="px-4 py-3 text-charcoal">{day(d.firstGift)}</td>
                  <td className="px-4 py-3 text-charcoal">{day(d.lastGift)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <p className="mt-6 text-xs leading-relaxed text-stormy">
        Live from HubSpot payments. Totals are net of refunds; failed and pending
        payments are excluded. &ldquo;Monthly&rdquo; means an active recurring
        gift today. Addresses come from each donor&apos;s HubSpot contact record —
        fix missing ones there before sending year-end letters.
      </p>
    </Shell>
  );
}
