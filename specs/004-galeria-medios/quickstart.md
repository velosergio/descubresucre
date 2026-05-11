# Quickstart

1. `npx prisma migrate dev` o `db push`
2. Admin → Personalizar → Galería: subir medios
3. Banner principal: «De la galería» o «Subir nuevo» (va a la galería)
4. En Galería, usar «Limpiar registros huérfanos» si hubo reinicios/despliegues que desincronicen BD y disco.
5. Verificar en red que los medios se sirvan por `/api/media?src=...` (no depender de acceso estático directo a `/uploads/...`).
