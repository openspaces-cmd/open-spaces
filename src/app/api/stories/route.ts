import { writeClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-dynamic";

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

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

  const doc = {
    _type: "story",
    status: "submitted",
    story,
    name: str(body.name, 80),
    location: str(body.location, 80),
    email: str(body.email, 120),
    anonymous: body.anonymous === true,
    mayShare: body.mayShare === true,
    wantsFollowUp: body.wantsFollowUp === true,
    submittedAt: new Date().toISOString(),
  };

  // Until Sanity is connected, accept gracefully so the flow can be exercised.
  if (!isSanityConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    console.log("[stories] demo submission (Sanity not configured):", {
      ...doc,
      email: doc.email ? "<redacted>" : "",
    });
    return Response.json({ ok: true, demo: true });
  }

  try {
    await writeClient.create(doc);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[stories] failed to save submission:", err);
    return Response.json(
      { ok: false, error: "Failed to save" },
      { status: 500 },
    );
  }
}
