# Three Boys Mart

A local React and Vite demo for a multi-vendor food and grocery delivery platform.

## Run locally

Prerequisite: Node.js 20 or later.

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open `http://localhost:3000`

## Checks

- `npm run lint`
- `npm run build`

## Remote catalog (optional)

Set `VITE_API_URL` in Vercel to the deployed Render URL. On Render, set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `FRONTEND_ORIGIN`. The API reads from the `products` table and uploads images to the public `product-images` storage bucket. Without `VITE_API_URL`, the demo uses its bundled catalog and keeps newly added products in the current session.

## Deployment

- Vercel: build command `npm run build`, output directory `dist`, environment variable `VITE_API_URL`.
- Render: build command `npm install`, start command `npm start`, environment variables from `.env.example`.
- The `vercel.json` SPA rewrite keeps direct `/admin` navigation from returning a 404.