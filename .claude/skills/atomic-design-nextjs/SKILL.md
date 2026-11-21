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
