# Release SEO-only — DG Audiosound

## Alcance

Este cambio contiene **únicamente SEO** sobre la base `main` que está en producción,
reutilizando el piloto de 4 URLs auditado y el archivo de 44 títulos/metadescripciones
aprobados.

- 44 fichas: metadatos title/description, canonical y Open Graph/Twitter.
- 4 de las 44 fichas: slugs legibles y redirecciones HTTP 301 de UUID.
- 40 fichas adicionales: conservan URL UUID, pero con metadatos personalizados.
- El sitemap usa siempre la ruta real `/tienda/producto/{slug|UUID}` y
  excluye productos inactivos.
- Para productos fuera de las 44 aprobaciones: no se cambian metadatos actuales;
  el sitemap se corrige para la ruta existente.
- No se altera la base de datos ni se ejecutan migraciones.
- No se cambian permisos de administrador ni secretos de sesiones.
- Se conservan los IDs internos de productos, carrito y solicitudes de cotización.

## Limitación clara

Este despliegue **no** actualiza el texto largo visible de las descripciones
guardadas en MySQL. Esos textos se deben cargar posteriormente mediante
un mecanismo seguro de actualización de contenido. No confundir SEO técnico
publicado con las 44 descripciones comerciales publicadas.

## Comprobaciones previas a producción

1. Confirmar `main` y el commit de producción; revisar que el PR contenga
   exclusivamente los archivos SEO y el renombrado inocuo de ruta de catálogo.
2. Revisar y ejecutar pruebas de código, compilación y navegación.
3. Confirmar Vercel project `tienda-dg-audio` y dominio `www.dgaudiosound.com`.
4. Verificar acceso administrativo existente y respaldo/rollback de aplicación.
5. Probar cuatro redirecciones 301, sus slugs, canonical y OG; probar una ficha
   entre las otras 40, y un producto activo fuera del lote.
6. Probar ficha inactiva, carrito, cotización y blog.
7. Comprobar `/sitemap-store.xml` con ruta UUID válida fuera del piloto.

No fusionar y desplegar en producción hasta superar estas verificaciones.
El PR #4 de seguridad y el PR #5 de importador no forman parte de este cambio.
