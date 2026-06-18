export function youtubeThumbnail(id: string, quality: "hq" | "max" = "max") {
  const file = quality === "max" ? "maxresdefault" : "hqdefault";
  return `https://i.ytimg.com/vi/${id}/${file}.jpg`;
}

export function youtubeWatchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}
