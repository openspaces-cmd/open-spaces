import Link from "next/link";

import type { StoryItem } from "@/sanity/queries";

// Long stories are clipped on the wall so one entry can't dominate the
// masonry; the full text lives on /stories/[id].
const WALL_LIMIT = 420;

function clip(text: string): string {
  if (text.length <= WALL_LIMIT) return text;
  const cut = text.slice(0, WALL_LIMIT);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.—-]+$/, "")}…`;
}

export const storyByline = (story: StoryItem) =>
  story.anonymous || !story.name ? "Anonymous" : story.name;

// Testimony card for the Stories wall. Featured stories flip to midnight.
export function StoryCard({ story }: { story: StoryItem }) {
  const dark = Boolean(story.featured);
  const clipped = story.story.length > WALL_LIMIT;

  return (
    <figure
      className={`break-inside-avoid rounded-2xl p-6 ring-1 ${
        dark
          ? "bg-midnight text-ivory-light ring-midnight"
          : "bg-ivory-light text-midnight ring-tan/70"
      }`}
    >
      <span
        aria-hidden
        className="font-display block text-5xl leading-none text-camel"
      >
        “
      </span>
      {story.title ? (
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-camel">
          {story.title}
        </p>
      ) : null}
      <blockquote
        className={`mt-2 whitespace-pre-line text-[15px] leading-relaxed ${
          dark ? "text-ivory-light/90" : "text-charcoal"
        }`}
      >
        {clip(story.story)}
      </blockquote>
      <figcaption className="mt-4 flex items-end justify-between gap-4">
        <span className={`text-xs ${dark ? "text-ivory-light/60" : "text-stormy"}`}>
          — {storyByline(story)}
          {story.location ? `, ${story.location}` : ""}
        </span>
        <Link
          href={`/stories/${story._id}`}
          className={`shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
            dark ? "text-camel hover:text-ivory-light" : "text-camel hover:text-midnight"
          }`}
        >
          {clipped ? "Read more →" : "Share →"}
        </Link>
      </figcaption>
    </figure>
  );
}
