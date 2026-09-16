# Deploy Frontier AI landing page to Cloud Run (asia-south1) with GoDaddy DNS

## Context

The `frontier-ai-deployment-company` repo now contains a static React "Launching
soon" landing page in `frontend/`, served by nginx via `frontend/Dockerfile`, plus
a root `docker-compose.yml` for local runs. The domain `frontierdeploy.co` is
registered at **GoDaddy** and must stay there (DNS managed at GoDaddy).

Goal: deploy the container to **Google Cloud Run** in **asia-south1 (Mumbai)** and
serve it at `https://frontierdeploy.co` and `https://www.frontierdeploy.co` with
automatic TLS, while GoDaddy remains the DNS host.

Because Cloud Run **direct domain mappings are not available in asia-south1**, the
custom domain is fronted by a **Global External Application Load Balancer (ALB)**
with a serverless NEG pointing at the Cloud Run service, and a Google-managed SSL
certificate. GoDaddy just holds `A` records pointing at the load balancer's static
IP.

> **Cost heads-up:** A Global External ALB is **not free** — the forwarding
> rules + LB cost roughly **$18–25/month** even at zero traffic (Cloud Run itself
> still scales to zero and stays ~free). If avoiding that fixed cost matters more
> than Mumbai latency, deploying Cloud Run in `us-central1` and using a **free
> direct domain mapping** instead is the cheaper path. Flag if you want to
> switch; otherwise we proceed with asia-south1 + ALB as chosen.

## Environment (already verified)

- gcloud SDK 584 installed; active account `connect@naturo.fit`; default project
  already set to `frontier-ai-deployment-company`.
- Auth token is **expired** — the first step must be an interactive
  `gcloud auth login` (run it yourself with `! gcloud auth login`).
- Docker 28.5 installed locally; `docker compose config` validates.

Shell variables used throughout:

```bash
export PROJECT_ID=frontier-ai-deployment-company
export REGION=asia-south1
export SERVICE=frontier-ai-web
export DOMAIN=frontierdeploy.co
```

---

## Step 0 — Rewrite README.md to match reality (do this FIRST)

The current `README.md` describes a `web/` + `server/` (Express) + Supabase setup
deployed via Cloud Run **domain mappings**. None of that matches the repo, which is
a static `frontend/` React app served by nginx, run locally via `docker-compose.yml`,
and (per this plan) deployed to Cloud Run in **asia-south1** behind a **Load
Balancer**. Replace `README.md` with content that documents the real setup:

- **Title + intro:** Frontier AI Deployment Company — landing page for
  `frontierdeploy.co`. Stack: React (Vite) built into a static site, served by
  nginx in a container, deployed to Google Cloud Run.
- **Layout section:** describe `frontend/` (Vite app; page lives in
  `frontend/src/App.jsx`), `frontend/Dockerfile` (multi-stage build -> nginx),
  `frontend/nginx.conf`, and root `docker-compose.yml`.
- **Local development:** `cd frontend && npm install && npm run dev`
  (http://localhost:5173); and container run via
  `docker compose up --build` (http://localhost:8091).
- **Deploy to Cloud Run (asia-south1):** the `gcloud run deploy --source ./frontend`
  command from Step 4 below.
- **Custom domain via Load Balancer + GoDaddy:** summarize Steps 5–6 (ALB +
  serverless NEG + managed cert; GoDaddy `A` records to the LB IP). Include the
  **~$18–25/mo ALB cost** note and the us-central1 + domain-mapping cheaper
  alternative.
- **Remove** all Supabase / `server/` / Express / Secret Manager / Search Console
  domain-mapping content that no longer applies.

This is a documentation-only change and can land as its own commit before any
cloud work begins.

## Step 1 — Make the container Cloud-Run-ready (code change)

Cloud Run's contract expects the container to listen on `$PORT` (default **8080**);
our nginx currently listens on **80**. Align it to 8080.

- **`frontend/nginx.conf`** — change `listen 80;` to `listen 8080;`
- **`frontend/Dockerfile`** — change `EXPOSE 80` to `EXPOSE 8080`
- **`docker-compose.yml`** — update the mapping (currently `8091:80`) to
  `8091:8080` so local compose still works after the port change.

Verify locally before touching the cloud:

```bash
docker compose up --build      # then open http://localhost:8091
```

## Step 2 — Auth, project, APIs

```bash
gcloud auth login
gcloud config set project $PROJECT_ID
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  compute.googleapis.com \
  certificatemanager.googleapis.com
```

Confirm billing is linked (ALB + Cloud Build require it):

```bash
gcloud billing projects describe $PROJECT_ID
# if not linked:
# gcloud billing accounts list
# gcloud billing projects link $PROJECT_ID --billing-account=<ACCOUNT_ID>
```

## Step 3 — Create the Artifact Registry repository

`gcloud run deploy --source` needs a Docker repository to push the built image
into. Create one explicitly (rather than relying on any auto-created default)
so it's named and located predictably:

```bash
gcloud artifacts repositories create frontier-ai-repo \
  --repository-format=docker \
  --location=$REGION \
  --description="Container images for Frontier AI landing page"
```

Verify it exists:

```bash
gcloud artifacts repositories list --location=$REGION
```

## Step 4 — Deploy the container to Cloud Run

Cloud Build reads `frontend/Dockerfile` from the `--source` dir and pushes the
built image to the `frontier-ai-repo` repository created above:

```bash
gcloud run deploy $SERVICE \
  --source ./frontend \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --min-instances 0 \
  --max-instances 3
```

The command prints a `https://<hash>-<region>.run.app` URL. **Open it and confirm
the page renders** before wiring up DNS. This isolates "is the app deployed"
from "is the domain wired up".

## Step 5 — Build the Global External ALB in front of Cloud Run

Reserve a global static IP (this is the address GoDaddy will point at):

```bash
gcloud compute addresses create frontier-ai-ip --global
gcloud compute addresses describe frontier-ai-ip --global --format='value(address)'
# note the printed IP -> $LB_IP
```

Serverless NEG -> backend service -> URL map:

```bash
gcloud compute network-endpoint-groups create frontier-ai-neg \
  --region=$REGION --network-endpoint-type=serverless \
  --cloud-run-service=$SERVICE

gcloud compute backend-services create frontier-ai-backend --global
gcloud compute backend-services add-backend frontier-ai-backend --global \
  --network-endpoint-group=frontier-ai-neg \
  --network-endpoint-group-region=$REGION

gcloud compute url-maps create frontier-ai-urlmap \
  --default-service frontier-ai-backend
```

Google-managed SSL cert for both apex and www:

```bash
gcloud compute ssl-certificates create frontier-ai-cert \
  --domains=$DOMAIN,www.$DOMAIN --global
```

HTTPS proxy + forwarding rule (port 443):

```bash
gcloud compute target-https-proxies create frontier-ai-https-proxy \
  --url-map=frontier-ai-urlmap --ssl-certificates=frontier-ai-cert

gcloud compute forwarding-rules create frontier-ai-https-fr \
  --global --target-https-proxy=frontier-ai-https-proxy \
  --address=frontier-ai-ip --ports=443
```

HTTP -> HTTPS redirect (port 80):

```bash
gcloud compute url-maps import frontier-ai-redirect --global <<'EOF'
name: frontier-ai-redirect
defaultUrlRedirect:
  httpsRedirect: true
  redirectResponseCode: MOVED_PERMANENTLY_DEFAULT
EOF

gcloud compute target-http-proxies create frontier-ai-http-proxy \
  --url-map=frontier-ai-redirect

gcloud compute forwarding-rules create frontier-ai-http-fr \
  --global --target-http-proxy=frontier-ai-http-proxy \
  --address=frontier-ai-ip --ports=80
```

## Step 6 — Point GoDaddy DNS at the load balancer

In GoDaddy: **My Products -> frontierdeploy.co -> DNS -> Manage DNS**. Using the
`$LB_IP` from Step 5, create/replace these records (delete GoDaddy's default
parked `A @` and any parked `CNAME www` first):

| Type | Name | Value      | TTL      |
|------|------|------------|----------|
| A    | `@`  | `$LB_IP`   | 600 sec  |
| A    | `www`| `$LB_IP`   | 600 sec  |

(Both apex and www point to the single LB IP; no CNAME needed since the LB gives a
stable anycast IP. GoDaddy can't CNAME the apex anyway, so an `A` record is the
correct choice here.)

## Step 7 — Wait for TLS + verify

The Google-managed cert provisions **automatically once DNS resolves to the LB
IP** — no Search Console TXT step is needed for LB-managed certs. It typically
takes 15 min to a few hours (occasionally up to 24h).

Watch cert status until `ACTIVE`:

```bash
gcloud compute ssl-certificates describe frontier-ai-cert --global \
  --format='value(managed.status, managed.domainStatus)'
```

Check DNS propagation and the live site:

```bash
dig +short frontierdeploy.co
dig +short www.frontierdeploy.co
curl -I https://frontierdeploy.co
curl -I http://frontierdeploy.co        # expect 301 -> https
```

## Redeploying later

Only the app image needs rebuilding; the ALB stays as-is:

```bash
gcloud run deploy $SERVICE --source ./frontend --region $REGION
```

---

## Files changed in this repo

- `README.md` — **rewritten first** (Step 0) to match the real `frontend/` + nginx
  + Cloud Run (asia-south1) + Load Balancer setup; removes stale `web/`/`server/`/
  Supabase/domain-mapping content.
- `frontend/nginx.conf` — listen on 8080
- `frontend/Dockerfile` — `EXPOSE 8080`
- `docker-compose.yml` — host mapping to `:8080` (i.e. `8091:8080`)

## Verification summary

1. Local: `docker compose up --build` -> page at `http://localhost:8091`.
2. Cloud Run: `run.app` URL renders the landing page.
3. ALB: `curl -I https://frontierdeploy.co` returns `200`; HTTP redirects to HTTPS;
   cert status is `ACTIVE`; both apex and www resolve to `$LB_IP`.
