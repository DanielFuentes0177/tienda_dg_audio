import { NextResponse } from 'next/server';
import { getProductUrl } from "@/lib/seo/productSeoPilot4";
import prisma from "@/lib/prisma";
import { PRODUCT_SEO_PILOT_44 } from "@/lib/seo/productSeoPilot44";
import { PRODUCT_SEO_BATCH_002_100 } from "@/lib/seo/productSeoBatch002";
import { PRODUCT_SEO_PILOT_4 } from "@/lib/seo/productSeoPilot4";

export const dynamic = "force-dynamic";

/**
 * Solo se listan las fichas con contenido suficiente (metadatos SEO aprobados, o imagen y
 * descripción de 200+ caracteres). El resto sigue accesible y rastreable por enlaces, pero no
 * se empuja a Google desde el sitemap: miles de fichas casi vacías frenan el rastreo del sitio.
 */
const hasApprovedSeo = (id: string) => Boolean(PRODUCT_SEO_PILOT_44[id] ?? PRODUCT_SEO_BATCH_002_100[id] ?? PRODUCT_SEO_PILOT_4[id]);

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, updatedAt: true, imageUrl: true, description: true },
    orderBy: { updatedAt: "desc" },
  });
  const worthIndexing = products.filter(
    (p) => hasApprovedSeo(p.id) || (Boolean(p.imageUrl) && p.description.length >= 200)
  );

  const urls = worthIndexing.map((product) => `
  <url>
    <loc>${getProductUrl(product.id)}</loc>
    <lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
