import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Newsletter } from "@/components/Newsletter";
import { getSiteSettings } from "@/sanity/queries";

const FALLBACK_NAV = [
  { label: "About", href: "/about" },
  { label: "Podcast", href: "/podcast" },
  { label: "Articles", href: "/articles" },
  { label: "Stories", href: "/stories" },
  { label: "Connect", href: "/connect" },
];

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const nav = settings?.nav?.length ? settings.nav : FALLBACK_NAV;

  return (
    <>
      <Header nav={nav} />
      <main className="flex-1">{children}</main>
      <Newsletter newsletter={settings?.newsletter} />
      <Footer
        nav={nav}
        social={settings?.social}
        listen={settings?.listen}
        contactEmail={settings?.contactEmail}
        tagline={settings?.tagline}
      />
    </>
  );
}
