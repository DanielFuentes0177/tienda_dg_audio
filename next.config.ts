import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/tienda/producto/d40b51e9-bb0b-4aa6-bc97-ac9aae7dc1c3', destination: '/tienda/producto/biamp-voltera-d-1200-2m', statusCode: 301 },
      { source: '/tienda/producto/35682066-ab42-41ba-aacb-0ff7b86f8796', destination: '/tienda/producto/barco-clickshare-bar-pro', statusCode: 301 },
      { source: '/tienda/producto/984d626a-5b96-4904-b5d5-9e1527541283', destination: '/tienda/producto/hisense-65we3fe', statusCode: 301 },
      { source: '/tienda/producto/31056167-e2dd-417d-8de4-443aa5066709', destination: '/tienda/producto/bowers-wilkins-isw-8', statusCode: 301 },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: '/:path*',
          destination: 'https://html.dgaudiosound.com/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
