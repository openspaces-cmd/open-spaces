"use client";

import { useState } from "react";

// Lightweight share row: native share where available, plus copy + X/Facebook.
export function ShareButtons({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  const [copied, setCopied] = useState(false);

  const url = () => new URL(path, window.location.origin).toString();

  const nativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: url() });
        return;
      }
    } catch {
      /* user dismissed */
    }
    copy();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const open = (shareUrl: string) =>
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");

  const btn =
    "flex h-9 items-center gap-2 rounded-full border border-tan px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-charcoal transition-colors hover:border-camel hover:text-camel";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.18em] text-stormy">
        Share
      </span>
      <button type="button" onClick={nativeShare} className={btn}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v13" strokeLinecap="round" />
          <path d="M7 8l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 13v6h14v-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Share
      </button>
      <button type="button" onClick={copy} className={btn}>
        {copied ? "Copied!" : "Copy link"}
      </button>
      <button
        type="button"
        aria-label="Share on X"
        onClick={() =>
          open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url())}`,
          )
        }
        className={btn}
      >
        X
      </button>
      <button
        type="button"
        aria-label="Share on Facebook"
        onClick={() =>
          open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`,
          )
        }
        className={btn}
      >
        Facebook
      </button>
    </div>
  );
}
