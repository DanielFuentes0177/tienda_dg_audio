import type { Prisma } from "@prisma/client";

export const catalogProductSelect = {
  id: true, name: true, description: true, imageUrl: true,
  brand: true, model: true, category: true, family: true,
} satisfies Prisma.ProductSelect;

export const publicProductSelect = {
  ...catalogProductSelect,
  subcategory: true, color: true, images: true, warranty: true, shipping: true,
} satisfies Prisma.ProductSelect;

export type CatalogProduct = Prisma.ProductGetPayload<{ select: typeof catalogProductSelect }>;
export type PublicProduct = Prisma.ProductGetPayload<{ select: typeof publicProductSelect }>;
