import type { StoryItem } from "@/sanity/queries";

// Testimony card for the Stories wall. Featured stories flip to midnight.
export function StoryCard({ story }: { story: StoryItem }) {
  const dark = Boolean(story.featured);
  const byline = story.anonymous || !story.name ? "Anonymous" : story.name;

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
        <p
          className={`mt-1 font-mono text-[11px] uppercase tracking-[0.18em] ${
            dark ? "text-camel" : "text-camel"
          }`}
        >
          {story.title}
        </p>
      ) : null}
      <blockquote
        className={`mt-2 text-[15px] leading-relaxed ${
          dark ? "text-ivory-light/90" : "text-charcoal"
        }`}
      >
        {story.story}
      </blockquote>
      <figcaption
        className={`mt-4 text-xs ${dark ? "text-ivory-light/60" : "text-stormy"}`}
      >
        — {byline}
        {story.location ? `, ${story.location}` : ""}
      </figcaption>
    </figure>
  );
}
