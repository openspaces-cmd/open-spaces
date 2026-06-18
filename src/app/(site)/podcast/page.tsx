import type { Metadata } from "next";

import { EpisodeBrowser } from "@/components/EpisodeBrowser";
import { ListenLinks } from "@/components/ListenLinks";
import { getEpisodes, getSiteSettings } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Podcast",
  description: "Every episode of the Open Spaces podcast.",
};

export default async function PodcastPage() {
  const [episodes, settings] = await Promise.all([
    getEpisodes(),
    getSiteSettings(),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
      <p className="eyebrow text-camel">The Open Spaces Podcast</p>
      <h1 className="mt-3 font-display text-6xl text-midnight">All Episodes</h1>
      <div className="mt-6">
        <ListenLinks listen={settings?.listen} />
      </div>

      <div className="mt-12">
        <EpisodeBrowser episodes={episodes} />
      </div>
    </section>
  );
}
