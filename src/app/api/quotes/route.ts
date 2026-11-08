import { Prisma } from "@prisma/client";
import { readQuote } from "@/lib/quote-input";
import { requireAdmin } from "@/lib/admin-access";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const input = await readQuote(req);
    if (!input) return NextResponse.json({ error: "Datos de cotización inválidos" }, { status: 400 });

    const { items, ...customer } = input;
    const quote = await prisma.$transaction(async tx => {
      const count = await tx.product.count({
        where: { id: { in: items.map(item => item.productId) }, isActive: true },
      });
      if (count !== items.length) return null;
      return tx.quote.create({
        data: { ...customer, status: "PENDING", items: { create: items } },
        select: { id: true },
      });
    }, { isolationLevel: "Serializable" });

    if (!quote) return NextResponse.json({ error: "Producto no disponible" }, { status: 400 });
    return NextResponse.json({ success: true, quoteId: quote.id });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      return NextResponse.json({ error: "El catálogo cambió. Vuelve a intentarlo." }, { status: 409 });
    }
    console.error("Error creating quote");
    return NextResponse.json(
      { error: "Error al guardar la cotización." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const quotes = await prisma.quote.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(quotes, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Error al obtener las cotizaciones." },
      { status: 500 }
    );
  }
}
