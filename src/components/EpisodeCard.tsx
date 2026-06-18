import Link from "next/link";

import type { EpisodeListItem } from "@/sanity/queries";
import { youtubeThumbnail } from "@/lib/youtube";

export function EpisodeCard({ episode }: { episode: EpisodeListItem }) {
  const thumb = episode.thumbnailUrl || youtubeThumbnail(episode.youtubeId);
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
      className="group flex flex-col overflow-hidden rounded-2xl bg-ivory-light ring-1 ring-tan/70 transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden bg-midnight">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt={episode.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-3">
          {episode.episodeNumber ? (
            <span className="eyebrow text-camel">Ep {episode.episodeNumber}</span>
          ) : null}
          {date ? (
            <span className="font-mono text-[11px] uppercase tracking-widest text-stormy">
              {date}
            </span>
          ) : null}
        </div>
        <h3 className="text-lg font-semibold leading-snug text-midnight">
          {episode.title}
        </h3>
        {episode.excerpt ? (
          <p className="line-clamp-2 text-sm text-charcoal">{episode.excerpt}</p>
        ) : null}
        {episode.guests && episode.guests.length > 0 ? (
          <p className="mt-auto pt-2 text-xs text-stormy">
            With {episode.guests.map((g) => g.name).join(", ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
