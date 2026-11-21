import writeExcelFile from "write-excel-file/node";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

/** Descarga el catálogo completo (activos e inactivos) como Excel. Solo admin. */
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const products = await prisma.product.findMany({
    select: {
      id: true, name: true, description: true, stock: true, category: true, brand: true, family: true,
      subcategory: true, model: true, color: true, warranty: true, shipping: true,
      storeClassification: true, isActive: true, 
    },
    orderBy: { name: "asc" },
  });

  const COLS: { header: string; width: number; get: (p: (typeof products)[number]) => string | number | Date }[] = [
    { header: "ID", width: 38, get: (p) => p.id },
    { header: "Nombre_Producto", width: 50, get: (p) => p.name },
    { header: "Descripcion_Comercial", width: 70, get: (p) => p.description },
    { header: "Categoria", width: 24, get: (p) => p.category ?? "" },
    { header: "Marca", width: 20, get: (p) => p.brand ?? "" },
    { header: "Segmento", width: 20, get: (p) => p.family ?? "" },
    { header: "Subcategoria", width: 24, get: (p) => p.subcategory ?? "" },
    { header: "Modelo", width: 24, get: (p) => p.model ?? "" },
    { header: "Color_Acabado", width: 18, get: (p) => p.color ?? "" },
    { header: "Garantia", width: 18, get: (p) => p.warranty ?? "" },
    { header: "Tipo_Envio", width: 18, get: (p) => p.shipping ?? "" },
    { header: "Clasificacion_Tienda", width: 22, get: (p) => p.storeClassification ?? "" },
    { header: "Stock", width: 8, get: (p) => p.stock },
    { header: "Publicar", width: 10, get: (p) => (p.isActive ? "Sí" : "No") },
  ];
  const cell = (v: string | number | Date) =>
    typeof v === "number" ? { value: v, type: Number } : { value: String(v), type: String };
  const sheetData = [
    COLS.map((c) => ({ value: c.header, fontWeight: "bold" as const })),
    ...products.map((p) => COLS.map((c) => cell(c.get(p)))),
  ];
  const buffer = await writeExcelFile(sheetData, {
    sheet: "Productos",
    columns: COLS.map((c) => ({ width: c.width })),
    stickyRowsCount: 1,
  }).toBuffer();

  const date = new Date().toISOString().slice(0, 10);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="productos-dg-audiosound-${date}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
