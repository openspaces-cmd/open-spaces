import Link from "next/link";

import { CircularLogo } from "@/components/CircularLogo";
import { collectionHref, type ResolvedCollection } from "@/lib/collections";

// Branded gradient tile for a collection — used on the homepage "Explore by
// Theme" grid and in the "Explore other collections" band on collection pages.
export function CollectionTile({
  collection,
}: {
  collection: ResolvedCollection;
}) {
  return (
    <Link
      href={collectionHref(collection.slug)}
      className={`group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${collection.gradient} ring-1 ring-tan/30`}
    >
      {/* Faint brand seal watermark */}
      <span
        aria-hidden
        className="absolute -right-10 -top-10 text-ivory-light/[0.07] transition-transform duration-500 group-hover:scale-105"
      >
        <CircularLogo size={200} className="text-current" />
      </span>
      {/* Bottom darken for text legibility over the lighter stops */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-midnight/10 to-transparent"
      />
      <div className="relative p-6">
        <h3 className="font-display text-3xl text-ivory-light">
          {collection.title}
        </h3>
        <p className="mt-1 max-w-xs text-sm leading-relaxed text-ivory-light/80">
          {collection.blurb}
        </p>
        <span className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-camel">
          {collection.count} episode{collection.count === 1 ? "" : "s"} →
        </span>
      </div>
    </Link>
  );
}
