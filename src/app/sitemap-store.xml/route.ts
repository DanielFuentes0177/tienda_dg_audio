import { NextResponse } from 'next/server';
import { PRODUCT_SEO_PILOT_4, getProductUrl } from "@/lib/seo/productSeoPilot4";
import prisma from "@/lib/prisma";

export async function GET() {
  const baseUrl = 'https://www.dgaudiosound.com';
  
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });

  const urls = products.map((product) => `
  <url>
    <loc>${PRODUCT_SEO_PILOT_4[product.id] ? getProductUrl(product.id) : `${baseUrl}/tienda/${product.id}`}</loc>
    <lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
