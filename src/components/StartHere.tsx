import Link from "next/link";

import { youtubeThumbnail } from "@/lib/youtube";
import type { EpisodeListItem } from "@/sanity/queries";

// Curated first-listen path for new visitors: a numbered, in-order arc into
// the story, so newcomers don't face a wall of episodes.
export function StartHere({ episodes }: { episodes?: EpisodeListItem[] }) {
  if (!episodes?.length) return null;

  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="eyebrow text-camel">New here?</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl text-midnight sm:text-5xl">
            <Link href="/podcast/collection/our-story" className="transition-colors hover:text-camel">
              Our Story
            </Link>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-stormy">
            Jeff &amp; Jourdan&apos;s story unfolds episode by episode. These
            first five are the place to begin.
          </p>
        </div>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {episodes.map((ep, i) => (
            <li key={ep._id}>
              <Link
                href={`/podcast/${ep.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-ivory-light ring-1 ring-tan/70 transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden bg-midnight">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ep.thumbnailUrl || youtubeThumbnail(ep.youtubeId, "hq")}
                    alt={ep.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5 lg:p-4">
                  <h3 className="text-lg font-semibold leading-snug text-midnight transition-colors group-hover:text-camel lg:text-base">
                    {ep.title}
                  </h3>
                  {ep.excerpt ? (
                    <p className="line-clamp-2 text-sm leading-relaxed text-charcoal lg:text-[13px]">
                      {ep.excerpt}
                    </p>
                  ) : null}
                  <span className="mt-auto pt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-camel">
                    {i === 0 ? "Begin here →" : `Part ${i + 1} →`}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
