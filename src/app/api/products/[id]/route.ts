import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Filtramos solo los campos permitidos para actualizar
    const { name, description, stock, imageUrl, images, isActive } = body;

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (description !== undefined) dataToUpdate.description = description;
    if (stock !== undefined) dataToUpdate.stock = parseInt(stock.toString());
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;
    if (images !== undefined) dataToUpdate.images = images;
    if (isActive !== undefined) dataToUpdate.isActive = isActive;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath("/tienda");
    revalidatePath(`/tienda/producto/${id}`);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Eliminación física
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/tienda");
    revalidatePath(`/tienda/producto/${id}`);

    return NextResponse.json({ success: true, product: deletedProduct });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    
    // Error típico de Prisma cuando hay registros relacionados (Foreign Key Constraint)
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "No se puede borrar este producto porque ya tiene ventas (órdenes) asociadas. En su lugar, usa el botón de 'Deshabilitar' para ocultarlo de la tienda." }, 
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
