# Contracts: rutas públicas (Convocatorias)

## Home (SSR)

No hay route handler dedicado. La home obtiene el payload en el Server Component:

```text
GET /  (RSC)
  → getConvocatoriasForHome()
  → HomePage({ convocatoriasPayload })
  → ConvocatoriasSection
```

### Respuesta lógica (`ConvocatoriasHomePayload`)

Ver `data-model.md`. Solo ítems publicados con deadline vigente. Lista vacía permitida.

### Enlace externo

Cada tarjeta renderiza un ancla real:

```text
<a href="{externalUrl}" target="_blank" rel="noopener noreferrer">
  Más información
</a>
```

Sin proxy ni redirección interna: el navegador va directo a la URL guardada por el staff.

## Fuera de alcance

- `GET /api/convocatorias` — no se implementa (research §5).
- `GET /convocatorias/[slug]` — no hay página de detalle (Assumptions del spec).
