# Research: CMS «Qué hacer en Sucre»

## 1. Catálogo propio vs reutilizar hubs Sucre Natural

**Decision**: Tablas nuevas `QueHacerActivity` y `QueHacerCategory`. No convertir `SucreNaturalHub` ni `NatureExperience` en este CMS.

**Rationale**: FR-017 y el prompt 3 piden CRUD de actividades **y** categorías M-N con destinos. Los siete hubs son un catálogo cerrado de naturaleza (prompt 2); «Qué hacer» es oferta de la home, abierta a Cultura/Gastronomía/etc. Fusionarlos rompería paletas, rutas `/sucre-natural/[hub]` y el material de las fichas.

**Alternatives considered**: «Qué hacer = hubs CRUD» (memoria de una conversación previa). Rechazado: el spec actual es explícito y el usuario reafirmó el prompt 3 original. Meter actividades como `NatureExperience` ensucia el hub naranja.

## 2. Tres relaciones M-N, no una sola vía categoría

**Decision**:

- Categoría ↔ Actividad
- Categoría ↔ Destino (`ImperdibleDestination`)
- Actividad ↔ Destino (enlace explícito «cuando aplique»)

**Rationale**: FR-003 cubre taxonomía compartida; FR-011 el enlace navegable. Compartir categoría no implica que toda playa salga en la ficha de «Playas»: eso sería ruido. El enlace explícito es el CTA público; la categoría etiqueta y agrupa en admin.

**Alternatives considered**: Solo M-N categoría↔actividad y categoría↔destino, derivar destinos de la actividad por categoría compartida (demasiados enlaces no editoriales). Solo actividad↔destino sin categorías (incumple el prompt).

## 3. Ficha pública `/que-hacer/[slug]`

**Decision**: Una página pública por actividad. La home no anida el carrusel de fotos de cada ítem. La tarjeta enlaza a la ficha; la ficha enlaza a `/imperdibles/[slug]` de destinos publicados.

**Rationale**: FR-007/008. Tres carruseles en la sección (fotos por tarjeta + tarjetas + fondo) sería ilegible. El slug queda listo para itinerarios/favoritos (FR-018).

**Alternatives considered**: Solo home, clic al primer destino (falla si no hay destino). Modal/lightbox (peor para compartir URL y para teclado).

## 4. Pictogramas: catálogo cerrado en código

**Decision**: `src/lib/que-hacer-icons.ts`: mapa `iconKey →` componente Lucide + etiqueta en español. Admin elige de esa lista (Select), nunca un string libre. Claves estables (`waves`, `palette`, `utensils-crossed`, `tree-pine`, `heart`, …). Resolución pública: si la clave desaparece, icono de reserva (`compass`) + título visible.

**Rationale**: FR-009, NFR-005. Lucide ya está en el sitio; el spec pide catálogo, no los 1500 iconos (bundle y UX). `optimizePackageImports` de Next cubre Lucide.

**Alternatives considered**: Import dinámico de cualquier nombre Lucide (inyección de claves, tree-shaking peor, admin frágil). SVG subidos por el staff (otro almacén de medios).

## 5. Fotos: misma galería + tabla de ítems

**Decision**: `QueHacerActivityPhoto` (`publicUrl`, `sortOrder`, `alt`, `isCover`) con URLs `/uploads/gallery/images/...`. Picker/subida existentes. Máximo 12 fotos. Publicar exige ≥1 foto cuya ruta exista en disco (mismo filtro de huérfanos que Imperdibles). Foto de tarjeta/fondo: `isCover === true` o, si ninguna, la de menor `sortOrder`. Borrar de galería se bloquea si la URL está en fotos de actividades.

**Rationale**: FR-010/020, patrón `ImperdibleGalleryItem` + `isGalleryUrlUsedBySucreNatural`.

**Alternatives considered**: JSON `photoUrls[]` en la actividad (más difícil bloquear delete). Copiar archivos fuera de galería (rompe el CMS de medios).

## 6. Home: umbral 5, Embla, fondo liviano

**Decision**: Constante `QUE_HACER_HOME_CAROUSEL_AFTER = 5`. `items.length > 5` → carrusel Embla + plugin Autoplay (mismo stack que Imperdibles). `0` → no renderizar sección. `1..5` → grilla, sin flechas. Intervalo de autoplay de tarjetas y de fondo: 5000 ms (sin singleton de settings en v1). Fondo: solo fotos de portada (una por actividad publicada, máx. las que hay), crossfade; `prefers-reduced-motion: reduce` desactiva ambos autoplays; pausa al hover/foco y botón explícito.

**Rationale**: FR-004/005/006/019. v1 no pide textos de sección configurables (supuesto del spec).

**Alternatives considered**: Siempre carrusel (flechas inútiles con 3 ítems). Settings singleton como Imperdibles (alcance extra). Fondo con todas las fotos de todas las actividades (descarga excesiva, NFR-004).

## 7. Seed: cinco pares categoría + actividad homónima

**Decision**: Dataset tipado `prisma/data/que-hacer-seed.ts`. Por cada ítem del mock actual: una categoría y una actividad con el mismo slug (`playas`, `cultura`, `gastronomia`, `naturaleza`, `experiencias`), `seedManaged`, icono y copy del mock. Copiar los JPG de `src/assets/` a `public/uploads/gallery/images/que-hacer-{slug}.webp` (o conservar extensión si no se transcodifica en seed) y registrar `GalleryAsset` + foto. Re-seed: misma política que Sucre Natural (`decideSeedMerge` / no pisar `seedManaged=false`; joins solo añaden). No enlazar destinos en el seed v1 (opcional, no hay mapeo editorial fiable).

**Rationale**: FR-016. La home no queda vacía al quitar el mock. Homónimos ilustran M-N sin fingir destinos.

**Alternatives considered**: Solo categorías (la home muestra actividades, quedaría vacía). Parsear ROADMAP (frágil). Enlazar todas las fichas de Playas a la actividad Playas (demasiado amplio).

## 8. Admin y destinos existentes

**Decision**: `/admin/personalizar/que-hacer` con dos bloques o pestañas: actividades y categorías. Nav en `admin-shell` + tarjeta en Personalizar. El diálogo de destinos Imperdibles gana `categoryIds[]` (categorías «Qué hacer»). Los destinos enlazados a una actividad se eligen en el formulario de la actividad (`destinationIds[]`).

**Rationale**: Un solo módulo de personalización; no un segundo CRUD de destinos (NFR-001, FR-012).

**Alternatives considered**: Página de categorías separada (más clics). Editar categorías solo desde el destino (dificulta el CRUD de categorías).

## 9. Enlace de vuelta en la ficha de destino

**Decision**: En `/imperdibles/[slug]`, si hay actividades publicadas vinculadas, bloque «Qué hacer» con enlaces a `/que-hacer/[slug]`. No mezclar con `liveActivities` JSON («vive el destino» del prompt 2).

**Rationale**: FR-011 escenario 4. Son listas distintas: una es copy de la lámina; la otra es el CMS de la home.

## 10. Autorización, revalidación, observabilidad

**Decision**: `assertAdminAction` + layout `requireAdminSession` de `/admin/personalizar`. Zod en mutadores. `revalidatePath('/')`, `/que-hacer/[slug]`, `/imperdibles/[slug]` afectados, rutas admin. Logs `console.error` con nombre de acción; seed log `Que hacer seed: created=N updated=N skippedManaged=N`. Errores al cliente en español.

**Rationale**: Constitución III–IV, patrón 005/006.

## 11. Tests proporcionales

**Decision**: Unit junto a `src/lib/que-hacer-*.ts` (iconos, umbral carrusel, cover, orphans, seed merge). Integration: CRUD, publish sin foto, M-N, 404, seed, bloqueo galería. Component: sección 0 / 5 / 6 ítems y pausa. E2E: home seed → ficha `/que-hacer/playas`. Admin e2e opcional con `E2E_ADMIN_*`.

**Rationale**: Constitución II (persistencia + auth).
