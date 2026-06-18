"use client";

import { useState } from "react";

import { youtubeThumbnail } from "@/lib/youtube";

// Lazy facade: shows the thumbnail until clicked, then loads the iframe.
// Keeps the player off the critical path so episode pages stay fast.
export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [active, setActive] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-midnight">
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Play ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={youtubeThumbnail(id)}
            alt={title}
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-midnight/20 transition-colors group-hover:bg-midnight/10" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-camel/95 transition-transform group-hover:scale-110">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fdfaf6">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
