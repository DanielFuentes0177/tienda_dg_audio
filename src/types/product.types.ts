export interface Product {
  id: string;
  name: string;
  description: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  slug?: string | null;
  seoImageAlt?: string | null;
  stock: number;
  category: string | null;
  brand: string | null;
  family: string | null;
  subcategory: string | null;
  model: string | null;
  imageUrl: string | null;
  images: any | null; // using any since Prisma Json maps to diverse types in TS by default
  color: string | null;
  warranty: string | null;
  shipping: string | null;
  storeClassification: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
