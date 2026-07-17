export interface Video {
  id: string;
  /** Real YouTube video ID — reemplaza estos por los IDs reales del canal */
  videoId: string;
  title: string;
  views: string;
}

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@ramicuba";
export const INSTAGRAM_URL = "https://www.instagram.com/ramicuba/";

// TODO: reemplaza videoId por los IDs reales de los videos más recientes
// (el ID es lo que va después de "v=" en la URL del video de YouTube)
export const videos: Video[] = [
  {
    id: "v1",
    videoId: "REPLACE_ME_1",
    title: "Mi mamá me llamó en medio del show",
    views: "128K vistas",
  },
  {
    id: "v2",
    videoId: "REPLACE_ME_2",
    title: "Por qué los aeropuertos me odian",
    views: "94K vistas",
  },
  {
    id: "v3",
    videoId: "REPLACE_ME_3",
    title: "Stand up completo en La Habana",
    views: "310K vistas",
  },
];
