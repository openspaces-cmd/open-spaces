/**
 * One-time move: re-key every story document under the "private." id prefix.
 *
 * The production dataset is public (private datasets need a paid Sanity plan),
 * and story submissions hold emails and unapproved stories. Documents whose id
 * contains a "." are only readable with a token, so moving stories to
 * `private.<old id>` hides them from the public API. The site reads with a
 * token, so approved stories keep showing on the wall.
 *
 * Each story is copied to its new id and the old one deleted in the same
 * transaction, so a failure leaves the original untouched. Drafts move too
 * (drafts.<id> → drafts.private.<id>). Re-running skips stories already moved.
 *
 * Run (dry run by default — prints what would happen, writes nothing):
 *   set -a && . ./.env.local && set +a && npx tsx scripts/hide-stories.ts
 * Then add --write to apply.
 */
import { createClient } from "@sanity/client";

const write = process.argv.includes("--write");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN. Source .env.local first.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
  perspective: "raw",
});

type Doc = { _id: string; _type: string } & Record<string, unknown>;

const SYSTEM = new Set(["_id", "_rev", "_createdAt", "_updatedAt"]);

const strip = (doc: Doc) =>
  Object.fromEntries(Object.entries(doc).filter(([k]) => !SYSTEM.has(k)));

// drafts.abc → drafts.private.abc; abc → private.abc
const hiddenId = (id: string) =>
  id.startsWith("drafts.")
    ? `drafts.private.${id.slice("drafts.".length)}`
    : `private.${id}`;

const isHidden = (id: string) =>
  id.startsWith("private.") || id.startsWith("drafts.private.");

async function main() {
  const stories: Doc[] = await client.fetch(`*[_type == "story"]`);
  const toMove = stories.filter((s) => !isHidden(s._id));

  console.log(
    `Stories: ${stories.length} · already hidden: ${stories.length - toMove.length} · to move: ${toMove.length}`,
  );
  for (const s of toMove) console.log(`  ${s._id} → ${hiddenId(s._id)}`);

  if (!write) {
    console.log("\nDry run — nothing written. Re-run with --write to apply.");
    return;
  }

  let moved = 0;
  for (const s of toMove) {
    await client
      .transaction()
      .createIfNotExists({ ...strip(s), _id: hiddenId(s._id), _type: s._type })
      .delete(s._id)
      .commit();
    moved++;
  }
  console.log(`\nMoved ${moved} stories ✓`);

  const leftovers: number = await client.fetch(
    `count(*[_type == "story" && !(_id in path("private.**")) && !(_id in path("drafts.private.**"))])`,
  );
  console.log(`Stories still on public ids: ${leftovers}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
