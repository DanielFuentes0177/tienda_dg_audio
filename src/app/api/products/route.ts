import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin, isAdminSession } from "@/lib/auth-guard";

export async function GET() {
  try {
    // El público solo ve productos activos; el admin ve todo.
    const admin = await isAdminSession();
    const products = await prisma.product.findMany({
      where: admin ? undefined : { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json();
    const { name, description, stock, imageUrl, images, isActive } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing required fields (name, description)" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        stock: parseInt(stock?.toString() || "0"),
        imageUrl: imageUrl || null,
        images: images || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    revalidatePath("/tienda");

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
