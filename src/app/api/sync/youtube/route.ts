import { syncYouTubeEpisodes } from "@/lib/sync-youtube";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.SYNC_SECRET;
  if (!secret) return false;
  const url = new URL(request.url);
  const bearer = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");
  const provided =
    request.headers.get("x-sync-secret") ??
    url.searchParams.get("secret") ??
    bearer;
  return provided === secret;
}

async function handle(request: Request): Promise<Response> {
  if (!process.env.SYNC_SECRET) {
    return Response.json(
      { error: "SYNC_SECRET is not configured" },
      { status: 500 },
    );
  }
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSanityConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    return Response.json(
      { error: "Sanity is not configured (need project id + write token)" },
      { status: 500 },
    );
  }

  try {
    const result = await syncYouTubeEpisodes();
    return Response.json({ ok: true, ...result });
  } catch (err) {
    console.error("[sync/youtube] failed:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 },
    );
  }
}

// GET — for Vercel Cron (sends Authorization: Bearer <SYNC_SECRET>).
export const GET = handle;
// POST — for manual triggers / webhooks.
export const POST = handle;
