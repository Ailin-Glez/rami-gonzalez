import { useState, type FormEvent } from "react";
import { useReveal } from "../useReveal";
import { addCityRequest } from "../cityRequests";

export default function ContactForm() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [values, setValues] = useState({ nombre: "", email: "", ciudad: "", mensaje: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      await addCityRequest(values);
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacto" className="contact">
      <div ref={ref} className={`contact__wrap reveal ${visible ? "reveal--visible" : ""}`}>
        <p className="section-eyebrow">¿A dónde te llevo la risa?</p>
        <h2 className="section-title">Pide tu ciudad</h2>
        <p className="contact__intro">
          Dime dónde vives y cuando arme la próxima gira, tu ciudad ya está en el mapa.
        </p>

        {sent ? (
          <div className="contact__success">
            <span className="contact__success-emoji">🎤</span>
            <p>¡Recibido! Ya anoté tu ciudad. Nos vemos en primera fila.</p>
          </div>
        ) : (
          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="contact__row">
              <label className="field">
                <span>Nombre</span>
                <input
                  required
                  type="text"
                  value={values.nombre}
                  onChange={(e) => setValues((v) => ({ ...v, nombre: e.target.value }))}
                  placeholder="¿Cómo te llamas?"
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  required
                  type="email"
                  value={values.email}
                  onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                  placeholder="tucorreo@ejemplo.com"
                />
              </label>
            </div>

            <label className="field">
              <span>Ciudad donde quieres que haga show</span>
              <input
                required
                type="text"
                value={values.ciudad}
                onChange={(e) => setValues((v) => ({ ...v, ciudad: e.target.value }))}
                placeholder="Ej. Barcelona, Buenos Aires, Houston..."
              />
            </label>

            <label className="field">
              <span>Mensaje (opcional)</span>
              <textarea
                rows={3}
                value={values.mensaje}
                onChange={(e) => setValues((v) => ({ ...v, mensaje: e.target.value }))}
                placeholder="Cuéntame algo, un buen teatro, lo que sea"
              />
            </label>

            <button type="submit" className="btn btn--primary btn--wide" disabled={sending}>
              {sending ? "Enviando..." : "Enviar petición"}
            </button>

            {error && (
              <p className="contact__error">
                Algo falló al enviar tu petición. Intenta de nuevo en un momento.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
