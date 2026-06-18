import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EpisodeCard } from "@/components/EpisodeCard";
import { ListenLinks } from "@/components/ListenLinks";
import { ShareButtons } from "@/components/ShareButtons";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { collectionHref, upNextInCollection } from "@/lib/collections";
import { seriesSlug } from "@/lib/series";
import { siteUrl } from "@/lib/site";
import { youtubeThumbnail, youtubeWatchUrl } from "@/lib/youtube";
import {
  getEpisodeBySlug,
  getEpisodes,
  getEpisodeSlugs,
  getHomeContent,
  getSiteSettings,
} from "@/sanity/queries";

export async function generateStaticParams() {
  const slugs = await getEpisodeSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/podcast/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const episode = await getEpisodeBySlug(slug);
  if (!episode) return { title: "Episode not found" };
  const image = episode.thumbnailUrl || youtubeThumbnail(episode.youtubeId);
  return {
    title: episode.title,
    description: episode.excerpt,
    openGraph: {
      title: episode.title,
      description: episode.excerpt,
      url: `/podcast/${episode.slug}`,
      images: [{ url: image, width: 1280, height: 720, alt: episode.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: episode.title,
      description: episode.excerpt,
      images: [image],
    },
  };
}

export default async function EpisodePage(
  props: PageProps<"/podcast/[slug]">,
) {
  const { slug } = await props.params;
  const [episode, settings, allEpisodes, home] = await Promise.all([
    getEpisodeBySlug(slug),
    getSiteSettings(),
    getEpisodes(),
    getHomeContent(),
  ]);

  if (!episode) notFound();

  // Recommend the next episodes from this episode's own collection.
  const { collection: upNextCollection, episodes: related } =
    upNextInCollection(episode, allEpisodes, home.startHere ?? [], 3);

  // Structured data so search engines understand this as a podcast episode.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: episode.title,
    url: `${siteUrl}/podcast/${episode.slug}`,
    datePublished: episode.publishedAt,
    description: episode.excerpt,
    episodeNumber: episode.episodeNumber,
    image: episode.thumbnailUrl || youtubeThumbnail(episode.youtubeId),
    associatedMedia: {
      "@type": "VideoObject",
      name: episode.title,
      embedUrl: `https://www.youtube.com/embed/${episode.youtubeId}`,
      contentUrl: youtubeWatchUrl(episode.youtubeId),
      thumbnailUrl: youtubeThumbnail(episode.youtubeId),
      uploadDate: episode.publishedAt,
      description: episode.excerpt,
    },
    partOfSeries: {
      "@type": "PodcastSeries",
      name: "Open Spaces",
      url: `${siteUrl}/podcast`,
    },
  };

  const date = episode.publishedAt
    ? new Date(episode.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article className="mx-auto max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
      <Link
        href="/podcast"
        className="eyebrow text-charcoal transition-colors hover:text-camel"
      >
        ← All episodes
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          {episode.episodeNumber ? (
            <span className="eyebrow text-camel">
              Episode {episode.episodeNumber}
            </span>
          ) : null}
          {date ? (
            <span className="font-mono text-[11px] uppercase tracking-widest text-stormy">
              {date}
            </span>
          ) : null}
          {episode.series ? (
            <Link
              href={collectionHref(seriesSlug(episode.series))}
              className="rounded-full border border-camel px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-camel transition-colors hover:bg-camel hover:text-ivory-light"
            >
              {episode.series} Series
            </Link>
          ) : null}
        </div>
        <h1 className="mt-3 font-display text-5xl leading-tight text-midnight">
          {episode.title}
        </h1>
        {episode.guests && episode.guests.length > 0 ? (
          <p className="mt-3 text-sm text-stormy">
            With {episode.guests.map((g) => g.name).join(", ")}
          </p>
        ) : null}
      </header>

      <div className="mt-8">
        <YouTubeEmbed id={episode.youtubeId} title={episode.title} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <ListenLinks listen={settings?.listen} />
        <ShareButtons title={episode.title} path={`/podcast/${episode.slug}`} />
      </div>

      {episode.excerpt ? (
        <p className="mt-8 border-l-2 border-camel pl-5 text-lg leading-relaxed text-charcoal">
          {episode.excerpt}
        </p>
      ) : null}

      <div className="mt-12 rounded-2xl bg-midnight px-6 py-8 text-ivory-light sm:px-10">
        <p className="font-display text-3xl">Have a question for us?</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-steel">
          We answer listener questions on the show. Send yours and it might shape
          a future episode.
        </p>
        <a
          href={`mailto:${settings?.contactEmail || "questions@openspacespodcast.com"}`}
          className="mt-5 inline-block rounded-sm bg-camel px-7 py-3 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
        >
          Submit a Question
        </a>
      </div>

      {episode.transcript ? (
        <details className="mt-10 rounded-2xl bg-ivory-light p-6 ring-1 ring-tan/70">
          <summary className="cursor-pointer font-display text-2xl text-midnight">
            Transcript
          </summary>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-charcoal">
            {episode.transcript}
          </p>
        </details>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-16 border-t border-tan/70 pt-10">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl text-midnight">
              {upNextCollection
                ? `Up Next in ${upNextCollection.title}`
                : "More Episodes"}
            </h2>
            <Link
              href={
                upNextCollection
                  ? collectionHref(upNextCollection.slug)
                  : "/podcast"
              }
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-camel hover:text-midnight"
            >
              View all →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((ep) => (
              <EpisodeCard key={ep._id} episode={ep} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
