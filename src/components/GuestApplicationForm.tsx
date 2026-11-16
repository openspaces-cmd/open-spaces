"use client";

import { useState } from "react";

import {
  GUEST_ANONYMITY_OPTIONS,
  GUEST_TOPICS,
  GUEST_VIDEO_OPTIONS,
} from "@/lib/formOptions";

import {
  Field,
  Honeypot,
  SubmitButton,
  SuccessPanel,
  inputClass,
  labelClass,
  useJsonSubmit,
} from "./FormKit";

function RadioGroup({
  name,
  legend,
  options,
}: {
  name: string;
  legend: string;
  options: readonly string[];
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className={labelClass}>{legend}</legend>
      <div className="mt-2 flex flex-col gap-2">
        {options.map((opt, i) => (
          <label key={opt} className="flex items-start gap-3 text-sm text-charcoal">
            <input type="radio" name={name} value={opt} required={i === 0} className="mt-1 accent-[#bf8b3e]" />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function GuestApplicationForm() {
  const { status, submit } = useJsonSubmit("/api/guest-application");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const story = String(fd.get("story") ?? "").trim();
    if (story.length < 100) {
      setError("Tell us a bit more about your story — a short paragraph or two is perfect.");
      return;
    }
    setError(null);
    await submit({
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      location: fd.get("location"),
      links: fd.get("links"),
      topics: fd.getAll("topics").map(String),
      story,
      takeaway: fd.get("takeaway"),
      sharedBefore: fd.get("sharedBefore"),
      video: fd.get("video"),
      anonymity: fd.get("anonymity"),
      church: fd.get("church"),
      referral: fd.get("referral"),
      website: fd.get("website"),
    });
  }

  if (status === "success") {
    return (
      <SuccessPanel heading="Application received">
        <p>
          Thank you for being willing to share your story. Our team reviews
          every application. We may not be able to respond to each one, but if
          it&apos;s a fit for an upcoming episode, we&apos;ll reach out by email.
        </p>
      </SuccessPanel>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="firstName" label="First name">
          <input id="firstName" name="firstName" required maxLength={80} className={inputClass} />
        </Field>
        <Field id="lastName" label="Last name">
          <input id="lastName" name="lastName" required maxLength={80} className={inputClass} />
        </Field>
        <Field id="email" label="Email">
          <input id="email" name="email" type="email" required maxLength={120} placeholder="you@example.com" className={inputClass} />
        </Field>
        <Field id="phone" label="Phone" optional>
          <input id="phone" name="phone" type="tel" maxLength={40} className={inputClass} />
        </Field>
        <Field id="location" label="City & state">
          <input id="location" name="location" required maxLength={80} placeholder="Atlanta, GA" className={inputClass} />
        </Field>
        <Field id="church" label="Church or ministry" optional>
          <input id="church" name="church" maxLength={120} className={inputClass} />
        </Field>
      </div>

      <Field id="links" label="Website or social links" optional>
        <input id="links" name="links" maxLength={500} placeholder="Instagram, website, YouTube…" className={inputClass} />
      </Field>

      <fieldset className="flex flex-col gap-3">
        <legend className={labelClass}>What would you want to talk about? <span className="text-stormy/60">(pick any)</span></legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {GUEST_TOPICS.map((opt) => (
            <label key={opt} className="flex items-start gap-3 text-sm text-charcoal">
              <input type="checkbox" name="topics" value={opt} className="mt-1 accent-[#bf8b3e]" />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      <Field id="story" label="Your story in brief">
        <textarea
          id="story"
          name="story"
          required
          rows={7}
          maxLength={5000}
          placeholder="What have you walked through, and where has God met you in it?"
          className={inputClass}
        />
      </Field>

      <Field id="takeaway" label="What do you hope listeners take away?">
        <textarea id="takeaway" name="takeaway" required rows={3} maxLength={2000} className={inputClass} />
      </Field>

      <Field id="sharedBefore" label="Have you shared your story publicly before?" optional>
        <textarea
          id="sharedBefore"
          name="sharedBefore"
          rows={2}
          maxLength={1000}
          placeholder="Other podcasts, talks, articles — links are helpful."
          className={inputClass}
        />
      </Field>

      <div className="grid gap-8 sm:grid-cols-2">
        <RadioGroup name="video" legend="Comfortable on video?" options={GUEST_VIDEO_OPTIONS} />
        <RadioGroup name="anonymity" legend="Using your name" options={GUEST_ANONYMITY_OPTIONS} />
      </div>

      <Field id="referral" label="How did you hear about Open Spaces?" optional>
        <input id="referral" name="referral" maxLength={200} className={inputClass} />
      </Field>

      <Honeypot />

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {status === "error" ? (
        <p className="text-sm text-red-700">
          Something went wrong sending your application. Please try again in a
          moment.
        </p>
      ) : null}

      <SubmitButton status={status} label="Submit Application" busyLabel="Sending…" />
    </form>
  );
}
