# Rami González — sitio web

React + TypeScript + Vite. Incluye hero, sobre mí, videos de YouTube, tickets/shows (Firestore) y un formulario para pedir ciudad, que notifica por email vía Resend usando una Cloud Function.

## Desarrollo

```bash
npm install
cp .env.example .env   # completa las credenciales de Firebase
npm run dev
```

## Notificación por email de "pide tu ciudad" (Resend + Cloud Functions)

El formulario de contacto guarda cada petición en Firestore (`cityRequests`). Una Cloud Function (`functions/`) se dispara al crear el documento y envía un email con [Resend](https://resend.com).

Pasos para activarlo:

1. Instala [firebase-tools](https://firebase.google.com/docs/cli) si no lo tienes: `npm install -g firebase-tools`.
2. El proyecto de Firebase debe estar en el plan **Blaze** (pago por uso) — las Cloud Functions necesitan salida a internet para llamar a Resend. El nivel gratuito de Blaze cubre este uso sin costo con este volumen.
3. Configura el email destino y el remitente:
   ```bash
   cd functions
   cp .env.example .env
   # edita functions/.env con NOTIFY_EMAIL y (opcional) FROM_EMAIL
   ```
4. Guarda tu API key de Resend como secreto de Firebase (no va en `.env`):
   ```bash
   firebase functions:secrets:set RESEND_API_KEY
   ```
5. Despliega:
   ```bash
   firebase deploy --only firestore:rules,functions
   ```

Si usas `FROM_EMAIL=onboarding@resend.dev` (el dominio de pruebas de Resend), los emails solo llegarán a la cuenta dueña del API key. Para recibirlos en cualquier `NOTIFY_EMAIL`, verifica tu propio dominio en Resend y usa un remitente de ese dominio.
