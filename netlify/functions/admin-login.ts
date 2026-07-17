import type { Handler } from "@netlify/functions";

interface LoginBody {
  password?: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { password } = JSON.parse(event.body || "{}") as LoginBody;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { statusCode: 500, body: JSON.stringify({ error: "Servidor no configurado" }) };
  }

  if (password !== adminPassword) {
    return { statusCode: 401, body: JSON.stringify({ error: "Contraseña incorrecta" }) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
