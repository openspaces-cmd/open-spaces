// HubSpot Forms submission helper.
//
// Posts to the public Forms Submission API — no private app token required.
// Submissions land in the configured HubSpot portal as contacts, with native
// dedup and consent handling. Configure via env vars (see .env.local):
//   HUBSPOT_PORTAL_ID            – the portal/account id (e.g. 48590777)
//   HUBSPOT_NEWSLETTER_FORM_GUID – the form GUID for newsletter signups
//
// Kept separate from any other ecosystem: the portal id lives only in env, so
// re-pointing to a different HubSpot account never touches code.

const SUBMIT_BASE =
  "https://api.hsforms.com/submissions/v3/integration/submit";

export const portalId = process.env.HUBSPOT_PORTAL_ID || "";

export const isHubspotConfigured = portalId !== "";

export type HubspotField = { name: string; value: string };

export type HubspotResult =
  | { ok: true; demo?: boolean }
  | { ok: false; status: number; message: string };

type SubmitContext = { pageUri?: string; pageName?: string };

/**
 * Submit a set of fields to a HubSpot form. Returns a normalized result.
 * When HubSpot isn't configured, resolves as a graceful demo success so the
 * form flow can still be exercised locally / before launch.
 */
export async function submitHubspotForm(
  formGuid: string,
  fields: HubspotField[],
  context?: SubmitContext,
): Promise<HubspotResult> {
  if (!isHubspotConfigured || !formGuid) {
    console.log("[hubspot] demo submission (not configured):", { fields });
    return { ok: true, demo: true };
  }

  const url = `${SUBMIT_BASE}/${portalId}/${formGuid}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: fields.filter((f) => f.value !== ""),
        context,
      }),
    });
  } catch (err) {
    console.error("[hubspot] network error:", err);
    return { ok: false, status: 502, message: "Could not reach HubSpot" };
  }

  if (res.ok) return { ok: true };

  // HubSpot returns a descriptive body on 400 (e.g. an unknown/invalid field),
  // which is exactly what we need to correct the field mapping.
  let detail = `HTTP ${res.status}`;
  try {
    const body = await res.json();
    detail = body?.message || JSON.stringify(body?.errors ?? body);
  } catch {
    /* keep the status-only detail */
  }
  console.error("[hubspot] submission rejected:", detail);
  return { ok: false, status: res.status, message: detail };
}
