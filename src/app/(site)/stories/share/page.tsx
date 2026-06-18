import type { Metadata } from "next";
import Link from "next/link";

import { ShareStoryForm } from "@/components/ShareStoryForm";

export const metadata: Metadata = {
  title: "Share Your Story",
  description:
    "Your story matters — share it with Open Spaces publicly, anonymously, or just between us.",
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

      <p className="eyebrow mt-6 text-camel">Your story matters</p>
      <h1 className="mt-3 font-display text-6xl text-midnight">
        Share Your Story
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal">
        No matter what you&apos;ve walked through, your story is not over — and
        telling it might be the doorway to freedom for you, and for someone
        else. You decide what happens to it: share it publicly, share it
        anonymously, or keep it just between us.
      </p>

      <div className="mt-10">
        <ShareStoryForm />
      </div>
    </section>
  );
}
