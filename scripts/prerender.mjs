import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, getDocs } from "firebase/firestore/lite";

const rootDir = fileURLToPath(new URL("..", import.meta.url));

function loadDotEnv() {
  const path = `${rootDir}.env`;
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const match = line.match(/^([\w]+)=(.*)$/);
    if (match) env[match[1]] = match[2];
  }
  return env;
}

const env = { ...loadDotEnv(), ...process.env };

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function fetchShows() {
  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  };
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn("Prerender: faltan credenciales de Firebase, se omiten los shows");
    return [];
  }
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const snapshot = await getDocs(query(collection(db, "shows"), orderBy("date", "asc")));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

function parseDurationSeconds(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const [, h, m, s] = match;
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
}

async function fetchVideos() {
  const apiKey = env.VITE_YOUTUBE_API_KEY;
  const playlistId = env.VITE_YOUTUBE_UPLOADS_PLAYLIST_ID;
  if (!apiKey || !playlistId) {
    console.warn("Prerender: faltan credenciales de YouTube, se omiten los videos");
    return [];
  }

  const playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=6&key=${apiKey}`,
  );
  if (!playlistRes.ok) {
    console.warn("Prerender: no se pudieron cargar los videos de YouTube");
    return [];
  }
  const playlistData = await playlistRes.json();
  return (playlistData.items ?? []).map((item) => ({
    videoId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
  }));
}

function buildEventJsonLd(shows) {
  return shows.map((show) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Rami González en vivo — ${show.name}`,
    startDate: show.date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: show.name },
    performer: { "@type": "Person", name: "Rami González" },
    offers: {
      "@type": "Offer",
      url: show.ticketUrl,
      availability: "https://schema.org/InStock",
    },
  }));
}

function buildFallbackMarkup(shows, videos) {
  const showItems = shows.length
    ? shows
        .map(
          (s) =>
            `<li>${escapeHtml(formatDate(s.date))} — ${escapeHtml(s.name)} — <a href="${escapeHtml(s.ticketUrl)}">Conseguir entradas</a></li>`,
        )
        .join("")
    : "<li>Muy pronto anunciaremos nuevas fechas.</li>";

  const videoItems = videos
    .map(
      (v) =>
        `<li><a href="https://www.youtube.com/watch?v=${escapeHtml(v.videoId)}">${escapeHtml(v.title)}</a></li>`,
    )
    .join("");

  return `<noscript><h2>Próximos shows</h2><ul>${showItems}</ul>${videoItems ? `<h2>Videos recientes</h2><ul>${videoItems}</ul>` : ""}</noscript>`;
}

async function main() {
  const [shows, videos] = await Promise.all([
    fetchShows().catch((err) => {
      console.warn("Prerender: fallo al leer shows de Firestore:", err.message);
      return [];
    }),
    fetchVideos().catch((err) => {
      console.warn("Prerender: fallo al leer videos de YouTube:", err.message);
      return [];
    }),
  ]);

  const jsonLd = buildEventJsonLd(shows);
  const fallback = buildFallbackMarkup(shows, videos);
  const injected = [
    jsonLd.length > 0 ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : "",
    fallback,
  ].join("\n    ");

  const indexPath = `${rootDir}dist/index.html`;
  const html = readFileSync(indexPath, "utf-8");
  const updated = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n    ${injected}`,
  );
  writeFileSync(indexPath, updated);

  console.log(`Prerender: ${shows.length} shows y ${videos.length} videos embebidos en dist/index.html`);
}

main().catch((err) => {
  console.error("Prerender falló:", err);
  process.exitCode = 1;
});
