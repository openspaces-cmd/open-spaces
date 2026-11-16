import { isDonorAuthed } from "@/lib/donorAuth";
import {
  donorName,
  getDonorReport,
  isDonorReportConfigured,
} from "@/lib/donors";

export const dynamic = "force-dynamic";

const cell = (v: unknown) => {
  const s = String(v ?? "");
  // Quote everything; neutralise spreadsheet formula injection.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};
const row = (vals: unknown[]) => vals.map(cell).join(",");
const day = (iso: string) => (iso ? iso.slice(0, 10) : "");

export async function GET(request: Request) {
  if (!(await isDonorAuthed())) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!isDonorReportConfigured()) {
    return new Response("HubSpot is not configured", { status: 503 });
  }

  const url = new URL(request.url);
  const thisYear = new Date().getFullYear();
  const year = Math.min(thisYear, Math.max(2020, Number(url.searchParams.get("year")) || thisYear));
  const type = url.searchParams.get("type") === "gifts" ? "gifts" : "donors";

  const report = await getDonorReport(year);
  const byKey = new Map(report.donors.map((d) => [d.key, d]));

  const lines =
    type === "donors"
      ? [
          row([
            "First name", "Last name", "Email", "Phone",
            "Street address", "City", "State", "Zip", "Country", "Address source",
            `Total ${year}`, "Gift count", "Frequency", "Monthly amount",
            "First gift", "Last gift",
          ]),
          ...report.donors.map((d) =>
            row([
              d.firstName, d.lastName, d.email, d.phone,
              d.address, d.city, d.state, d.zip, d.country,
              { gift: "Checkout (latest gift)", contact: "HubSpot contact", "zip-only": "ZIP only — no street", none: "Missing" }[d.addressSource],
              d.total.toFixed(2), d.giftCount, d.frequency, d.monthlyAmount.toFixed(2),
              day(d.firstGift), day(d.lastGift),
            ]),
          ),
        ]
      : [
          row(["Date", "Donor", "Email", "Amount", "Currency", "Status", "HubSpot payment id"]),
          ...report.gifts.map((g) => {
            const d = byKey.get(g.donorKey);
            return row([
              day(g.date), d ? donorName(d) : "", d?.email ?? "",
              g.amount.toFixed(2), g.currency, g.status, g.id,
            ]);
          }),
        ];

  return new Response(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="open-spaces-${type}-${year}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
