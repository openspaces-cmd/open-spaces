"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-sm border border-tan bg-ivory-light px-4 py-3 text-sm text-midnight placeholder:text-stormy focus:border-camel focus:outline-none";
const labelClass =
  "text-sm font-medium text-midnight";

export function ShareStoryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const story = String(data.story ?? "").trim();
    if (story.length < 40) {
      setError(
        "Tell us a little more — a few sentences helps us honor your story well.",
      );
      return;
    }
    setError(null);
    setStatus("submitting");
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          location: data.location,
          email: data.email,
          story,
          anonymous: data.anonymous === "on",
          mayShare: data.mayShare === "on",
          website: data.website, // honeypot
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-midnight p-8 text-center text-ivory-light sm:p-12">
        <p className="font-display text-4xl">Thank you for sharing</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory-light/80">
          Your courage could be exactly what someone else needs. Every story is
          read by Jeff &amp; Jourdan&apos;s team. We may not be able to respond
          to each one personally, but we&apos;re so grateful you shared yours
          to help others. Nothing is ever shared without your permission.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            First name
          </label>
          <input id="name" name="name" type="text" maxLength={80} placeholder="Your first name" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="location" className={labelClass}>
            Location <span className="font-normal text-stormy">(optional)</span>
          </label>
          <input id="location" name="location" type="text" maxLength={80} placeholder="Atlanta, GA" className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClass}>
          Email <span className="font-normal text-stormy">(optional)</span>
        </label>
        <input id="email" name="email" type="email" maxLength={120} placeholder="you@example.com" className={inputClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="story" className={labelClass}>
          Your story
        </label>
        <textarea
          id="story"
          name="story"
          required
          rows={8}
          maxLength={5000}
          placeholder="What happened, what helped, and what you’d want someone in your shoes to know. Take your time."
          className={inputClass}
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

      <fieldset className="flex flex-col gap-3 rounded-2xl bg-ivory-light p-5 ring-1 ring-tan/70">
        <legend className="sr-only">Sharing permissions</legend>
        <label className="flex items-start gap-3 text-sm text-charcoal">
          <input type="checkbox" name="mayShare" className="mt-1 accent-[#bf8b3e]" />
          You may share my story on the Open Spaces website or podcast to
          help others.
        </label>
        <label className="flex items-start gap-3 text-sm text-charcoal">
          <input type="checkbox" name="anonymous" className="mt-1 accent-[#bf8b3e]" />
          If you share it, please keep me anonymous.
        </label>
        <p className="text-xs leading-relaxed text-stormy">
          Sharing is how your story reaches someone who needs it — but
          it&apos;s always your choice. Leave the first box unchecked and your
          story stays just between us.
        </p>
      </fieldset>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {status === "error" ? (
        <p className="text-sm text-red-700">
          Something went wrong sending your story. Please try again — or email
          it to us instead.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start rounded-sm bg-camel px-8 py-3.5 text-sm font-semibold text-ivory-light transition-colors hover:bg-camel/85 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send My Story"}
      </button>
    </form>
  );
}
