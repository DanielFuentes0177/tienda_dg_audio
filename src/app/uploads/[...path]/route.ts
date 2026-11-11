import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { resolveUploadPath } from "@/lib/uploads";

export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const full = resolveUploadPath(segments.join("/"));
  if (!full) return new NextResponse("Not found", { status: 404 });

  try {
    const data = await fs.readFile(full);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": TYPES[path.extname(full).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
