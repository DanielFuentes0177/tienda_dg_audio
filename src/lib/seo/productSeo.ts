// DG Audiosound — rutas SEO. Los UUID siguen siendo las claves de carrito y cotizaciones.
export const STORE_ORIGIN = "https://www.dgaudiosound.com";
export type ProductRouteRef = { id: string; slug?: string | null };
export function productPath(product: ProductRouteRef): string {
  return "/tienda/producto/" + (product.slug || product.id);
}
export function productUrl(product: ProductRouteRef): string {
  return STORE_ORIGIN + productPath(product);
}
export function publicImage(image: unknown): string | null {
  if (typeof image !== "string") return null;
  return /^https?:\/\//i.test(image) ? image : null;
}
