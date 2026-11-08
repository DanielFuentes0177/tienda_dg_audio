import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { productUrl } from "@/lib/seo/productSeo";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
  const urls = products.map(product => `
  <url>
    <loc>${productUrl(product)}</loc>
    <lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
