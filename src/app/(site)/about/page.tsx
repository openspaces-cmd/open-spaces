/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jeff and Jourdan Johnson are worship leaders, pastors, and podcast hosts based in Atlanta, GA, with 25+ years of ministry experience.",
};

const FAMILY_PHOTOS = [
  { src: "/brand/family-1.jpg", alt: "Jeff and Jourdan Johnson with their three children" },
  { src: "/brand/family-2.jpg", alt: "The Johnson family together" },
  { src: "/brand/family-3.jpg", alt: "The Johnson family outdoors" },
  { src: "/brand/family-4.jpg", alt: "Jeff and Jourdan Johnson with their kids outdoors" },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-16 lg:px-8 lg:pt-24">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <p className="eyebrow text-camel">About</p>
            <h1 className="mt-3 font-display text-6xl leading-[0.95] text-midnight sm:text-7xl">
              About Jeff + Jourdan
            </h1>

            <div className="mt-10 space-y-6 text-lg leading-relaxed text-charcoal">
              <p>
                Jeff and Jourdan Johnson are worship leaders, pastors, and podcast
                hosts based in Atlanta, GA, with 25+ years of ministry experience.
                They&apos;ve spent decades leading worship in churches, college
                campuses, and student events across the country, helping to build
                and develop worship teams while creating spaces where people can
                encounter God in a real and transformative way.
              </p>
              <p>
                Their journey has been deeply shaped by God&apos;s
                faithfulness—particularly through Jeff&apos;s decades-long
                experience navigating same-sex attraction while holding onto his
                faith. This led them to start{" "}
                <em className="italic">Open Spaces</em>, a podcast where they
                share their story and engage in honest conversations about faith,
                marriage, identity, and the power of living with vulnerability.
              </p>
              <p>
                Their passion is to help others experience the same freedom and
                restoration they have found—to create space for people to wrestle
                with hard questions, embrace authenticity, and discover the hope
                that comes from walking in the light. Whether through worship,
                pastoring, or personal conversations, their heart remains the
                same: to see people grow in faith, build deep community, and step
                fully into the life God has for them.
              </p>
              <p>
                Jeff and Jourdan serve on staff at Passion City Church in Atlanta,
                where they lead, mentor, and invest in the Church. But their
                greatest joy is their family. Their three children—Case, Ayden,
                and Beacon—are nothing short of miracles, and together, they are a
                tight-knit team, walking out their faith and calling side-by-side.
                Whether in ministry or everyday life, they are committed to
                growing together, supporting one another, and living out their
                mission as a family.
              </p>
            </div>
          </div>

          <div className="relative lg:sticky lg:top-24">
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

      {/* Family gallery */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-14 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="border-t border-tan/60 pt-12 lg:pt-16">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {FAMILY_PHOTOS.map((photo) => (
              <div
                key={photo.src}
                className="overflow-hidden rounded-sm bg-tan/20"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="aspect-[4/5] w-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
