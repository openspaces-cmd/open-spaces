import Link from "next/link";

import type { SiteSettings } from "@/sanity/queries";

import { CircularLogo } from "./CircularLogo";
import { SocialIcons } from "./SocialIcons";

const DEFAULT_NAV = [
  { label: "About", href: "/about" },
  { label: "Podcast", href: "/podcast" },
  { label: "Articles", href: "/articles" },
  { label: "Stories", href: "/stories" },
  { label: "Connect", href: "/connect" },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-camel">
      {children}
    </h3>
  );
}

const linkClass =
  "text-sm text-ivory-light/70 transition-colors hover:text-ivory-light";

export function Footer({
  nav,
  social,
  listen,
  contactEmail,
  tagline,
}: {
  nav?: { label: string; href: string }[];
  social?: SiteSettings["social"];
  listen?: SiteSettings["listen"];
  contactEmail?: string;
  tagline?: string;
}) {
  const explore = nav?.length ? nav : DEFAULT_NAV;
  const year = new Date().getFullYear();

  const listenLinks = [
    { label: "Apple Podcasts", href: listen?.applePodcasts },
    { label: "Spotify", href: listen?.spotify },
    { label: "YouTube", href: listen?.youtube },
  ].filter((l) => l.href);

  return (
    <footer className="relative mt-auto overflow-hidden bg-midnight text-ivory-light">
      {/* Top */}
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-10 pt-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10 lg:px-8 lg:pt-20">
        {/* Brand */}
        <div className="flex flex-col gap-6">
          <CircularLogo className="text-ivory-light" size={124} />
          <p className="max-w-xs text-sm leading-relaxed text-ivory-light/70">
            {tagline ||
              "Honest conversations that point people back to Jesus."}
          </p>
          <SocialIcons social={social} className="text-ivory-light" />
        </div>

        {/* Explore */}
        <nav className="flex flex-col gap-4">
          <ColumnHeading>Explore</ColumnHeading>
          <ul className="flex flex-col gap-3">
            {explore.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Listen */}
        {listenLinks.length > 0 ? (
          <div className="flex flex-col gap-4">
            <ColumnHeading>Listen</ColumnHeading>
            <ul className="flex flex-col gap-3">
              {listenLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Connect */}
        <div className="flex flex-col gap-4">
          <ColumnHeading>Connect</ColumnHeading>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href={`mailto:${contactEmail || "questions@openspacespodcast.com"}`}
                className={linkClass}
              >
                Contact Us
              </a>
            </li>
            <li>
              <Link href="/booking" className={linkClass}>
                Booking
              </Link>
            </li>
            <li>
              <Link href="/give" className={linkClass}>
                Give
              </Link>
            </li>
          </ul>
          <Link
            href="/connect"
            className="mt-2 inline-block self-start rounded-sm bg-camel px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
          >
            Let’s Connect
          </Link>
        </div>
      </div>

      {/* Oversized wordmark signature */}
      <div
        aria-hidden
        className="pointer-events-none select-none px-6 lg:px-8"
      >
        <p className="font-display whitespace-nowrap text-center leading-[0.8] text-ivory-light/[0.06] text-[22vw]">
          Open Spaces
        </p>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ivory-light/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ivory-light/50">
            © {year} Open Spaces Collective
          </p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-ivory-light/50">
            Sharing stories with vulnerability &amp; belief for the impossible
          </p>
        </div>
      </div>
    </footer>
  );
}
