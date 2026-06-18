// Canonical site origin for absolute URLs in metadata, feeds, and sitemaps.
// Set NEXT_PUBLIC_SITE_URL in production (e.g. https://theopenspacescollective.com).
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "http://localhost:3005"
).replace(/\/$/, "");

export const siteName = "Open Spaces";
export const siteDescription =
  "Honest conversations that point people back to Jesus. A podcast with Jeff & Jourdan Johnson.";
