import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";

export async function POST(request: NextRequest) {
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

    // Limpiar nombre base del archivo y subir a Vercel Blob
    const cleanBaseName = (file.name || "imagen")
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60) || "imagen";

    const filename = `uploads/${Date.now()}-${cleanBaseName}.webp`;

    const blob = await put(filename, processedBuffer, {
      access: "public",
      contentType: "image/webp",
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      base64: blob.url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Error subiendo la imagen a Vercel Blob" },
      { status: 500 }
    );
  }
}
