# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexto

**Sucre Vivo / DescubreSucre**: sitio de turismo del departamento de Sucre (Colombia) con panel de administración y un asistente conversacional enlazado a **n8n**. Next.js 16 (App Router) + React 19 + TypeScript + Prisma 7 sobre MySQL/MariaDB (XAMPP en local). La UI y los mensajes al usuario están en **español**; mantén ese idioma en copy, comentarios y errores visibles.

## Comandos

```bash
npm run dev              # servidor de desarrollo (localhost:3000)
npm run build            # build de producción (output: standalone)
npm run lint             # Biome check --write (lint + format con autofix)
npm run format           # solo formato
npx biome check .        # verificación sin escribir (lo que corre en CI)
```

Base de datos:

```bash
npm run db:migrate       # prisma migrate dev
npm run db:generate      # regenera el cliente en src/generated/prisma
npm run db:seed          # solo crea roles admin/editor
npm run admin:create     # crea el primer usuario admin (interactivo)
```

Tests (por capas; `test:integration`, `test:e2e` y `test:coverage` cargan `.env.test` vía `node --env-file`):

```bash
npm run test:unit         # utilidades puras
npm run test:integration  # rutas API, auth/RBAC, server actions (Prisma real)
npm run test:component    # UI crítica con Testing Library
npm run test:e2e          # Playwright (levanta `npm run dev` solo si no hay servidor)
npm run test:ci           # equivalente local a CI: biome + unit + integration + component + e2e
npm run test:db:prepare   # migrate deploy + seed sobre TEST_DATABASE_URL
```

Un solo test / un solo caso:

```bash
npx vitest run src/lib/hero-appearance.test.ts
npx vitest run src/test/components/chat-panel.component.test.tsx -t "nombre del caso"
node --env-file=.env.test ./node_modules/vitest/vitest.mjs run src/test/integration/chat-api.integration.test.ts
node --env-file=.env.test ./node_modules/@playwright/test/cli.js test e2e/critical-flows.spec.ts -g "chatbot"
```

Notas operativas:

- `.npmrc` tiene `ignore-scripts=true` (decisión deliberada de cadena de suministro). Por eso **no existe** un `postinstall`: `prisma generate` se invoca siempre de forma explícita — `npm run setup` en un clone nuevo, o `npm run db:generate` tras tocar el schema. Los hooks `pre`/`post` de npm tampoco se ejecutan con esa flag, así que no intentes resolverlo con un `predev`/`prebuild`.
- Si al arrancar falta `@/generated/prisma/client`, es que nadie corrió `db:generate`. Distinto es "Cannot read properties of undefined" en un delegado (p. ej. `chatbotSettings`): eso es el cliente cacheado que documenta `src/lib/prisma.ts`, y también se cura regenerando.
- `src/generated/prisma` está en `.gitignore`: es artefacto, nunca se edita ni se commitea.
- Los tests de integración **se saltan solos** (`describe.skip`) si falta `TEST_DATABASE_URL`; un run "verde" sin `.env.test` no prueba nada. Tras tocar `prisma/schema.prisma`, vuelve a correr `npm run test:db:prepare`.

## Arquitectura

### Autorización: tres puertas, no una

1. `src/proxy.ts` — en Next 16 el middleware se llama **proxy**. Solo hace un chequeo barato de cookie (`getToken`) sobre `/admin/:path*` y redirige a `/login`. No consulta la base de datos ni valida roles.
2. `src/lib/auth-helpers.ts` — la autorización real, en Server Components:
   - `requireStaffSession()` → `admin` o `editor` (usada en `src/app/admin/layout.tsx`).
   - `requireAdminSession()` → solo `admin`; se aplica en layouts de sección (`personalizar/layout.tsx`, `users/layout.tsx`, `roles/layout.tsx`, `configuracion/layout.tsx`), no página por página.

   Ambas redirigen a `/cuenta/pendiente` o `/cuenta/rechazada` según `accountStatus`.
3. `assertAdminAction()` — para **server actions**; no redirige, devuelve `{ ok: false, error }`. Toda server action mutante empieza con esta llamada: el layout no protege una action invocada directamente.

Los roles viven en la tabla `Role` (M-N con `User`), se cargan al JWT en el callback `jwt` de `src/auth.ts` y se exponen en `session.user.roles`. El evento `createUser` asigna `editor` + `PENDING` a toda cuenta nueva (incluidas las de Google OAuth), por lo que registrarse nunca otorga acceso inmediato.

### Chatbot: jobs asíncronos con n8n

El navegador nunca ve la URL del webhook; vive en la fila `singleton` de `ChatbotSettings` y solo se lee en servidor.

`POST /api/chat` (valida con Zod, crea `ChatJob` PENDING, hace `fetch` al webhook con `{ jobId, messages, callbackUrl, secret }`, timeout 15 s) → n8n responde de inmediato y luego llama `POST /api/chat/n8n-callback` → el cliente hace polling a `GET /api/chat/job/[jobId]` hasta `DONE`/`ERROR` (`POLL_MAX_MS = 120_000` en `ChatPanel.tsx`).

El callback autentica con `N8N_CALLBACK_SECRET` (cabecera `X-N8N-Secret` o campo `secret`), acepta `reply` u `output`, y es idempotente: si el job ya no está `PENDING` devuelve `ok` sin tocar nada. `getPublicOriginFromRequest()` (`src/lib/site-url.ts`) construye el `callbackUrl`: en producción **debe** existir `NEXT_PUBLIC_SITE_URL` alcanzable desde n8n.

### Medios: disco local, no CDN

Las subidas se guardan en `public/uploads/{hero,gallery}/{images,video}` (contenido gitignorado, `.gitkeep` conservado) y las imágenes se transcodifican a WebP con `sharp` (`src/lib/encode-image-webp.ts`). Se sirven por `GET /api/media?src=/uploads/...` — usa siempre `toServedMediaUrl()` (`src/lib/media-url.ts`) al renderizar, no la ruta cruda.

Toda ruta de disco se valida con el mismo patrón defensivo (prefijo `/uploads/...` esperado **y** rechazo de `..`); replícalo en cualquier código nuevo que toque el sistema de archivos. Como la BD puede quedar desincronizada del disco, `mapExistingGalleryRowsToDTO` / `collectGalleryOrphanIds` (`src/lib/gallery-assets.ts`) filtran huérfanos antes de mostrar la galería.

Límites en `src/lib/upload-limits.ts` (8 MB imagen / 80 MB vídeo) alineados con `serverActions.bodySizeLimit: "8mb"` en `next.config.ts`: si cambias uno, cambia el otro.

### Contenido configurable desde el admin

`HeroAppearanceSettings`, `ImperdiblesSectionSettings` y `ChatbotSettings` son tablas de **fila única con `id: "singleton"`** (siempre `upsert`, nunca `create`). La lógica de resolución vive en funciones puras y testeables separadas del acceso a datos: `resolveHeroFromRow()` en `src/lib/hero-appearance.ts` degrada a `IMAGE_DEFAULT` ante cualquier configuración inválida en vez de fallar, y `getResolvedHeroConfig()` incluso tolera la tabla ausente (Prisma `P2021`, migración pendiente). Mantén esa separación: transformaciones puras en `src/lib/*.ts` con su `*.test.ts` al lado, I/O en `src/lib/actions/*.ts`.

### Server actions

Viven en `src/lib/actions/`, con `"use server"`, y siguen el contrato `{ ok: true, ... } | { ok: false, error: string }` (nunca lanzan al cliente). Patrón: `assertAdminAction()` → validar con Zod → Prisma → `revalidatePath()` de las rutas afectadas (pública y de admin).

### Cliente Prisma

`src/lib/prisma.ts` reutiliza el singleton global **solo en producción**; en desarrollo crea uno nuevo por deliberación explícita, para que un cliente cacheado no quede sin delegados tras `prisma generate`. No "optimices" eso a un singleton único.

## Contenedor (Docker → EasyPanel)

Build multi-etapa con `output: "standalone"`. Dos cosas no evidentes:

- El trace del standalone **no** incluye `@prisma/client`, el adapter ni `mariadb`, aunque la app los usa en runtime. El runner los instala con `npm install` (etapa `/opt/extra-deps`, fusionada en `/app/node_modules` antes de copiar el standalone, que gana en caso de solape). No vuelvas a copiar rutas de `node_modules` a mano: se rompen cada vez que una dependencia pasa de directa a transitiva.
- Todas las versiones del runner se leen de `package-lock.json` en tiempo de build, para que el CLI de migraciones no se desincronice del cliente generado. El CLI vive en `/opt/prisma`, fuera de `/app`, porque `prisma.config.ts` hace `import "prisma/config"` y el standalone no trae ese paquete.

Para probar la imagen en local: dentro del contenedor usa `127.0.0.1`, no `localhost` (Next escucha en IPv4 y `localhost` resuelve a `::1`).

## Convenciones

- **Biome** (no ESLint/Prettier): comillas dobles, punto y coma, comas finales, ancho 100, indent 2 espacios. `src/components/ui/**` (shadcn) y `src/test/**` tienen reglas relajadas en `biome.json`; no reformatees `src/components/ui` a mano.
- TypeScript con `strict: false` pero `strictNullChecks: true`. Alias `@/*` → `src/*`.
- Tests colocados junto al código para utilidades (`src/lib/x.ts` + `src/lib/x.test.ts`) y en `src/test/{unit,integration,components}` para el resto. La cobertura tiene umbrales (`vitest.config.ts`) y solo mide `src/app/api/**` y `src/lib/**`.
- Componentes de dominio en `src/components/*.tsx` (PascalCase), admin en `src/components/admin/*.tsx` (kebab-case), primitivos shadcn en `src/components/ui/`.
- Tailwind con tokens HSL sobre variables CSS (`--primary`, `--background`, …) y fuentes `font-display` / `font-body`. Usa los tokens, no colores literales.

## Spec Kit

El repo usa Spec Kit: `specs/NNN-nombre/` documenta cada feature y `.specify/memory/constitution.md` fija los principios normativos del proyecto (pruebas proporcionales al riesgo, validación en todos los límites, secretos solo por entorno, logs con contexto en rutas críticas). Las skills `speckit-*` implementan el flujo `specify → plan → tasks → implement`. Al añadir una feature con impacto en autenticación, persistencia o integraciones, la constitución exige pruebas automatizadas.
