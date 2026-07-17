import backstage from "../assets/backstage.webp";
import { useReveal } from "../useReveal";

export default function About() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="sobre-mi" className="about">
      <div ref={ref} className={`about__wrap reveal ${visible ? "reveal--visible" : ""}`}>
        <div className="about__image-frame">
          <img
            src={backstage}
            alt="Rami González antes de salir a escena"
            className="about__image"
            width={801}
            height={1200}
            loading="lazy"
          />
          <div className="about__tag">detrás de cámaras</div>
        </div>

        <div className="about__text">
          <p className="section-eyebrow">Sobre mí</p>
          <h2 className="section-title">
            Humor honesto, <br />
            historias que se sienten propias.
          </h2>
          <p>
            Nací en la Isla de la Juventud, Cuba, y empecé a hacer stand-up en Uruguay, donde
            encontré mi estilo: observación cercana, historias personales y humor honesto —
            llevando mi mirada cubana a una cultura nueva.
          </p>
          <p>
            Al llegar a Estados Unidos, convertí la experiencia migratoria en mi material más
            fuerte: los cambios, la adaptación y la vida del inmigrante latino, creando un
            espacio donde el público se ve reflejado y se ríe de lo suyo.
          </p>
          <p>
            He llevado mi comedia a escenarios de Estados Unidos, Puerto Rico, Canadá y
            Uruguay, conectando con audiencias diversas desde la honestidad y la identificación.
          </p>
        </div>
      </div>
    </section>
  );
}
