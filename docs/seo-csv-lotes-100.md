# DGAS — Importador SEO por lotes (máximo 100)

Objetivo: actualizar datos editoriales SEO SIN tocar stock, precios, imágenes, marca,
modelo, categorías, estatus de publicación, IDs o tablas de cotizaciones.

## Flujo obligatorio
1. Hacer un respaldo de MySQL recuperable y verificar la restauración.
2. Ejecutar en mantenimiento la migración ADITIVA de Prisma:
   `npx prisma migrate deploy`.
3. Desplegar la aplicación candidata, verificar inicio de sesión del propietario y
   acceso a `/admin/products/seo`; no incorporar SEC-02 sin resolver su propia clave.
4. Importar archivo UTF-8 por navegador (no usar el importador general actual).
5. Revisar vista previa y campos modificados; confirmar para publicar.
6. Verificar ficha, canonical, meta, URL, redirección permanente, sitemap y cotizaciones.
7. Siguiente lote de hasta 100 solo tras validación del anterior.

## Columnas soportadas
- `ID_Producto` (obligatoria, UUID existente y activo).
- `SEO_Titulo` (opcional).
- `Meta_Descripcion` (opcional).
- `SEO_Slug` (opcional; sin prefijo ni barras; único en toda la tienda).
- `Descripcion_Comercial` (opcional; texto visible en ficha).
- `SEO_ALT` (opcional; texto alternativo de galería).

Una celda vacía se ignora y conserva el valor actual. Nunca borra datos.

## Reglas de seguridad
- Se aceptan solo 1–100 registros, UUID existentes y activos, sin duplicados.
- Administración requiere sesión y pertenencia a `STORE_ADMIN_IDS`.
- También se exige el mismo origen configurado en `NEXTAUTH_URL`.
- Vista previa y confirmación tienen huella SHA-256 ligada a la versión del producto.
- Actualización transaccional por lote: todo o nada.
- Solo se actualizan `seoTitle`, `seoDescription`, `slug`,
  `description` y `seoImageAlt`; no se permite pasar otras propiedades.
- Las URLs antiguas con UUID son redirigidas con HTTP 301 cuando tienen slug.
- Los productos sin slug continúan en `/tienda/producto/{UUID}`.
- Si no existe la migración, NO desplegar este cambio: el acceso al catálogo fallará.

## Trabajo previo reutilizado
Se conserva el mapa de 44 SEO titles/metadescripciones aprobado, cuya fuente está en
`seo/piloto-44-metadata-canonical-20261107`. Se activa como fallback para las 44
fichas hasta que los campos se actualicen vía CSV.

Los cuatro slugs del piloto se aplican por la migración aditiva. Se mantienen
redirecciones 301 por ID desde el proxy sin reemplazar UUID en pedidos.

**NO ejecutar esta migración ni fusionar el PR sin revisión técnica y respaldo.**
