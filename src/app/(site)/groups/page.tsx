import type { Metadata } from "next";

import { GroupsWaitlistForm } from "@/components/GroupsWaitlistForm";

export const metadata: Metadata = {
  title: "Groups",
  description:
    "Small, safe, online groups for honest conversations about faith and life's hardest struggles. Join the waitlist for the next Open Spaces group.",
};

const WHAT_TO_EXPECT = [
  {
    title: "Small & safe",
    body: "A handful of people, the same faces each week, and a clear commitment to confidentiality. What's shared in the group stays in the group.",
  },
  {
    title: "Story-centered",
    body: "Each person has the chance to share their story, using a simple guide to help you prepare. You go at your own pace.",
  },
  {
    title: "Listening, not fixing",
    body: "We share feelings, not advice. No cross-talk, no pressure — just room to be honest and be heard.",
  },
  {
    title: "Online & short-term",
    body: "Groups meet over Zoom for a set number of weeks, so you can join from anywhere.",
  },
];

export default function GroupsPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-16 lg:px-8 lg:pt-24">
        <h1 className="max-w-3xl font-display text-6xl leading-[0.95] text-midnight sm:text-7xl">
          You don&apos;t have to walk through it alone
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal">
          Open Spaces groups are small, guided gatherings where you can bring
          the hardest parts of your story into the light with people who
          understand. Our first groups are full — join the waitlist and
          we&apos;ll let you know the moment the next one opens.
        </p>
        <a
          href="#waitlist"
          className="mt-8 inline-block rounded-sm bg-camel px-8 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
        >
          Join the Waitlist
        </a>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <h2 className="font-display text-4xl text-midnight sm:text-5xl">
          What to expect
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHAT_TO_EXPECT.map((item) => (
            <div key={item.title} className="rounded-2xl bg-ivory-light p-6 ring-1 ring-tan/70">
              <h3 className="font-display text-2xl text-midnight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="waitlist" className="scroll-mt-24 bg-tan/30">
        <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="font-display text-5xl text-midnight">
            Save your spot
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal">
            Joining the waitlist doesn&apos;t commit you to anything. It just
            means you&apos;ll hear first when a group that fits you opens up.
          </p>
          <div className="mt-10">
            <GroupsWaitlistForm />
          </div>
        </div>
      </section>
    </>
  );
}
