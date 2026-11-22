import type { NextConfig } from "next";
import { LEGACY_REDIRECTS } from "./src/content/legacyRedirects";

const nextConfig: NextConfig = {
  experimental: {
    // Menos workers y reintentos al generar páginas estáticas: evita agotar las conexiones de MySQL en el build
    cpus: 6,
    staticGenerationRetryCount: 2,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    const uuid = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';
    return [
      // Un solo host canónico: dgaudiosound.com -> www.dgaudiosound.com
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'dgaudiosound.com' }],
        destination: 'https://www.dgaudiosound.com/:path*',
        statusCode: 301,
      },
      // URLs del WordPress/WooCommerce anterior
      { source: '/product/:path*', destination: '/tienda', statusCode: 301 },
      { source: '/product-category/:path*', destination: '/tienda', statusCode: 301 },
      { source: '/product-tag/:path*', destination: '/tienda', statusCode: 301 },
      { source: '/marca/:path*', destination: '/tienda', statusCode: 301 },
      // Ruta antigua de producto sin /producto/
      { source: `/tienda/:id(${uuid})`, destination: '/tienda/producto/:id', statusCode: 301 },
      // La home también existía como /index e /index.html
      { source: '/index', destination: '/', statusCode: 301 },
      { source: '/index.html', destination: '/', statusCode: 301 },
      // Estructura antigua del sitio HTML (/subpage/...) y URLs con extensión .html
      ...LEGACY_REDIRECTS.map((r) => ({ ...r, statusCode: 301 })),
      { source: '/:path((?!_next|api|google[0-9a-f]+\\.html$).+)\\.html', destination: '/:path', statusCode: 301 },
      { source: '/tienda/producto/d40b51e9-bb0b-4aa6-bc97-ac9aae7dc1c3', destination: '/tienda/producto/biamp-voltera-d-1200-2m', statusCode: 301 },
      { source: '/tienda/producto/35682066-ab42-41ba-aacb-0ff7b86f8796', destination: '/tienda/producto/barco-clickshare-bar-pro', statusCode: 301 },
      { source: '/tienda/producto/984d626a-5b96-4904-b5d5-9e1527541283', destination: '/tienda/producto/hisense-65we3fe', statusCode: 301 },
      { source: '/tienda/producto/31056167-e2dd-417d-8de4-443aa5066709', destination: '/tienda/producto/bowers-wilkins-isw-8', statusCode: 301 },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async rewrites() {
    // El sitio HTML ya está migrado por completo: el proxy a `estatico` quedó desactivado.
    // Para reactivarlo en una emergencia: DG_ENABLE_FALLBACK=1 (y redeploy).
    const fallback = process.env.DG_ENABLE_FALLBACK === '1'
      ? [{ source: '/:path*', destination: 'https://estatico.dgaudiosound.com/:path*' }]
      : [];
    return { beforeFiles: [], afterFiles: [], fallback };
  },
};

export default nextConfig;
