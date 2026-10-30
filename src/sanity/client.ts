import { createClient } from "next-sanity";

import { apiVersion, dataset, safeProjectId } from "./env";

// The dataset is private (story submissions hold emails and unapproved
// stories), so site reads authenticate with a server-only token. Prefer a
// dedicated Viewer token; fall back to the write token Vercel already has.
// Only import from server code — client components may import types only.
export const client = createClient({
  projectId: safeProjectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
  // A token can see drafts; the site must only ever render published content.
  perspective: "published",
});

// Server-only client for writes (YouTube sync, story submissions).
export const writeClient = createClient({
  projectId: safeProjectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
