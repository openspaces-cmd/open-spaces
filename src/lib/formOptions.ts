// Option lists shared by the forms (client) and their API routes (server
// validation). Edit the labels here; the Sanity schemas store the same text.

export const GROUP_OPTIONS = [
  "Women's group",
  "Men's group",
] as const;

export const GUEST_TOPICS = [
  "Same-sex attraction",
  "Faith, doubt & deconstruction",
  "Grief & loss",
  "Marriage & family",
  "Parenting",
  "Addiction & recovery",
  "Mental health",
  "Other",
] as const;

export const GUEST_VIDEO_OPTIONS = [
  "Yes — video is fine",
  "Audio only, please",
  "Not sure yet",
] as const;

export const GUEST_ANONYMITY_OPTIONS = [
  "I'm comfortable using my name",
  "I'd prefer to stay anonymous / use a first name only",
] as const;
