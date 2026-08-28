# Production deployment

The production topology is:

- ROMARG shared hosting: static React frontend
- Railway: Node.js API
- Neon: PostgreSQL
- Railway volume: uploaded property images

## 1. Neon

Create a Neon project and run `scripts/neon-schema.sql` in the Neon SQL Editor.
Copy the pooled connection string. Keep `sslmode=require` in the URL.

To migrate the current local sample/data set instead, import `dump.sql` into an
empty Neon database. Do not run both imports unless duplicate seed data is wanted.

## 2. Railway API

Create a Railway service from this repository. Railway reads `railway.json`.
Add these variables using `artifacts/api-server/.env.example` as the reference:

- `NODE_ENV=production`
- `DATABASE_URL` (the Neon pooled connection string)
- `FRONTEND_ORIGIN=https://YOUR_DOMAIN,https://www.YOUR_DOMAIN`
- `ADMIN_PASSWORD` (a unique admin password)
- `SESSION_SECRET` (at least 32 random characters)
- `UPLOAD_DIR=/data/uploads`

Railway supplies `PORT`; do not set it manually. Add a Railway volume mounted at
`/data`, then generate a public Railway domain. Confirm that
`https://YOUR_RAILWAY_DOMAIN/api/healthz` returns `{ "status": "ok" }`.

Without the volume, uploaded files disappear after a redeploy.

## 3. Build the ROMARG frontend

From the repository root in PowerShell:

```powershell
$env:VITE_API_URL='https://YOUR_RAILWAY_DOMAIN'
$env:BASE_PATH='/'
$env:PORT='4173'
pnpm --filter '@workspace/terenuri-imobiliare' run build
```

Upload the **contents** of `artifacts/terenuri-imobiliare/dist/public` to the
domain's `public_html` directory in cPanel. The generated `.htaccess` enables
client-side routes such as `/admin`.

Enable the free AutoSSL certificate in cPanel and force HTTPS. Test both the
public inquiry form and `/admin` after DNS and TLS are active.

## 4. DNS and final checks

Point the domain to the ROMARG hosting account. The browser talks directly from
the ROMARG site to Railway, so the final domain must exactly match one of the
origins in `FRONTEND_ORIGIN` (scheme included, no path).

Before launch, verify:

- homepage, filters and property details work over HTTPS;
- contact forms create inquiries;
- `/admin` rejects a wrong password and accepts the configured password;
- create/edit/delete and image upload work;
- Railway has a mounted volume and Neon backups are enabled;
- no `.env`, database dump, or source map is uploaded to `public_html`.
