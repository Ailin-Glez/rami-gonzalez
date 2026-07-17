import { useEffect, useState } from "react";
import { YOUTUBE_CHANNEL_URL } from "../data";
import { fetchLatestVideos, type Video } from "../youtube";
import VideoModal from "./VideoModal";
import { useReveal } from "../useReveal";

export default function YouTubeSection() {
  const [active, setActive] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const { ref, visible } = useReveal<HTMLDivElement>();

  useEffect(() => {
    fetchLatestVideos(3)
      .then(setVideos)
      .catch(() => setVideos([]));
  }, []);

  return (
    <section id="youtube" className="youtube">
      <div ref={ref} className={`reveal ${visible ? "reveal--visible" : ""}`}>
        <div className="youtube__header">
          <div>
            <p className="section-eyebrow">El canal</p>
            <h2 className="section-title">Lo más reciente en YouTube</h2>
          </div>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            className="btn btn--youtube"
          >
            Suscríbete al canal
          </a>
        </div>

        <div className="youtube__grid">
          {videos.map((video, i) => (
            <button
              key={video.id}
              className="video-card"
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => setActive(video)}
            >
              <span className="video-card__thumb">
                <img
                  src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                  alt={video.title}
                  loading="lazy"
                />
                <span className="video-card__play">▶</span>
              </span>
              <span className="video-card__title">{video.title}</span>
              <span className="video-card__views">{video.views}</span>
            </button>
          ))}
        </div>
      </div>

      {active && <VideoModal video={active} onClose={() => setActive(null)} />}
    </section>
  );
}
