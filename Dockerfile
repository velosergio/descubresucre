# syntax=docker/dockerfile:1

FROM node:24-alpine AS builder
WORKDIR /app

# `postinstall` → prisma generate: el esquema debe existir antes de `npm ci`. Sin `.env` en la imagen.
ENV DATABASE_URL="mysql://build:build@127.0.0.1:3306/build"

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci --legacy-peer-deps

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:24-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN apk update && apk upgrade --no-cache \
  && apk add --no-cache openssl

# Prisma fuera de /app: el standalone de Next no incluye el paquete `prisma`;
# si cargamos prisma.config.ts desde /app, `import "prisma/config"` falla.
WORKDIR /opt/prisma
RUN npm install prisma@7.6.0 dotenv@17.4.1 --no-package-lock

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# `npm run admin:create` en el contenedor (sin tsx; standalone suele no incluir esto para el script)
COPY --from=builder /app/scripts/create-admin.mjs ./scripts/create-admin.mjs
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv
COPY --from=builder /app/node_modules/prompts ./node_modules/prompts
COPY --from=builder /app/node_modules/kleur ./node_modules/kleur
COPY --from=builder /app/node_modules/sisteransi ./node_modules/sisteransi
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/mariadb ./node_modules/mariadb
COPY --from=builder /app/node_modules/denque ./node_modules/denque
COPY --from=builder /app/node_modules/iconv-lite ./node_modules/iconv-lite
COPY --from=builder /app/node_modules/lru-cache ./node_modules/lru-cache
COPY --from=builder /app/node_modules/bcrypt ./node_modules/bcrypt
COPY --from=builder /app/node_modules/node-addon-api ./node_modules/node-addon-api
COPY --from=builder /app/node_modules/node-gyp-build ./node_modules/node-gyp-build

EXPOSE 3000
CMD ["sh", "-c", "cd /opt/prisma && ./node_modules/.bin/prisma migrate deploy && cd /app && exec node server.js"]
