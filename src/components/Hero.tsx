import heroImage from "../assets/main.webp";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <img
        src={heroImage}
        alt="Rami González en el escenario"
        className="hero__image"
        width={1333}
        height={2000}
        fetchPriority="high"
      />
      <div className="hero__overlay" />

      <div className="hero__blob hero__blob--one" />
      <div className="hero__blob hero__blob--two" />

      <div className="hero__content">
        <p className="hero__eyebrow">Stand up comedy · en español</p>
        <h1 className="hero__title">
          RAMI <span className="hero__title-accent">GONZÁLEZ</span>
        </h1>
      </div>

      <a href="#tickets" className="hero__scroll" aria-label="Bajar">
        <span />
      </a>
    </section>
  );
}
