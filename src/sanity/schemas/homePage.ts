import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "featured", title: "Featured" },
    { name: "reels", title: "Reels" },
    { name: "startHere", title: "Start Here" },
    { name: "about", title: "About" },
    { name: "newsletter", title: "Newsletter" },
  ],
  fields: [
    defineField({
      name: "heroHeading",
      title: "Hero heading",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroBody",
      title: "Hero body",
      type: "text",
      rows: 3,
      group: "hero",
    }),
    defineField({
      name: "heroSubscribeLabel",
      title: "Hero subscribe prompt",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      group: "hero",
    }),
    defineField({
      name: "featuredHeading",
      title: "Featured heading",
      type: "string",
      group: "featured",
    }),
    defineField({
      name: "featuredBody",
      title: "Featured body",
      type: "text",
      rows: 3,
      group: "featured",
    }),
    defineField({
      name: "featuredYoutubeId",
      title: "Featured YouTube ID",
      type: "string",
      group: "featured",
    }),
    defineField({
      name: "reelsHeading",
      title: "Reels heading (oversized wordmark)",
      type: "string",
      group: "reels",
    }),
    defineField({
      name: "reels",
      title: "Reels",
      description: "Short vertical videos shown in a row.",
      type: "array",
      group: "reels",
      of: [
        defineField({
          name: "reel",
          title: "Reel",
          type: "object",
          fields: [
            defineField({
              name: "video",
              title: "Video file (vertical / 9:16)",
              type: "file",
              options: { accept: "video/*" },
            }),
            defineField({
              name: "poster",
              title: "Poster image (optional)",
              type: "image",
              options: { hotspot: true },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "startHereEpisodes",
      title: "Our Story episodes",
      description:
        "Curated path for first-time listeners (shown in order, ~5 episodes).",
      type: "array",
      group: "startHere",
      of: [{ type: "reference", to: [{ type: "episode" }] }],
      validation: (r) => r.max(6),
    }),
    defineField({
      name: "aboutHeading",
      title: "About heading",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutBody",
      title: "About body",
      type: "text",
      rows: 6,
      group: "about",
    }),
    defineField({
      name: "aboutCtaLabel",
      title: "About button label",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutCtaUrl",
      title: "About button link",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutImage",
      title: "About image",
      type: "image",
      options: { hotspot: true },
      group: "about",
    }),
    defineField({
      name: "newsletterImage",
      title: "Newsletter background image",
      type: "image",
      options: { hotspot: true },
      group: "newsletter",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
