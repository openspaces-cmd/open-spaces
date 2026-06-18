import type { MetadataRoute } from "next";

import { collectionHref, resolveCollections } from "@/lib/collections";
import { seriesSlug } from "@/lib/series";
import { siteUrl } from "@/lib/site";
import { getArticles, getEpisodes, getHomeContent } from "@/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [episodes, articles, home] = await Promise.all([
    getEpisodes(),
    getArticles(),
    getHomeContent(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/podcast",
    "/articles",
    "/stories",
    "/stories/share",
    "/connect",
    "/give",
    "/booking",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "" || path === "/podcast" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  // Every non-empty collection (curated + series + tag), plus any series in
  // the data not yet in the registry — all under the unified /collection route.
  const collectionSlugs = [
    ...new Set([
      ...resolveCollections(episodes, home.startHere ?? []).map((c) => c.slug),
      ...episodes.filter((e) => e.series).map((e) => seriesSlug(e.series!)),
    ]),
  ];
  const collectionPages: MetadataRoute.Sitemap = collectionSlugs.map(
    (slug) => ({
      url: `${siteUrl}${collectionHref(slug)}`,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  return [
    ...staticPages,
    ...collectionPages,
    ...episodes.map((e) => ({
      url: `${siteUrl}/podcast/${e.slug}`,
      lastModified: e.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...articles.map((a) => ({
      url: `${siteUrl}/articles/${a.slug}`,
      lastModified: a.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
