# Data model: HeroAppearanceSettings

## Entidad `HeroAppearanceSettings` (singleton)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String PK | Siempre `"singleton"` |
| heroMode | Enum | `IMAGE_DEFAULT`, `IMAGE_CUSTOM`, `VIDEO`, `CAROUSEL` |
| heroImageUrl | String? | Ruta pública `/uploads/...` cuando modo imagen custom |
| heroVideoUrl | String? | `/uploads/...` o URL HTTPS absoluta |
| heroVideoSource | Enum? | `UPLOAD`, `EXTERNAL_URL`; null si no aplica |
| carouselSlides | Json? | `Array<{ url: string, alt?: string }>` |
| updatedAt | DateTime | Automático |

## Reglas

- `IMAGE_CUSTOM`: `heroImageUrl` obligatorio para guardado válido.
- `VIDEO`: `heroVideoUrl` obligatorio; `heroVideoSource` obligatorio.
- `CAROUSEL`: `carouselSlides` con longitud ≥ 2; cada `url` no vacía.

## Valores por defecto en aplicación

Ausencia de fila ⇒ tratar como `IMAGE_DEFAULT`.
