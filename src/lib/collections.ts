import type { EpisodeListItem } from "@/sanity/queries";
import { seriesSlug } from "@/lib/series";

// ---------------------------------------------------------------------------
// One unified "collection" model for the whole site.
//
// A collection is any curated grouping of episodes that gets its own page at
// /podcast/collection/[slug]. There are three kinds:
//   - "curated" → a hand-picked, ordered arc (e.g. Our Story = the homepage
//      Start list). Ordered.
//   - "series"  → episodes sharing an `episode.series` value, ordered by
//      episodeNumber (e.g. Community). Ordered.
//   - "tag"     → episodes sharing a `tags` value (e.g. Parenting). Thematic,
//      newest first.
//
// Every collection renders with the SAME page template; `ordered` just toggles
// the numbered "01 / 02" treatment and the "listen in order" framing.
// ---------------------------------------------------------------------------

export type CollectionKind = "curated" | "series" | "tag";

export type Collection = {
  slug: string;
  title: string;
  blurb: string;
  /** Tailwind from/via/to stops (paired with bg-gradient-to-br). Brand darks. */
  gradient: string;
  /** Numbered + "in order" framing vs. thematic (newest first). */
  ordered: boolean;
  kind: CollectionKind;
  /** kind "series" — matches episode.series. */
  seriesName?: string;
  /** kind "tag" — matches a value in episode.tags. */
  tag?: string;
  /** Surfaced on the homepage "Explore by Theme" grid. */
  featured?: boolean;
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "our-story",
    title: "Our Story",
    blurb:
      "Start at the beginning — the secret, the unraveling, and the slow, grace-filled road back. The episodes to listen to first.",
    gradient: "from-midnight via-charcoal to-stormy",
    ordered: true,
    kind: "curated",
    featured: true,
  },
  {
    slug: "community",
    title: "Community",
    blurb:
      "A series on being fully known — the risk and the reward of letting people truly see you.",
    gradient: "from-charcoal via-midnight to-stormy",
    ordered: true,
    kind: "series",
    seriesName: "Community",
    featured: true,
  },
  {
    slug: "parenting",
    title: "Parenting",
    blurb:
      "The hard conversations, the grace, and showing up honestly for the next generation.",
    gradient: "from-stormy via-charcoal to-midnight",
    ordered: false,
    kind: "tag",
    tag: "parenting",
    featured: true,
  },
  {
    slug: "marriage",
    title: "Marriage",
    blurb:
      "Building something real through the parts no highlight reel ever shows.",
    gradient: "from-midnight via-stormy to-charcoal",
    ordered: false,
    kind: "tag",
    tag: "marriage",
    featured: true,
  },
  {
    slug: "faith",
    title: "Faith",
    blurb:
      "Trusting God in the unanswered questions and the long obedience of following Jesus.",
    gradient: "from-charcoal via-stormy to-midnight",
    ordered: false,
    kind: "tag",
    tag: "faith",
    featured: true,
  },
  {
    slug: "family",
    title: "Family",
    blurb: "Honoring where we come from — and breaking what needs to break.",
    gradient: "from-stormy via-midnight to-charcoal",
    ordered: false,
    kind: "tag",
    tag: "family",
    featured: true,
  },
  {
    slug: "identity",
    title: "Identity",
    blurb: "Who you are when the labels fall away.",
    gradient: "from-midnight via-charcoal to-steel",
    ordered: false,
    kind: "tag",
    tag: "identity",
  },
  {
    slug: "struggle",
    title: "The Struggle",
    blurb:
      "Honest, practical conversations for walking through what's hard — without doing it alone.",
    gradient: "from-charcoal via-midnight to-steel",
    ordered: false,
    kind: "tag",
    tag: "struggle",
  },
];

export const collectionHref = (slug: string) => `/podcast/collection/${slug}`;

export const collectionBySlug = (slug: string): Collection | undefined =>
  COLLECTIONS.find((c) => c.slug === slug);

export const collectionForTag = (tag: string): Collection | undefined =>
  COLLECTIONS.find((c) => c.kind === "tag" && c.tag === tag);

export const collectionForSeries = (name: string): Collection | undefined =>
  COLLECTIONS.find((c) => c.kind === "series" && c.seriesName === name);

// Resolve a collection's episodes. `startHere` is the homepage's curated list
// (only needed for the curated "our-story" arc).
export function collectionEpisodes(
  collection: Collection,
  episodes: EpisodeListItem[],
  startHere: EpisodeListItem[] = [],
): EpisodeListItem[] {
  if (collection.kind === "curated") return startHere;
  if (collection.kind === "series") {
    return episodes
      .filter((e) => e.series === collection.seriesName)
      .sort((a, b) => (a.episodeNumber ?? 0) - (b.episodeNumber ?? 0));
  }
  // tag — newest first
  return episodes
    .filter((e) => e.tags?.includes(collection.tag!))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export type ResolvedCollection = Collection & {
  episodes: EpisodeListItem[];
  count: number;
};

// Every non-empty collection, in registry order, with episodes attached.
export function resolveCollections(
  episodes: EpisodeListItem[],
  startHere: EpisodeListItem[] = [],
): ResolvedCollection[] {
  return COLLECTIONS.map((c) => {
    const eps = collectionEpisodes(c, episodes, startHere);
    return { ...c, episodes: eps, count: eps.length };
  }).filter((c) => c.count > 0);
}

// Resolve a slug to a collection. Falls back to a DYNAMIC series collection for
// any `episode.series` value not in the static registry, so a brand-new series
// added in Sanity automatically gets a standardized page.
export function getCollection(
  slug: string,
  episodes: EpisodeListItem[],
): Collection | null {
  const stat = collectionBySlug(slug);
  if (stat) return stat;

  const seriesName = [
    ...new Set(episodes.map((e) => e.series).filter(Boolean) as string[]),
  ].find((name) => seriesSlug(name) === slug);

  if (seriesName) {
    return {
      slug,
      title: seriesName,
      blurb: `Episodes in the ${seriesName} series — best listened to in order.`,
      gradient: "from-midnight via-charcoal to-stormy",
      ordered: true,
      kind: "series",
      seriesName,
    };
  }
  return null;
}

// All collection slugs that should be statically generated: the registry plus
// any series present in the data.
export function allCollectionSlugs(episodes: EpisodeListItem[]): string[] {
  const dynamicSeries = [
    ...new Set(episodes.map((e) => e.series).filter(Boolean) as string[]),
  ].map((name) => seriesSlug(name));
  return [...new Set([...COLLECTIONS.map((c) => c.slug), ...dynamicSeries])];
}

// The collection an episode most belongs to, for "Up Next" recommendations:
// its series first, then the curated arc, then its first tag collection.
export function primaryCollectionFor(
  episode: EpisodeListItem,
  startHere: EpisodeListItem[] = [],
): Collection | null {
  if (episode.series) {
    const c = collectionForSeries(episode.series);
    if (c) return c;
  }
  if (startHere.some((e) => e._id === episode._id)) {
    const c = collectionBySlug("our-story");
    if (c) return c;
  }
  for (const tag of episode.tags ?? []) {
    const c = collectionForTag(tag);
    if (c) return c;
  }
  return null;
}

// "Up Next" within an episode's collection: the episodes that follow it (then
// wrapping to earlier ones to fill), excluding itself. Falls back to the most
// recent episodes when the episode isn't part of any collection.
export function upNextInCollection(
  episode: EpisodeListItem,
  episodes: EpisodeListItem[],
  startHere: EpisodeListItem[] = [],
  limit = 3,
): { collection: Collection | null; episodes: EpisodeListItem[] } {
  const collection = primaryCollectionFor(episode, startHere);

  if (!collection) {
    const recent = episodes
      .filter((e) => e.slug !== episode.slug)
      .slice(0, limit);
    return { collection: null, episodes: recent };
  }

  const list = collectionEpisodes(collection, episodes, startHere);
  const idx = list.findIndex((e) => e._id === episode._id);
  const after = idx >= 0 ? list.slice(idx + 1) : list;
  const before = idx >= 0 ? list.slice(0, idx) : [];
  const ordered = [...after, ...before].filter((e) => e.slug !== episode.slug);
  return { collection, episodes: ordered.slice(0, limit) };
}
