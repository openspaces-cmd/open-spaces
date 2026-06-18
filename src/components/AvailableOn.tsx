import type { SiteSettings } from "@/sanity/queries";

const icons: Record<string, React.ReactNode> = {
  apple: (
    <path d="M16.4 12.6c0-2 1.6-3 1.7-3a3.7 3.7 0 0 0-2.9-1.6c-1.2-.1-2.4.7-3 .7s-1.6-.7-2.6-.7a3.9 3.9 0 0 0-3.3 2c-1.4 2.5-.4 6.1 1 8.1.7 1 1.5 2.1 2.5 2 1-.04 1.4-.65 2.6-.65s1.5.65 2.6.63c1.1-.02 1.8-1 2.4-2a8.8 8.8 0 0 0 1.1-2.2 3.5 3.5 0 0 1-2.1-3.2ZM14.5 6.3a3.4 3.4 0 0 0 .8-2.4 3.5 3.5 0 0 0-2.3 1.2 3.2 3.2 0 0 0-.8 2.3 2.9 2.9 0 0 0 2.3-1.1Z" />
  ),
  spotify: (
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.62.62 0 0 1-.86.2c-2.35-1.43-5.3-1.76-8.78-.96a.62.62 0 1 1-.28-1.22c3.8-.87 7.07-.5 9.7 1.12.3.18.4.58.22.86Zm1.23-2.73a.78.78 0 0 1-1.07.26c-2.7-1.66-6.8-2.14-9.99-1.17a.78.78 0 1 1-.45-1.49c3.64-1.1 8.16-.57 11.25 1.33.37.22.49.7.26 1.07Zm.1-2.84C14.8 8.96 9.4 8.78 6.3 9.72a.93.93 0 1 1-.54-1.79c3.56-1.08 9.52-.87 13.28 1.36a.94.94 0 0 1-.95 1.61Z" />
  ),
  youtube: (
    <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.76-1.77C19.27 5.1 12 5.1 12 5.1s-7.27 0-8.84.43A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.76 1.77C4.73 18.9 12 18.9 12 18.9s7.27 0 8.84-.43a2.5 2.5 0 0 0 1.76-1.77C23 15.2 23 12 23 12ZM9.75 15.02V8.98L15 12l-5.25 3.02Z" />
  ),
  vimeo: (
    <path d="M22 7.4c-.1 2.1-1.6 5-4.4 8.6-2.9 3.8-5.4 5.7-7.4 5.7-1.3 0-2.3-1.2-3.2-3.5l-1.7-6.3c-.6-2.3-1.3-3.5-2-3.5-.16 0-.7.32-1.6.96L1 8.1c1-.92 2-1.84 3-2.76C5.4 4.16 6.4 3.5 7.1 3.43c1.6-.15 2.6.94 3 3.3.42 2.5.72 4.1.88 4.7.5 2.2 1 3.3 1.6 3.3.45 0 1.1-.7 2-2.13.88-1.42 1.36-2.5 1.43-3.25.13-1.27-.36-1.9-1.47-1.9-.52 0-1.06.12-1.62.36C16.5 6.3 18.4 5.32 20 5.4c1.2.04 1.8.7 1.97 2Z" />
  ),
};

export function AvailableOn({
  listen,
  className = "",
  tone = "light",
}: {
  listen?: SiteSettings["listen"];
  className?: string;
  /** "light" = ivory icons for dark surfaces; "dark" = midnight icons for light surfaces. */
  tone?: "light" | "dark";
}) {
  const toneClass =
    tone === "dark"
      ? "border-midnight/30 text-midnight"
      : "border-ivory-light/30 text-ivory-light";
  const links: { key: string; href: string; label: string }[] = [
    { key: "apple", href: listen?.applePodcasts || "#", label: "Apple Podcasts" },
    { key: "spotify", href: listen?.spotify || "#", label: "Spotify" },
    { key: "youtube", href: listen?.youtube || "#", label: "YouTube" },
    { key: "vimeo", href: "#", label: "Vimeo" },
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map(({ key, href, label }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors hover:border-camel hover:text-camel ${toneClass}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            {icons[key]}
          </svg>
        </a>
      ))}
    </div>
  );
}
