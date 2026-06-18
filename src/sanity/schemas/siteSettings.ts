import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      initialValue: "Open Spaces",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      initialValue:
        "Honest conversations that point people back to Jesus.",
    }),
    defineField({
      name: "nav",
      title: "Header navigation",
      type: "array",
      of: [
        defineField({
          name: "link",
          title: "Link",
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "href", title: "Href", type: "string" },
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "givingUrl",
      title: "Giving URL",
      description: "External giving/donation link (current processor).",
      type: "url",
    }),
    defineField({
      name: "newsletter",
      title: "Newsletter (Stay Connected) block",
      type: "object",
      fields: [
        {
          name: "heading",
          title: "Heading",
          type: "string",
          initialValue: "Stay Connected",
        },
        {
          name: "body",
          title: "Body copy",
          type: "text",
          rows: 2,
          initialValue:
            "Sign up to receive emails from us on our journey and know what's available through this ministry.",
        },
        {
          name: "actionUrl",
          title: "Form action URL",
          description: "Your ESP form endpoint (ConvertKit, Mailchimp, HubSpot, etc.).",
          type: "url",
        },
      ],
    }),
    defineField({
      name: "social",
      title: "Social links",
      type: "object",
      fields: [
        { name: "instagram", title: "Instagram", type: "url" },
        { name: "tiktok", title: "TikTok", type: "url" },
        { name: "facebook", title: "Facebook", type: "url" },
        { name: "youtube", title: "YouTube", type: "url" },
      ],
    }),
    defineField({
      name: "listen",
      title: "Where to listen",
      type: "object",
      fields: [
        { name: "applePodcasts", title: "Apple Podcasts", type: "url" },
        { name: "spotify", title: "Spotify", type: "url" },
        { name: "youtube", title: "YouTube", type: "url" },
      ],
    }),
    defineField({
      name: "contactEmail",
      title: "Q&A / contact email",
      type: "string",
      initialValue: "questions@openspacespodcast.com",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
