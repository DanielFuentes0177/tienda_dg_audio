import type { PublicProduct } from "@/lib/public-product";
import { Product } from "@/types/product.types";

const API_URL = "/api/products";

export const productsService = {
  async getAll(): Promise<Product[]> {
    const response = await fetch("/api/admin/products", { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  async getById(id: string): Promise<PublicProduct> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },

  async create(product: Partial<Product>): Promise<Product> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error("Failed to create product");
    return response.json();
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error("Failed to update product");
    return response.json();
  },

  async hardDelete(id: string): Promise<{ success: boolean; product: Product }> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to delete product");
    }
    return response.json();
  },
};
