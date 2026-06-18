import type { StructureResolver } from "sanity/structure";

// Singleton for siteSettings; document lists for everything else.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      S.documentTypeListItem("episode").title("Episodes"),
      S.documentTypeListItem("article").title("Articles"),
      S.documentTypeListItem("story").title("Stories"),
      S.documentTypeListItem("guest").title("Guests"),
      S.documentTypeListItem("page").title("Pages"),
    ]);
