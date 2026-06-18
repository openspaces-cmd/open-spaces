/**
 * One-time seed: pushes the existing sample content into the live Sanity
 * dataset so the Studio opens populated and the site reads real data.
 *
 * Idempotent for documents (createOrReplace with stable ids). Reel videos are
 * uploaded as assets each run, so run it ONCE. Episodes use the same
 * `youtube-<id>` id scheme as the YouTube sync, so the sync dedupes against
 * these instead of creating duplicates.
 *
 * Run:  set -a && . ./.env.local && set +a && ./node_modules/.bin/tsx scripts/seed-sanity.ts
 */
import { createReadStream } from "node:fs";

import { createClient } from "@sanity/client";

import {
  sampleArticles,
  sampleEpisodes,
  sampleHome,
  sampleSettings,
  sampleStories,
} from "../src/sanity/sampleData";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN. Source .env.local first.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<string, any>;
type Doc = { _id: string; _type: string } & Json;

async function main() {
  // 1) Guests (referenced by episodes) — dedupe by the sample's inline id.
  const guestByInlineId = new Map<string, Doc>();
  for (const ep of sampleEpisodes) {
    for (const g of ep.guests ?? []) {
      if (!guestByInlineId.has(g._id)) {
        guestByInlineId.set(g._id, {
          _id: `guest-${slugify(g.name)}`,
          _type: "guest",
          name: g.name,
          slug: { _type: "slug", current: slugify(g.name) },
          ...(g.role ? { role: g.role } : {}),
        });
      }
    }
  }

  // 2) Episodes — id matches the YouTube-sync scheme so the sync won't dupe.
  const episodeDocs: Doc[] = sampleEpisodes.map((ep) => ({
    _id: `youtube-${ep.youtubeId}`,
    _type: "episode",
    title: ep.title,
    slug: { _type: "slug", current: ep.slug },
    youtubeId: ep.youtubeId,
    publishedAt: ep.publishedAt,
    ...(ep.episodeNumber != null ? { episodeNumber: ep.episodeNumber } : {}),
    ...(ep.season != null ? { season: ep.season } : {}),
    ...(ep.series ? { series: ep.series } : {}),
    ...(ep.tags ? { tags: ep.tags } : {}),
    ...(ep.excerpt ? { excerpt: ep.excerpt } : {}),
    ...(ep.featured ? { featured: ep.featured } : {}),
    ...(ep.guests?.length
      ? {
          guests: ep.guests.map((g, i) => ({
            _type: "reference",
            _key: `guest-${i}`,
            _ref: guestByInlineId.get(g._id)!._id,
          })),
        }
      : {}),
  }));

  // 3) Articles — body is already valid Portable Text in the sample data.
  const articleDocs: Doc[] = sampleArticles.map((a) => ({
    _id: a._id,
    _type: "article",
    title: a.title,
    slug: { _type: "slug", current: a.slug },
    ...(a.excerpt ? { excerpt: a.excerpt } : {}),
    ...(a.author ? { author: a.author } : {}),
    ...(a.authorRole ? { authorRole: a.authorRole } : {}),
    ...(a.category ? { category: a.category } : {}),
    publishedAt: a.publishedAt,
    ...(a.featured != null ? { featured: a.featured } : {}),
    ...(a.body ? { body: a.body } : {}),
  }));

  // 4) Stories — add the approval + consent flags the public query requires.
  const storyDocs: Doc[] = sampleStories.map((s) => ({
    _id: s._id,
    _type: "story",
    status: s.featured ? "featured" : "approved",
    mayShare: true,
    ...(s.title ? { title: s.title } : {}),
    story: s.story,
    ...(s.name ? { name: s.name } : {}),
    ...(s.location ? { location: s.location } : {}),
    ...(s.anonymous ? { anonymous: s.anonymous } : {}),
    ...(s.submittedAt ? { submittedAt: s.submittedAt } : {}),
  }));

  // 5) Reels — upload the bundled videos + posters as Sanity assets.
  console.log("Uploading reel assets…");
  const reels: Json[] = [];
  for (let i = 1; i <= 5; i++) {
    const video = await client.assets.upload(
      "file",
      createReadStream(`public/reels/reel-${i}.mp4`),
      { filename: `reel-${i}.mp4` },
    );
    const poster = await client.assets.upload(
      "image",
      createReadStream(`public/reels/reel-${i}.jpg`),
      { filename: `reel-${i}.jpg` },
    );
    reels.push({
      _type: "reel",
      _key: `reel-${i}`,
      video: { _type: "file", asset: { _type: "reference", _ref: video._id } },
      poster: {
        _type: "image",
        asset: { _type: "reference", _ref: poster._id },
      },
    });
    console.log(`  reel-${i} ✓`);
  }

  // 6) Singletons (ids must match structure.ts: "siteSettings" / "homePage").
  const settingsDoc: Doc = {
    _id: "siteSettings",
    _type: "siteSettings",
    ...(sampleSettings.title ? { title: sampleSettings.title } : {}),
    ...(sampleSettings.tagline ? { tagline: sampleSettings.tagline } : {}),
    ...(sampleSettings.nav
      ? {
          nav: sampleSettings.nav.map((n, i) => ({
            _type: "link",
            _key: `nav-${i}`,
            label: n.label,
            href: n.href,
          })),
        }
      : {}),
    ...(sampleSettings.givingUrl ? { givingUrl: sampleSettings.givingUrl } : {}),
    ...(sampleSettings.newsletter
      ? { newsletter: sampleSettings.newsletter }
      : {}),
    ...(sampleSettings.social ? { social: sampleSettings.social } : {}),
    ...(sampleSettings.listen ? { listen: sampleSettings.listen } : {}),
    ...(sampleSettings.contactEmail
      ? { contactEmail: sampleSettings.contactEmail }
      : {}),
  };

  const homeDoc: Doc = {
    _id: "homePage",
    _type: "homePage",
    heroHeading: sampleHome.heroHeading,
    heroBody: sampleHome.heroBody,
    heroSubscribeLabel: sampleHome.heroSubscribeLabel,
    featuredHeading: sampleHome.featuredHeading,
    featuredBody: sampleHome.featuredBody,
    featuredYoutubeId: sampleHome.featuredYoutubeId,
    reelsHeading: sampleHome.reelsHeading,
    reels,
    startHereEpisodes: (sampleHome.startHere ?? []).map((e, i) => ({
      _type: "reference",
      _key: `sh-${i}`,
      _ref: `youtube-${e.youtubeId}`,
    })),
    aboutHeading: sampleHome.aboutHeading,
    aboutBody: sampleHome.aboutBody,
    aboutCtaLabel: sampleHome.aboutCtaLabel,
    aboutCtaUrl: sampleHome.aboutCtaUrl,
  };

  const all: Doc[] = [
    ...guestByInlineId.values(),
    ...episodeDocs,
    ...articleDocs,
    ...storyDocs,
    settingsDoc,
    homeDoc,
  ];

  console.log(`Writing ${all.length} documents…`);
  const tx = client.transaction();
  all.forEach((doc) => tx.createOrReplace(doc));
  await tx.commit();

  console.log(
    `✓ Seeded: ${guestByInlineId.size} guests, ${episodeDocs.length} episodes, ${articleDocs.length} articles, ${storyDocs.length} stories, ${reels.length} reels, + home & settings.`,
  );
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
