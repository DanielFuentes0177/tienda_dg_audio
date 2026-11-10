import fs from "fs";
import path from "path";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import sharp from "sharp";

// Load .env manually if needed
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

const prisma = new PrismaClient();
const uploadedCache = new Map(); // sha256 -> blobUrl

function slugifyName(name) {
  return (
    (name || "item")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "item"
  );
}

async function uploadBase64ToBlob(dataUri, folder, nameHint) {
  const hash = crypto.createHash("sha256").update(dataUri).digest("hex").slice(0, 16);
  if (uploadedCache.has(hash)) {
    return uploadedCache.get(hash);
  }

  const matches = dataUri.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Formato data:image base64 inválido");
  }

  const base64Data = matches[2];
  const rawBuffer = Buffer.from(base64Data, "base64");

  const processedBuffer = await sharp(rawBuffer)
    .resize({
      width: 800,
      height: 800,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 72, effort: 6 })
    .toBuffer();

  const filename = `${folder}/${slugifyName(nameHint)}-${hash}.webp`;
  const blob = await put(filename, processedBuffer, {
    access: "public",
    contentType: "image/webp",
    addRandomSuffix: false,
  });

  if (!blob || !blob.url || !blob.url.startsWith("https://")) {
    throw new Error(`No se recibió una URL válida de Vercel Blob para ${filename}`);
  }

  uploadedCache.set(hash, blob.url);
  return blob.url;
}

async function main() {
  console.log("=== Iniciando migración de imágenes Base64 a Vercel Blob ===");

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Falta BLOB_READ_WRITE_TOKEN en el archivo .env");
  }

  let totalBytesSaved = 0;
  let migratedProductsCount = 0;
  let migratedPostsCount = 0;

  // 1. Migrar Productos (procesando por lotes de IDs para no saturar memoria)
  const productIds = await prisma.product.findMany({
    select: { id: true, name: true },
  });

  console.log(`Revisando ${productIds.length} productos en la base de datos...`);

  for (let i = 0; i < productIds.length; i++) {
    const { id } = productIds[i];
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true, imageUrl: true, images: true },
    });

    if (!product) continue;

    let changed = false;
    let newImageUrl = product.imageUrl;
    let newImages = product.images;

    if (typeof product.imageUrl === "string" && product.imageUrl.startsWith("data:image/")) {
      totalBytesSaved += Buffer.byteLength(product.imageUrl, "utf8");
      newImageUrl = await uploadBase64ToBlob(product.imageUrl, "products", product.name);
      changed = true;
    }

    if (Array.isArray(product.images)) {
      const updatedArr = [];
      for (let idx = 0; idx < product.images.length; idx++) {
        const img = product.images[idx];
        if (typeof img === "string" && img.startsWith("data:image/")) {
          totalBytesSaved += Buffer.byteLength(img, "utf8");
          const url = await uploadBase64ToBlob(
            img,
            "products",
            `${product.name}-${idx + 1}`
          );
          updatedArr.push(url);
          changed = true;
        } else {
          updatedArr.push(img);
        }
      }
      newImages = updatedArr;
    }

    if (changed) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          imageUrl: newImageUrl,
          images: newImages,
        },
      });
      migratedProductsCount++;
      console.log(
        `[Producto ${migratedProductsCount}] Migrado: "${product.name}" -> ${newImageUrl}`
      );
    }
  }

  // 2. Migrar Posts del Blog
  const postIds = await prisma.post.findMany({
    select: { id: true, title: true },
  });

  console.log(`Revisando ${postIds.length} artículos del blog...`);

  const base64Regex = /data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/=]+/g;

  for (const { id } of postIds) {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        authorImage: true,
        content: true,
      },
    });

    if (!post) continue;

    let changed = false;
    let newImageUrl = post.imageUrl;
    let newAuthorImage = post.authorImage;
    let newContent = post.content;

    if (typeof post.imageUrl === "string" && post.imageUrl.startsWith("data:image/")) {
      totalBytesSaved += Buffer.byteLength(post.imageUrl, "utf8");
      newImageUrl = await uploadBase64ToBlob(post.imageUrl, "blog", post.slug || post.title);
      changed = true;
    }

    if (typeof post.authorImage === "string" && post.authorImage.startsWith("data:image/")) {
      totalBytesSaved += Buffer.byteLength(post.authorImage, "utf8");
      newAuthorImage = await uploadBase64ToBlob(
        post.authorImage,
        "blog-authors",
        post.slug || post.title
      );
      changed = true;
    }

    if (typeof post.content === "string" && post.content.includes("data:image/")) {
      const matches = post.content.match(base64Regex) || [];
      for (let idx = 0; idx < matches.length; idx++) {
        const match = matches[idx];
        totalBytesSaved += Buffer.byteLength(match, "utf8");
        const url = await uploadBase64ToBlob(
          match,
          "blog-content",
          `${post.slug || post.title}-inline-${idx + 1}`
        );
        newContent = newContent.replace(match, url);
        changed = true;
      }
    }

    if (changed) {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          imageUrl: newImageUrl,
          authorImage: newAuthorImage,
          content: newContent,
        },
      });
      migratedPostsCount++;
      console.log(`[Blog ${migratedPostsCount}] Migrado: "${post.title}"`);
    }
  }

  const mbSaved = (totalBytesSaved / (1024 * 1024)).toFixed(2);
  console.log("=== Migración completada con éxito ===");
  console.log(`- Productos migrados: ${migratedProductsCount}`);
  console.log(`- Artículos de blog migrados: ${migratedPostsCount}`);
  console.log(`- Imágenes únicas subidas a Vercel Blob: ${uploadedCache.size}`);
  console.log(`- Peso Base64 eliminado de las respuestas de BD: ${mbSaved} MB`);
}

main()
  .catch((err) => {
    console.error("Error durante la migración:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
