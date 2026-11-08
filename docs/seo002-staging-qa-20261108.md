# DG Audiosound — Validación de staging SEO 002
Fecha: 8 de noviembre de 2026.

## Alcance y aislamiento
- Rama de pruebas: `review/seo002-uuid-dryrun-20261108`, PR borrador #7, basado en `feature/seo-csv-lotes-100`.
- Sandbox Vercel temporal `dgas-seo002-mysql-staging-qa-2`, sin conexión a Production. Sesión detenida al terminar.
- MariaDB 11.8.6 en loopback y dos bases de prueba independientes: `dgas_staging_qa` para el SQL exacto de migración, `dgas_prisma_qa` para el esquema Prisma y las pruebas del endpoint.
- Datos y usuario administrador **exclusivamente ficticios**; ninguna credencial ni registro comercial real fue utilizado.
- Vercel Production: `SEO_BULK_WRITE_ENABLED=false`; Preview PR #7: `SEO_BULK_WRITE_ENABLED=false`; ambos valores verificados en el proyecto. La habilitación temporal de escritura ocurrió **solo dentro del proceso Next.js del laboratorio local** y nunca en variables de Vercel.

## Pruebas completadas
| Prueba | Resultado |
|---|---|
| Instalación y arranque MariaDB temporal | PASS |
| Migración SQL aditiva sobre tabla `Product` pre-SEO | PASS |
| Cuatro slugs piloto migrados e índice único | PASS |
| Integridad de stock/estado tras migración | PASS |
| Rechazo de slug duplicado | PASS — SQL 1062 |
| Rollback de transacción SQL sin cambios parciales | PASS |
| Actualización SEO-only de prueba SQL y reversión | PASS |
| `npx prisma generate` | PASS |
| Sincronización Prisma con base aislada creada desde cero | PASS |
| `node --test tests/seo-only-rules.test.mjs` | PASS — 12/12 |
| Dos productos ficticios: transacción Prisma y rollback forzado | PASS |
| Dos productos ficticios: escritura solo metadatos, reversible | PASS |
| Verificación de inmutabilidad stock, name, imageUrl, isActive | PASS |
| Huella antigua tras escritura | PASS — rechazada |
| Vista previa API por usuario autenticado y UUID | PASS — HTTP 200 |
| Sin sesión | PASS — HTTP 401 |
| Origen incorrecto | PASS — HTTP 403 |
| Intento de publicar con flag desactivado | PASS — HTTP 403 |
| API: escritura SEO-only con flag habilitado **solo en laboratorio** | PASS — HTTP 200, 1 registro |
| Restauración de campos SEO tras prueba de escritura | PASS |
| Reutilizar fingerprint vencido API | PASS — HTTP 400 y cero escrituras |
| Apagado del sandbox | PASS |

## Hallazgo resuelto
Se detectó un falso rechazo de origen en Next.js detrás del enrutamiento interno: `request.url` puede tener un hostname interno diferente a `NEXTAUTH_URL`. El PR #7 ahora compara estrictamente `Origin` con el origen público configurado, manteniendo la protección ante solicitudes de otro origen. Autenticación y pertenencia a `STORE_ADMIN_IDS` siguen obligatorias.

## Delimitación técnica
- La migración SQL exacta se verificó contra una tabla mínima pre-SEO y un conjunto ficticio. La sincronización del **esquema completo** de Prisma se probó sobre una segunda base vacía. La primera no validó una cadena de migraciones históricas con todas las relaciones de la tienda real.
- `prisma db push` fue usado solamente para generar el esquema sintético en la segunda base; NO se ejecutó sobre Production.
- Un despliegue Vercel Preview `READY` confirma compilación, no integración con una MySQL persistente.
- No se comprobaron backups/restauración de Production, migraciones completas de Production, autorizaciones reales ni regresión en carrito/cotizaciones reales.

## Estado
**GO técnico para el flujo de escritura mínima, exclusivamente en laboratorio aislado. NO GO para Production.**

Pendientes: base staging MySQL persistente, plan de respaldo/restauración, validación cadena completa de migraciones, CI, despliegue Preview con flags actualizados, aprobación editorial/técnica por SKU y revisión de seguridad de APIs existentes.
