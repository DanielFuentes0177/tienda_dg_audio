import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { UPLOAD_DIR } from "@/lib/uploads";
import sharp from "sharp";
import { requireAdmin } from "@/lib/auth-guard";

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

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

    // Procesar la imagen con sharp:
    // - Resize a max 800x800 sin agrandar si es más pequeña
    // - Convertir a WebP con máxima compresión (quality 72, effort 6)
    const processedBuffer = await sharp(buffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 72, effort: 6 })
      .toBuffer();

    // Limpiar nombre base del archivo y guardar en disco
    const cleanBaseName = (file.name || "imagen")
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60) || "imagen";

    const filename = `${Date.now()}-${cleanBaseName}.webp`;
    const dir = path.join(UPLOAD_DIR, "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), processedBuffer);

    const url = `/uploads/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url,
      base64: url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Error guardando la imagen" },
      { status: 500 }
    );
  }
}
