import { useEffect, useState } from "react";
import { YOUTUBE_CHANNEL_URL } from "../data";
import { fetchFeaturedVideos, type FeaturedVideos } from "../youtube";
import { useReveal } from "../useReveal";

const EMPTY: FeaturedVideos = { main: null, shorts: [] };

export default function YouTubeSection() {
  const [{ main, shorts }, setFeatured] = useState<FeaturedVideos>(EMPTY);
  const { ref, visible } = useReveal<HTMLDivElement>();

  useEffect(() => {
    fetchFeaturedVideos()
      .then(setFeatured)
      .catch(() => setFeatured(EMPTY));
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

        <div className="youtube__featured">
          {main && (
            <a
              href={`https://www.youtube.com/watch?v=${main.videoId}`}
              target="_blank"
              rel="noreferrer"
              className="video-card video-card--main"
            >
              <span className="video-card__thumb">
                <img
                  src={`https://img.youtube.com/vi/${main.videoId}/maxresdefault.jpg`}
                  alt={main.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = `https://img.youtube.com/vi/${main.videoId}/hqdefault.jpg`;
                  }}
                />
                <span className="video-card__play">▶</span>
              </span>
              <span className="video-card__title">{main.title}</span>
            </a>
          )}

          <div className="youtube__shorts">
            {shorts.map((video, i) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/shorts/${video.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="video-card video-card--short"
                style={{ animationDelay: `${i * 0.08}s` }}
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
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
