import { defineField, defineType } from "sanity";

import {
  GROUP_OPTIONS,
  GUEST_ANONYMITY_OPTIONS,
  GUEST_TOPICS,
  GUEST_VIDEO_OPTIONS,
} from "@/lib/formOptions";

// Private form submissions from the website. Documents are created with a
// "private." id prefix so they never appear in public API reads.

const list = (opts: readonly string[]) => opts.map((o) => ({ title: o, value: o }));

const statusField = (options: { title: string; value: string }[]) =>
  defineField({
    name: "status",
    title: "Status",
    type: "string",
    options: { list: options, layout: "radio" },
    initialValue: "new",
  });

const contactFields = [
  defineField({ name: "firstName", title: "First name", type: "string" }),
  defineField({ name: "lastName", title: "Last name", type: "string" }),
  defineField({ name: "email", title: "Email", type: "string" }),
  defineField({ name: "phone", title: "Phone", type: "string" }),
  defineField({ name: "location", title: "City & state", type: "string" }),
];

const submittedAt = defineField({
  name: "submittedAt",
  title: "Submitted at",
  type: "datetime",
  readOnly: true,
});

const newestFirst = [
  {
    title: "Newest first",
    name: "submittedDesc",
    by: [{ field: "submittedAt", direction: "desc" as const }],
  },
];

export const groupWaitlist = defineType({
  name: "groupWaitlist",
  title: "Groups Waitlist",
  type: "document",
  fields: [
    statusField([
      { title: "New", value: "new" },
      { title: "Contacted", value: "contacted" },
      { title: "Placed in a group", value: "placed" },
      { title: "Not a fit / withdrew", value: "closed" },
    ]),
    ...contactFields,
    defineField({
      name: "groups",
      title: "Interested in",
      type: "array",
      of: [{ type: "string" }],
      options: { list: list(GROUP_OPTIONS) },
    }),
    defineField({ name: "notes", title: "Notes from them", type: "text", rows: 4 }),
    defineField({ name: "teamNotes", title: "Team notes (internal)", type: "text", rows: 3 }),
    submittedAt,
  ],
  orderings: newestFirst,
  preview: {
    select: { first: "firstName", last: "lastName", groups: "groups", status: "status" },
    prepare({ first, last, groups, status }) {
      return {
        title: [first, last].filter(Boolean).join(" ") || "Waitlist signup",
        subtitle: `${status ?? "new"} · ${(groups ?? []).join(", ")}`,
      };
    },
  },
});

export const guestApplication = defineType({
  name: "guestApplication",
  title: "Podcast Guest Application",
  type: "document",
  fields: [
    statusField([
      { title: "New", value: "new" },
      { title: "Reviewing", value: "reviewing" },
      { title: "Invited", value: "invited" },
      { title: "Recorded", value: "recorded" },
      { title: "Not a fit right now", value: "declined" },
    ]),
    ...contactFields,
    defineField({ name: "church", title: "Church or ministry", type: "string" }),
    defineField({ name: "links", title: "Website / social links", type: "string" }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      of: [{ type: "string" }],
      options: { list: list(GUEST_TOPICS) },
    }),
    defineField({ name: "story", title: "Story in brief", type: "text", rows: 8 }),
    defineField({ name: "takeaway", title: "Hoped-for listener takeaway", type: "text", rows: 3 }),
    defineField({ name: "sharedBefore", title: "Shared publicly before", type: "text", rows: 2 }),
    defineField({
      name: "video",
      title: "Comfortable on video",
      type: "string",
      options: { list: list(GUEST_VIDEO_OPTIONS) },
    }),
    defineField({
      name: "anonymity",
      title: "Using their name",
      type: "string",
      options: { list: list(GUEST_ANONYMITY_OPTIONS) },
    }),
    defineField({ name: "referral", title: "Heard about us via", type: "string" }),
    defineField({ name: "teamNotes", title: "Team notes (internal)", type: "text", rows: 3 }),
    submittedAt,
  ],
  orderings: newestFirst,
  preview: {
    select: { first: "firstName", last: "lastName", topics: "topics", status: "status" },
    prepare({ first, last, topics, status }) {
      return {
        title: [first, last].filter(Boolean).join(" ") || "Guest application",
        subtitle: `${status ?? "new"} · ${(topics ?? []).join(", ")}`,
      };
    },
  },
});
