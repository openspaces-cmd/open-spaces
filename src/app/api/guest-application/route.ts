import {
  GUEST_ANONYMITY_OPTIONS,
  GUEST_TOPICS,
  GUEST_VIDEO_OPTIONS,
} from "@/lib/formOptions";
import { readJson, saveSubmission, str, strList } from "@/lib/submissions";

export const dynamic = "force-dynamic";

const oneOf = (v: unknown, allowed: readonly string[]) =>
  typeof v === "string" && allowed.includes(v) ? v : "";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  if (str(body.website, 10)) return Response.json({ ok: true }); // honeypot

  const firstName = str(body.firstName, 80);
  const lastName = str(body.lastName, 80);
  const email = str(body.email, 120);
  const story = str(body.story, 5000);

  if (!firstName || !email.includes("@") || story.length < 100) {
    return Response.json(
      { ok: false, error: "Name, email and your story are required" },
      { status: 400 },
    );
  }

  const doc = {
    firstName,
    lastName,
    email,
    phone: str(body.phone, 40),
    location: str(body.location, 80),
    church: str(body.church, 120),
    links: str(body.links, 500),
    topics: strList(body.topics, GUEST_TOPICS),
    story,
    takeaway: str(body.takeaway, 2000),
    sharedBefore: str(body.sharedBefore, 1000),
    video: oneOf(body.video, GUEST_VIDEO_OPTIONS),
    anonymity: oneOf(body.anonymity, GUEST_ANONYMITY_OPTIONS),
    referral: str(body.referral, 200),
  };

  const summary = [
    `Topics: ${doc.topics.join(", ") || "—"}`,
    `Story: ${doc.story}`,
    `Takeaway: ${doc.takeaway}`,
    doc.sharedBefore && `Shared before: ${doc.sharedBefore}`,
    `Video: ${doc.video || "—"} | Name: ${doc.anonymity || "—"}`,
    doc.church && `Church: ${doc.church}`,
    doc.links && `Links: ${doc.links}`,
    doc.referral && `Heard via: ${doc.referral}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return saveSubmission({
    type: "guestApplication",
    doc,
    hubspotFormGuid: process.env.HUBSPOT_GUEST_FORM_GUID || "",
    hubspotFields: [
      { name: "firstname", value: firstName },
      { name: "lastname", value: lastName },
      { name: "email", value: email },
      { name: "phone", value: doc.phone },
      { name: "city", value: doc.location },
      { name: "message", value: summary },
    ],
    pageName: "Open Spaces — Podcast Guest Application",
  });
}
