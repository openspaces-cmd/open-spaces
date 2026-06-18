import type { Metadata } from "next";
import Link from "next/link";

import { StoryCard } from "@/components/StoryCard";
import { getStories } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Real stories from listeners — honesty, freedom, and belief for the impossible. Read them, then share yours.",
};

export default async function StoriesPage() {
  const stories = await getStories();

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <p className="eyebrow text-camel">Belief for the impossible</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display text-6xl text-midnight sm:text-7xl">
            Stories
          </h1>
          <Link
            href="/stories/share"
            className="rounded-sm bg-camel px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
          >
            Share Your Story
          </Link>
        </div>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal">
          Every one of these came from a listener who decided to stop hiding.
          They&apos;re shared here with permission — some with names, some
          anonymously, all true.
        </p>

        {stories.length > 0 ? (
          <div className="mt-12 columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-sm text-stormy">
            Stories are coming soon — yours could be the first.
          </p>
        )}
      </section>

      {/* Closing CTA — bracket-framed, echoes the hero */}
      <section className="bg-midnight">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <span
              aria-hidden
              className="absolute -left-2 -top-5 h-9 w-9 border-l-2 border-t-2 border-camel sm:-left-8"
            />
            <span
              aria-hidden
              className="absolute -bottom-5 -right-2 h-9 w-9 border-b-2 border-r-2 border-camel sm:-right-8"
            />
            <h2 className="font-display text-5xl text-ivory-light sm:text-6xl">
              Your story isn&apos;t over
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-ivory-light/80">
              Whatever you&apos;ve walked through, telling the truth about it is
              the first step. Share it with us — publicly, anonymously, or just
              between us.
            </p>
            <Link
              href="/stories/share"
              className="rounded-sm bg-camel px-8 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
            >
              Share Your Story
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
