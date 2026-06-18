import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Every dollar fuels this mission. Together, we create spaces where honesty leads to healing.",
};

const ONE_TIME_URL =
  "https://app.hubspot.com/payments/v6vTKckRhX?referrer=PAYMENT_LINK";
const MONTHLY_URL =
  "https://app.hubspot.com/payments/h7dzMzYHnCk?referrer=PAYMENT_LINK";

export default function GivePage() {
  return (
    <>
      {/* Give hero — desktop overlays the heading on the wide banner (like the
          live page); mobile/tablet stacks a both-of-them crop above the text so
          neither Jeff nor Jourdan gets cropped out. */}
      <section className="bg-midnight">
        {/* Mobile/tablet: crop framed on both, shown as its own block */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/give-hero-mobile.jpg"
          alt="Jeff & Jourdan Johnson"
          className="aspect-[5/4] w-full object-cover object-top sm:aspect-[3/2] lg:hidden"
        />

        <div className="relative isolate overflow-hidden lg:flex lg:min-h-[580px] lg:items-end">
          {/* Desktop: full wide banner behind the heading */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/give-hero.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 -z-10 hidden h-full w-full object-cover object-left lg:block"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 hidden bg-gradient-to-t from-midnight via-midnight/55 to-midnight/10 lg:block"
          />

          <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8 lg:pb-16 lg:pt-24">
            <div className="max-w-xl">
              <h1 className="font-display text-7xl text-ivory-light sm:text-8xl">
                Give
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ivory-light/90">
                Every dollar fuels this mission. Together, we create spaces where
                honesty leads to healing.
              </p>
              <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href={ONE_TIME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm bg-camel px-8 py-3.5 text-center font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
                >
                  One Time Gift
                </a>
                <a
                  href={MONTHLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border border-ivory-light/40 px-8 py-3.5 text-center font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:border-camel hover:text-camel"
                >
                  Monthly Giving
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support section */}
      <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-20">
        <p className="eyebrow text-camel">Ways to give</p>
        <h2 className="mt-3 font-display text-5xl text-midnight">
          Support Open Spaces Collective, Inc.
        </h2>

        <div className="mt-8 space-y-6 text-lg leading-relaxed text-charcoal">
          <p>
            Open Spaces Collective, Inc. is a 501(c)(3) nonprofit creating safe
            spaces for honest conversations about faith, identity, and
            life&apos;s hardest struggles. Your donation helps people wrestle
            with deep struggles while discovering God&apos;s unshakable love.
          </p>

          <div>
            <h3 className="font-display text-2xl text-midnight">
              Your Support Funds:
            </h3>
            <ul className="mt-4 ml-5 list-disc space-y-3 text-base marker:text-camel">
              <li>
                <strong className="font-semibold text-midnight">
                  New episodes
                </strong>{" "}
                of the Open Spaces Podcast, breaking the silence around faith
                and struggle.
              </li>
              <li>
                <strong className="font-semibold text-midnight">
                  Expanding our reach
                </strong>{" "}
                through marketing, helping more people find a space where they
                can wrestle with their faith without fear of judgment.
              </li>
              <li>
                <strong className="font-semibold text-midnight">
                  Future webinars and online gatherings
                </strong>{" "}
                for individuals facing same-sex attraction, grief, and other
                challenges as well as parents of children facing the same.
              </li>
              <li>
                Providing{" "}
                <strong className="font-semibold text-midnight">
                  support and resources
                </strong>{" "}
                for those struggling.
              </li>
            </ul>
          </div>

          <p>
            Every dollar fuels this mission. Together, we create spaces where
            honesty leads to healing.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={ONE_TIME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm bg-camel px-8 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
          >
            One Time Gift
          </a>
          <a
            href={MONTHLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-midnight/30 px-8 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-midnight transition-colors hover:border-camel hover:text-camel"
          >
            Monthly Giving
          </a>
        </div>
      </section>
    </>
  );
}
