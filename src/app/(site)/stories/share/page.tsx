import type { Metadata } from "next";
import Link from "next/link";

import { ShareStoryForm } from "@/components/ShareStoryForm";

export const metadata: Metadata = {
  title: "Share Your Story",
  description:
    "Your story could be the one someone else needs to hear. Share it with Open Spaces to help others find hope.",
};

export default function ShareStoryPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
      <Link
        href="/stories"
        className="eyebrow text-charcoal transition-colors hover:text-camel"
      >
        ← All stories
      </Link>

      <p className="eyebrow mt-6 text-camel">Your story could help someone</p>
      <h1 className="mt-3 font-display text-6xl text-midnight">
        Share Your Story
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal">
        Somewhere, someone is walking through what you&apos;ve walked through —
        and wondering if they&apos;re the only one. Your story could be the
        thing that reminds them they&apos;re not alone and that their story
        isn&apos;t over either. Share it here, and with your permission, we may
        share it on the website or podcast to help others find hope. You can
        stay anonymous if you prefer.
      </p>

      <p className="mt-6 max-w-xl rounded-2xl bg-ivory-light p-5 text-sm leading-relaxed text-charcoal ring-1 ring-tan/70">
        <span className="font-semibold text-midnight">A quick note:</span> We
        read every story, but we may not be able to respond to each one
        personally. We&apos;re so grateful you would share yours to help
        others.
      </p>

      <div className="mt-10">
        <ShareStoryForm />
      </div>
    </section>
  );
}
