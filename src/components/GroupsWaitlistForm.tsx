"use client";

import { useState } from "react";

import { GROUP_OPTIONS } from "@/lib/formOptions";

import {
  Field,
  Honeypot,
  SubmitButton,
  SuccessPanel,
  inputClass,
  labelClass,
  useJsonSubmit,
} from "./FormKit";

export function GroupsWaitlistForm() {
  const { status, submit } = useJsonSubmit("/api/groups-waitlist");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const groups = fd.getAll("groups").map(String);
    if (groups.length === 0) {
      setError("Pick at least one group you're interested in.");
      return;
    }
    setError(null);
    await submit({
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      location: fd.get("location"),
      groups,
      notes: fd.get("notes"),
      website: fd.get("website"),
    });
  }

  if (status === "success") {
    return (
      <SuccessPanel heading="You're on the list">
        <p>
          Thank you for raising your hand. We&apos;ll email you as soon as the
          next group opens. Until then, you&apos;re not alone.
        </p>
      </SuccessPanel>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="firstName" label="First name">
          <input id="firstName" name="firstName" required maxLength={80} className={inputClass} />
        </Field>
        <Field id="lastName" label="Last name">
          <input id="lastName" name="lastName" required maxLength={80} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="email" label="Email">
          <input id="email" name="email" type="email" required maxLength={120} placeholder="you@example.com" className={inputClass} />
        </Field>
        <Field id="phone" label="Phone" optional>
          <input id="phone" name="phone" type="tel" maxLength={40} className={inputClass} />
        </Field>
      </div>

      <Field id="location" label="City & state" optional>
        <input id="location" name="location" maxLength={80} placeholder="Atlanta, GA" className={inputClass} />
      </Field>

      <fieldset className="flex flex-col gap-3">
        <legend className={labelClass}>Which group are you interested in?</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {GROUP_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-start gap-3 rounded-sm bg-ivory-light px-4 py-3 text-sm text-charcoal ring-1 ring-tan/70">
              <input type="checkbox" name="groups" value={opt} className="mt-1 accent-[#bf8b3e]" />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      <Field id="notes" label="Anything you'd like us to know?" optional>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          maxLength={2000}
          placeholder="Share as much or as little as you'd like. This stays between us."
          className={inputClass}
        />
      </Field>

      <Honeypot />

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {status === "error" ? (
        <p className="text-sm text-red-700">
          Something went wrong. Please try again in a moment.
        </p>
      ) : null}

      <SubmitButton status={status} label="Join the Waitlist" busyLabel="Sending…" />
    </form>
  );
}
