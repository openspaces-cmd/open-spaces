"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, safeProjectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId: safeProjectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
