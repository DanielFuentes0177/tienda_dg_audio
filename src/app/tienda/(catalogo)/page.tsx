import { PrismaClient } from "@prisma/client";
import { StoreTemplate } from "@/components/templates/StoreTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo | DG Audiosound",
  description: "Explora nuestro catálogo de productos de audio y accesorios premium.",
};

import prisma from "@/lib/prisma";
export const dynamic = 'force-dynamic';

import { Suspense } from "react";

// The loader to show while the catalog data is being fetched
function CatalogLoader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '1.5rem' }}>
      <div style={{ position: 'relative', width: '60px', height: '60px' }}>
        <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(212, 164, 55, 0.1)', borderTopColor: '#d4a437', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ position: 'absolute', inset: '15px', backgroundColor: 'rgba(212, 164, 55, 0.2)', borderRadius: '50%', animation: 'pulse 1.5s ease-in-out infinite', boxShadow: '0 0 15px rgba(212, 164, 55, 0.3)' }} />
      </div>
      <p style={{ color: '#d4a437', fontWeight: 600, letterSpacing: '0.05em' }}>Cargando inventario...</p>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } }
      `}</style>
    </div>
  );
}

// Async component that fetches data and renders the template
async function CatalogDataFetcher() {
  const [products, categoriesRaw, brandsRaw, familiesRaw] = await Promise.all([
    prisma.product.findMany({ 
      where: { isActive: true }, 
      orderBy: { createdAt: 'desc' } 
    }),
    prisma.product.findMany({ select: { category: true }, distinct: ['category'], where: { isActive: true, category: { not: null } } }),
    prisma.product.findMany({ select: { brand: true }, distinct: ['brand'], where: { isActive: true, brand: { not: null } } }),
    prisma.product.findMany({ select: { family: true }, distinct: ['family'], where: { isActive: true, family: { not: null } } })
  ]);

  const categories = categoriesRaw.map(c => c.category as string).sort();
  const brands = brandsRaw.map(b => b.brand as string).sort();
  const families = familiesRaw.map(f => f.family as string).sort();

  return (
    <StoreTemplate 
      products={products} 
      categories={categories}
      brands={brands}
      families={families}
    />
  );
}

// Synchronous page component: navigates instantly
export default function TiendaPage() {
  return (
    <>
      {/* Landing-Matched Premium Hero Section */}
      <div 
        className="section-dark"
        style={{ 
          paddingTop: '180px', 
          paddingBottom: '120px', 
          textAlign: 'center',
          backgroundImage: 'linear-gradient(to bottom, rgba(10, 11, 14, 0.78) 0%, rgba(10, 11, 14, 0.92) 100%), url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Subtle Warm Light Glow */}
        <div 
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 164, 55, 0.08) 0%, rgba(0, 0, 0, 0) 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* Content Container */}
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          
          <div 
            style={{ 
              display: 'inline-block', 
              border: '1px solid #d4a437', 
              padding: '0.45rem 1.25rem', 
              borderRadius: '99px', 
              marginBottom: '1.75rem', 
              color: '#d4a437', 
              fontSize: '0.8rem', 
              fontWeight: 600, 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase',
              backgroundColor: 'rgba(212, 164, 55, 0.03)'
            }}
          >
            Soluciones de Audio Profesional
          </div>
          
          <h1 
            style={{ 
              fontSize: '3.85rem', 
              lineHeight: 1.15,
              marginBottom: '1.5rem', 
              fontWeight: 700, 
              letterSpacing: '-0.02em',
              color: '#ffffff',
              fontFamily: 'var(--font-heading)'
            }}
          >
            Equipos y componentes que <br />
            <span style={{ color: '#d4a437' }}>elevan la experiencia</span> <br />
            <span style={{ color: '#d4a437' }}>acústica de tu negocio.</span>
          </h1>
          
          <p 
            style={{ 
              color: 'rgba(255, 255, 255, 0.75)', 
              fontSize: '1.2rem', 
              maxWidth: '650px', 
              margin: '0 auto 3rem auto', 
              lineHeight: 1.6,
              fontFamily: 'var(--font-body)'
            }}
          >
            Transformamos el sonido de tu espacio en una experiencia de alta fidelidad. 
            Diseño, integración y marcas premium para antros, restaurantes, barberías y auditorios a tu alcance.
          </p>

          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '1rem', 
              flexWrap: 'wrap',
              maxWidth: '850px',
              margin: '0 auto 3rem auto'
            }}
          >
            {[
              { label: 'Audio Comercial', icon: '🔊' },
              { label: 'Sistemas Lineales', icon: '🔈' },
              { label: 'Procesadores y DSP', icon: '🎛️' },
              { label: 'Amplificadores High-End', icon: '⚡' }
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  padding: '0.65rem 1.35rem',
                  borderRadius: '99px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <a 
              href="https://wa.me/525537270177?text=Hola,%20quisiera%20cotizar%20un%20proyecto" 
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                padding: '0.85rem 2rem',
                fontSize: '0.95rem',
                boxShadow: '0 4px 15px rgba(212, 164, 55, 0.25)',
                display: 'inline-block'
              }}
            >
              Cotizar mi proyecto
            </a>
            <a 
              href="#catalogo-store"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                backgroundColor: 'rgba(255,255,255,0.03)',
                padding: '0.85rem 2rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                display: 'inline-block'
              }}
            >
              Explorar catálogo
            </a>
          </div>

        </div>
      </div>

      {/* Main Catalog Body */}
      <div id="catalogo-store" className="section-light-alt" style={{ minHeight: '100vh', paddingBottom: '4rem', paddingTop: '3rem', backgroundColor: '#f5f5f7' }}>
        <Suspense fallback={<CatalogLoader />}>
          <CatalogDataFetcher />
        </Suspense>
      </div>
    </>
  );
}
