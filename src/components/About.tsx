import backstage from "../assets/backstage.webp";
import { useReveal } from "../useReveal";

export default function About() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="sobre-mi" className="about">
      <div ref={ref} className={`about__wrap reveal ${visible ? "reveal--visible" : ""}`}>
        <div className="about__heading">
          <p className="section-eyebrow">Sobre mí</p>
          <h2 className="section-title">
            Humor honesto, <br />
            historias que se sienten propias.
          </h2>
        </div>

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
          <p>
            Soy comediante, nacido en la Isla de la Juventud, Cuba. He convertido mi experiencia
            como inmigrante, los choques culturales y las historias de la vida cotidiana en una
            comedia honesta y cercana con la que miles de latinos se sienten identificados.
          </p>
          <p>
            Inicié mi carrera de stand-up en Uruguay, llevando mi visión a una nueva cultura, y
            hoy me he presentado en escenarios de Estados Unidos, Puerto Rico, Canadá y Cuba. He
            participado en eventos como Netflix Is A Joke y Miami Es Un Chiste, además de llevar
            mi comedia a ciudades como Miami, Orlando, Tampa, Nueva York, Houston, Dallas,
            Denver, San Francisco, Seattle, Toronto, Vancouver, Montreal y Montevideo, entre
            muchas otras.
          </p>
          <p>
            Con un estilo que mezcla historias personales, observaciones culturales y el humor
            de quien ha tenido que empezar de nuevo lejos de casa, demuestro que incluso las
            experiencias más difíciles pueden convertirse en una buena razón para reír.
          </p>
        </div>
      </div>
    </section>
  );
}
