"use client";

import { useMemo, useState } from "react";

import type { EpisodeListItem } from "@/sanity/queries";

import { EpisodeCard } from "./EpisodeCard";

type Filter =
  | { kind: "all" }
  | { kind: "series"; value: string }
  | { kind: "tag"; value: string };

// Chips hidden from the filter row (the episodes keep the data).
const HIDDEN_SERIES = ["Community"];
const HIDDEN_TAGS = ["faith"];

const chipBase =
  "rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors";
const chipOff = `${chipBase} border-tan text-charcoal hover:border-camel hover:text-camel`;
const chipOn = `${chipBase} border-camel bg-camel text-ivory-light`;

export function EpisodeBrowser({ episodes }: { episodes: EpisodeListItem[] }) {
  const [filter, setFilter] = useState<Filter>({ kind: "all" });

  const seriesNames = useMemo(
    () =>
      ([...new Set(episodes.map((e) => e.series).filter(Boolean))] as string[]).filter(
        (name) => !HIDDEN_SERIES.includes(name),
      ),
    [episodes],
  );
  const tags = useMemo(
    () =>
      [...new Set(episodes.flatMap((e) => e.tags ?? []))]
        .filter((tag) => !HIDDEN_TAGS.includes(tag))
        .sort(),
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
        {seriesNames.length > 0 ? (
          <span aria-hidden className="mx-1 h-4 w-px bg-tan" />
        ) : null}
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
