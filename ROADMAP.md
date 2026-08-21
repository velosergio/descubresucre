# Roadmap — Sucre Vivo

## Contenido CMS (hoy mock → admin)

- **Actividades** (“Qué hacer”): CRUD + categorías M-N + fotos (carrusel) + iconos Lucide; en home, slide si hay >5
- **Eventos + Agenda cultural**: unificar; CRUD; listado por mes con navegación; “Agregar a calendario” (Google / iOS)
- **Destinos turísticos**: unir “Qué hacer” + Imperdibles; ajustar vistas y campos
- **Convocatorias**: CRUD con enlaces externos
- **Footer**: quitar datos mock de la Gobernación / teléfonos

## Comunidad

- **Guías del territorio**: formulario público de registro; aprobación en `/admin`
- **Mi viaje / favoritos**: usuarios guardan destinos, actividades y eventos; lista personal (export calendario opcional)

## Agente y datos

- **Respuestas ricas**: mapas, cards de contacto, tickets, etc. (no solo texto)
- **Base de conocimiento (RAG)**: subir textos/descripciones → PGVector → n8n
- **Analytics del chatbot**: volumen, errores, latencia y temas frecuentes en admin

## Oferta turística

- **Rutas e itinerarios**: CRUD día a día enlazando destinos/actividades; vista pública + mapa; sugeribles por el agente

## Prompts Speckit

Copiar tras `/speckit-specify`:

1. Reemplazar el mock de ActivitiesSection por un CMS de actividades “Qué hacer en Sucre”. Admin CRUD de actividades y de categorías (relación M-N: una categoría varios destinos/actividades y viceversa). Cada actividad: título, descripción, 1+ fotos en carrusel, icono Lucide desde un catálogo. En la home: icono + título + descripción; si hay más de 5, carrusel con flechas y autoplay; fondo con imágenes en autoplay.

2. Fusionar EventsSection y CulturalAgenda en un solo módulo de próximos eventos / agenda cultural. Admin CRUD (fecha, lugar, categoría, imagen, descripción). Home: listado por mes con navegación prev/next. Botón “Agregar a calendario” (Google Calendar y equivalente iOS/.ics). Quitar datos hardcodeados.

3. Unificar destinos turísticos: MapSection, Imperdibles y lo que salga de “Qué hacer”. Ajustar modelos/vistas (campos nuevos si hace falta: coords, categorías, enlace a detalle). El mapa y el listado deben leer la misma fuente CMS, no mocks.

4. Convertir ConvocatoriasSection en CMS: CRUD admin (título, descripción, audiencia, tipo, fecha límite, enlace externo obligatorio). Home consume la BD; sin mock.

5. Actualizar Footer: eliminar datos mock de turismo de la Gobernación de Sucre y números de teléfono; dejar solo contenido real/configurable o mínimo institucional.

6. Módulo Guías del territorio: formulario público de registro (datos de contacto, zona, experiencia). Admin en `/admin` aprueba o rechaza (mismo patrón PENDING/APPROVED que usuarios). Solo guías aprobados visibles o contactables.

7. Mi viaje / favoritos: usuarios con sesión pueden guardar destinos, actividades y eventos. Página “Mi viaje” con la lista; opcional exportar a calendario. Requiere auth; sin favoritos anónimos.

8. Ampliar el chatbot (ChatPanel + API + n8n): respuestas no solo texto. Investigar e implementar tipos de bloque (mapa, card de contacto, ticket/enlace) serializados en el job/callback y renderizados en el cliente de forma segura.

9. Base de conocimiento RAG: admin sube personas, comentarios, descripciones u otros textos. Persistir en PGVector (o servicio vectorial) para que el workflow n8n lo use como fuente RAG del asistente. Definir límites de upload y quién puede editar.

10. Analytics del chatbot en `/admin`: métricas de ChatJob (volumen, DONE/ERROR, latencia aproximada) y temas o consultas frecuentes si se pueden derivar. Solo lectura para staff; sin exponer PII innecesaria.

11. Rutas e itinerarios turísticos: CRUD admin de rutas (nombre, duración, días/pasos) enlazando destinos y actividades existentes. Vista pública con mapa; el agente puede sugerir rutas por id o slug cuando existan respuestas ricas / RAG.
