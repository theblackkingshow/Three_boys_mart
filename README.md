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

For a Vercel frontend, set `VITE_API_URL` to the deployed Render URL. For a single Render deployment, `render.yaml` builds and serves the frontend with the API on the same origin automatically.

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` on Render. The API reads from the `products` table and uploads images to the public `product-images` storage bucket. Set `COURIER_PROVIDER` to `Perth Connect Delivery` to show that delivery partner in checkout quotes. A real courier dispatch integration also needs that provider's API credentials and documentation.

## Deployment

- Vercel: build command `npm run build`, output directory `dist`, environment variable `VITE_API_URL`.
- Render: build command `npm install && npm run build`, start command `npm start`, environment variables from `.env.example`.
- The `vercel.json` SPA rewrite keeps direct `/admin` navigation from returning a 404.