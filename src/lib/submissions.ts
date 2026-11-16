// Shared backend for simple site forms (Groups waitlist, Podcast guest
// applications). Mirrors the story pipeline: every submission lands in Sanity
// as a private document (the "private." id prefix keeps it out of public API
// reads) and, when a HubSpot form GUID is configured, in HubSpot as a contact.
// The request succeeds if either system accepted it, so one outage never
// loses a submission.

import { randomUUID } from "node:crypto";

import { submitHubspotForm, type HubspotField } from "@/lib/hubspot";
import { writeClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";

export const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export const strList = (v: unknown, allowed: readonly string[]) =>
  Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string" && allowed.includes(x))
    : [];

export async function readJson(
  request: Request,
): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? body : null;
  } catch {
    return null;
  }
}

export async function saveSubmission({
  type,
  doc,
  hubspotFormGuid,
  hubspotFields,
  pageName,
}: {
  type: string;
  doc: Record<string, unknown>;
  hubspotFormGuid: string;
  hubspotFields: HubspotField[];
  pageName: string;
}): Promise<Response> {
  let sanityOk = false;
  if (isSanityConfigured && process.env.SANITY_API_WRITE_TOKEN) {
    try {
      await writeClient.create({
        _id: `private.${randomUUID()}`,
        _type: type,
        status: "new",
        ...doc,
        submittedAt: new Date().toISOString(),
      });
      sanityOk = true;
    } catch (err) {
      console.error(`[${type}] Sanity write failed:`, err);
    }
  }

  // Only counts as a real save when a HubSpot form is actually configured;
  // the helper's "demo" success must not mask a failed Sanity write.
  let hubspotOk = false;
  if (hubspotFormGuid) {
    const result = await submitHubspotForm(hubspotFormGuid, hubspotFields, {
      pageName,
    });
    hubspotOk = result.ok && !("demo" in result && result.demo);
  }

  if (sanityOk || hubspotOk) return Response.json({ ok: true });

  // Local dev with nothing configured: log and succeed so the flow is testable.
  if (!isSanityConfigured && !hubspotFormGuid) {
    console.log(`[${type}] demo submission (nothing configured):`, doc);
    return Response.json({ ok: true, demo: true });
  }

  return Response.json({ ok: false, error: "Failed to save" }, { status: 502 });
}
