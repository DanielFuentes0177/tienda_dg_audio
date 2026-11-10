import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    let products: any[] = [];
    let imageAction: "keep" | "replace" = "replace";

    if (Array.isArray(body)) {
      products = body;
    } else if (body && Array.isArray(body.products)) {
      products = body.products;
      imageAction = body.imageAction || "replace";
    } else {
      return NextResponse.json({ error: "El formato de datos no es válido. Se esperaba un array o un objeto con un array de productos." }, { status: 400 });
    }

    let successCount = 0;

    // Process each product
    for (const product of products) {
      const dataToSave = {
        name: product.name,
        description: product.description,
        stock: product.stock ?? 0,
        category: product.category,
        brand: product.brand,
        family: product.family,
        subcategory: product.subcategory,
        model: product.model,
        isActive: product.isActive,
      };

      if (product.id) {
        // Find existing product first to implement imageAction conditional
        const existing = await prisma.product.findUnique({
          where: { id: product.id }
        });

        let finalImageUrl = product.imageUrl;
        let finalImages = product.images;

        if (existing) {
          const hasDbImage = !!(existing.imageUrl || (Array.isArray(existing.images) && (existing.images as string[]).length > 0));
          if (hasDbImage && imageAction === "keep") {
            finalImageUrl = existing.imageUrl;
            finalImages = existing.images;
          }
        }

        await prisma.product.upsert({
          where: { id: product.id },
          update: {
            ...dataToSave,
            imageUrl: finalImageUrl,
            images: finalImages
          },
          create: {
            id: product.id,
            ...dataToSave,
            imageUrl: finalImageUrl,
            images: finalImages
          }
        });
      } else {
        await prisma.product.create({
          data: {
            ...dataToSave,
            imageUrl: product.imageUrl,
            images: product.images
          }
        });
      }
      successCount++;
    }

    revalidatePath("/tienda");

    return NextResponse.json({ success: true, count: successCount }, { status: 201 });
  } catch (error: any) {
    console.error("Error en la subida masiva de productos:", error);
    return NextResponse.json({ error: error.message || "Error al procesar la subida masiva." }, { status: 500 });
  }
}
