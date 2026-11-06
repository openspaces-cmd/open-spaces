import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ShareButtons } from "@/components/ShareButtons";
import { StoryCard, storyByline } from "@/components/StoryCard";
import { getStories, getStoryById } from "@/sanity/queries";

// New stories are approved in the Studio after deploy, so render unknown ids
// on demand instead of only those known at build time.
export async function generateStaticParams() {
  return [];
}

const headline = (title: string | undefined, byline: string) =>
  title || `${byline}’s story`;

const summary = (text: string) =>
  text.length > 155 ? `${text.slice(0, 152).trimEnd()}…` : text;

export async function generateMetadata(
  props: PageProps<"/stories/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const story = await getStoryById(id);
  if (!story) return { title: "Story not found" };
  const title = headline(story.title, storyByline(story));
  return {
    title,
    description: summary(story.story),
    openGraph: {
      title,
      description: summary(story.story),
      url: `/stories/${story._id}`,
    },
  };
}

export default async function StoryPage(props: PageProps<"/stories/[id]">) {
  const { id } = await props.params;
  const [story, all] = await Promise.all([getStoryById(id), getStories()]);

  if (!story) notFound();

  const byline = storyByline(story);
  const more = all.filter((s) => s._id !== story._id).slice(0, 3);

  return (
    <>
      <article className="mx-auto max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
        <Link
          href="/stories"
          className="eyebrow text-charcoal transition-colors hover:text-camel"
        >
          ← All stories
        </Link>

        <span
          aria-hidden
          className="font-display mt-8 block text-7xl leading-none text-camel"
        >
          “
        </span>
        {story.title ? (
          <h1 className="font-display text-5xl text-midnight sm:text-6xl">
            {story.title}
          </h1>
        ) : (
          <h1 className="sr-only">{headline(story.title, byline)}</h1>
        )}

        <blockquote className="mt-6 whitespace-pre-line text-lg leading-relaxed text-charcoal">
          {story.story}
        </blockquote>
        <p className="mt-6 text-sm text-stormy">
          — {byline}
          {story.location ? `, ${story.location}` : ""}
        </p>

        <div className="mt-10 border-t border-tan/70 pt-6">
          <ShareButtons
            title={headline(story.title, byline)}
            path={`/stories/${story._id}`}
          />
        </div>
      </article>

      {more.length > 0 ? (
        <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
          <div className="flex items-end justify-between border-t border-tan/70 pt-10">
            <h2 className="font-display text-3xl text-midnight">More Stories</h2>
            <Link
              href="/stories"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-camel hover:text-midnight"
            >
              View all →
            </Link>
          </div>
          <div className="mt-6 columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
            {more.map((s) => (
              <StoryCard key={s._id} story={s} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-midnight">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 py-14 text-center lg:px-8">
          <h2 className="font-display text-4xl text-ivory-light sm:text-5xl">
            Your story isn&apos;t over
          </h2>
          <Link
            href="/stories/share"
            className="rounded-sm bg-camel px-8 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
          >
            Share Your Story
          </Link>
        </div>
      </section>
    </>
  );
}
