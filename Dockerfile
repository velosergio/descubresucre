# syntax=docker/dockerfile:1

FROM node:26-alpine AS builder
WORKDIR /app

# URL ficticia solo para `prisma generate`: prisma.config.ts exige DATABASE_URL. Sin `.env` en la imagen.
ENV DATABASE_URL="mysql://build:build@127.0.0.1:3306/build"

# `.npmrc` (ignore-scripts=true) se copia aquí a propósito: el build usa la misma política que local.
# Por eso `prisma generate` es explícito — ningún `postinstall` lo ejecuta.
COPY package.json package-lock.json .npmrc ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci && npx prisma generate

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:26-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN apk update && apk upgrade --no-cache \
  && apk add --no-cache openssl

# Prisma fuera de /app: el standalone de Next no incluye el paquete `prisma`;
# si cargamos prisma.config.ts desde /app, `import "prisma/config"` falla.
# Las versiones se leen del lock, no se fijan a mano: así el CLI de migraciones nunca
# se desincroniza del cliente generado en el builder.
WORKDIR /opt/prisma
COPY --from=builder /app/package-lock.json /tmp/package-lock.json
RUN PRISMA_VERSION="$(node -p "require('/tmp/package-lock.json').packages['node_modules/prisma'].version")" \
  && DOTENV_VERSION="$(node -p "require('/tmp/package-lock.json').packages['node_modules/dotenv'].version")" \
  && npm install "prisma@${PRISMA_VERSION}" "dotenv@${DOTENV_VERSION}" --no-package-lock

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Lo que el trace del standalone no incluye: Prisma con su driver (los usa la app en runtime)
# y las dependencias de `scripts/create-admin.mjs`. Se piden por nombre y npm resuelve las
# transitivas —mariadb, denque, kleur…—, así que mover una dependencia entre directa y
# transitiva en package.json ya no rompe la imagen. Versiones, otra vez, leídas del lock.
WORKDIR /opt/extra-deps
RUN PKGS="$(node -e "const p=require('/tmp/package-lock.json').packages; const names=['@prisma/client','@prisma/adapter-mariadb','bcrypt','prompts','dotenv']; console.log(names.map((n) => n + '@' + p['node_modules/' + n].version).join(' '))")" \
  && npm install --no-package-lock --no-save --ignore-scripts ${PKGS} \
  && rm /tmp/package-lock.json

WORKDIR /app
# Primero las dependencias extra: el standalone se copia después y gana en caso de solape,
# para no alterar el árbol que Next resolvió en el build.
RUN mkdir -p node_modules \
  && cp -r /opt/extra-deps/node_modules/. ./node_modules/ \
  && rm -rf /opt/extra-deps

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Crear directorios para uploads - agregar nuevas carpetas de ser necesario
RUN mkdir -p /app/public/uploads/hero/images \
  /app/public/uploads/hero/video \
  /app/public/uploads/gallery/images \
  /app/public/uploads/gallery/video

# Código del proyecto que el standalone no arrastra: el script admin (se ejecuta con
# `node scripts/create-admin.mjs`, sin tsx) y el cliente Prisma generado, que la app importa
# como `@/generated/prisma/client`. Sus dependencias ya se instalaron arriba.
COPY --from=builder /app/scripts/create-admin.mjs ./scripts/create-admin.mjs
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma

EXPOSE 3000
CMD ["sh", "-c", "cd /opt/prisma && ./node_modules/.bin/prisma migrate deploy && cd /app && exec node server.js"]
