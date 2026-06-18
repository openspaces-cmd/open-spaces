import type { SiteSettings } from "@/sanity/queries";

const platforms: {
  key: keyof NonNullable<SiteSettings["listen"]>;
  label: string;
}[] = [
  { key: "applePodcasts", label: "Apple Podcasts" },
  { key: "spotify", label: "Spotify" },
  { key: "youtube", label: "YouTube" },
];

export function ListenLinks({
  listen,
  className = "",
}: {
  listen?: SiteSettings["listen"];
  className?: string;
}) {
  if (!listen) return null;
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {platforms.map(({ key, label }) => {
        const href = listen[key];
        if (!href) return null;
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-midnight/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-midnight transition-colors hover:border-camel hover:text-camel"
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}
