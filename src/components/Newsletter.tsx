"use client";

import { useState } from "react";

import type { SiteSettings } from "@/sanity/queries";

type Status = "idle" | "submitting" | "success" | "error";

export function Newsletter({
  newsletter,
  backgroundImageUrl,
}: {
  newsletter?: SiteSettings["newsletter"];
  backgroundImageUrl?: string | null;
}) {
  const heading = newsletter?.heading ?? "Stay Connected";
  const body =
    newsletter?.body ??
    "Sign up to receive emails from us on our journey and know what's available through this ministry.";

  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          website: data.website, // honeypot
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative overflow-hidden">
      {/* Desert band behind the card. Real photo via Sanity; warm sand gradient otherwise. */}
      <div
        className="absolute inset-x-0 bottom-0 top-28 bg-gradient-to-b from-steel/30 via-tan to-camel/40 bg-cover bg-center"
        style={
          backgroundImageUrl
            ? { backgroundImage: `url(${backgroundImageUrl})` }
            : undefined
        }
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-32 pt-12 lg:px-8">
        <div className="bg-ivory-light px-7 py-12 shadow-[0_24px_60px_-30px_rgba(29,37,45,0.5)] sm:px-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-4xl text-midnight sm:text-5xl">
                {heading}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal">
                {body}
              </p>
            </div>

            {status === "success" ? (
              <div className="flex flex-col justify-center gap-2 border border-camel/40 bg-tan/40 px-6 py-8 text-midnight">
                <p className="font-display text-3xl">You&apos;re in.</p>
                <p className="text-sm leading-relaxed text-charcoal">
                  Thanks for subscribing — keep an eye on your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your Name"
                    className="w-full border border-camel/40 bg-transparent px-4 py-3 text-sm text-midnight placeholder:text-stormy focus:border-camel focus:outline-none"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email Address"
                    className="w-full border border-camel/40 bg-transparent px-4 py-3 text-sm text-midnight placeholder:text-stormy focus:border-camel focus:outline-none"
                  />
                </div>

                {/* Honeypot — humans never see or fill this */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden
                />

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="self-start rounded-sm bg-camel px-8 py-3 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85 disabled:opacity-60"
                >
                  {status === "submitting" ? "Signing Up…" : "Sign Up"}
                </button>

                {status === "error" ? (
                  <p className="text-sm text-red-700">
                    Something went wrong — please try again in a moment.
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
