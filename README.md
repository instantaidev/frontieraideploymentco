# Frontier AI Deployment Company

Landing page for **frontierdeploy.co**.

A static React site — company name, a "Coming soon" badge and a "Launching soon."
tagline. There is no backend: no API, no database, nothing to configure.

## Stack

| | |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Production server | nginx 1.27 (alpine) |
| Container | multi-stage Docker build |

## Layout

```
frontend/
  index.html          page shell, title and meta description
  vite.config.js      React plugin; dev server pinned to port 5173
  src/main.jsx        mounts App into #root
  src/App.jsx         the page
  src/index.css       all styling — gradient title, ambient glow, badge
  public/favicon.svg
  Dockerfile          node build stage -> nginx serve stage
  nginx.conf          SPA fallback + cache headers for /assets/
docker-compose.yml    builds and runs the frontend container
```

## Local development

```bash
cd frontend
npm install
npm run dev
```

Opens on http://localhost:5173 with hot reload.

To check the production build:

```bash
npm run build     # writes frontend/dist/
npm run preview   # serves that build locally
```

## Running the container

From the repo root:

```bash
docker compose up --build
```

Then open **http://localhost:8091**.

The container serves on port 80 internally; compose maps it to 8091 on the host.
To stop it: `docker compose down`.

Equivalent without compose:

```bash
cd frontend
docker build -t frontier-ai-frontend .
docker run --rm -p 8091:80 frontier-ai-frontend
```

## How the build works

`frontend/Dockerfile` has two stages. The first uses `node:22-alpine` to run
`npm ci` and `npm run build`, producing static assets in `/app/dist`. The second
copies only those assets into `nginx:1.27-alpine` — the final image contains no
Node runtime and no `node_modules`.

`nginx.conf` does two things worth knowing:

- **SPA fallback** — unknown paths serve `index.html` rather than returning 404,
  so client-side routes will work if any are added later.
- **Asset caching** — everything under `/assets/` is served with a one-year
  immutable cache header. That is safe because Vite fingerprints those
  filenames; `index.html` itself is not cached that way.

## Deployment

Not yet decided. `npm run build` produces a plain static `dist/`, so any static
host will serve it, and the Dockerfile works with any container platform.

One thing to know before choosing: `nginx.conf` hardcodes `listen 80`. Google
Cloud Run requires the container to listen on the port given in the `$PORT`
environment variable, so deploying there means templating that value rather than
hardcoding it. Static hosts and most other container platforms do not care.
