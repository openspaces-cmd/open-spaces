"use client";

// Small shared pieces for the site's forms, matching ShareStoryForm's styling.

import { useState } from "react";

export const inputClass =
  "w-full rounded-sm border border-tan bg-ivory-light px-4 py-3 text-sm text-midnight placeholder:text-stormy focus:border-camel focus:outline-none";
export const labelClass =
  "text-sm font-medium text-midnight";

export type FormStatus = "idle" | "submitting" | "success" | "error";

export function Optional() {
  return <span className="font-normal text-stormy">(optional)</span>;
}

export function Field({
  id,
  label,
  optional,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClass}>
        {label} {optional ? <Optional /> : null}
      </label>
      {children}
    </div>
  );
}

export function Honeypot() {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      className="hidden"
      aria-hidden
    />
  );
}

export function SubmitButton({
  status,
  label,
  busyLabel,
}: {
  status: FormStatus;
  label: string;
  busyLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={status === "submitting"}
      className="self-start rounded-sm bg-camel px-8 py-3.5 text-sm font-semibold text-ivory-light transition-colors hover:bg-camel/85 disabled:opacity-60"
    >
      {status === "submitting" ? busyLabel : label}
    </button>
  );
}

export function SuccessPanel({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-midnight p-8 text-center text-ivory-light sm:p-12">
      <p className="font-display text-4xl">{heading}</p>
      <div className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory-light/80">
        {children}
      </div>
    </div>
  );
}

/** POSTs JSON to `endpoint` and tracks status. */
export function useJsonSubmit(endpoint: string) {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function submit(payload: Record<string, unknown>) {
    setStatus("submitting");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return { status, submit };
}
