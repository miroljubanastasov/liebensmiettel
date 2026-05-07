# Liebensmittel

Pantry / grocery / cooking PWA. React + Vite frontend, Supabase backend.

## Local development

```pwsh
npm install
npx supabase start          # local Postgres at 127.0.0.1:54321
npm run dev                 # https://localhost:5173
```

`.env.local` points to local Supabase. In dev mode `src/lib/supabase.js` routes through the Vite proxy `/supabase-proxy` so the HTTPS dev page can talk to the HTTP local stack without mixed-content errors.

## Cloud Supabase

Project ref: `mcesybzyqlqkcvbgtqwy`.

Apply local migrations to the cloud:

```pwsh
npx supabase link --project-ref mcesybzyqlqkcvbgtqwy
npx supabase db push
```

`.env.production` holds the cloud URL + publishable (anon) key — these are baked into the production bundle. That's fine **only because RLS policies are enabled on every table** (see `supabase/migrations`). The secret/service-role key must never be committed or used in browser code.

## Deploy to GitHub Pages

The site builds to `https://miroljubanastasov.github.io/liebensmiettel/`.

One-time setup:

1. Create the GitHub repo `miroljubanastasov/liebensmiettel` (public, empty — no README).
2. In the repo: **Settings → Pages → Source → GitHub Actions**.
3. (Optional) **Settings → Secrets and variables → Actions** — add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to override the values in `.env.production`.
4. Push to `master`. The workflow at `.github/workflows/deploy.yml` builds and deploys.

The Vite `base` is `/liebensmiettel/` (override with `VITE_BASE=/` for a custom domain). `public/404.html` + the inline script in `index.html` implement the SPA-on-Pages redirect trick so deep links work after refresh.

## Scripts

- `npm run dev` — Vite dev server (HTTPS, LAN-exposed)
- `npm run build` — production build to `dist/`
- `npm run lint`
- `npm run supabase:start` / `:stop` / `:reset`
- `npm run purchase:new|scan|barcodes|prices` — receipt-ingestion pipeline (see `scripts/`)
