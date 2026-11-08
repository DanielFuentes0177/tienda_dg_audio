import { requireAdmin } from "@/lib/admin-access";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const csvProducts = await req.json();

    if (!Array.isArray(csvProducts)) {
      return NextResponse.json({ error: "Formato inválido. Se esperaba un array de productos." }, { status: 400 });
    }

    const newProducts = [];
    const modifiedProducts = [];
    let unmodifiedCount = 0;
    let imageConflictsCount = 0;

    // Fetch all existing products to perform comparison in-memory for speed
    const dbProducts = await prisma.product.findMany();
    const dbProductsMap = new Map(dbProducts.map(p => [p.id, p]));

    for (const item of csvProducts) {
      // Find by ID if specified
      const dbProduct = item.id ? dbProductsMap.get(item.id) : null;

      if (!dbProduct) {
        newProducts.push(item);
      } else {
        // Compare fields to see if anything changed
        const isDifferent =
          dbProduct.name !== (item.name ?? dbProduct.name) ||
          dbProduct.description !== (item.description ?? dbProduct.description) ||
          dbProduct.category !== (item.category ?? dbProduct.category) ||
          dbProduct.brand !== (item.brand ?? dbProduct.brand) ||
          dbProduct.family !== (item.family ?? dbProduct.family) ||
          dbProduct.subcategory !== (item.subcategory ?? dbProduct.subcategory) ||
          dbProduct.model !== (item.model ?? dbProduct.model) ||
          dbProduct.isActive !== (item.isActive ?? dbProduct.isActive);

        // Check if there is an image in the DB and a new image is provided in the CSV
        const hasDbImage = !!(dbProduct.imageUrl || (Array.isArray(dbProduct.images) && (dbProduct.images as string[]).length > 0));
        const hasCsvImage = !!item.imageUrl;
        const isImageDifferent = hasCsvImage && dbProduct.imageUrl !== item.imageUrl;

        const hasImageConflict = hasDbImage && isImageDifferent;

        if (hasImageConflict) {
          imageConflictsCount++;
        }

        if (isDifferent || isImageDifferent) {
          modifiedProducts.push({
            ...item,
            // Keep track of database image in case they decide to keep it
            dbImageUrl: dbProduct.imageUrl,
            dbImages: dbProduct.images,
            hasImageConflict
          });
        } else {
          unmodifiedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      newProducts,
      modifiedProducts,
      unmodifiedCount,
      imageConflictsCount
    });

  } catch {
    console.error("Error generating import preview");
    return NextResponse.json({ error: "Error al procesar la previsualización." }, { status: 500 });
  }
}
