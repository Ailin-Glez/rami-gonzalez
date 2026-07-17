# Rami González — sitio web

React + TypeScript + Vite. Incluye hero, sobre mí, videos de YouTube, tickets/shows (Firestore) y un formulario para pedir ciudad que notifica por email vía Resend usando una Netlify Function.

## Desarrollo

```bash
npm install
cp .env.example .env   # completa las credenciales de Firebase
npm run dev
```

## Notificación por email de "pide tu ciudad" (Resend + Netlify Functions)

El formulario de contacto llama a `/api/send-city-request`, que Netlify enruta a la función en `netlify/functions/send-city-request.ts`. Esa función llama a la API de Resend con la API key guardada como variable de entorno del lado del servidor (nunca en el navegador). El tier gratuito de Netlify incluye funciones serverless sin necesidad de tarjeta de crédito.

Pasos para activarlo:

1. Sube el repo a GitHub (ya está) y conéctalo en [app.netlify.com](https://app.netlify.com) como "Import from Git" — Netlify detecta `netlify.toml` automáticamente (build: `npm run build`, publish: `dist`, functions: `netlify/functions`).
2. En **Site settings → Environment variables** agrega:
   - `RESEND_API_KEY`: tu API key de Resend
   - `NOTIFY_EMAIL`: el email donde Rami quiere recibir las peticiones
   - `FROM_EMAIL` (opcional): remitente verificado en Resend. Si lo dejas vacío usa `onboarding@resend.dev`, el dominio de pruebas de Resend, que solo entrega a la cuenta dueña del API key.
3. Vuelve a desplegar (o espera al próximo push) para que la función tome las variables.

### Probar localmente

```bash
npm install -g netlify-cli
netlify dev
```

`netlify dev` levanta Vite y las funciones juntos y lee variables desde `netlify env` o un `.env` local — copia `netlify/functions/.env.example` y complétalo para probar sin tocar producción.
