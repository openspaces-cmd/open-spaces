import { submitHubspotForm } from "@/lib/hubspot";

export const dynamic = "force-dynamic";

const NEWSLETTER_FORM_GUID =
  process.env.HUBSPOT_NEWSLETTER_FORM_GUID || "";

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

  const email = str(body.email, 120);
  const name = str(body.name, 80);

  if (!email || !email.includes("@")) {
    return Response.json(
      { ok: false, error: "A valid email is required" },
      { status: 400 },
    );
  }

  const result = await submitHubspotForm(
    NEWSLETTER_FORM_GUID,
    [
      { name: "email", value: email },
      { name: "firstname", value: name },
    ],
    { pageName: "Open Spaces — Newsletter" },
  );

  if (result.ok) return Response.json({ ok: true });

  return Response.json(
    { ok: false, error: "Could not complete signup" },
    { status: 502 },
  );
}
