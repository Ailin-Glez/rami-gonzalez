export interface Video {
  id: string;
  videoId: string;
  title: string;
  views: string;
}

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const UPLOADS_PLAYLIST_ID = import.meta.env.VITE_YOUTUBE_UPLOADS_PLAYLIST_ID;

function formatViews(count: string) {
  const n = Number(count);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M vistas`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K vistas`;
  return `${n} vistas`;
}

export async function fetchLatestVideos(count = 3): Promise<Video[]> {
  const playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=${count}&key=${API_KEY}`,
  );
  if (!playlistRes.ok) throw new Error("No se pudieron cargar los videos");
  const playlistData = await playlistRes.json();

  const items: { videoId: string; title: string }[] = playlistData.items.map(
    (item: { snippet: { resourceId: { videoId: string }; title: string } }) => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
    }),
  );

  const ids = items.map((item) => item.videoId).join(",");
  const statsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${API_KEY}`,
  );
  if (!statsRes.ok) throw new Error("No se pudieron cargar las vistas");
  const statsData = await statsRes.json();
  const viewsById = new Map<string, string>(
    statsData.items.map((item: { id: string; statistics: { viewCount: string } }) => [
      item.id,
      item.statistics.viewCount,
    ]),
  );

  return items.map((item) => ({
    id: item.videoId,
    videoId: item.videoId,
    title: item.title,
    views: formatViews(viewsById.get(item.videoId) ?? "0"),
  }));
}
