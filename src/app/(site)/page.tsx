import Link from "next/link";

import { ArticleCard } from "@/components/ArticleCard";
import { CollectionTile } from "@/components/CollectionTile";
import { FeaturedVideo } from "@/components/FeaturedVideo";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { LatestEpisode } from "@/components/LatestEpisode";
import { Reels } from "@/components/Reels";
import { StartHere } from "@/components/StartHere";
import { StoryCard } from "@/components/StoryCard";
import { resolveCollections } from "@/lib/collections";
import {
  getArticles,
  getEpisodes,
  getHomeContent,
  getSiteSettings,
  getStories,
} from "@/sanity/queries";

export default async function HomePage() {
  const [home, episodes, settings, articles, stories] = await Promise.all([
    getHomeContent(),
    getEpisodes(),
    getSiteSettings(),
    getArticles(),
    getStories(),
  ]);

  const latestArticles = articles.slice(0, 3);
  const featuredStories = stories.slice(0, 3);
  const latestEpisode = episodes[0]; // getEpisodes() returns newest-first

  // Featured collections for the homepage "Explore by Theme" grid.
  const collections = resolveCollections(episodes, home.startHere ?? []).filter(
    (c) => c.featured,
  );

  return (
    <>
      {/* Hero — brand photo, editorial statement framed by the gold brackets.
          Mobile/tablet stacks the photo above the text so Jeff & Jourdan stay
          unobscured; desktop runs the photo full-bleed behind the right column. */}
      <section className="bg-midnight">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={home.heroImageUrl || "/brand/hero-image.jpg"}
          alt="Jeff & Jourdan Johnson"
          className="aspect-[4/3] w-full object-cover object-left sm:aspect-[16/9] lg:hidden"
        />

        <div className="relative isolate overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={home.heroImageUrl || "/brand/hero-image.jpg"}
            alt=""
            aria-hidden
            className="absolute inset-0 -z-10 hidden h-full w-full object-cover object-left lg:block"
          />

          <div className="mx-auto grid w-full max-w-7xl items-center px-6 py-14 sm:py-20 lg:min-h-[660px] lg:grid-cols-2 lg:px-8 lg:py-28">
            <div className="hidden lg:block" />
            <div className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-6 pb-9 text-center sm:pb-0 lg:mx-0">
              {/* Bracket frame — the brand's signature lockup device */}
              <span
                aria-hidden
                className="absolute -left-4 -top-5 h-8 w-8 border-l-2 border-t-2 border-camel sm:-left-5 sm:-top-7 sm:h-10 sm:w-10 lg:-left-7"
              />
              <span
                aria-hidden
                className="absolute -bottom-5 -right-1 h-8 w-8 border-b-2 border-r-2 border-camel sm:-bottom-7 sm:-right-2 sm:h-10 sm:w-10"
              />

              <p className="eyebrow text-camel">
                A podcast with Jeff &amp; Jourdan Johnson
              </p>
              <h1
                className="font-display text-6xl text-white sm:text-7xl lg:text-8xl"
                style={{ fontWeight: 600 }}
              >
                {home.heroHeading || "Your story matters"}
              </h1>
              {home.heroBody ? (
                <p className="max-w-md text-base leading-relaxed text-ivory-light/90">
                  {home.heroBody}
                </p>
              ) : null}

              <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/podcast"
                  className="rounded-sm bg-camel px-7 py-3.5 text-center font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
                >
                  Start Listening
                </Link>
                <Link
                  href="/stories/share"
                  className="rounded-sm border border-ivory-light/40 px-7 py-3.5 text-center font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:border-camel hover:text-camel"
                >
                  Share Your Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Episode — newest drop, surfaced right under the hero */}
      {latestEpisode ? <LatestEpisode episode={latestEpisode} /> : null}

      {/* Featured — the "as heard on" conversation; plays in a modal */}
      {home.featuredHeading ? (
        <FeaturedVideo
          heading={home.featuredHeading}
          body={home.featuredBody}
          youtubeId={home.featuredYoutubeId}
        />
      ) : null}

      {/* Reels */}
      <Reels reels={home.reels} heading={home.reelsHeading} />

      {/* Start Here — curated path for first-time listeners */}
      <StartHere episodes={home.startHere} />

      {/* Explore by Theme — collection tiles instead of a wall of episodes */}
      <section className="bg-gradient-to-b from-steel/35 to-ivory">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="eyebrow text-camel">Explore by theme</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl text-midnight sm:text-5xl">
              Browse the Conversations
            </h2>
            <Link
              href="/podcast"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-camel hover:text-midnight"
            >
              All episodes →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <CollectionTile key={c.slug} collection={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Q&A */}
      <section className="bg-tan">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 py-16 text-center lg:px-8">
          <p className="font-display text-3xl text-midnight sm:text-4xl">
            Have a question for us?
          </p>
          <Link
            href={`mailto:${settings?.contactEmail || "questions@openspacespodcast.com"}`}
            className="rounded-sm bg-camel px-8 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
          >
            Submit a Question for Q&amp;A
          </Link>
        </div>
      </section>

      {/* Stories from listeners */}
      {featuredStories.length > 0 ? (
        <section className="bg-ivory">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <p className="eyebrow text-camel">Stories from listeners</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-4xl text-midnight sm:text-5xl">
                Belief for the Impossible
              </h2>
              <Link
                href="/stories"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-camel hover:text-midnight"
              >
                All stories →
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featuredStories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/stories/share"
                className="inline-block rounded-sm bg-camel px-8 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
              >
                Share Your Story
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* About Us */}
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
          <div className="max-w-md">
            <h2 className="font-display text-4xl text-midnight sm:text-5xl">
              {home.aboutHeading || "About Us"}
            </h2>
            {home.aboutBody ? (
              <p className="mt-5 text-[15px] leading-relaxed text-charcoal">
                {home.aboutBody}
              </p>
            ) : null}
            {home.aboutCtaLabel ? (
              <Link
                href={home.aboutCtaUrl || "/about"}
                className="mt-7 inline-block rounded-sm bg-camel px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
              >
                {home.aboutCtaLabel}
              </Link>
            ) : null}
          </div>

          <div className="relative aspect-[5/4] overflow-hidden rounded-sm">
            {home.aboutImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={home.aboutImageUrl}
                alt={home.aboutHeading || "About Open Spaces"}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlaceholder label="Jeff & Jourdan" sealSize={160} />
            )}
          </div>
        </div>
      </section>

      {/* From the Journal */}
      {latestArticles.length > 0 ? (
        <section className="bg-ivory">
          <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
            <div className="flex items-end justify-between">
              <div>
                <p className="eyebrow text-camel">The Journal</p>
                <h2 className="mt-2 font-display text-4xl text-midnight sm:text-5xl">
                  Read the Latest
                </h2>
              </div>
              <Link
                href="/articles"
                className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-camel hover:text-midnight sm:block"
              >
                All articles →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
