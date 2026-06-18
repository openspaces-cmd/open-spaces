import { createClient } from "next-sanity";

import { apiVersion, dataset, safeProjectId } from "./env";

export const client = createClient({
  projectId: safeProjectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Server-only client for writes (YouTube sync). Never import into client components.
export const writeClient = createClient({
  projectId: safeProjectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
