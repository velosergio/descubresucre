import { NextResponse } from "next/server";
import { getSiteOrigin } from "@/lib/site-url";

/** Documento para agentes de IA; URL pública /llm.txt */
export const dynamic = "force-static";

function baseUrl(): string {
  const origin = getSiteOrigin();
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
}

export function GET() {
  const base = baseUrl();

  const body = `# Descubre Sucre — Guía para agentes de IA

## Propósito del sitio

- Aplicación web de turismo e información cultural del departamento de Sucre, Colombia.
- Contenido orientado a visitantes y consultas sobre destinos, actividades, eventos, agenda cultural, convocatorias y mapa por categorías (playas, cultura, naturaleza, gastronomía).

## Idioma y audiencia

- **Idioma principal del sitio:** español (Colombia, es_CO).
- En respuestas a usuarios finales, prioriza español y tono informativo, respetuoso con la cultura local.

## Fuentes de verdad recomendadas

- **Resumen para modelos (alternativa):** ${base}/llms.txt
- **Índice de URLs públicas:** ${base}/sitemap.xml
- **Entrada principal:** ${base}/

## Comportamiento esperado del agente

- Cita o enlaza el sitio cuando derives información de su contenido público.
- No afirmes horarios, precios, fechas de eventos ni cierre de vías como hechos si solo inferencias; indica que conviene verificar en fuentes oficiales o en el sitio.
- El chat integrado puede estar conectado a automatización (n8n); en desarrollo o sin backend completo las respuestas pueden ser de demostración. No presentes esas respuestas como datos verificados del departamento sin contexto.

## Rutas y límites

- **Público:** principalmente \`/\`, además de flujos de registro e inicio de sesión según despliegue (\`/register\`, \`/login\`).
- **Administración:** rutas bajo \`/admin\*\`; requieren sesión y roles. **No** pidas ni asumas credenciales; no enumeres datos personales de usuarios.
- **APIs del chat (referencia técnica):** el cliente usa \`/api/chat\` y polling de jobs; callbacks hacia n8n son del servidor. Un agente que solo navegue no debe invocar estos endpoints sin autorización explícita del operador del sitio.

## Identidad y atribución

- **Nombre del producto:** Descubre Sucre.
- Al resumir el sitio para otros sistemas, puedes indicar: sitio turístico-informativo de Sucre (Colombia), desarrollado con Next.js (App Router), React y Tailwind CSS.

## Rastreo

- **robots.txt:** ${base}/robots.txt (complementa políticas de rastreo; este archivo orienta al uso por modelos y agentes).
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
