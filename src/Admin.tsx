import { useEffect, useState, type FormEvent } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth } from "./auth";
import { addShow, deleteShow, subscribeToShows, updateShow, type NewShow, type Show } from "./shows";
import { US_CITIES } from "./usCities";

function authErrorMessage(code: string) {
  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "Email o contraseña incorrectos";
  }
  return "No se pudo iniciar sesión";
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(authErrorMessage((err as { code?: string }).code ?? ""));
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit} className="admin-login__form">
        <h1>Admin</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="admin-login__error">{error}</p>}
        <button type="submit" className="btn btn--primary btn--wide" disabled={checking}>
          {checking ? "Verificando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

function ShowForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: NewShow;
  submitLabel: string;
  onSubmit: (show: NewShow) => Promise<void>;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [ticketUrl, setTicketUrl] = useState(initial?.ticketUrl ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !date || !ticketUrl) return;
    setSaving(true);
    await onSubmit({ name, date, ticketUrl });
    setSaving(false);
    if (!initial) {
      setName("");
      setDate("");
      setTicketUrl("");
    }
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
          list="us-cities"
          required
        />
        <datalist id="us-cities">
          {US_CITIES.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>
      </label>
      <label>
        Fecha
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          onClick={(e) => e.currentTarget.showPicker?.()}
          required
        />
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
      <div className="admin-form__actions">
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? "Guardando..." : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

function ShowList({
  shows,
  onUpdate,
  onDelete,
}: {
  shows: Show[];
  onUpdate: (id: string, show: NewShow) => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (shows.length === 0) {
    return <p className="admin-list__empty">Todavía no hay shows agregados.</p>;
  }

  return (
    <ul className="admin-list">
      {shows.map((show) =>
        editingId === show.id ? (
          <li key={show.id} className="admin-list__item admin-list__item--editing">
            <ShowForm
              initial={{ name: show.name, date: show.date, ticketUrl: show.ticketUrl }}
              submitLabel="Guardar cambios"
              onSubmit={(updated) => onUpdate(show.id, updated).then(() => setEditingId(null))}
              onCancel={() => setEditingId(null)}
            />
          </li>
        ) : (
          <li key={show.id} className="admin-list__item">
            <div>
              <strong>{show.name}</strong>
              <span>{show.date}</span>
              <a href={show.ticketUrl} target="_blank" rel="noreferrer">
                {show.ticketUrl}
              </a>
            </div>
            <div className="admin-list__actions">
              <button type="button" className="admin-list__edit" onClick={() => setEditingId(show.id)}>
                Editar
              </button>
              <button type="button" className="admin-list__delete" onClick={() => onDelete(show.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ),
      )}
    </ul>
  );
}

export default function Admin() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!user) return;
    return subscribeToShows(setShows);
  }, [user]);

  if (user === undefined) {
    return null;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="admin">
      <div className="admin__header">
        <h1>Panel de shows</h1>
        <button type="button" className="btn btn--ghost btn--small" onClick={() => signOut(auth)}>
          Cerrar sesión
        </button>
      </div>
      <ShowForm submitLabel="Agregar show" onSubmit={(show) => addShow(show).then(() => {})} />
      <ShowList shows={shows} onUpdate={updateShow} onDelete={deleteShow} />
    </div>
  );
}
