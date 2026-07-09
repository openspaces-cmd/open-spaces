// Canonical site origin for absolute URLs in metadata, feeds, and sitemaps.
// Production must NOT fall back to VERCEL_URL — deployment URLs sit behind
// Vercel's login wall, so social crawlers can't fetch og:image from them.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_ENV === "production"
    ? "https://www.theopenspacescollective.com"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "") ||
  "http://localhost:3005"
).replace(/\/$/, "");

export const siteName = "Open Spaces";
export const siteDescription =
  "Honest conversations that point people back to Jesus. A podcast with Jeff & Jourdan Johnson.";
