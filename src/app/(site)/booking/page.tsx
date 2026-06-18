import type { Metadata } from "next";

import { getSiteSettings } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Booking",
  description: "Invite Jeff & Jourdan to speak at your event.",
};

export default async function BookingPage() {
  const settings = await getSiteSettings();
  const email = settings?.contactEmail ?? "questions@openspacespodcast.com";

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
      <p className="eyebrow text-camel">Booking</p>
      <h1 className="mt-3 font-display text-6xl text-midnight">
        Invite Jeff &amp; Jourdan to speak
      </h1>
      <p className="mt-8 text-lg leading-relaxed text-charcoal">
        Jeff and Jourdan are available for select speaking engagements,
        conferences, and worship gatherings. To start a conversation about your
        event, reach out and our team will follow up with availability and
        details.
      </p>
      <a
        href={`mailto:${email}?subject=Speaking%20Inquiry`}
        className="mt-8 inline-block rounded-full bg-camel px-7 py-3 font-mono text-xs uppercase tracking-widest text-ivory-light transition-colors hover:bg-camel/85"
      >
        Request booking
      </a>
    </section>
  );
}
