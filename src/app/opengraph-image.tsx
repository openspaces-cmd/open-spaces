import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "Open Spaces — Honest conversations that point people back to Jesus";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded default share card: midnight field, gold brackets, Morganite wordmark.
export default async function Image() {
  const morganite = await readFile(
    join(process.cwd(), "public/fonts/Morganite-SemiBold-og.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1d252d",
          position: "relative",
        }}
      >
        {/* Gold corner brackets (echoes the wordmark lockup) */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 70,
            width: 70,
            height: 70,
            borderLeft: "6px solid #bf8b3e",
            borderTop: "6px solid #bf8b3e",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 70,
            width: 70,
            height: 70,
            borderRight: "6px solid #bf8b3e",
            borderBottom: "6px solid #bf8b3e",
          }}
        />

        <div
          style={{
            fontFamily: "Morganite",
            fontSize: 230,
            color: "#fdfaf6",
            letterSpacing: 6,
            lineHeight: 0.85,
          }}
        >
          OPEN SPACES
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 30,
            color: "#bf8b3e",
            letterSpacing: 16,
          }}
        >
          PODCAST
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 24,
            color: "#bec6c4",
            letterSpacing: 2,
          }}
        >
          Honest conversations that point people back to Jesus
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
