import type { SchemaTypeDefinition } from "sanity";

import { article } from "./article";
import { episode } from "./episode";
import { guest } from "./guest";
import { homePage } from "./homePage";
import { page } from "./page";
import { siteSettings } from "./siteSettings";
import { story } from "./story";

export const schemaTypes: SchemaTypeDefinition[] = [
  homePage,
  episode,
  article,
  story,
  guest,
  page,
  siteSettings,
];
