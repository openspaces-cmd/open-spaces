import { defineField, defineType } from "sanity";

// Listener-submitted stories. New submissions arrive with status "submitted";
// nothing appears on the site until an editor moves it to approved/featured.
export const story = defineType({
  name: "story",
  title: "Story",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Status",
      description:
        "Submitted stories are private. Approved/Featured stories appear on the Stories wall (only if sharing consent was given).",
      type: "string",
      options: {
        list: [
          { title: "Submitted (private)", value: "submitted" },
          { title: "Approved (on the wall)", value: "approved" },
          { title: "Featured (highlighted)", value: "featured" },
        ],
        layout: "radio",
      },
      initialValue: "submitted",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Headline",
      description:
        "Optional short headline added by the team (e.g. \"Freedom after 12 years\").",
      type: "string",
    }),
    defineField({
      name: "story",
      title: "Story",
      type: "text",
      rows: 8,
      validation: (r) => r.required().min(20),
    }),
    defineField({
      name: "name",
      title: "First name",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "anonymous",
      title: "Share anonymously",
      description: "If true, the wall shows “Anonymous” instead of the name.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "mayShare",
      title: "Consented to sharing",
      description:
        "They agreed their story may be shared on the website or podcast. Stories without consent never appear publicly.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "wantsFollowUp",
      title: "Asked for follow-up",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "email",
      title: "Email (private)",
      description: "Only for follow-up. Never shown on the site.",
      type: "string",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "submittedDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", name: "name", status: "status", story: "story" },
    prepare({ title, name, status, story }) {
      return {
        title: title || (story ? `${story.slice(0, 60)}…` : "Untitled story"),
        subtitle: `${status ?? "submitted"}${name ? ` · ${name}` : ""}`,
      };
    },
  },
});
