# Contracts: rutas públicas (Eventos y Agenda Cultural)

Lectura anónima. Solo eventos `published = true`. Sin autenticación.

## `GET /` (módulo "Próximos eventos / agenda cultural")

Server Component (`src/app/page.tsx`) obtiene el mes actual vía `getCulturalEventsForMonth({ year, month })` y lo pasa como prop inicial a `HomePage` → `CulturalEventsSection`. 0 eventos ese mes → módulo visible igualmente, con mensaje de estado vacío (no se omite la sección, a diferencia de Imperdibles cuando no hay destinos).

## `GET /api/cultural-events?mes=YYYY-MM`

Route handler público, usado por el módulo (client component) al navegar a otro mes sin recargar la página.

**Query params**:
- `mes` (string, `YYYY-MM`, obligatorio). Fuera de ese formato → `400` con `{ error: "Parámetro 'mes' inválido." }`.

**Respuesta 200**:
```json
{
  "year": 2026,
  "month": 10,
  "events": [
    {
      "id": "…",
      "title": "…",
      "description": "…",
      "category": "…",
      "location": "…",
      "startsAt": "2026-10-05T20:00:00.000Z",
      "endsAt": null,
      "allDay": false,
      "imageUrl": "/uploads/gallery/images/…" ,
      "mapLat": null,
      "mapLng": null
    }
  ]
}
```

Solo eventos con `published = true` y `startsAt` dentro de `[inicio de mes, inicio de mes siguiente)`, ordenados por `startsAt` ascendente. Sin límite de meses hacia atrás/adelante (puede devolver `events: []`).

## `GET /api/cultural-events/{id}/ics`

Descarga del evento en formato `.ics` (RFC 5545) para calendarios tipo iOS/Outlook/etc.

- Evento inexistente o `published = false` → `404`.
- Evento válido → `200`, `Content-Type: text/calendar; charset=utf-8`, `Content-Disposition: attachment; filename="{slug-del-titulo}.ics"`.
- Cuerpo: un único `VEVENT` con `SUMMARY` (título), `DTSTART`/`DTEND` (fecha+hora si `allDay=false`, o `VALUE=DATE` si `allDay=true`), `LOCATION`, `DESCRIPTION` (texto escapado por `buildIcsContent`), `UID` estable (`{id}@descubresucre`).

## Enlace a Google Calendar (sin route handler)

Construido en el cliente/servidor con `buildGoogleCalendarUrl(event)` (`src/lib/calendar-links.ts`) apuntando a `https://calendar.google.com/calendar/render?action=TEMPLATE&...`. No es un endpoint propio del sitio; se renderiza como `<a href="…" target="_blank" rel="noopener noreferrer">`.

## Fuera de contrato

- No hay página de detalle pública por evento (`/eventos/[id]`) en esta versión (research.md §9).
- No hay filtro público por categoría ni búsqueda.
- MapSection y RAG no consumen estos datos todavía (ROADMAP ítems 11/14, fuera de alcance).
