# Frontier AI Deployment Company

Landing page for **frontierdeploy.co**.

Stack: React (Vite) + Node (Express) + Supabase, deployed as a single container on Google Cloud Run.

## Layout

```
web/      React app (Vite). The landing page lives in web/src/App.jsx
server/   Express server: /api/* routes + serves the built React app
Dockerfile  Multi-stage build -> one container that Cloud Run runs
```

The server serves the React build from `server/public`, which the Docker build
populates from `web/dist`. Any non-`/api/*` path falls back to `index.html`.

## Local development

Two terminals:

```bash
cd server && npm install && npm run dev   # http://localhost:8080
cd web    && npm install && npm run dev   # http://localhost:5173
```

Open http://localhost:5173. Vite proxies `/api` to the Node server, so the front
end calls the same paths it will call in production.

If something else on your machine already owns port 8080, point both sides at a
free port instead:

```bash
cd server && PORT=8099 npm run dev
cd web    && API_PORT=8099 npm run dev
```

To test the real production container:

```bash
docker build -t frontierdeploy:test .
docker run --rm -p 8099:8080 frontierdeploy:test
# http://localhost:8099
```

## Supabase

The server reads `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (see
`server/.env.example`). Until they are set, `getSupabase()` returns `null` and
`/api/health` reports `"supabase": "not-configured"` — the landing page does not
need them.

The service role key bypasses row-level security, so it must stay server-side.
Never put it in `web/`. In production it is injected from Secret Manager.

## Deploying to Google Cloud Run

Set your variables once per shell:

```bash
export PROJECT_ID=frontierdeploy
export REGION=asia-south1
export SERVICE=frontierdeploy-web
```

### 1. Create the project and enable billing

```bash
gcloud auth login
gcloud projects create $PROJECT_ID --name="Frontier AI Deployment Company"
gcloud config set project $PROJECT_ID
```

Link a billing account in the console (Billing -> Link a billing account), or:

```bash
gcloud billing accounts list
gcloud billing projects link $PROJECT_ID --billing-account=<ACCOUNT_ID>
```

### 2. Enable the APIs

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
  artifactregistry.googleapis.com secretmanager.googleapis.com
```

### 3. Deploy

```bash
gcloud run deploy $SERVICE \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 3
```

Cloud Build sees the `Dockerfile`, builds it, pushes to Artifact Registry, and
Cloud Run starts the container. The command prints a `*.run.app` URL — open it
and confirm the page renders before touching DNS.

Cloud Run sets `PORT`; `server/src/index.js` already honours it.

### 4. Add Supabase secrets (when the app needs them)

```bash
echo -n "https://<ref>.supabase.co" | gcloud secrets create SUPABASE_URL --data-file=-
echo -n "<service-role-key>"        | gcloud secrets create SUPABASE_SERVICE_ROLE_KEY --data-file=-

PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
for S in SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY; do
  gcloud secrets add-iam-policy-binding $S \
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role=roles/secretmanager.secretAccessor
done

gcloud run services update $SERVICE --region $REGION \
  --set-secrets=SUPABASE_URL=SUPABASE_URL:latest,SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest
```

### 5. Point frontierdeploy.co at the service

Verify the domain first (one-time), at
https://search.google.com/search-console — add `frontierdeploy.co` as a domain
property and complete the TXT record it asks for.

```bash
gcloud beta run domain-mappings create --service $SERVICE \
  --domain frontierdeploy.co --region $REGION
gcloud beta run domain-mappings create --service $SERVICE \
  --domain www.frontierdeploy.co --region $REGION
```

Each command prints the DNS records to add at your registrar: A + AAAA records
for the apex, a CNAME for `www`. Add them, then wait for propagation. Google
provisions the TLS certificate automatically once DNS resolves — that step can
take anywhere from 15 minutes to a few hours.

If domain mappings are unavailable in `$REGION`, use a global external
Application Load Balancer with a serverless NEG pointing at the Cloud Run
service instead.

### Redeploying

```bash
gcloud run deploy $SERVICE --source . --region $REGION
```

### Cost

At zero traffic with `--min-instances 0` the service scales to zero and stays
within the Cloud Run free tier. Artifact Registry storage for the images is the
only steady cost, in cents per month.
