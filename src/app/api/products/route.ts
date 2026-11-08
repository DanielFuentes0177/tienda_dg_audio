import { catalogProductSelect } from "@/lib/public-product";
import { requireAdmin } from "@/lib/admin-access";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: catalogProductSelect,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
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

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
