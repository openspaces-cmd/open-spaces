import { GROUP_OPTIONS } from "@/lib/formOptions";
import { readJson, saveSubmission, str, strList } from "@/lib/submissions";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  if (str(body.website, 10)) return Response.json({ ok: true }); // honeypot

  const firstName = str(body.firstName, 80);
  const lastName = str(body.lastName, 80);
  const email = str(body.email, 120);
  const groups = strList(body.groups, GROUP_OPTIONS);

  if (!firstName || !email.includes("@") || groups.length === 0) {
    return Response.json(
      { ok: false, error: "Name, email and a group are required" },
      { status: 400 },
    );
  }

  const phone = str(body.phone, 40);
  const location = str(body.location, 80);
  const notes = str(body.notes, 2000);

  return saveSubmission({
    type: "groupWaitlist",
    doc: { firstName, lastName, email, phone, location, groups, notes },
    hubspotFormGuid: process.env.HUBSPOT_GROUPS_FORM_GUID || "",
    hubspotFields: [
      { name: "firstname", value: firstName },
      { name: "lastname", value: lastName },
      { name: "email", value: email },
      { name: "phone", value: phone },
      { name: "city", value: location },
      { name: "message", value: [`Groups: ${groups.join(", ")}`, notes].filter(Boolean).join("\n\n") },
    ],
    pageName: "Open Spaces — Groups Waitlist",
  });
}
