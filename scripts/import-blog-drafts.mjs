// Guarda los borradores de scripts/blog-drafts.mjs como entradas NO publicadas del blog.
// Uso:  node scripts/import-blog-drafts.mjs            (simulación: no escribe nada)
//       node scripts/import-blog-drafts.mjs --apply    (crea los borradores que aún no existan)
// Usa DATABASE_URL de tu .env: confirma a qué base apunta antes de usar --apply.
import { PrismaClient } from "@prisma/client";
import { DRAFTS } from "./blog-drafts.mjs";

const apply = process.argv.includes("--apply");
const prisma = new PrismaClient();
try {
  for (const d of DRAFTS) {
    const exists = await prisma.post.findUnique({ where: { slug: d.slug }, select: { id: true } });
    if (exists) { console.log(`= ya existe: ${d.slug}`); continue; }
    if (!apply) { console.log(`+ crearía (borrador): ${d.slug}`); continue; }
    await prisma.post.create({
      data: {
        title: d.title, slug: d.slug, content: d.content.trim(), published: false,
        seoTitle: d.seoTitle, seoDescription: d.seoDescription, seoKeywords: d.seoKeywords,
        coverImageAlt: d.coverImageAlt, category: d.category,
      },
    });
    console.log(`+ creado (sin publicar): ${d.slug}`);
  }
  if (!apply) console.log("\nSimulación. Para guardar: node scripts/import-blog-drafts.mjs --apply");
} finally { await prisma.$disconnect(); }
