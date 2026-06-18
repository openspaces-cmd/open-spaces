import { groq } from "next-sanity";

import { client } from "./client";
import { isSanityConfigured } from "./env";
import {
  sampleArticles,
  sampleEpisodes,
  sampleHome,
  sampleSettings,
  sampleStories,
} from "./sampleData";

const episodeFields = groq`
  _id,
  title,
  "slug": slug.current,
  youtubeId,
  publishedAt,
  episodeNumber,
  season,
  series,
  tags,
  excerpt,
  featured,
  applePodcastsUrl,
  spotifyUrl,
  "thumbnailUrl": thumbnail.asset->url,
  "guests": guests[]->{ _id, name, role, "slug": slug.current }
`;

export type EpisodeListItem = {
  _id: string;
  title: string;
  slug: string;
  youtubeId: string;
  publishedAt: string;
  episodeNumber?: number;
  season?: number;
  series?: string;
  tags?: string[];
  excerpt?: string;
  featured?: boolean;
  applePodcastsUrl?: string;
  spotifyUrl?: string;
  thumbnailUrl?: string;
  guests?: { _id: string; name: string; role?: string; slug?: string }[];
};

export type EpisodeDetail = EpisodeListItem & {
  transcript?: string;
};

export type SiteSettings = {
  title?: string;
  tagline?: string;
  nav?: { label: string; href: string }[];
  givingUrl?: string;
  newsletter?: { heading?: string; body?: string; actionUrl?: string };
  social?: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
  };
  listen?: { applePodcasts?: string; spotify?: string; youtube?: string };
  contactEmail?: string;
};

export type ArticleListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImageUrl?: string | null;
  author?: string;
  authorRole?: string;
  category?: string;
  publishedAt: string;
  featured?: boolean;
};

export type ArticleDetail = ArticleListItem & { body?: unknown[] };

export type StoryItem = {
  _id: string;
  title?: string;
  story: string;
  name?: string;
  location?: string;
  anonymous?: boolean;
  featured?: boolean;
  submittedAt?: string;
};

export type HomeContent = {
  heroHeading?: string;
  heroBody?: string;
  heroSubscribeLabel?: string;
  heroImageUrl?: string | null;
  featuredHeading?: string;
  featuredBody?: string;
  featuredYoutubeId?: string;
  reelsHeading?: string;
  reels?: { _key?: string; url: string; poster?: string }[];
  startHere?: EpisodeListItem[];
  aboutHeading?: string;
  aboutBody?: string;
  aboutCtaLabel?: string;
  aboutCtaUrl?: string;
  aboutImageUrl?: string | null;
  newsletterImageUrl?: string | null;
};

// Returns fallback when Sanity isn't configured or a fetch fails, so the site
// always renders. Once the project id + content exist, real data flows through.
async function safeFetch<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  if (!isSanityConfigured) return fallback;
  try {
    const result = await run();
    return result ?? fallback;
  } catch (err) {
    console.error("[sanity] fetch failed, using fallback:", err);
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return safeFetch(
    () =>
      client.fetch(
        groq`*[_type == "siteSettings"][0]{
          title, tagline, nav, givingUrl, newsletter, social, listen, contactEmail
        }`,
        {},
        { next: { revalidate: 60 } },
      ),
    sampleSettings,
  );
}

export async function getHomeContent(): Promise<HomeContent> {
  return safeFetch(
    () =>
      client.fetch(
        groq`*[_type == "homePage"][0]{
          heroHeading,
          heroBody,
          heroSubscribeLabel,
          "heroImageUrl": heroImage.asset->url,
          featuredHeading,
          featuredBody,
          featuredYoutubeId,
          reelsHeading,
          "reels": reels[]{ _key, "url": video.asset->url, "poster": poster.asset->url },
          "startHere": startHereEpisodes[]->{ ${episodeFields} },
          aboutHeading,
          aboutBody,
          aboutCtaLabel,
          aboutCtaUrl,
          "aboutImageUrl": aboutImage.asset->url,
          "newsletterImageUrl": newsletterImage.asset->url
        }`,
        {},
        { next: { revalidate: 60 } },
      ),
    sampleHome,
  );
}

export async function getEpisodes(): Promise<EpisodeListItem[]> {
  return safeFetch(
    () =>
      client.fetch(
        groq`*[_type == "episode"] | order(publishedAt desc){ ${episodeFields} }`,
        {},
        { next: { revalidate: 60 } },
      ),
    sampleEpisodes,
  );
}

export async function getFeaturedEpisode(): Promise<EpisodeListItem | null> {
  return safeFetch(
    () =>
      client.fetch(
        groq`*[_type == "episode" && featured == true] | order(publishedAt desc)[0]{ ${episodeFields} }`,
        {},
        { next: { revalidate: 60 } },
      ),
    sampleEpisodes.find((e) => e.featured) ?? sampleEpisodes[0],
  );
}

export async function getEpisodeBySlug(
  slug: string,
): Promise<EpisodeDetail | null> {
  return safeFetch(
    () =>
      client.fetch(
        groq`*[_type == "episode" && slug.current == $slug][0]{ ${episodeFields}, transcript }`,
        { slug },
        { next: { revalidate: 60 } },
      ),
    sampleEpisodes.find((e) => e.slug === slug) ?? null,
  );
}

export async function getEpisodeSlugs(): Promise<{ slug: string }[]> {
  return safeFetch(
    () =>
      client.fetch(
        groq`*[_type == "episode" && defined(slug.current)]{ "slug": slug.current }`,
      ),
    sampleEpisodes.map((e) => ({ slug: e.slug })),
  );
}

const articleFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "coverImageUrl": coverImage.asset->url,
  author,
  authorRole,
  category,
  publishedAt,
  featured
`;

export async function getArticles(): Promise<ArticleListItem[]> {
  return safeFetch(
    () =>
      client.fetch(
        groq`*[_type == "article"] | order(publishedAt desc){ ${articleFields} }`,
        {},
        { next: { revalidate: 60 } },
      ),
    sampleArticles,
  );
}

export async function getArticleBySlug(
  slug: string,
): Promise<ArticleDetail | null> {
  return safeFetch(
    () =>
      client.fetch(
        groq`*[_type == "article" && slug.current == $slug][0]{
          ${articleFields},
          "body": body[]{ ..., _type == "image" => { "url": asset->url } }
        }`,
        { slug },
        { next: { revalidate: 60 } },
      ),
    sampleArticles.find((a) => a.slug === slug) ?? null,
  );
}

export async function getArticleSlugs(): Promise<{ slug: string }[]> {
  return safeFetch(
    () =>
      client.fetch(
        groq`*[_type == "article" && defined(slug.current)]{ "slug": slug.current }`,
      ),
    sampleArticles.map((a) => ({ slug: a.slug })),
  );
}

// Public wall: only approved/featured stories WITH sharing consent, and only
// public-safe fields (never email or follow-up flags).
export async function getStories(): Promise<StoryItem[]> {
  return safeFetch(
    () =>
      client.fetch(
        groq`*[_type == "story" && status in ["approved", "featured"] && mayShare == true]
          | order(submittedAt desc){
            _id,
            title,
            story,
            "name": select(anonymous == true => null, name),
            "location": select(anonymous == true => null, location),
            anonymous,
            "featured": status == "featured",
            submittedAt
          }`,
        {},
        { next: { revalidate: 60 } },
      ),
    sampleStories,
  );
}

export async function getPageBySlug(slug: string) {
  return safeFetch(
    () =>
      client.fetch(
        groq`*[_type == "page" && slug.current == $slug][0]{
          title, heading, subheading, body, "heroImageUrl": heroImage.asset->url
        }`,
        { slug },
        { next: { revalidate: 60 } },
      ),
    null,
  );
}
