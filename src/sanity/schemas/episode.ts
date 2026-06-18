import { defineField, defineType } from "sanity";

export const episode = defineType({
  name: "episode",
  title: "Episode",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "youtubeId",
      title: "YouTube Video ID",
      description: "The 11-character ID from the video URL (after v=). Drives the embedded player.",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "episodeNumber",
      title: "Episode number",
      type: "number",
    }),
    defineField({
      name: "season",
      title: "Season",
      type: "number",
    }),
    defineField({
      name: "series",
      title: "Series",
      description:
        "Optional. Episodes sharing a series name are grouped into a collection (e.g. \"Community\").",
      type: "string",
    }),
    defineField({
      name: "tags",
      title: "Topics",
      description: "Short topic tags used for filtering (e.g. marriage, family, identity).",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "Short summary shown in episode cards and meta descriptions.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "guests",
      title: "Guests",
      type: "array",
      of: [{ type: "reference", to: [{ type: "guest" }] }],
    }),
    defineField({
      name: "thumbnail",
      title: "Custom thumbnail",
      description: "Optional. Falls back to the YouTube thumbnail if empty.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "transcript",
      title: "Transcript",
      description: "Auto-generated or pasted. Powers search and SEO.",
      type: "text",
      rows: 10,
    }),
    defineField({
      name: "applePodcastsUrl",
      title: "Apple Podcasts URL",
      type: "url",
    }),
    defineField({
      name: "spotifyUrl",
      title: "Spotify URL",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      description: "Highlight this episode in the hero on the homepage.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "syncedFromYouTube",
      title: "Synced from YouTube",
      description: "Set automatically by the sync job. Manual edits are preserved.",
      type: "boolean",
      readOnly: true,
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "thumbnail" },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : "Unpublished",
        media,
      };
    },
  },
});
