import { useEffect, useState } from "react";
import { subscribeToShows, type Show } from "../shows";
import { useReveal } from "../useReveal";

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Tickets() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => subscribeToShows(setShows), []);

  return (
    <section id="tickets" className="tickets">
      <div ref={ref} className={`reveal ${visible ? "reveal--visible" : ""}`}>
        <p className="section-eyebrow section-eyebrow--light">La gira</p>
        <h2 className="section-title section-title--light">Próximos shows</h2>

        <div className="tickets__list">
          {shows.map((show, i) => (
            <div className="ticket-row" style={{ animationDelay: `${i * 0.06}s` }} key={show.id}>
              <div className="ticket-row__date">{formatDate(show.date)}</div>
              <div className="ticket-row__info">
                <span className="ticket-row__city">{show.name}</span>
              </div>
              <a
                href={show.ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn--primary btn--small"
              >
                Conseguir entradas
              </a>
            </div>
          ))}
          {shows.length === 0 && <p className="tickets__empty">Muy pronto anunciaremos nuevas fechas.</p>}
        </div>

        <p className="tickets__note">
          ¿No ves tu ciudad? Escríbeme abajo y te agrego a la lista de la próxima gira.
        </p>
      </div>
    </section>
  );
}
