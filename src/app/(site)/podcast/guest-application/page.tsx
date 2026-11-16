import type { Metadata } from "next";
import Link from "next/link";

import { GuestApplicationForm } from "@/components/GuestApplicationForm";

export const metadata: Metadata = {
  title: "Be a Guest on the Podcast",
  description:
    "Have a story of faith, struggle, and hope that could help someone else? Apply to be a guest on the Open Spaces Podcast.",
};

export default function GuestApplicationPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
      <Link
        href="/podcast"
        className="backlink text-charcoal transition-colors hover:text-camel"
      >
        ← The Podcast
      </Link>

      <p className="eyebrow mt-6 text-camel">Podcast guest application</p>
      <h1 className="mt-3 font-display text-6xl text-midnight">
        Share your story on the podcast
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal">
        The Open Spaces Podcast is built on honest conversations about faith,
        identity, and life&apos;s hardest struggles. If you have a story that
        could help someone else feel less alone, we&apos;d love to hear it.
      </p>
      <p className="mt-6 max-w-xl rounded-2xl bg-ivory-light p-5 text-sm leading-relaxed text-charcoal ring-1 ring-tan/70">
        We read every application, but we can&apos;t feature every story or
        respond to each one personally. If it&apos;s a fit for an upcoming
        episode, our team will reach out by email.
      </p>

      <div className="mt-10">
        <GuestApplicationForm />
      </div>
    </section>
  );
}
