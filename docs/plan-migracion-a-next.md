# Plan: migrar el sitio HTML a Next.js (DG Audiosound)

Decisiones del dueño: todo en Next.js · puede cambiar URLs **con 301** (pero se mantienen las actuales) · conservar el diseño · editar textos sin código · formulario de contacto real (WhatsApp como canal principal) · mejor SEO local · migrar **por etapas** verificando en vivo.

## Punto de partida (medido)
- HTML en `/Users/kelebra/Documents/Rpm_Code/Dg_audio`: home, 4 páginas hub y 27 páginas de servicio (31 en el sitemap), 2 legales, `soluciones` y `aplicaciones`.
- Todas las páginas de servicio comparten la misma plantilla de ~9 secciones (hero, problema, qué incluye, proceso, FAQ, contacto) → se resuelve con **un solo `ServicePageTemplate` alimentado por datos**, no con 31 componentes.
- JS: hero-slider, navbar, faq-accordion, scroll-reveal, whatsapp-forms, banner de cookies. Analítica: GTM `GTM-N65F3T7P`, GA4 `G-H29S551ZJK`, Consent Mode.
- CSS ya está en Atomic Design (tokens → atoms → molecules → organisms → pages).
- Assets: 271 MB (carpeta `Imagenes` 67 MB; PNG de 6 MB). Hay que optimizar.
- Hoy el HTML se sirve por el `fallback` de `next.config.ts` hacia `estatico.dgaudiosound.com`.

## Red de seguridad (por qué es de bajo riesgo)
Next solo toma una ruta cuando existe su `page.tsx`. Mientras no exista, el `fallback` sigue sirviendo el HTML. **Rollback de cualquier página = borrar su `page.tsx` y redeployar.** Las URLs no cambian, así que no hay redirects ni pérdida de SEO.

## Etapas

### Etapa 0 — Publicar lo hecho y línea base (1 sesión)
- Push del commit `029bc12` (SEO etapa 1 + seguridad). Verificar en vivo: 301 a `www`, 301 de URLs viejas, `/contacto`, canonical de fichas, `/api/quotes` ahora 401.
- Script `scripts/snapshot-seo.mjs`: rastrea las 32 URLs del sitemap y guarda título, meta description, canonical, H1, JSON-LD, nº de enlaces. Se corre **antes y después de cada etapa** para detectar regresiones.
- Pedir en Search Console "Validar corrección" (403/404) — lo hace el dueño.

### Etapa 1 — Cimientos Atomic (1–2 sesiones)
- Tokens del `variables.css`/`lux-tokens.css` → `globals.css` (`:root`), sin hex sueltos.
- Átomos: `Button`, `Badge`, `Input`, `Heading`, `WhatsAppLink`/`FloatingWhatsApp`.
- Moléculas: `ServiceCard`, `FaqItem`, `TrustBar`, `NavLink`, `CookieBanner`.
- Organismos compartidos: unificar **un solo** `Navbar`/`Footer` (hoy hay dos distintos: el de Next y el del HTML) con el diseño del sitio HTML.
- `Analytics` (GTM + GA4 + Consent Mode) cargado una sola vez en el layout, respetando el consentimiento.
- Criterio de salida: el layout de Next se ve igual al HTML en cabecera/pie.

### Etapa 2 — Piloto: `/residencial-premium/cine-en-casa` (1–2 sesiones)
- Organismos: `ServiceHero`, `ProblemSection`, `IncludesSection`, `ProcessSteps`, `FaqSection`, `CtaContacto`; plantilla `ServicePageTemplate`.
- Contenido en un archivo de datos tipado (`src/content/services/…`), misma URL, `generateMetadata` (title, description, canonical `www`, OG) y JSON-LD (`Service`, `FAQPage`, `BreadcrumbList`).
- Comparar con la versión HTML (capturas lado a lado + `snapshot-seo`). Deploy → `curl` → Inspección de URLs en Search Console.
- Criterio de salida: indistinguible visualmente, mismo o mejor SEO, Core Web Vitals iguales o mejores.

### Etapa 3 — Resto de servicios por grupos (3–5 sesiones)
Orden: residencial (6) → negocios (6) → corporativo (6) → eventos (7) → 4 hubs. Cada grupo: datos + `snapshot-seo` + deploy + verificación. En este paso se **diferencian los textos** de páginas hermanas (hoy comparten 36–41 %) y se añaden imágenes optimizadas (WebP, `width/height`).

### Etapa 4 — Home y páginas sueltas (2 sesiones)
Home (hero slider, soluciones, FAQ, marcas), `aviso-de-privacidad`, `terminos-y-condiciones`. Decidir qué pasa con `/soluciones` y `/aplicaciones` (¿se usan? si no, 301 a la home o al hub correspondiente).

### Etapa 5 — Contacto real y SEO local (1–2 sesiones)
- Página `/contacto` con formulario (valida, guarda en BD y abre/envía a WhatsApp), sin romper `#contacto` de la home.
- JSON-LD `LocalBusiness` (dirección/teléfono/horario/zona de servicio), enlaces `tel:`; enlaces internos entre servicios y fichas de producto.
- Anti-spam: honeypot + límite de intentos (ver pendientes de seguridad).

### Etapa 6 — Editar sin código (2–3 sesiones)
- Modelos Prisma `ServicePage` (+ secciones/FAQ) y vistas en `/admin` para editar texto, FAQ y metadatos; seed desde los archivos de datos. Migración de BD **solo con autorización**.
- Revalidación (`revalidatePath`) al guardar. Sanitizar HTML (pendiente de seguridad) antes de aceptar texto enriquecido.

### Etapa 7 — Apagar el HTML (1 sesión)
- Quitar el `fallback` de `next.config.ts` y el subdominio `estatico`; limpiar redirects; un único `sitemap.xml` generado por Next.
- Revisión final: `snapshot-seo` completo, Search Console (cobertura, sitemap, Core Web Vitals), archivar el repo `Dg_audio`.

## Riesgos y mitigaciones
| Riesgo | Mitigación |
|---|---|
| Regresión visual | Comparación lado a lado por página; CSS portado con los mismos tokens |
| Pérdida de SEO | Mismas URLs, `snapshot-seo` antes/después, rollback = borrar `page.tsx` |
| Doble contenido durante la transición | Canonical siempre a `www`; la ruta solo la sirve uno de los dos a la vez |
| Rendimiento (2 MB de HTML en `/tienda`, imágenes pesadas) | Optimizar imágenes, paginar catálogo, revisar CWV en cada etapa |
| Hostinger/Node (memoria, caché de LiteSpeed) | Probar `curl` y cabeceras de caché tras cada deploy |
| Analítica duplicada o sin consentimiento | Un solo componente `Analytics`; comprobar GTM en cada página |

## Reglas de trabajo
Usar las skills `dg-audiosound-context` y `atomic-design-nextjs`. Componentes dumb; contenido por props; guards en toda ruta/acción de escritura; verificar con `curl` antes de dar algo por terminado.

## Pendientes previos (no bloquean la etapa 0)
Sanitizar HTML del blog (XSS), rate limit en login y cotizaciones, CSP, mensajes de login genéricos.
