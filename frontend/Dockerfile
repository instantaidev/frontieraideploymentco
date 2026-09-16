# --- Build stage: compile the React app with Vite ---
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first so this layer is cached until package files change
COPY package*.json ./
RUN npm ci

# Build the static assets into /app/dist
COPY . .
RUN npm run build


# --- Serve stage: serve the built assets with nginx ---
FROM nginx:1.27-alpine AS serve

# SPA-friendly nginx config (falls back to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]