import { writeClient } from "@/sanity/client";

// TEMPORARY one-off: moves every story under the "private." id prefix so the
// public Sanity API can't read emails or unapproved stories (same logic as
// scripts/hide-stories.ts, run with the server's write token). Unauthenticated
// on purpose: it is idempotent, can only make data more private, and returns
// counts only. Delete this route once it has run.

export const dynamic = "force-dynamic";

type Doc = { _id: string; _type: string } & Record<string, unknown>;

const SYSTEM = new Set(["_id", "_rev", "_createdAt", "_updatedAt"]);

const hiddenId = (id: string) =>
  id.startsWith("drafts.")
    ? `drafts.private.${id.slice("drafts.".length)}`
    : `private.${id}`;

const isHidden = (id: string) =>
  id.startsWith("private.") || id.startsWith("drafts.private.");

export async function POST() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return Response.json({ error: "No write token" }, { status: 500 });
  }

  const client = writeClient.withConfig({ perspective: "raw" });
  const stories: Doc[] = await client.fetch(`*[_type == "story"]`);
  const toMove = stories.filter((s) => !isHidden(s._id));

  let moved = 0;
  const failed: string[] = [];
  for (const s of toMove) {
    const fields = Object.fromEntries(
      Object.entries(s).filter(([k]) => !SYSTEM.has(k)),
    );
    try {
      await client
        .transaction()
        .createIfNotExists({ ...fields, _id: hiddenId(s._id), _type: s._type })
        .delete(s._id)
        .commit();
      moved++;
    } catch (err) {
      console.error("[hide-stories] failed:", s._id, err);
      failed.push(s._id);
    }
  }

  const remaining: number = await client.fetch(
    `count(*[_type == "story" && !(_id in path("private.**")) && !(_id in path("drafts.private.**"))])`,
  );

  return Response.json({
    total: stories.length,
    alreadyHidden: stories.length - toMove.length,
    moved,
    failed: failed.length,
    remaining,
  });
}
