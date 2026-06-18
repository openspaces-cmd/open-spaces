import { submitHubspotForm } from "@/lib/hubspot";

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

  const permissions = [
    body.mayShare === true ? PERMISSION_VALUE.mayShare : null,
    body.anonymous === true ? PERMISSION_VALUE.anonymous : null,
    body.wantsFollowUp === true ? PERMISSION_VALUE.wantsFollowUp : null,
  ]
    .filter(Boolean)
    .join(";");

  // Field names match the HubSpot form's property names. Empty values are
  // dropped by the helper. NOTE: the form currently marks `email` as required,
  // so anonymous (no-email) submissions will be rejected until that's relaxed.
  const result = await submitHubspotForm(
    STORY_FORM_GUID,
    [
      { name: "email", value: str(body.email, 120) },
      { name: "firstname", value: str(body.name, 80) },
      { name: "story", value: story },
      { name: "story_share_permissions", value: permissions },
    ],
    { pageName: "Open Spaces — Share Your Story" },
  );

  if (result.ok) return Response.json({ ok: true });

  return Response.json(
    { ok: false, error: "Failed to save" },
    { status: 502 },
  );
}
