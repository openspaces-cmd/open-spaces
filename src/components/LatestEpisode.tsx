import Link from "next/link";

import { youtubeThumbnail } from "@/lib/youtube";
import type { EpisodeListItem } from "@/sanity/queries";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Homepage callout that surfaces the newest episode directly under the hero.
export function LatestEpisode({ episode }: { episode: EpisodeListItem }) {
  const href = `/podcast/${episode.slug}`;
  const meta = [
    episode.episodeNumber ? `Episode ${episode.episodeNumber}` : null,
    episode.publishedAt ? formatDate(episode.publishedAt) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="bg-midnight">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-12 sm:py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12 lg:px-8 lg:py-16">
        <Link href={href} className="group relative block">
          <span className="block overflow-hidden rounded-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={youtubeThumbnail(episode.youtubeId)}
              alt={episode.title}
              className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </span>
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-camel/95 transition-transform group-hover:scale-110">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fdfaf6">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </Link>

        <div className="text-ivory-light">
          <p className="eyebrow text-camel">Latest Episode</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            <Link href={href} className="transition-colors hover:text-camel">
              {episode.title}
            </Link>
          </h2>
          {meta ? (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ivory-light/60">
              {meta}
            </p>
          ) : null}
          {episode.excerpt ? (
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ivory-light/80">
              {episode.excerpt}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={href}
              className="rounded-sm bg-camel px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
            >
              Listen Now
            </Link>
            <Link
              href="/podcast"
              className="rounded-sm border border-ivory-light/40 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:border-camel hover:text-camel"
            >
              All Episodes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
