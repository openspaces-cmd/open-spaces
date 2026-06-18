import { submitHubspotForm } from "@/lib/hubspot";
import { writeClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-dynamic";

const STORY_FORM_GUID = process.env.HUBSPOT_STORY_FORM_GUID || "";

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

// The site's three consent checkboxes map to option values of the HubSpot
// "Story Share Permissions" multi-checkbox property (from the form definition,
// portal 48590777 / form 0cf5c99d…). Submitted as a semicolon-joined string of
// the selected option values.
const PERMISSION_VALUE = {
  mayShare: "HnvN_djo9RzjyA4Ow-REU",
  anonymous: "XPVG5eb2f1burPYoOw_Aw",
  wantsFollowUp: "I-5JdCth61F9_jteaxrZL",
} as const;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: bots fill every field; humans never see this one.
  if (str(body.website, 10)) {
    return Response.json({ ok: true });
  }

  const story = str(body.story, 5000);
  if (story.length < 40) {
    return Response.json(
      { ok: false, error: "Story is too short" },
      { status: 400 },
    );
  }

  const name = str(body.name, 80);
  const location = str(body.location, 80);
  const email = str(body.email, 120);
  const anonymous = body.anonymous === true;
  const mayShare = body.mayShare === true;
  const wantsFollowUp = body.wantsFollowUp === true;

  // 1) Sanity — lands as "submitted" so the couple can approve it in Studio.
  //    This is the publishing path: nothing shows on the site until approved.
  let sanityOk = false;
  if (isSanityConfigured && process.env.SANITY_API_WRITE_TOKEN) {
    try {
      await writeClient.create({
        _type: "story",
        status: "submitted",
        story,
        name,
        location,
        email,
        anonymous,
        mayShare,
        wantsFollowUp,
        submittedAt: new Date().toISOString(),
      });
      sanityOk = true;
    } catch (err) {
      console.error("[stories] Sanity write failed:", err);
    }
  }

  // 2) HubSpot — lead capture / follow-up. Field names match the form's
  //    property names; empty values are dropped by the helper.
  const permissions = [
    mayShare ? PERMISSION_VALUE.mayShare : null,
    anonymous ? PERMISSION_VALUE.anonymous : null,
    wantsFollowUp ? PERMISSION_VALUE.wantsFollowUp : null,
  ]
    .filter(Boolean)
    .join(";");

  const hubspot = await submitHubspotForm(
    STORY_FORM_GUID,
    [
      { name: "email", value: email },
      { name: "firstname", value: name },
      { name: "story", value: story },
      { name: "story_share_permissions", value: permissions },
    ],
    { pageName: "Open Spaces — Share Your Story" },
  );

  // Succeed if the story landed in either system, so one outage never loses it.
  if (sanityOk || hubspot.ok) return Response.json({ ok: true });

  return Response.json(
    { ok: false, error: "Failed to save" },
    { status: 502 },
  );
}
