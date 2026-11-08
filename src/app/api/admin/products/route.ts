import { requireAdmin } from "@/lib/admin-access";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json(products, { headers: { "Cache-Control": "private, no-store" } });
}
