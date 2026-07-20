import about from "../assets/about.webp";
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
            src={about}
            alt="Rami González antes de salir a escena"
            className="about__image"
            width={900}
            height={1350}
            loading="lazy"
          />
          <div className="about__tag">detrás de cámaras</div>
        </div>

        <div className="about__text">
          <p>
            Soy comediante cubano. He convertido mi experiencia
            como inmigrante, los choques culturales y las historias de la vida cotidiana en una
            comedia con la que miles de latinos se sienten identificados.
          </p>
          <p>
            Inicié mi carrera de stand-up en Uruguay, y tras llegar a Estados Unidos, fundé el showcase{" "}
            <a href="https://latinoscomedy.com/" target="_blank" rel="noreferrer">
              Latinos Comedy
            </a>{" "}
            en Miami, un proyecto que por más de dos años ha creado espacios para la comedia en español
            y conectado con la comunidad latina.
          </p>
          <p>
            He abierto shows para Angelo Colina, Led Varela, Nanutria y Abelardo, entre otros.
            He participado en eventos como{" "}
            <a href="https://www.netflixisajokefest.com/" target="_blank" rel="noreferrer">
              Netflix Is A Joke
            </a>{" "}
            y{" "}
            <a href="https://miamiesunchiste.com/" target="_blank" rel="noreferrer">
              Miami Es Un Chiste
            </a>
            , consolidando mi presencia dentro del circuito de comedia latina.
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
