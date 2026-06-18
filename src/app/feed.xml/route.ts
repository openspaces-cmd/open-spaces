import { siteDescription, siteName, siteUrl } from "@/lib/site";
import { youtubeThumbnail } from "@/lib/youtube";
import { getArticles, getEpisodes } from "@/sanity/queries";

export const revalidate = 3600;

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function GET() {
  const [episodes, articles] = await Promise.all([
    getEpisodes(),
    getArticles(),
  ]);

  const items = [
    ...episodes.map((e) => ({
      title: e.episodeNumber ? `Ep. ${e.episodeNumber} — ${e.title}` : e.title,
      url: `${siteUrl}/podcast/${e.slug}`,
      date: e.publishedAt,
      description: e.excerpt ?? "",
      image: e.thumbnailUrl || youtubeThumbnail(e.youtubeId),
    })),
    ...articles.map((a) => ({
      title: a.title,
      url: `${siteUrl}/articles/${a.slug}`,
      date: a.publishedAt,
      description: a.excerpt ?? "",
      image: a.coverImageUrl || undefined,
    })),
  ].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(siteName)}</title>
    <link>${siteUrl}</link>
    <description>${escape(siteDescription)}</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (i) => `    <item>
      <title>${escape(i.title)}</title>
      <link>${i.url}</link>
      <guid>${i.url}</guid>
      <pubDate>${new Date(i.date).toUTCString()}</pubDate>
      <description>${escape(i.description)}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
