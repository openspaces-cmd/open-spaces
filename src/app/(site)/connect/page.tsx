import type { Metadata } from "next";
import Link from "next/link";

import { SocialIcons } from "@/components/SocialIcons";
import { getSiteSettings } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Your story matters. When we bring our struggles into the light, healing begins.",
};

export default async function ConnectPage() {
  const settings = await getSiteSettings();
  const email = settings?.contactEmail ?? "questions@openspacespodcast.com";

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
      <p className="eyebrow text-camel">Connect</p>
      <h1 className="mt-3 font-display text-6xl text-midnight sm:text-7xl">
        We&apos;re so glad you&apos;re here!
      </h1>

      <p className="mt-8 max-w-xl text-lg leading-relaxed text-charcoal">
        Your story matters. When we bring our struggles into the light, healing
        begins. We&apos;d love to hear your journey—because freedom starts with
        honesty, and you&apos;re not alone.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={`mailto:${email}`}
          className="rounded-sm bg-camel px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
        >
          Contact Us
        </a>
        <Link
          href="/stories/share"
          className="rounded-sm border border-midnight/30 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-midnight transition-colors hover:border-camel hover:text-camel"
        >
          Share Your Story
        </Link>
      </div>

      <div className="mt-14 border-t border-tan/70 pt-8">
        <h2 className="font-display text-2xl text-midnight">Follow along</h2>
        <div className="mt-4">
          <SocialIcons social={settings?.social} />
        </div>
      </div>
    </section>
  );
}
