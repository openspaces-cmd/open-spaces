import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ListenLinks } from "@/components/ListenLinks";
import { OtherCollections } from "@/components/OtherCollections";
import {
  allCollectionSlugs,
  collectionEpisodes,
  getCollection,
} from "@/lib/collections";
import { youtubeThumbnail } from "@/lib/youtube";
import {
  getEpisodes,
  getHomeContent,
  getSiteSettings,
} from "@/sanity/queries";
import type { EpisodeListItem } from "@/sanity/queries";

export async function generateStaticParams() {
  const episodes = await getEpisodes();
  return allCollectionSlugs(episodes).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/podcast/collection/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const episodes = await getEpisodes();
  const collection = getCollection(slug, episodes);
  if (!collection) return { title: "Collection not found" };
  return { title: collection.title, description: collection.blurb };
}

function eyebrowFor(ordered: boolean, kind: string, count: number): string {
  const n = `${count} ${count === 1 ? "Episode" : "Episodes"}`;
  if (kind === "series") return `A Series in ${count} Parts`;
  if (kind === "curated") return `Start Here · ${count} Parts`;
  return `Collection · ${n}`;
}

export default async function CollectionPage(
  props: PageProps<"/podcast/collection/[slug]">,
) {
  const { slug } = await props.params;
  const [episodes, home, settings] = await Promise.all([
    getEpisodes(),
    getHomeContent(),
    getSiteSettings(),
  ]);

  const collection = getCollection(slug, episodes);
  if (!collection) notFound();

  const startHere = home.startHere ?? [];
  const parts = collectionEpisodes(collection, episodes, startHere);
  if (parts.length === 0) notFound();

  return (
    <>
      <section className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-24">
        <Link
          href="/podcast"
          className="eyebrow text-charcoal transition-colors hover:text-camel"
        >
          ← All episodes
        </Link>

        <p className="eyebrow mt-6 text-camel">
          {eyebrowFor(collection.ordered, collection.kind, parts.length)}
        </p>
        <h1 className="mt-3 font-display text-6xl text-midnight sm:text-7xl">
          {collection.title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal">
          {collection.blurb}
        </p>
        <div className="mt-6">
          <ListenLinks listen={settings?.listen} />
        </div>

        <ol className="mt-12 space-y-6">
          {parts.map((ep, i) => (
            <li key={ep._id}>
              <CollectionRow
                episode={ep}
                index={i}
                ordered={collection.ordered}
              />
            </li>
          ))}
        </ol>
      </section>

      <OtherCollections
        currentSlug={collection.slug}
        episodes={episodes}
        startHere={startHere}
      />
    </>
  );
}

// One horizontal episode card — the look from the original Community series
// page, now shared by every collection. Ordered collections show the big
// "01 / 02" position number; thematic ones show the publish date instead.
function CollectionRow({
  episode,
  index,
  ordered,
}: {
  episode: EpisodeListItem;
  index: number;
  ordered: boolean;
}) {
  const date = episode.publishedAt
    ? new Date(episode.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/podcast/${episode.slug}`}
      className="group grid gap-5 rounded-2xl bg-ivory-light p-5 ring-1 ring-tan/70 transition-shadow hover:shadow-lg sm:grid-cols-[200px_1fr] sm:items-center"
    >
      <div className="relative overflow-hidden rounded-xl bg-midnight">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={episode.thumbnailUrl || youtubeThumbnail(episode.youtubeId, "hq")}
          alt={episode.title}
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div>
        {ordered ? (
          <span className="font-display text-3xl text-camel">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : date ? (
          <span className="font-mono text-[11px] uppercase tracking-widest text-stormy">
            {date}
          </span>
        ) : null}
        <h2 className="mt-1 text-lg font-semibold leading-snug text-midnight transition-colors group-hover:text-camel">
          {episode.title}
        </h2>
        {episode.excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal">
            {episode.excerpt}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
