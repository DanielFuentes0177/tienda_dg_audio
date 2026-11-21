import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = rateLimit(`quote:${clientIp(req.headers)}`, 5, 10 * 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Demasiados intentos. Inténtalo de nuevo en unos minutos." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, message, items } = body ?? {};

    const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
    const name = str(customerName, 120);
    const email = str(customerEmail, 200);
    const phone = str(customerPhone, 40);
    const note = str(message, 2000);

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json(
        { error: "Nombre, email válido y al menos un producto son requeridos." },
        { status: 400 }
      );
    }

    const cleanItems = items.map((item: { productId?: unknown; quantity?: unknown }) => ({
      productId: typeof item?.productId === "string" ? item.productId : "",
      quantity: Number.isInteger(item?.quantity) ? (item.quantity as number) : 0,
    }));
    if (cleanItems.some((i) => !i.productId || i.quantity < 1 || i.quantity > 999)) {
      return NextResponse.json({ error: "Productos o cantidades inválidos." }, { status: 400 });
    }

    // Create the quote and its items in a transaction
    const quote = await prisma.quote.create({
      data: {
        customerName: name,
        customerEmail: email,
        customerPhone: phone || null,
        message: note || null,
        status: "PENDING",
        items: {
          create: cleanItems,
        },
      },
    });

    return NextResponse.json({ success: true, quoteId: quote.id });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Error al guardar la cotización." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

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

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Error al obtener las cotizaciones." },
      { status: 500 }
    );
  }
}
