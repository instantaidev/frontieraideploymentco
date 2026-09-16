# GitHub Actions: build & push Docker image to Artifact Registry on merge to main

## Context

Repo `instantaidev/frontieraideploymentco` (GitHub, public, default branch `main`)
has no `.github/workflows/` yet. The frontend lives in `frontend/` with a working
multi-stage `Dockerfile` (builds via Vite, serves via nginx on port 8080).

Goal: whenever a PR is merged into `main` (i.e. a push lands on `main`), GitHub
Actions should automatically build the Docker image from `frontend/Dockerfile`
and push it to Google Artifact Registry — no manual `gcloud run deploy --source`
step needed for the build/push part.

**Auth approach (confirmed):** Workload Identity Federation (WIF) — no long-lived
JSON key stored in GitHub. GitHub's OIDC token is exchanged at runtime for a
short-lived GCP token, scoped to only this repo.

## Environment (already verified, read-only checks)

- GCP project: `frontier-ai-deployment-company`
- Artifact Registry repo **already exists**: `frontier-ai-deployment-frontend-repo`
  (Docker format, `asia-south1`) — reuse it, no need to create a new one.
- Required APIs already enabled: `artifactregistry.googleapis.com`,
  `iamcredentials.googleapis.com`.
- No Workload Identity Pool exists yet (`0 items`) — must be created.
- No dedicated CI service account exists yet — only the default compute SA.
  Create a purpose-specific one instead of reusing the default.
- `gh` CLI is authenticated as **`instantaidev`** (the repo owner) via SSH git
  protocol, scopes `admin:public_key, gist, read:org, repo` — can be used to set
  repo variables non-interactively (`gh variable set` is API-based, unaffected
  by the missing scope below).
  - **Caveat:** the token lacks the `workflow` scope, which GitHub requires to
    push commits that touch `.github/workflows/*` **over HTTPS with that
    token**. Since git protocol is set to SSH here, pushing the new workflow
    file via a normal `git push` (SSH key auth) should not be blocked. If a
    push of `.github/workflows/build-and-push.yml` is ever rejected with a
    "refusing to allow a Personal Access Token to create or update workflow"
    error, run `gh auth refresh -h github.com -s workflow` to add the scope.

Shell variables used throughout:

```bash
export PROJECT_ID=frontier-ai-deployment-company
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
export REGION=asia-south1
export AR_REPO=frontier-ai-deployment-frontend-repo
export GH_REPO=instantaidev/frontieraideploymentco
export SA_NAME=github-actions-ci
export SA_EMAIL=$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com
export POOL_ID=github-pool
export PROVIDER_ID=github-provider
```

---

## Step 1 — Create a dedicated CI service account

```bash
gcloud iam service-accounts create $SA_NAME \
  --display-name="GitHub Actions CI (build & push images)"
```

Grant it only what it needs — push access to Artifact Registry, nothing else:

```bash
gcloud artifacts repositories add-iam-policy-binding $AR_REPO \
  --location=$REGION \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/artifactregistry.writer"
```

## Step 2 — Create the Workload Identity Pool + Provider

```bash
gcloud iam workload-identity-pools create $POOL_ID \
  --location="global" \
  --display-name="GitHub Actions Pool"

gcloud iam workload-identity-pools providers create-oidc $PROVIDER_ID \
  --location="global" \
  --workload-identity-pool=$POOL_ID \
  --display-name="GitHub OIDC Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
  --attribute-condition="assertion.repository=='$GH_REPO'" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

The `attribute-condition` restricts token exchange to **only** this exact GitHub
repo — a workflow in any other repo cannot mint a token for this SA even if it
tries.

## Step 3 — Allow GitHub Actions (from this repo) to impersonate the CI service account

```bash
gcloud iam service-accounts add-iam-policy-binding $SA_EMAIL \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_ID/attribute.repository/$GH_REPO"
```

Get the full provider resource name (needed by the workflow YAML):

```bash
gcloud iam workload-identity-pools providers describe $PROVIDER_ID \
  --location="global" \
  --workload-identity-pool=$POOL_ID \
  --format="value(name)"
# -> projects/<number>/locations/global/workloadIdentityPools/github-pool/providers/github-provider
```

## Step 4 — Store non-secret config as GitHub Actions repo variables

These aren't secrets (WIF has none to store) but keep the workflow file
portable. Using `gh` CLI (already authenticated):

```bash
gh variable set GCP_PROJECT_ID --repo $GH_REPO --body "$PROJECT_ID"
gh variable set GCP_REGION --repo $GH_REPO --body "$REGION"
gh variable set AR_REPOSITORY --repo $GH_REPO --body "$AR_REPO"
gh variable set GCP_SERVICE_ACCOUNT --repo $GH_REPO --body "$SA_EMAIL"
gh variable set GCP_WORKLOAD_IDENTITY_PROVIDER --repo $GH_REPO \
  --body "projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_ID/providers/$PROVIDER_ID"
```

## Step 5 — Add the workflow file

Create `.github/workflows/build-and-push.yml`:

```yaml
name: Build and Push to Artifact Registry

on:
  push:
    branches: [main]
    paths:
      - "frontend/**"
      - ".github/workflows/build-and-push.yml"

permissions:
  contents: read
  id-token: write   # required for WIF

concurrency:
  group: build-push-main
  cancel-in-progress: false

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        id: auth
        uses: google-github-actions/auth@v2
        with:
          project_id: ${{ vars.GCP_PROJECT_ID }}
          workload_identity_provider: ${{ vars.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ vars.GCP_SERVICE_ACCOUNT }}

      - name: Configure Docker for Artifact Registry
        run: gcloud auth configure-docker ${{ vars.GCP_REGION }}-docker.pkg.dev --quiet

      - name: Set image tags
        id: vars
        run: |
          echo "sha_tag=${GITHUB_SHA::7}" >> "$GITHUB_OUTPUT"
          echo "image=${{ vars.GCP_REGION }}-docker.pkg.dev/${{ vars.GCP_PROJECT_ID }}/${{ vars.AR_REPOSITORY }}/frontend" >> "$GITHUB_OUTPUT"

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: ./frontend
          file: ./frontend/Dockerfile
          push: true
          tags: |
            ${{ steps.vars.outputs.image }}:${{ steps.vars.outputs.sha_tag }}
            ${{ steps.vars.outputs.image }}:latest
```

Notes on the design:
- Triggers only on `push` to `main` with changes under `frontend/**` — a merged
  PR that only touched, say, `plans.md`, won't rebuild the image.
- Tags each image with both the short git SHA (traceable, immutable) and
  `latest` (convenient for manual `gcloud run deploy` without specifying a tag).
- `permissions: id-token: write` is required for the OIDC handshake — without
  it, `google-github-actions/auth` fails.
- No JSON key, no GitHub secret to rotate or leak.

## Step 6 — Verify end-to-end

1. Push the workflow file on a feature branch, open a PR into `main`.
2. Merge the PR — this creates a push event on `main`.
3. `gh run watch --repo $GH_REPO` (or check the Actions tab) — confirm the
   `build-and-push` job goes green.
4. Confirm the image landed:
   ```bash
   gcloud artifacts docker images list \
     $REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO --include-tags
   ```
   Expect both a `<short-sha>` and `latest` tag with a fresh timestamp.
5. Sanity-pull it locally:
   ```bash
   docker pull $REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO/frontend:latest
   ```

## Out of scope (flag if wanted later)

- This workflow only **builds and pushes** — it does not deploy to Cloud Run.
  Adding a `gcloud run deploy --image ...` step after the push is a natural
  follow-on once you're ready to fully automate deployment too.
- No `pull_request`-triggered "does it build" check before merge. Could add a
  separate lightweight job (`docker build`, no push) on `pull_request` if you
  want build failures caught before merge rather than after.

## Files added/changed in this repo

- `.github/workflows/build-and-push.yml` — new
- No changes to `frontend/`, `docker-compose.yml`, or `README.md` needed; the
  existing Dockerfile is used as-is.
