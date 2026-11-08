import { requireAdmin } from "@/lib/admin-access";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "El archivo excede los 5MB permitidos" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Procesar la imagen con sharp
    // - Resize a max 800x800, sin agrandar si es más pequeña (withoutEnlargement)
    // - Convertir a WebP con calidad 75%
    const processedBuffer = await sharp(buffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 75 })
      .toBuffer();

    // Convertir a cadena Base64
    const base64String = `data:image/webp;base64,${processedBuffer.toString("base64")}`;

    // Devolver el string Base64 para guardarlo en la DB
    return NextResponse.json({ success: true, base64: base64String });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Error procesando la imagen" },
      { status: 500 }
    );
  }
}
