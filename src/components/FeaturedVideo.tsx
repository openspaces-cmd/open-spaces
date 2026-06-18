"use client";

import { useCallback, useEffect, useState } from "react";

import { youtubeThumbnail } from "@/lib/youtube";

// The homepage "Featured" block (e.g. the Sadie Robertson Huff conversation).
// Clicking the thumbnail or the CTA opens the video in a modal instead of
// navigating off to YouTube.
export function FeaturedVideo({
  heading,
  body,
  youtubeId,
  eyebrow = "Featured · As heard on",
}: {
  heading: string;
  body?: string;
  youtubeId?: string;
  eyebrow?: string;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  // Esc to close + lock background scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  return (
    <section className="bg-tan">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 sm:py-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:px-8 lg:py-24">
        {youtubeId ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Play ${heading}`}
            className="group relative mx-3 block sm:mx-0"
          >
            <span
              aria-hidden
              className="absolute -left-3 -top-3 h-12 w-12 border-l-[3px] border-t-[3px] border-camel"
            />
            <span
              aria-hidden
              className="absolute -bottom-3 -right-3 h-12 w-12 border-b-[3px] border-r-[3px] border-camel"
            />
            <span className="block overflow-hidden rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={youtubeThumbnail(youtubeId)}
                alt={heading}
                className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </span>
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-camel/90 text-ivory-light shadow-lg transition-transform group-hover:scale-110">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        ) : null}

        <div className="text-midnight">
          <p className="eyebrow text-camel">{eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl text-midnight sm:text-5xl">
            {heading}
          </h2>
          {body ? (
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-charcoal">
              {body}
            </p>
          ) : null}
          {youtubeId ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-7 inline-block rounded-sm bg-midnight px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-midnight/85"
            >
              Watch the Conversation
            </button>
          ) : null}
        </div>
      </div>

      {open && youtubeId ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={heading}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/90 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close video"
              className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full text-ivory-light transition-colors hover:text-camel"
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
                title={heading}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
