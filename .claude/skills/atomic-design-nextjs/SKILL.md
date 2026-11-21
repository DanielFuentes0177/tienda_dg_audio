---
name: atomic-design-nextjs
description: Reglas de Atomic Design con componentes "dumb" (presentacionales) y de seguridad para la app Next.js de DG Audiosound. Úsala al crear o modificar componentes, páginas, rutas /api, Server Actions, formularios, subida de archivos o al migrar las páginas HTML de servicios a Next.js.
---

# Atomic Design + componentes dumb + seguridad (Next.js)

Complementa a `dg-audiosound-context` (arquitectura/SEO). Antes de escribir código Next lee la guía relevante en `node_modules/next/dist/docs/` (este Next tiene cambios incompatibles; ver `AGENTS.md`).

## 1. Capas (carpeta `src/components/`)

| Capa | Carpeta | Qué es | Ejemplos |
|---|---|---|---|
| Tokens | `src/app/globals.css` (`:root`) | Colores, tipografías, espacios, radios, sombras. **Único lugar** para valores de marca | oro `#d4a437`, carbón `#0d0d0f`, `Outfit` títulos / `Inter` cuerpo |
| Átomos | `atoms/` | Elemento indivisible, sin lógica de negocio | `Button`, `Badge`, `Input`, `Heading`, `Icon`, `WhatsAppLink` |
| Moléculas | `molecules/` | 2+ átomos con una función visual | `ProductCard`, `ServiceCard`, `FaqItem`, `NavLink`, `FilterTab` |
| Organismos | `organisms/` | Sección completa e independiente | `Navbar`, `Footer`, `ServiceHero`, `FaqSection`, `ProcessSteps`, `CtaContacto` |
| Templates | `templates/` | Esqueleto de página con *slots*, sin datos | `StoreTemplate`, `ServicePageTemplate` |
| Páginas | `src/app/**/page.tsx` | Obtienen datos, arman el template con props, definen `generateMetadata` | `/residencial-premium/cine-en-casa` |

Regla de dependencia: **solo hacia abajo** (página → template → organismo → molécula → átomo). Un átomo nunca importa una molécula. Nada importa de `src/app/`.

## 1b. Estado real de la estructura (etapa 1, nov-2026)
- `src/content/site.ts`: datos únicos (contacto, enlaces de navegación/footer, IDs de analítica, clave de consentimiento) y `NEXT_ROUTE_PREFIXES`/`isNextRoute`. **Al migrar una página a Next, añade su prefijo ahí.**
- Átomos: `Button` (botón o enlace), `Badge`, `FloatingWhatsApp`, `AppLink` (usa `next/link` solo para rutas de esta app; el resto —servidas aún por el HTML— va con `<a>` para evitar prefetch al proxy).
- Moléculas: `CookieBanner` (dumb), `ProductCard`.
- Organismos dumb: `Navbar` (recibe `links`, `cta`, `pathname`), `Footer` (recibe todo el contenido por props).
- Contenedores (`src/components/containers/`, smart): `SiteNavbar`, `SiteFooter`, `ConsentManager` (consentimiento + WhatsApp flotante), `Analytics` (GTM + Consent Mode v2, desactivado en `/admin`).
- El consentimiento usa la misma clave `dg_cookie_consent` que el sitio HTML: la elección se comparte entre ambos (mismo origen).

## 1c. Páginas de servicio en Next (etapa 3: grupo residencial migrado)
- **Flujo de migración de un grupo:** `python3 scripts/migration/generate.py <grupo>` (lee el repo HTML, escribe `src/content/services/<grupo>/*.ts`, copia imágenes a `public/assets/...`, regenera `index.ts` y `servicePaths.ts`) → crear `src/app/<grupo>/[slug]/page.tsx` (copiar el de `residencial-premium`) → `python3 scripts/migration/parity.py http://localhost:3000 /<grupo>/<slug> ...` debe dar OK (texto y conteos idénticos) → deploy → `snapshot-seo diff`.
- Los íconos son Font Awesome (`/assets/font-awesome.min.css`, con las reglas que faltaban añadidas al final); los datos guardan las clases (`fa-solid fa-award`).
- Ya no se usa `cine-en-casa.ts` manual: todo sale del generador.

### (histórico) piloto cine-en-casa
- Contenido tipado en `src/content/services/<slug>.ts` (`ServicePageContent`, `src/types/service.types.ts`). Una página nueva = un archivo de datos + un `page.tsx` de 8 líneas (ver `cine-en-casa/page.tsx`) + añadir su ruta a `NEXT_ROUTE_PREFIXES` y `SERVICE_ROUTE_PREFIXES` en `src/content/site.ts`.
- Plantilla `templates/ServicePageTemplate` → organismos en `organisms/service/*` → moléculas `ServiceCards`, `FaqItem`. Estado/efectos en contenedores: `ServicePageEffects` (reveal + tilt), `ServiceContactContainer` (WhatsApp).
- SEO por helper: `serviceMetadata()` y `serviceJsonLd()` (Service + BreadcrumbList + FAQPage) en `src/lib/seo/serviceSeo.ts`.
- **CSS heredado:** `src/styles/service-page.css` está GENERADO desde `styles/bundle.min.css` del repo HTML con todos los selectores prefijados por `.svc` (script en `scripts/gen-service-css/`). Es deuda técnica controlada: se sustituye por CSS Modules por componente al terminar la migración. Ajustes propios en `service-page-overrides.css`.
- Imágenes: copiar a `public/assets/...` con la MISMA ruta del sitio HTML (así Next las sirve directo, sin pasar por el proxy a `estatico`).
- Rollback de una página migrada: borrar su `page.tsx` y redeployar (el fallback a `estatico` vuelve a servirla).

## 2. Componentes "dumb" (presentacionales)
Un componente en `atoms/`, `molecules/`, `organisms/` y `templates/` es **dumb** salvo que esté en `containers/` o sea un formulario explícito:

- Recibe todo por **props tipadas** y devuelve JSX. Eventos hacia arriba con callbacks (`onSubmit`, `onChange`).
- **Prohibido** dentro de un dumb: `fetch`, `prisma`, `getServerSession`, `process.env`, `localStorage`, `useRouter` para decidir lógica, leer cookies, mutar contexto global.
- Estado permitido solo de **UI local** (abierto/cerrado, pestaña activa). Nada de reglas de negocio.
- Sin textos o datos *hardcodeados* de contenido: el contenido llega por props (de la BD o de un archivo de datos tipado).
- Un archivo = un componente = un `.module.css` hermano. Nombres en PascalCase; props `interface XProps`.
- Server Component por defecto. Añade `"use client"` **solo** en la hoja que lo necesite (interactividad), nunca en un organismo entero por comodidad.
- Accesibilidad: HTML semántico, un solo `<h1>` por página, `alt` real en imágenes, foco visible, contraste AA.

### Dónde va la lógica ("smart")
- `src/services/` → llamadas a la API (cliente). `src/hooks/` → estado/efectos reutilizables. `src/context/` → estado global (carrito).
- `src/lib/` → utilidades de servidor (prisma, auth, uploads, SEO). 
- La **página** (`page.tsx`) o un `container` obtiene datos y los pasa hacia abajo.

## 3. Estilos
- CSS Modules (`X.module.css`) por componente, usando solo variables de los tokens (`var(--color-primary)`); no escribir hex sueltos.
- Cero regresiones visuales al migrar: el diseño de referencia vive en el repo HTML (`/Users/kelebra/Documents/Rpm_Code/Dg_audio`, ver su `docs/atomic-design-architecture.md` y `component-inventory.md`). Replica clases/valores, no los reinventes.

## 4. Migrar una página de servicio del HTML a Next (por etapas)
1. Identifica en el HTML las secciones y mapea cada una a un organismo (`ServiceHero`, `ServiceBenefits`, `ProcessSteps`, `FaqSection`, `CtaContacto`…).
2. Define el contenido como **datos tipados** (por servicio) o en BD; el template solo pinta.
3. La ruta conserva **la misma URL**. `generateMetadata` con title, description, canonical `https://www.dgaudiosound.com/<ruta>`, OG y JSON-LD (`Service`, `FAQPage`, `BreadcrumbList`, y `LocalBusiness` en la home/contacto).
4. Un solo `<h1>`; enlaces de contacto a WhatsApp (`https://wa.me/525537270177`) o `/#contacto`.
5. Verifica en vivo con `curl` (200, canonical, title) y compara visualmente con la versión HTML antes de continuar con la siguiente página.

## 5. Seguridad (obligatorio)
Estado: en nov-2026 se auditó y se añadió `src/lib/auth-guard.ts` (`requireAdmin`, `assertAdmin`, `isAdminSession`) y `src/lib/auth-secret.ts`. Mantén estas reglas:

**Autenticación y autorización**
- **Toda ruta `/api` que cree, modifique, borre o devuelva datos privados empieza con**
  ```ts
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  ```
  Públicas por diseño: `POST /api/quotes` (con validación), `GET /api/products` y `GET /api/products/[id]` (solo productos `isActive`; el admin ve todo), `/api/auth/*`.
- **Toda Server Action** (`"use server"`) llama `await assertAdmin()` primero. `src/proxy.ts` solo cubre rutas `/admin/*`; **no sustituye** al chequeo dentro de cada handler/acción.
- Nunca un secreto con valor por defecto en producción. `NEXTAUTH_SECRET` es obligatorio; sin él el admin queda cerrado. No commitear `.env`.
- Mensajes de login genéricos (no distinguir "usuario no encontrado" de "contraseña incorrecta") — pendiente en `src/lib/auth.ts`.

**Entradas (nunca confiar en el cliente)**
- Valida y recorta todo `req.json()`/`formData`: tipos, largos máximos, formato de email, enteros acotados, listas con tope. Lista blanca de campos (no pasar `body` entero a Prisma).
- Subidas (`/api/upload`): solo admin, tope de 5 MB, reprocesar con `sharp` (ya se hace), nombre de archivo saneado, directorio fijo. Si se añaden tipos nuevos, validar MIME por contenido, no por extensión.
- Prisma: solo consultas parametrizadas del cliente; **prohibido** `$queryRawUnsafe` con entrada de usuario.
- Cantidades/estados (`status` de cotización) contra lista blanca.

**Salida**
- **`dangerouslySetInnerHTML`** (hoy en `src/app/blog/[slug]/page.tsx` y `PostForm.tsx`) renderiza HTML del editor sin sanitizar: riesgo de XSS almacenado. **Pendiente:** sanitizar en servidor al guardar y al renderizar (p. ej. `sanitize-html` o DOMPurify con jsdom; requiere añadir dependencia, pedir permiso). Hasta entonces, no usar `dangerouslySetInnerHTML` en nada nuevo.
- No devolver al cliente campos innecesarios ni `password`. No registrar datos personales en logs.

**Plataforma**
- Cabeceras de seguridad en `next.config.ts` (`nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`). Pendiente: CSP y rate limiting (login, `/api/quotes`).
- Datos personales de clientes (cotizaciones: nombre, email, teléfono) son privados: solo admin.

**Pendientes de seguridad conocidos (por prioridad)**
1. Sanitizar HTML del blog (XSS).
2. Rate limit en `/api/quotes` y login; CAPTCHA o honeypot en cotizaciones.
3. CSP.
4. Mensajes de login genéricos y bloqueo por intentos.
5. Rotar `NEXTAUTH_SECRET` en producción si alguna vez faltó (el valor por defecto estuvo en el código).

## 6. Checklist antes de dar algo por terminado
- [ ] Componentes nuevos en la capa correcta y dumb (sin fetch/prisma/env).
- [ ] Estilos con tokens, sin hex sueltos.
- [ ] Rutas `/api` y acciones nuevas con guard (o justificadas como públicas) y validación.
- [ ] `npx tsc --noEmit` sin errores; tests: `node --experimental-strip-types --test tests/<archivo>.mjs`.
- [ ] URL pública conservada o con 301; canonical/metadata correctos; verificado con `curl`.
- [ ] Nada de secretos ni datos personales en el repo o en el chat.
