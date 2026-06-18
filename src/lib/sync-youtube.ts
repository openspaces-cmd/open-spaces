import { writeClient } from "@/sanity/client";

type YouTubeVideo = {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

async function youtubeGet(
  path: string,
  params: Record<string, string>,
): Promise<unknown> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("Missing YOUTUBE_API_KEY");
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  Object.entries({ ...params, key: apiKey }).forEach(([k, v]) =>
    url.searchParams.set(k, v),
  );
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`YouTube API ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function getUploadsPlaylistId(channelId: string): Promise<string> {
  const data = (await youtubeGet("channels", {
    part: "contentDetails",
    id: channelId,
  })) as {
    items?: { contentDetails: { relatedPlaylists: { uploads: string } } }[];
  };
  const uploads = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) throw new Error(`No uploads playlist for channel ${channelId}`);
  return uploads;
}

async function getAllUploads(playlistId: string): Promise<YouTubeVideo[]> {
  const videos: YouTubeVideo[] = [];
  let pageToken: string | undefined;

  do {
    const data = (await youtubeGet("playlistItems", {
      part: "snippet,contentDetails",
      playlistId,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    })) as {
      nextPageToken?: string;
      items?: {
        snippet: { title: string; description: string };
        contentDetails: { videoId: string; videoPublishedAt?: string };
      }[];
    };

    for (const item of data.items ?? []) {
      videos.push({
        videoId: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt:
          item.contentDetails.videoPublishedAt ?? new Date().toISOString(),
      });
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  return videos;
}

export type SyncResult = {
  fetched: number;
  created: number;
  skipped: number;
};

// Pulls a channel's uploads and creates an episode for any video that doesn't
// already exist. Existing episodes are left untouched so manual edits in the
// Studio (show notes, custom excerpt, guests, featured flag) are never clobbered.
export async function syncYouTubeEpisodes(): Promise<SyncResult> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) throw new Error("Missing YOUTUBE_CHANNEL_ID");

  const uploads = await getUploadsPlaylistId(channelId);
  const videos = await getAllUploads(uploads);

  let created = 0;
  let skipped = 0;

  for (const video of videos) {
    const _id = `youtube-${video.videoId}`;
    const excerpt = video.description
      .split("\n")
      .find((line) => line.trim().length > 0)
      ?.slice(0, 240);

    const result = await writeClient
      .transaction()
      .createIfNotExists({
        _id,
        _type: "episode",
        title: video.title,
        slug: { _type: "slug", current: slugify(video.title) || video.videoId },
        youtubeId: video.videoId,
        publishedAt: video.publishedAt,
        excerpt,
        syncedFromYouTube: true,
      })
      .commit({ returnDocuments: false, visibility: "async" });

    // createIfNotExists is a no-op when the doc exists; count via mutation results.
    if (result.results?.some((r) => r.operation === "create")) {
      created += 1;
    } else {
      skipped += 1;
    }
  }

  return { fetched: videos.length, created, skipped };
}
