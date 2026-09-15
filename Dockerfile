# syntax=docker/dockerfile:1

# Landing de Arauca (React + Vite). Se compila a estaticos y se sirve con
# nginx -- mismo patron que Casino-cucuta/Clients-innova, simplificado: sin
# TLS propio (lo termina el Nginx del host) y sin llamadas a ninguna API
# (este frontend hoy no tiene backend propio).

# --- Compilacion ------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

# Version de pnpm fijada igual que .mise.toml, para que el lockfile resuelva
# exactamente igual dentro y fuera del contenedor.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare pnpm@10.34.3 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# vite.config.ts ya lee FIGMA_PUBLIC_URL para fijar `base` (heredado del
# scaffolding de Figma Make); se reusa el mismo nombre en vez de inventar
# uno nuevo. Vacio = base '/' (landing-principal, en la raiz). Para las
# landings bajo subpath se pasa p.ej. FIGMA_PUBLIC_URL=/arauca.
ARG FIGMA_PUBLIC_URL=""
ENV FIGMA_PUBLIC_URL=$FIGMA_PUBLIC_URL
RUN pnpm build

# --- Imagen final -----------------------------------------------------------
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/healthz || exit 1
