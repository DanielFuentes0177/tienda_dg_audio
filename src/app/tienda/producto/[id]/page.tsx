import React, { cache } from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AddToCartButton } from "./AddToCartButton";
import { ChevronRight, ShieldCheck, Truck, Headphones } from "lucide-react";
import { Metadata } from "next";
import { PRODUCT_SEO_PILOT_4, getProductIdForRoute, getProductUrl } from "@/lib/seo/productSeoPilot4";
import { PRODUCT_SEO_PILOT_44 } from "@/lib/seo/productSeoPilot44";
import { PRODUCT_SEO_BATCH_002_100 } from "@/lib/seo/productSeoBatch002";
import { ProductCard } from "@/components/molecules/ProductCard";
import { ProductGallery } from "@/components/organisms/ProductGallery";

const getColorHex = (colorName: string) => {
  const lower = colorName.toLowerCase();
  if (lower.includes('negro') || lower.includes('black')) return '#000000';
  if (lower.includes('blanco') || lower.includes('white')) return '#ffffff';
  if (lower.includes('plata') || lower.includes('silver')) return '#c0c0c0';
  if (lower.includes('gris') || lower.includes('grey') || lower.includes('gray')) return '#808080';
  if (lower.includes('rojo') || lower.includes('red')) return '#ff0000';
  if (lower.includes('azul') || lower.includes('blue')) return '#0000ff';
  if (lower.includes('madera') || lower.includes('wood')) return '#8b5a2b';
  if (lower.includes('fibra') || lower.includes('carbon')) return '#333333';
  return '#e5e7eb'; // default grey
}

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

const getActiveProduct = cache(async (routeId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: getProductIdForRoute(routeId), isActive: true },
  });
  if (!product) notFound();
  return product;
});

function getShareImage(imageUrl: string | null, gallery: unknown) {
  const candidates = [imageUrl, ...(Array.isArray(gallery) ? gallery : [])];
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const value = candidate.trim();
    if (!/^(?:https?:\/\/|\/(?!\/))/i.test(value) || value.includes("\\")) continue;
    try {
      const url = new URL(value, "https://www.dgaudiosound.com");
      if (!url.username && !url.password) return url.href;
    } catch {
      // Try the next image saved for this product.
    }
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getActiveProduct((await params).id);
  // Prioridad: 44 previamente liberados, luego lote 002 de 100 y piloto inicial de 4.
  // Metadatos SEO solamente: no toca catálogo, DB, URLs ni descripciones visibles.
  const seo = PRODUCT_SEO_PILOT_44[product.id] ?? PRODUCT_SEO_BATCH_002_100[product.id] ?? PRODUCT_SEO_PILOT_4[product.id];
  if (!seo) {
    return {
      title: `${product.name} | DG Audiosound`,
      description: product.description.substring(0, 160),
    };
  }
  const { title, description } = seo;
  const url = getProductUrl(product.id);
  const image = getShareImage(product.imageUrl, product.images);
  const images = image ? [image] : [];
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, images,
      siteName: "DG Audiosound", locale: "es_MX", type: "website",
    },
    twitter: { title, description, images, card: image ? "summary_large_image" : "summary" },
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const product = await getActiveProduct((await params).id);

  // Fetch related products (same category or brand)
  const relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      OR: [
        { category: product.category },
        { brand: product.brand }
      ]
    },
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  const imagesArray = Array.isArray(product.images) && product.images.length > 0 
    ? product.images as string[] 
    : (product.imageUrl ? [product.imageUrl] : []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Breadcrumbs Header */}
      <div 
        className="section-black"
        style={{ 
          paddingTop: '120px', 
          paddingBottom: '40px', 
          background: 'linear-gradient(to right, #1c1f26 0%, #050505 100%)',
          color: 'white',
          borderBottom: '1px solid #333'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
          <Link href="/tienda" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}>
            Catálogo
          </Link>
          <ChevronRight size={14} />
          {product.category && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{product.category}</span>
              <ChevronRight size={14} />
            </>
          )}
          <span style={{ color: '#d4a437', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'flex-start' }}>
          
          {/* Image Gallery Column */}
          <div style={{ height: '600px' }}>
            <ProductGallery images={imagesArray} productName={product.name} />
          </div>

          {/* Product Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              {product.brand && (
                <div style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {product.brand}
                </div>
              )}
              <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', lineHeight: 1.2, marginBottom: '0.5rem' }}>
                {product.name}
              </h1>
              {product.model && (
                <div style={{ color: '#6b7280', fontSize: '1rem' }}>
                  Modelo: <span style={{ fontWeight: 500, color: '#374151' }}>{product.model}</span>
                </div>
              )}
            </div>

            {/* Tags/Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {product.family && (
                <span style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {product.family}
                </span>
              )}
              {product.subcategory && (
                <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {product.subcategory}
                </span>
              )}
            </div>

            {/* Colors */}
            {product.color && (
              <div style={{ marginTop: '0.5rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Color / Acabado
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    backgroundColor: getColorHex(product.color), 
                    border: '1px solid #d1d5db',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' 
                  }} title={product.color} />
                  <span style={{ fontSize: '1rem', color: '#4b5563', fontWeight: 500 }}>{product.color}</span>
                </div>
              </div>
            )}

            {/* Description */}
            <div style={{ color: '#4b5563', lineHeight: 1.7, fontSize: '1rem', whiteSpace: 'pre-line' }}>
              {product.description || "Este producto no tiene una descripción detallada en el catálogo."}
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '1rem' }}>
              <AddToCartButton product={product} />
            </div>

            {/* Trust Badges */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              {product.warranty && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: '#10b981', backgroundColor: '#ecfdf5', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>Garantía</div>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>{product.warranty}</div>
                  </div>
                </div>
              )}
              {product.shipping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: '#3b82f6', backgroundColor: '#eff6ff', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
                    <Truck size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>Envío</div>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>{product.shipping}</div>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ color: '#8b5cf6', backgroundColor: '#f5f3ff', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
                  <Headphones size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>Soporte Especializado</div>
                  <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>Asesoría en tu compra e instalación</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '5rem 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                  Productos Relacionados
                </h2>
                <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                  Complementa tu equipo con estas sugerencias.
                </p>
              </div>
              <Link 
                href="/tienda" 
                style={{ color: '#d4a437', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                Ver todo <ChevronRight size={20} />
              </Link>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '2rem' 
            }}>
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
