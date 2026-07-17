import { initializeApp } from "firebase-admin/app";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret, defineString } from "firebase-functions/params";
import { logger } from "firebase-functions";

initializeApp();

const resendApiKey = defineSecret("RESEND_API_KEY");
const toEmail = defineString("NOTIFY_EMAIL");
const fromEmail = defineString("FROM_EMAIL", { default: "onboarding@resend.dev" });

interface CityRequest {
  nombre?: string;
  email?: string;
  ciudad?: string;
  mensaje?: string;
}

export const notifyCityRequest = onDocumentCreated(
  { document: "cityRequests/{requestId}", secrets: [resendApiKey] },
  async (event) => {
    const data = event.data?.data() as CityRequest | undefined;
    if (!data) return;

    const { nombre, email, ciudad, mensaje } = data;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey.value()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Rami González Web <${fromEmail.value()}>`,
        to: [toEmail.value()],
        reply_to: email,
        subject: `Nueva ciudad solicitada: ${ciudad ?? "sin especificar"}`,
        html: `
          <h2>Nueva petición de ciudad</h2>
          <p><strong>Nombre:</strong> ${nombre ?? "-"}</p>
          <p><strong>Email:</strong> ${email ?? "-"}</p>
          <p><strong>Ciudad:</strong> ${ciudad ?? "-"}</p>
          <p><strong>Mensaje:</strong> ${mensaje ? mensaje : "(sin mensaje)"}</p>
        `,
      }),
    });

    if (!res.ok) {
      logger.error("Resend error", { status: res.status, body: await res.text() });
    }
  },
);
