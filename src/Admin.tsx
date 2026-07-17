import { useEffect, useState, type FormEvent } from "react";
import { addShow, deleteShow, subscribeToShows, type Show } from "./shows";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const AUTH_KEY = "rami-admin-auth";

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onSuccess();
    } else {
      setError("Contraseña incorrecta");
    }
  }

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit} className="admin-login__form">
        <h1>Admin</h1>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p className="admin-login__error">{error}</p>}
        <button type="submit" className="btn btn--primary btn--wide">
          Entrar
        </button>
      </form>
    </div>
  );
}

function ShowForm({ onAdd }: { onAdd: (show: { name: string; date: string; ticketUrl: string }) => Promise<void> }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !date || !ticketUrl) return;
    setSaving(true);
    await onAdd({ name, date, ticketUrl });
    setName("");
    setDate("");
    setTicketUrl("");
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <label>
        Nombre / ciudad
        <input
          type="text"
          placeholder="Miami, FL — The Comedy Spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Fecha
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <label>
        Link de tickets
        <input
          type="url"
          placeholder="https://..."
          value={ticketUrl}
          onChange={(e) => setTicketUrl(e.target.value)}
          required
        />
      </label>
      <button type="submit" className="btn btn--primary" disabled={saving}>
        {saving ? "Guardando..." : "Agregar show"}
      </button>
    </form>
  );
}

function ShowList({ shows, onDelete }: { shows: Show[]; onDelete: (id: string) => void }) {
  if (shows.length === 0) {
    return <p className="admin-list__empty">Todavía no hay shows agregados.</p>;
  }

  return (
    <ul className="admin-list">
      {shows.map((show) => (
        <li key={show.id} className="admin-list__item">
          <div>
            <strong>{show.name}</strong>
            <span>{show.date}</span>
            <a href={show.ticketUrl} target="_blank" rel="noreferrer">
              {show.ticketUrl}
            </a>
          </div>
          <button type="button" className="admin-list__delete" onClick={() => onDelete(show.id)}>
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => {
    if (!authed) return;
    return subscribeToShows(setShows);
  }, [authed]);

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="admin">
      <h1>Panel de shows</h1>
      <ShowForm onAdd={(show) => addShow(show).then(() => {})} />
      <ShowList shows={shows} onDelete={deleteShow} />
    </div>
  );
}
