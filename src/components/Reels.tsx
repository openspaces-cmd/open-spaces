"use client";

import { useEffect, useRef, useState } from "react";

import { CircularLogo } from "./CircularLogo";

type Reel = { _key?: string; url: string; poster?: string };

function ReelCard({
  reel,
  active,
  onActivate,
}: {
  reel: Reel;
  active: boolean;
  onActivate: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  // Autoplay a muted preview while the card is in view; pause when it isn't.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // React's `muted` attribute doesn't reliably set the DOM property, and
    // browsers only allow autoplay when the element is actually muted.
    v.muted = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // Sound follows the "active" reel; only one plays audio at a time.
  useEffect(() => {
    const v = ref.current;
    if (v) v.muted = !active;
  }, [active]);

  const handleClick = () => {
    const v = ref.current;
    if (!v) return;
    if (!active) {
      // Engage: restart from the top, unmuted.
      v.currentTime = 0;
      v.muted = false;
      v.play().catch(() => {});
    }
    onActivate();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? "Mute reel" : "Play reel from the beginning"}
      className="group relative aspect-[9/16] w-44 shrink-0 overflow-hidden rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] sm:w-auto sm:shrink"
    >
      {/* Branded backdrop — visible until the poster/video covers it */}
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-midnight via-charcoal to-stormy"
      >
        <CircularLogo size={120} className="text-ivory-light/10" />
      </span>

      <video
        ref={ref}
        src={reel.url}
        poster={reel.poster}
        playsInline
        preload="metadata"
        muted
        loop
        className="relative h-full w-full object-cover"
      />

      {/* Sound indicator */}
      <span
        aria-hidden
        className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-midnight/55 text-ivory-light backdrop-blur transition-colors group-hover:bg-midnight/75"
      >
        {!active ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 5 6 9H3v6h3l5 4V5z" />
            <path
              d="M16 9l5 5m0-5-5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 5 6 9H3v6h3l5 4V5z" />
            <path
              d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8 8 0 0 1 0 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )}
      </span>
    </button>
  );
}

export function Reels({
  reels,
  heading = "Open Spaces",
}: {
  reels?: Reel[];
  heading?: string;
}) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  if (!reels?.length) return null;

  return (
    <section className="relative overflow-hidden bg-midnight pb-14 pt-12 lg:pb-16">
      {/* Oversized brand wordmark behind the reels */}
      <h2
        className="font-display pointer-events-none select-none whitespace-nowrap text-center leading-[0.8] text-ivory-light text-[19vw] -mb-[2.5vw]"
        style={{ fontWeight: 600 }}
      >
        {heading}
      </h2>

      <div className="relative mx-auto flex max-w-7xl gap-3 overflow-x-auto px-5 pb-2 sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible lg:px-8">
        {reels.map((reel, i) => {
          const key = reel._key ?? reel.url ?? String(i);
          return (
            <ReelCard
              key={key}
              reel={reel}
              active={activeKey === key}
              onActivate={() =>
                setActiveKey((cur) => (cur === key ? null : key))
              }
            />
          );
        })}
      </div>
    </section>
  );
}
