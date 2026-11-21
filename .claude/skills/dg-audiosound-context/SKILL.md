---
name: dg-audiosound-context
description: Contexto completo de dgaudiosound.com (arquitectura mezclada HTML estático + Next.js en Hostinger, SEO, catálogo y plan de migración a Next.js). Úsala antes de tocar rutas, redirects, sitemap, metadatos, productos, páginas de servicios, despliegue o cualquier tema de Search Console en este proyecto.
---

# DG Audiosound — contexto del sitio

Léela completa antes de cambiar nada. Si algo de aquí ya no es cierto, corrígelo en este archivo.

## 0. Estado actual (21-nov-2026) — LEE ESTO PRIMERO
- **Todo el sitio es Next.js.** El proxy a `estatico` está apagado y los subdominios `estatico`, `app` y `html` fueron eliminados de Hostinger. Las secciones 2 y 6 de abajo describen el pasado (migración); la meta ya se cumplió.
- **Imágenes subidas desde el admin** viven en `UPLOAD_DIR=/home/u820012597/uploads-data` (carpeta propia en la raíz de la cuenta, fuera de cualquier sitio; subcarpetas `products/` y `blog/`). NUNCA apuntar `UPLOAD_DIR` dentro de la carpeta de un sitio: al borrar ese sitio se pierden las fotos (pasó al borrar `app`; se recuperó de la copia de seguridad de Hostinger). Quedó `domains/app.dgaudiosound.com/uploads-data.viejo` como copia de respaldo: borrarla solo con permiso del usuario.
- **Despliegue:** `git archive HEAD | tar -x -C <carpeta limpia>` y `hosting_deploy` (domain dgaudiosound.com, type nodejs, appType next, node 22) sobre esa carpeta; nunca subir `node_modules`, `.next` ni `.env`. Si el build falla sin mensaje, reintentar con paquete limpio. Antes de borrar cualquier sitio/carpeta en Hostinger: revisar `UPLOAD_DIR`/`DATABASE_URL` y pedir confirmación explícita.
- **Admin** (`/admin`): Resumen (cotizaciones + clics a WhatsApp), Productos (descarga Excel), Cotizaciones, Blog (pegar desde Word conserva formato; HTML sanitizado en `src/lib/sanitize.ts`), Textos SEO (`PageText`). Login: `scripts/set-admin-password.mjs` cambia correo/contraseña y `--check` verifica. Límite de intentos en `src/lib/rate-limit.ts`.
- Tablas añadidas con `prisma db push` (autorizado): `PageText`, `WhatsappClick`. Clics a WhatsApp: `WhatsappTracker` + `trackWhatsapp()` + `POST /api/track/whatsapp`.
- Las páginas de servicio se editan en `src/content/services/**` (JSON en .ts; el generador `generate.py` las pisaría si se vuelve a correr).

## 1. Qué es el sitio
Integrador de audio y video (CDMX/México). Dominio canónico: **https://www.dgaudiosound.com** (siempre con www). Canal de contacto principal: **WhatsApp** (`https://wa.me/525537270177`), correo `contacto@dgaudiosound.com`.

## 2. Arquitectura actual (revuelta, en transición)
Dos proyectos distintos sirven el mismo dominio:

| Parte | Repo / ruta local | Tecnología | Qué sirve |
|---|---|---|---|
| **Next.js** (este repo) | `tienda_dg_audio` | Next.js + Prisma + MySQL | `/tienda`, `/tienda/producto/*`, `/blog`, `/admin`, `/api`, `/login`, `/checkout`, sitemaps |
| **HTML estático** | `/Users/kelebra/Documents/Rpm_Code/Dg_audio` (GitHub `Kelebra28/Dg_audio`) | HTML + CSS/JS vanilla (Atomic Design), `.htaccess` | Home `/`, `/residencial-premium/*`, `/negocios-y-experiencias/*`, `/corporativo-e-institucional/*`, `/eventos-y-produccion/*`, `/aviso-de-privacidad`, `/terminos-y-condiciones`, `/soluciones`, `/aplicaciones` |

**Cómo se combinan:** Next.js corre en el dominio principal (`www`). En `next.config.ts` hay un `rewrites().fallback` que manda **toda ruta que Next no conoce** a `https://estatico.dgaudiosound.com/:path*`. Es decir: el HTML se sirve por proxy desde el subdominio `estatico`.

**Despliegue:**
- Next.js: **un `git push` NO despliega.** El sitio `dgaudiosound.com` en Hostinger es Node.js (Next 16, Node 22, `npm run build`) y el último build salió de un zip subido (`source_type: archive`, `gitAutoDeployment: null`). Se despliega con `hosting_deploy` (MCP `hostinger-dg`) o el CLI `hostinger up`; el estado se ve con `hosting_get-deployment`. Confirmar con el usuario antes de desplegar (sobrescribe producción). El build lee variables de `.env` del servidor.
- HTML estático: **manual**, se sube al subdominio `estatico` (Hostinger). No hay CI.

**Hosting:** todo en Hostinger (LiteSpeed). Vercel ya no se usa (hubo migración de Vercel Blob a disco del servidor; las imágenes de producto viven en `/uploads/products/`).

### Consecuencias que hay que recordar
- **Bug medido (21-nov-2026): el proxy `fallback` hacia `estatico` devuelve ~10 % de respuestas `200` con cuerpo vacío** (estatico directo: 0/40 vacías; vía `www`: 4/40). Googlebot puede ver páginas en blanco. Cada página migrada a Next elimina el problema para esa URL.
- `scripts/snapshot-seo.mjs` (`snapshot` / `diff`) guarda y compara título, canonical, H1, JSON-LD y estado de las URLs; reintenta cuando el cuerpo viene vacío. Línea base en `docs/seo-snapshots/`.
- El HTML estático tiene su propio `.htaccess` (reescritura sin `.html`, 301 de `/subpage/...` viejos, caché). **No aplica a las rutas de Next.**
- Dos sitios = dos sistemas de canonicals, sitemaps y redirects. Hay que mantenerlos coherentes (ver §4).
- `/contacto` está en `sitemap-pages.xml` pero **da 404** (no existe ni en Next ni en el HTML). Los servicios enlazan a `/index#contacto`.
- Páginas de servicios enlazan a `/index#contacto`; `/index` responde 200 con canonical a `/` (duplicado inofensivo, pero preferible enlazar a `/#contacto`).

## 3. Next.js: reglas del proyecto
- **Este Next.js tiene cambios incompatibles con lo que conoces.** Antes de escribir código lee la guía relevante en `node_modules/next/dist/docs/` y respeta deprecaciones (ver `AGENTS.md`). El middleware ahora es `src/proxy.ts` (solo protege `/admin/:path*` con next-auth).
- Base de datos: MySQL vía Prisma (`DATABASE_URL`). Modelos: `Product`, `Quote`, `QuoteItem`, `User`, `Post`. `dev.db` en la raíz es residuo local, no producción.
- Imágenes: `images.unoptimized: true`; archivos en `/uploads/...`, ver `src/lib/uploads.ts`.
- **No ejecutar migraciones ni tocar la BD de producción** sin que el usuario lo pida (el release SEO se hizo explícitamente "sin migración", ver `docs/release-seo-44-sin-migracion.md`).
- Nunca imprimir ni commitear secretos de `.env`.

## 4. SEO: estado y reglas
**Search Console** (propiedad de dominio `sc-domain:dgaudiosound.com`; datos desde ~sep 2026, sitio nuevo). Estado al 20-nov-2026:
- ~70 clics y 1,78 mil impresiones en el periodo; posición media ~13,7; **solo 69 páginas indexadas de ~2.510 conocidas**.
- Sin indexar: 1.826 "descubiertas, sin indexar", 495 con 404 (URLs del WordPress viejo `/product/`, `/product-category/`, `/product-tag/` y `/tienda/<uuid>` sin `/producto/`), 63 rastreadas sin indexar, 24 con 403 (Google recibió 403 del 2 al 10 de nov en páginas de servicios reales; hoy responden 200), 20 redirecciones, 13 canónica alternativa, 2 `noindex`.
- Las páginas con más impresiones son los **servicios** (cine-en-casa, residencial-premium, restaurantes), posición ~14 y casi sin clics: es un problema de **posicionamiento/señales locales**, no solo de indexación.

**Hallazgos técnicos pendientes (en orden de impacto):**
1. `dgaudiosound.com` y `www` responden ambos 200 → falta 301 a `www`. El logo de las páginas Next enlaza a `https://dgaudiosound.com/` (sin www).
2. Solo ~148 de 2.107 productos tienen metadatos + canonical + OG propios (`PRODUCT_SEO_PILOT_44`, `PRODUCT_SEO_BATCH_002_100`, `PRODUCT_SEO_PILOT_4` en `src/lib/seo/`). El resto no tiene canonical y hereda `og:title` "Tienda" y `og:url` de la home.
3. Productos usan URL con UUID; solo 4 tienen slug legible (con 301 en `next.config.ts`). El sitemap lista UUID.
4. Sin 301 para URLs del WordPress viejo ni para `/tienda/<uuid>`.
5. `/contacto` 404 estando en el sitemap.
6. Faltan datos estructurados `LocalBusiness` (dirección, teléfono) y enlaces `tel:`; las páginas hermanas de servicios comparten 36–41 % del texto (restaurantes/cafeterías/gimnasios).
7. `/tienda` pesa ~2 MB de HTML.

**Reglas:**
- Canónica siempre `https://www.dgaudiosound.com/...` sin slash final.
- Un solo sitemap índice: `https://www.dgaudiosound.com/sitemap.xml` → `sitemap-pages.xml`, `sitemap-store.xml`, `sitemap-blog.xml` (rutas en `src/app/`). No listar URLs que no devuelvan 200.
- Cambiar una URL = 301 permanente desde la anterior, siempre.
- No pedir a Google indexar 2.000 fichas de golpe: priorizar servicios y fichas con metadatos propios.
- Los metadatos SEO aprobados no se editan a mano sin revisión; no confundir "SEO técnico publicado" con "descripción comercial visible publicada".
- Verificar siempre con `curl` (código, redirect, canonical, title) antes de decir que algo quedó bien.

## 5. Catálogo y productos
- Fuente: Excel/CSV en raíz y `catalogo/`; scripts `scripts/import_catalog.js` y `scripts/import_excel_catalog.js`.
- `Product.id` es UUID y se conserva como identificador interno (carrito y cotizaciones). El slug es solo ruta pública (`getProductPath/getProductUrl` en `src/lib/seo/productSeoPilot4.ts`).
- Pruebas SEO: `tests/product-seo-44-release.test.mjs`, `tests/product-seo-pilot.test.mjs`. Córrelas al tocar `src/lib/seo/`.
- El `generateMetadata` de `src/app/tienda/producto/[id]/page.tsx` prioriza: PILOT_44 → BATCH_002_100 → PILOT_4 → fallback sin canonical (el hueco a cerrar).

## 6. Meta y plan de migración
**Meta:** todo en Next.js, un solo proyecto. Puede cambiar URLs **con 301**. Debe: conservar el diseño actual, permitir editar textos de servicios sin tocar código (admin/BD), tener formulario de contacto real (canal principal WhatsApp) y mejor SEO local (LocalBusiness, teléfono, textos únicos por página).

**Método: por etapas, verificando en vivo cada una.** Orden sugerido:
1. Arreglos sin riesgo en Next: 301 non-www→www, logo con www, canonical/OG para todos los productos, 301 de URLs viejas (WordPress y `/tienda/<uuid>`), arreglar `/contacto`.
2. Crear en Next una página de servicio de prueba que replique una del HTML (p. ej. cine-en-casa) con **la misma URL**, y comprobar diseño y SEO en vivo. El fallback a `estatico` deja de aplicar a esa ruta automáticamente porque Next ya la conoce.
3. Migrar el resto de servicios por categoría, retirando cada ruta del HTML cuando Next la sirva.
4. Mover textos a BD/admin, añadir formulario de contacto, LocalBusiness y diferenciar contenido entre páginas hermanas.
5. Al final: retirar el fallback `estatico` y apagar el subdominio.

El repo HTML tiene su propia guía de diseño en `/Users/kelebra/Documents/Rpm_Code/Dg_audio/docs/atomic-design-architecture.md` y `component-inventory.md`; úsalos para replicar componentes sin cambiar el diseño.

## 7. Cosas que NO hay que hacer
- No cambiar URLs públicas sin 301.
- No tocar la BD de producción ni correr migraciones sin autorización.
- No editar el HTML estático en el repo `Dg_audio` pensando que se despliega solo: es manual en `estatico`.
- No asumir que Search Console refleja cambios al instante (tarda días o semanas); validar y solicitar indexación desde la consola.
- No iniciar sesión de Google por el usuario ni usar sus credenciales.

## 8. Cómo verificar rápido
```bash
curl -sI https://www.dgaudiosound.com/<ruta> | head -5          # código y redirect
curl -s https://www.dgaudiosound.com/<ruta> | grep -oE '<title>[^<]*|<link[^>]*canonical[^>]*>'
curl -s https://www.dgaudiosound.com/sitemap-pages.xml | grep -o '<loc>[^<]*'   # y comprobar que todas den 200
```
Nota: Googlebot falso (user-agent simulado) recibe 403 desde fuera; no es prueba de que el real esté bloqueado. Usa la "Inspección de URLs" de Search Console para confirmar.
