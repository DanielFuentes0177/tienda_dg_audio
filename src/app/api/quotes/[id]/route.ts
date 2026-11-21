import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

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
