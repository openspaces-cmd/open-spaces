/* eslint-disable @next/next/no-img-element */
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
      {/* Intro — same lockup as the About page: copy beside a bracket-framed photo */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <h1 className="max-w-3xl font-display text-6xl leading-[0.95] text-midnight sm:text-7xl">
              You don&apos;t have to walk through it alone
            </h1>
            <div className="mt-8 max-w-xl space-y-5 text-lg leading-relaxed text-charcoal">
              <p>
                Open Spaces groups are small, guided gatherings where you can
                bring the hardest parts of your story into the light with people
                who understand.
              </p>
              <p>
                Our first groups are full. Join the waitlist and we&apos;ll let
                you know the moment the next women&apos;s or men&apos;s group
                opens.
              </p>
            </div>
            <a
              href="#waitlist"
              className="mt-10 inline-block rounded-sm bg-camel px-8 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
            >
              Join the Waitlist
            </a>
          </div>

          <div className="relative">
            <span
              aria-hidden
              className="absolute -left-3 -top-3 h-12 w-12 border-l-[3px] border-t-[3px] border-camel"
            />
            <span
              aria-hidden
              className="absolute -bottom-3 -right-3 h-12 w-12 border-b-[3px] border-r-[3px] border-camel"
            />
            <img
              src="/brand/about-jeff-jourdan.jpg"
              alt="Jeff & Jourdan Johnson"
              className="aspect-[4/5] w-full rounded-sm object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* What to expect — the steel-to-ivory band and outlined tiles from
          the homepage "Explore by theme" section */}
      <section className="bg-gradient-to-b from-steel/35 to-ivory">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <h2 className="font-display text-4xl text-midnight sm:text-5xl">
            What to Expect
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {WHAT_TO_EXPECT.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-midnight/20 p-7"
              >
                <h3 className="font-display text-4xl text-midnight sm:text-5xl">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-charcoal">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist — same form layout as Share Your Story */}
      <section id="waitlist" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
          <h2 className="font-display text-5xl text-midnight sm:text-6xl">
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
