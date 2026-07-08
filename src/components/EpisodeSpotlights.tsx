"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { youtubeThumbnail } from "@/lib/youtube";
import type { EpisodeListItem } from "@/sanity/queries";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function PlayCircle() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 flex items-center justify-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-camel/95 transition-transform group-hover:scale-110">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fdfaf6">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </span>
  );
}

function Thumbnail({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <span className="block overflow-hidden rounded-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      <PlayCircle />
    </>
  );
}

// One spotlight card — identical treatment for both columns; only the tag
// (eyebrow), copy, and where the media takes you differ.
function SpotlightCard({
  tag,
  title,
  meta,
  text,
  thumbnailSrc,
  href,
  onPlay,
  cta,
}: {
  tag: string;
  title: string;
  meta?: string | null;
  text?: string | null;
  thumbnailSrc: string;
  href?: string;
  onPlay?: () => void;
  cta: string;
}) {
  return (
    <div className="flex flex-col">
      {href ? (
        <Link href={href} className="group relative block">
          <Thumbnail src={thumbnailSrc} alt={title} />
        </Link>
      ) : (
        <button
          type="button"
          onClick={onPlay}
          aria-label={`Play ${title}`}
          className="group relative block"
        >
          <Thumbnail src={thumbnailSrc} alt={title} />
        </button>
      )}

      <p className="eyebrow mt-7 text-camel">{tag}</p>
      <h2 className="mt-3 font-display text-4xl text-ivory-light sm:text-5xl">
        {href ? (
          <Link href={href} className="transition-colors hover:text-camel">
            {title}
          </Link>
        ) : (
          title
        )}
      </h2>
      {meta ? (
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ivory-light/60">
          {meta}
        </p>
      ) : null}
      {text ? (
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ivory-light/80">
          {text}
        </p>
      ) : null}

      <div className="mt-auto pt-7">
        {href ? (
          <Link
            href={href}
            className="inline-block rounded-sm bg-camel px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
          >
            {cta}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onPlay}
            className="inline-block rounded-sm bg-camel px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
          >
            {cta}
          </button>
        )}
      </div>
    </div>
  );
}

// Two-column homepage block pairing the newest drop with the featured
// conversation. The featured video plays in a modal instead of navigating
// off to YouTube.
export function EpisodeSpotlights({
  latest,
  featured,
}: {
  latest?: EpisodeListItem;
  featured?: { heading: string; body?: string; youtubeId?: string } | null;
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

  if (!latest && !featured) return null;

  const latestMeta = latest
    ? [
        latest.episodeNumber ? `Episode ${latest.episodeNumber}` : null,
        latest.publishedAt ? formatDate(latest.publishedAt) : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

  return (
    <section className="bg-midnight">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-14 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        {latest ? (
          <SpotlightCard
            tag="Latest Episode"
            title={latest.title}
            meta={latestMeta}
            text={latest.excerpt}
            thumbnailSrc={
              latest.thumbnailUrl || youtubeThumbnail(latest.youtubeId)
            }
            href={`/podcast/${latest.slug}`}
            cta="Watch Now"
          />
        ) : null}

        {featured ? (
          <SpotlightCard
            tag="Featured Episode"
            title={featured.heading}
            text={featured.body}
            thumbnailSrc={
              featured.youtubeId ? youtubeThumbnail(featured.youtubeId) : ""
            }
            onPlay={featured.youtubeId ? () => setOpen(true) : undefined}
            cta="Watch Now"
          />
        ) : null}
      </div>

      {open && featured?.youtubeId ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={featured.heading}
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
                src={`https://www.youtube-nocookie.com/embed/${featured.youtubeId}?autoplay=1`}
                title={featured.heading}
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
