import { requireAdmin } from "@/lib/admin-access";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = await req.json();
    const status = body?.status;
    if (status !== "PENDING" && status !== "ATTENDED") {
      return NextResponse.json({ error: "Estatus inválido" }, { status: 400 });
    }

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, quote: updatedQuote });
  } catch (error) {
    console.error("Error updating quote:", error);
    return NextResponse.json(
      { error: "Error al actualizar la cotización." },
      { status: 500 }
    );
  }
}
