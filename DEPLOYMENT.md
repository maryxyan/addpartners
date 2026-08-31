# Production deployment

The production topology is:

- ROMARG shared hosting: static React frontend
- Railway: Node.js API
- Neon: PostgreSQL
- Railway volume: uploaded property images

## 1. Neon

Create a Neon project with a production branch, database, and application role.
Run `scripts/neon-schema.sql` in the Neon SQL Editor. From **Connect**, enable
connection pooling and copy the pooled URL (its hostname contains `-pooler`).
Keep `sslmode=require&channel_binding=require` in the URL.

To migrate the current local sample/data set instead, import `dump.sql` into an
empty Neon database. Do not run both imports unless duplicate seed data is wanted.
The API also runs idempotent schema checks at startup, so the workflow and gallery
columns are added automatically when deploying over an older database.

Store the pooled URL only as Railway's `DATABASE_URL`; it is not needed by the
current GitHub CI workflow. This keeps production data unavailable to pull-request
jobs. `/api/healthz` executes a database query, so Railway's health check also
verifies that the deployed API can reach Neon.

Optional later enhancement: connect Neon to the GitHub repository and create an
isolated Neon branch for each pull request when database integration tests are
added. That requires a GitHub `NEON_API_KEY` secret and `NEON_PROJECT_ID` variable;
do not point pull-request tests at the production branch.

## 2. Railway API

Create a Railway service from this repository. Railway reads `railway.json`.
Add these variables using `artifacts/api-server/.env.example` as the reference:

- `NODE_ENV=production`
- `DATABASE_URL` (the Neon pooled connection string)
- `FRONTEND_ORIGIN=https://addpartners.ro,https://www.addpartners.ro`
- `ADMIN_PASSWORD` (a long, unique production password; do not use the local development password)
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
$env:VITE_SITE_URL='https://addpartners.ro'
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
- property workflows and slideshow images can be saved from `/admin`;
- create/edit/delete and image upload work;
- Railway has a mounted volume and Neon backups are enabled;
- no `.env`, database dump, or source map is uploaded to `public_html`.

## 5. Release checklist

Before each production release:

```powershell
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm --filter '@workspace/api-server' run build
$env:VITE_API_URL='https://YOUR_RAILWAY_DOMAIN'
$env:VITE_SITE_URL='https://addpartners.ro'
$env:BASE_PATH='/'
$env:PORT='4173'
pnpm --filter '@workspace/terenuri-imobiliare' run build
```

Deploy the API first and wait for `/api/healthz` to return HTTP 200. Then upload
the new frontend build. Keep the previous `public_html` archive until the smoke
tests pass so the static site can be rolled back quickly.

## 6. CI/CD flow

The workflow in `.github/workflows/ci.yml` runs on pull requests and pushes to
`main`. Protect `main` in GitHub and require the **Verify and build** check.

For the Railway API service:

1. Connect `maryxyan/addpartners` and select the `main` branch.
2. Set the build command to `pnpm --filter '@workspace/api-server' run build`.
3. Set the start command to `pnpm --filter '@workspace/api-server' run start`.
4. Set the health-check path to `/api/healthz` and enable **Wait for CI**.
5. Add the production variables above and mount a persistent volume at `/data`.
6. Add `api.addpartners.ro` as the API custom domain, or replace that URL in the
   frontend CI environment with Railway's generated public domain.

After GitHub CI succeeds on `main`, Railway deploys the API. The same CI run
publishes the static frontend as a downloadable artifact. Automating the final
ROMARG upload depends on whether the hosting account supports SSH/SFTP or FTP.
