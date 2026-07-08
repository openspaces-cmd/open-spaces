"use client";

import { useEffect, useRef, useState } from "react";

import { youtubeThumbnail } from "@/lib/youtube";

type YTPlayer = { playVideo: () => void; destroy: () => void };
type YTPlayerOptions = {
  videoId: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, number | string>;
  events?: { onReady?: () => void };
};

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: YTPlayerOptions) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Load the IFrame Player API once per page.
let apiReady: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (apiReady) return apiReady;
  apiReady = new Promise<void>((resolve) => {
    if (window.YT?.Player) return resolve();
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiReady;
}

// The player is initialized up front (cued, not streaming) so the visitor's
// click can call playVideo() as a real user gesture — which starts the video
// WITH SOUND on the first click. A freshly-mounted `autoplay=1` iframe gets
// blocked by browser autoplay policies on low-engagement sites, which is what
// forced the old "click twice" behavior.
export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);
  const pendingPlayRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    readyRef.current = false;
    loadYouTubeApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: id,
        width: "100%",
        height: "100%",
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => {
            readyRef.current = true;
            if (pendingPlayRef.current) playerRef.current?.playVideo();
          },
        },
      });
    });
    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [id]);

  const play = () => {
    setPlaying(true);
    // If the player is ready, this plays immediately within the click gesture.
    // If the user clicked before it finished initializing, play on ready.
    if (readyRef.current) playerRef.current?.playVideo();
    else pendingPlayRef.current = true;
  };

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-midnight [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full ${
        playing ? "" : "[&_iframe]:pointer-events-none"
      }`}
    >
      {/* The API replaces this element with the player iframe. While the facade
          is up the iframe ignores pointer events, so the click always lands on
          our button (which then calls playVideo within the user gesture). */}
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      {!playing ? (
        <button
          type="button"
          onClick={play}
          aria-label={`Play ${title}`}
          className="group absolute inset-0 z-10 h-full w-full"
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
      ) : null}
    </div>
  );
}
