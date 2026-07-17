export interface Video {
  id: string;
  videoId: string;
  title: string;
  isShort: boolean;
}

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const UPLOADS_PLAYLIST_ID = import.meta.env.VITE_YOUTUBE_UPLOADS_PLAYLIST_ID;

function parseDurationSeconds(iso: string) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const [, h, m, s] = match;
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
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
  const detailsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids}&key=${API_KEY}`,
  );
  if (!detailsRes.ok) throw new Error("No se pudieron cargar los detalles");
  const detailsData = await detailsRes.json();
  const durationById = new Map<string, number>(
    detailsData.items.map((item: { id: string; contentDetails: { duration: string } }) => [
      item.id,
      parseDurationSeconds(item.contentDetails.duration),
    ]),
  );

  return items.map((item) => ({
    id: item.videoId,
    videoId: item.videoId,
    title: item.title,
    isShort: (durationById.get(item.videoId) ?? 0) <= 60,
  }));
}
