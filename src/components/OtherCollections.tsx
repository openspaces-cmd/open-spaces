import { CollectionTile } from "@/components/CollectionTile";
import { resolveCollections } from "@/lib/collections";
import type { EpisodeListItem } from "@/sanity/queries";

// "Explore other collections" band shown at the bottom of every collection
// page. Renders the branded gradient tiles for every non-empty collection
// except the one being viewed.
export function OtherCollections({
  currentSlug,
  episodes,
  startHere,
}: {
  currentSlug: string;
  episodes: EpisodeListItem[];
  startHere?: EpisodeListItem[];
}) {
  const others = resolveCollections(episodes, startHere).filter(
    (c) => c.slug !== currentSlug,
  );

  if (others.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-ivory to-steel/30">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="eyebrow text-camel">Keep exploring</p>
        <h2 className="mt-2 font-display text-4xl text-midnight sm:text-5xl">
          Other Collections
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((collection) => (
            <CollectionTile key={collection.slug} collection={collection} />
          ))}
        </div>
      </div>
    </section>
  );
}
