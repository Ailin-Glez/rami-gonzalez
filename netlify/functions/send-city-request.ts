import type { Handler } from "@netlify/functions";

interface CityRequestBody {
  nombre?: string;
  email?: string;
  ciudad?: string;
  mensaje?: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { nombre, email, ciudad, mensaje } = JSON.parse(event.body || "{}") as CityRequestBody;

  if (!nombre || !email || !ciudad) {
    return { statusCode: 400, body: JSON.stringify({ error: "Faltan campos requeridos" }) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;
  const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !notifyEmail) {
    return { statusCode: 500, body: JSON.stringify({ error: "Servidor no configurado" }) };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Rami González Web <${fromEmail}>`,
      to: [notifyEmail],
      reply_to: email,
      subject: `Nueva ciudad solicitada: ${ciudad}`,
      html: `
        <h2>Nueva petición de ciudad</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Ciudad:</strong> ${ciudad}</p>
        <p><strong>Mensaje:</strong> ${mensaje ? mensaje : "(sin mensaje)"}</p>
      `,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return { statusCode: 502, body: JSON.stringify({ error: "No se pudo enviar el email", detail }) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
