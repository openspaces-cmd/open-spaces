export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Empty until the user creates a Sanity project and sets the env var.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

// Drives graceful fallback to sample content across the site + Studio.
export const isSanityConfigured = projectId !== "";

// createClient requires a syntactically valid id even when unconfigured.
export const safeProjectId = projectId || "placeholder";
