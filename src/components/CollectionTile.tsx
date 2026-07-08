import Link from "next/link";

import { collectionHref, type ResolvedCollection } from "@/lib/collections";

// Editorial tile for a collection — used on the homepage "Explore by
// Theme" grid and in the "Other Collections" band on collection pages.
export function CollectionTile({
  collection,
}: {
  collection: ResolvedCollection;
}) {
  return (
    <Link
      href={collectionHref(collection.slug)}
      className="group flex flex-col rounded-2xl border border-midnight/20 p-7 transition-colors hover:border-camel"
    >
      <h3 className="font-display text-4xl text-midnight sm:text-5xl">
        {collection.title}
      </h3>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-charcoal">
        {collection.blurb}
      </p>
      <span className="mt-auto inline-block pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-camel transition-colors group-hover:text-midnight">
        {collection.count} episode{collection.count === 1 ? "" : "s"} →
      </span>
    </Link>
  );
}
