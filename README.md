# Sucre Vivo

Aplicación web de turismo para el departamento de Sucre, Colombia. Presenta destinos, actividades, agenda cultural, eventos, convocatorias y un asistente conversacional enlazado a **n8n** mediante webhooks asíncronos.

Esta primera version se limita a Sincelejo, Tolú, Coveñas, Sampués y Morroa, sin embargo se desea expandir en proximas versiones a más destinos.

## Stack tecnológico

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS + componentes `shadcn/ui` (Radix UI)
- Framer Motion (animaciones)
- Auth.js (NextAuth v5) + Prisma + MySQL/MariaDB
- TanStack React Query (proveedor global listo para consumo de APIs)
- Vitest + Testing Library (tests)

## Arquitectura del proyecto

### Rutas públicas

- `/` → inicio (`src/app/page.tsx` + `HomePage`)
- `/register` → registro (cuenta pendiente de aprobación)
- `/login` → inicio de sesión
- Rutas no definidas → `src/app/not-found.tsx`

La home se compone de secciones (`HeroSection`, `PromoCards`, `ActivitiesSection`, etc.) y un **chat a pantalla completa** (`ChatPanel`) que sustituye el landing con animación al escribir en el hero o al usar el botón flotante.

### Panel de administración (dashboard)

Ruta base: **`/admin`**. El acceso exige sesión; el proxy (`src/proxy.ts`) redirige a `/login` si no hay token.

**Roles (RBAC en base de datos):**

| Rol      | Acceso |
| -------- | ------ |
| `admin`  | Tablero, usuarios, roles y **Configuración** del chatbot (sidebar completo) |
| `editor` | Tablero (`/admin`) con sesión de staff; las rutas de gestión avanzada requieren rol `admin` |

Las rutas `/admin/users`, `/admin/roles` y `/admin/configuracion` validan **`requireAdminSession`** (solo administradores).

**Rutas del dashboard:**

| Ruta                   | Descripción breve                                      |
| ---------------------- | ------------------------------------------------------ |
| `/admin`               | Resumen y datos del usuario conectado (staff)        |
| `/admin/users`         | Usuarios: aprobar/rechazar, roles, edición (**admin**) |
| `/admin/roles`         | CRUD de roles (**admin**)                              |
| `/admin/configuracion` | URL del webhook n8n del chatbot (**admin**)            |

Shell común: `src/components/admin/admin-shell.tsx` (sidebar colapsable, cierre de sesión).

Estados de cuenta: `PENDING` / `APPROVED` / `REJECTED` (flujo descrito en `.env.example`).

### Chatbot (flujo n8n asíncrono)

El cliente **no** llama a n8n directamente: el navegador habla con la API de Next.js, que lee la URL del webhook desde la base de datos y orquesta trabajos (`ChatJob`).

1. El usuario envía mensajes desde `ChatPanel` → `POST /api/chat` con historial y `sessionKey`.
2. El servidor crea un job `PENDING`, reenvía el payload al webhook de n8n (`callbackUrl`, `secret`, `jobId`, `messages`, etc.) y devuelve `{ jobId }`.
3. n8n debe **responder al instante** al webhook (modo “Respond immediately”) y, al terminar el workflow, hacer un **HTTP Request** al callback de la app.
4. El cliente hace **polling** a `GET /api/chat/job/[jobId]` hasta ver `DONE` o `ERROR` (o timeout).

**Rutas API del chat:**

| Método y ruta                    | Uso |
| -------------------------------- | --- |
| `POST /api/chat`                 | Crear job y disparar n8n                           |
| `GET /api/chat/job/[jobId]`      | Estado del job (polling)                         |
| `POST /api/chat/n8n-callback`    | Llamada desde n8n con la respuesta (`reply`/`output` o `error`) |

**Variables de entorno relevantes** (ver `.env.example`):

- `N8N_CALLBACK_SECRET`: secreto compartido; Next lo envía en el payload al webhook y lo exige en el callback (cabecera `X-N8N-Secret` o campo `secret` en JSON).
- `NEXT_PUBLIC_SITE_URL`: origen público de la app; debe ser alcanzable por n8n para `POST` al callback en producción.

**Configuración en admin:** en `/admin/configuracion` el administrador guarda la URL del webhook n8n (tabla `ChatbotSettings`, fila `singleton`).

**Contrato sugerido del callback (JSON):** `{ "jobId": "…", "reply": "markdown o texto", "secret": "…" }` (alternativa: `output` en lugar de `reply`). Para errores: `{ "jobId": "…", "error": "…", "secret": "…" }`.

Modelos Prisma: `ChatbotSettings`, `ChatJob`, enum `ChatJobStatus`.

Estructura base:

```txt
src/
  assets/          # Imágenes y recursos visuales
  components/      # Secciones y componentes de dominio (p. ej. ChatPanel, HeroSection)
  components/ui/   # Componentes UI reutilizables (shadcn)
  components/admin/# Shell del dashboard y formularios de admin
  hooks/           # Hooks compartidos
  lib/             # Utilidades, Prisma, acciones de servidor
  app/             # Rutas y layout (Next.js App Router)
  test/            # Setup y pruebas
```

## Requisitos

- Node.js 20+ recomendado
- npm
- MySQL/MariaDB (p. ej. XAMPP) para Prisma

## Instalación y ejecución local

```bash
npm install
# Configura DATABASE_URL, AUTH_SECRET, N8N_CALLBACK_SECRET (chatbot), NEXT_PUBLIC_SITE_URL si aplica
npx prisma migrate dev
npm run dev
```

La app queda en `http://localhost:3000` por defecto (`next dev`).

Crear primer administrador (tras migraciones y seed de roles):

```bash
npm run admin:create
```

## Scripts disponibles

- `npm run dev`: servidor de desarrollo (Next.js)
- `npm run build`: build de producción
- `npm run start`: servidor de producción (tras `build`)
- `npm run preview`: alias de `next start`
- `npm run lint`: **ESLint CLI** (`eslint .`). No uses `next lint` (deprecado en Next 16+).
- `npm run test`: corre pruebas una vez
- `npm run test:watch`: corre pruebas en modo observación
- `npm run db:migrate` / `db:push` / `db:seed`: Prisma

## Pruebas y calidad

Para validar cambios antes de subirlos:

```bash
npm run lint
npm run test
```

### Suite completa de tests

La suite está dividida por capas:

- `npm run test:unit`: utilidades/reglas puras.
- `npm run test:integration`: rutas API, auth/RBAC y server actions.
- `npm run test:component`: UI crítica con Testing Library.
- `npm run test:e2e`: flujos críticos con Playwright.
- `npm run test:coverage`: reporte de cobertura con Vitest (`html` + `lcov`).
- `npm run test:ci`: pipeline local equivalente a CI.

### Base de datos de pruebas (Prisma real)

1. Crea un archivo `.env.test` (puedes copiar `.env.test.example`).
2. Asegura que `TEST_DATABASE_URL` apunte a una base aislada (ej. `sucre_vivo_test`).
3. Prepara schema+seed para tests:

```bash
npm run test:db:prepare
```

Notas:
- `test:integration` y `test:e2e` cargan variables desde `.env.test`.
- Nunca uses la base de desarrollo como `TEST_DATABASE_URL`.
- Si cambias `prisma/schema.prisma`, vuelve a correr `npm run test:db:prepare`.

## Integraciones y notas técnicas

- El mapa usa OpenStreetMap embebido mediante `iframe`.
- El asistente de chat está integrado con **n8n** (webhook + callback asíncrono); la URL del webhook se configura en el dashboard, no en el cliente público.
- Hay proveedor de React Query configurado globalmente para otras integraciones con API.

## Despliegue

Build con salida `standalone` para contenedores (ver `Dockerfile`):

```bash
npm run build
```

En producción, define `NEXT_PUBLIC_SITE_URL` con el dominio público para que los callbacks de n8n apunten a `/api/chat/n8n-callback`.
