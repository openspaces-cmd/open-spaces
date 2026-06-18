import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { getArticleBySlug } from "@/sanity/queries";

export const alt = "Open Spaces article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded share card per article: category, condensed title, journal footer.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const morganite = await readFile(
    join(process.cwd(), "public/fonts/Morganite-SemiBold-og.ttf"),
  );

  const title = article?.title ?? "Open Spaces";
  const category = article?.category ?? "The Journal";
  const author = article?.author;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1d252d",
          padding: "70px 90px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 46,
            left: 50,
            width: 56,
            height: 56,
            borderLeft: "5px solid #bf8b3e",
            borderTop: "5px solid #bf8b3e",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 46,
            right: 50,
            width: 56,
            height: 56,
            borderRight: "5px solid #bf8b3e",
            borderBottom: "5px solid #bf8b3e",
          }}
        />

        <div
          style={{
            fontSize: 26,
            color: "#bf8b3e",
            letterSpacing: 10,
            textTransform: "uppercase",
          }}
        >
          {category}
        </div>

        <div
          style={{
            fontFamily: "Morganite",
            fontSize: 150,
            color: "#fdfaf6",
            lineHeight: 0.9,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#bec6c4",
            letterSpacing: 3,
          }}
        >
          <div>{author ? `BY ${author.toUpperCase()}` : ""}</div>
          <div style={{ color: "#bf8b3e", letterSpacing: 6 }}>
            OPEN SPACES · THE JOURNAL
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Morganite", data: morganite, style: "normal", weight: 600 },
      ],
    },
  );
}
