"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { EpisodeListItem } from "@/sanity/queries";
import { collectionForTag, collectionHref } from "@/lib/collections";
import { seriesSlug } from "@/lib/series";

import { EpisodeCard } from "./EpisodeCard";

type Filter =
  | { kind: "all" }
  | { kind: "series"; value: string }
  | { kind: "tag"; value: string };

const chipBase =
  "rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors";
const chipOff = `${chipBase} border-tan text-charcoal hover:border-camel hover:text-camel`;
const chipOn = `${chipBase} border-camel bg-camel text-ivory-light`;

export function EpisodeBrowser({ episodes }: { episodes: EpisodeListItem[] }) {
  const [filter, setFilter] = useState<Filter>({ kind: "all" });

  const seriesNames = useMemo(
    () =>
      [...new Set(episodes.map((e) => e.series).filter(Boolean))] as string[],
    [episodes],
  );
  const tags = useMemo(
    () => [...new Set(episodes.flatMap((e) => e.tags ?? []))].sort(),
    [episodes],
  );

  const visible = useMemo(() => {
    if (filter.kind === "series")
      return episodes.filter((e) => e.series === filter.value);
    if (filter.kind === "tag")
      return episodes.filter((e) => e.tags?.includes(filter.value));
    return episodes;
  }, [episodes, filter]);

  const isOn = (f: Filter) =>
    f.kind === filter.kind &&
    (f.kind === "all" ||
      (f as { value?: string }).value === (filter as { value?: string }).value);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter({ kind: "all" })}
          className={isOn({ kind: "all" }) ? chipOn : chipOff}
        >
          All
        </button>
        {seriesNames.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setFilter({ kind: "series", value: name })}
            className={isOn({ kind: "series", value: name }) ? chipOn : chipOff}
          >
            {name} Series
          </button>
        ))}
        <span aria-hidden className="mx-1 h-4 w-px bg-tan" />
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setFilter({ kind: "tag", value: tag })}
            className={isOn({ kind: "tag", value: tag }) ? chipOn : chipOff}
          >
            {tag.replace(/-/g, " ")}
          </button>
        ))}
      </div>

      {filter.kind === "series" ? (
        <p className="mt-4 text-sm text-stormy">
          A {visible.length}-part series, best listened to in order.{" "}
          <Link
            href={collectionHref(seriesSlug(filter.value))}
            className="text-camel underline underline-offset-2 hover:text-midnight"
          >
            View the collection page →
          </Link>
        </p>
      ) : null}

      {filter.kind === "tag" && collectionForTag(filter.value) ? (
        <p className="mt-4 text-sm text-stormy">
          {visible.length} episode{visible.length === 1 ? "" : "s"} in this
          collection.{" "}
          <Link
            href={collectionHref(collectionForTag(filter.value)!.slug)}
            className="text-camel underline underline-offset-2 hover:text-midnight"
          >
            View the {collectionForTag(filter.value)!.title} collection →
          </Link>
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((episode) => (
          <EpisodeCard key={episode._id} episode={episode} />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-sm text-stormy">
          No episodes match that topic yet.
        </p>
      ) : null}
    </div>
  );
}
