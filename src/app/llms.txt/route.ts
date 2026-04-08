import { NextResponse } from "next/server";
import { getSiteOrigin } from "@/lib/site-url";

/** Misma URL base que sitemap/robots; se resuelve en build si la env está definida. */
export const dynamic = "force-static";

function baseUrl(): string {
  const origin = getSiteOrigin();
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
}

export function GET() {
  const base = baseUrl();

  const body = `# Descubre Sucre

> Sitio informativo sobre turismo y cultura del departamento de Sucre, Colombia: playas del Golfo de Morrosquillo (Tolú, Coveñas, San Onofre, Islas de San Bernardo), capital Sincelejo, gastronomía caribeña, festivales (por ejemplo Fiestas del 20 de Enero, cultura Zenú y porro), naturaleza y manglares.

El contenido principal está en la página de inicio: secciones de actividades, eventos, agenda cultural, convocatorias, tarjetas promocionales y un mapa de destinos con categorías (playas, cultura, naturaleza, gastronomía). Incluye un asistente de chat orientado a preguntas turísticas sobre Sucre; en algunos entornos las respuestas pueden ser de demostración hasta conectar un backend real.

**Idioma del sitio:** español (Colombia). **Stack:** Next.js (App Router), React, Tailwind CSS.

## Páginas públicas

- [Inicio](${base}/): Landing con todas las secciones de descubrimiento turístico y el asistente conversacional.

## Descubrimiento para sistemas automáticos

- [Sitemap XML](${base}/sitemap.xml): Lista de URLs públicas pensada para buscadores y rastreadores.
- [llm.txt](${base}/llm.txt): Instrucciones y límites para agentes de IA (comportamiento, fuentes y rutas sensibles).

## Optional

- [robots.txt](${base}/robots.txt): Reglas de rastreo; complementa este archivo (robots controla acceso, llms.txt resume el propósito y enlaces útiles para modelos).
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
