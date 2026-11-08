"use client";

import React, { useCallback } from "react";
import type { CatalogProduct } from "@/lib/public-product";
import { ProductCard } from "@/components/molecules/ProductCard";
import styles from "./StoreTemplate.module.css";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface StoreTemplateProps {
  products: CatalogProduct[];
  categories: string[];
  brands: string[];
  families: string[];
}

export const StoreTemplate: React.FC<StoreTemplateProps> = ({ 
  products, 
  categories, 
  brands, 
  families
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const deferredSearchTerm = React.useDeferredValue(searchTerm);
  const [currentCategory, setCurrentCategory] = React.useState<string | null>(null);
  const [currentBrand, setCurrentBrand] = React.useState<string | null>(null);
  const [currentFamily, setCurrentFamily] = React.useState<string | null>(null);
  const [currentSort, setCurrentSort] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 24;

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearchTerm, currentCategory, currentBrand, currentFamily, currentSort]);

  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    if (currentCategory) {
      filtered = filtered.filter(p => p.category === currentCategory);
    }
    if (currentBrand) {
      filtered = filtered.filter(p => p.brand === currentBrand);
    }
    if (currentFamily) {
      filtered = filtered.filter(p => p.family === currentFamily);
    }
    if (deferredSearchTerm) {
      const lower = deferredSearchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        (p.name && String(p.name).toLowerCase().includes(lower)) ||
        (p.description && String(p.description).toLowerCase().includes(lower)) ||
        (p.model && String(p.model).toLowerCase().includes(lower))
      );
    }

    if (currentSort === 'name_asc') {
      filtered = [...filtered].sort((a, b) => String(a.name).localeCompare(String(b.name)));
    }

    return filtered;
  }, [products, currentCategory, currentBrand, currentFamily, deferredSearchTerm, currentSort]);

  const totalCount = filteredProducts.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #e5e7eb' }}>
          <SlidersHorizontal size={20} color="#d4a437" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Filtros</h2>
        </div>

        {/* Search */}
        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>Buscar</h3>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Categoría</h3>
            <div className={styles.filterList}>
                <label className={`${styles.filterLabel} ${!currentCategory ? styles.active : ""}`}>
                  <input 
                    type="radio" 
                    checked={!currentCategory}
                    onChange={() => setCurrentCategory(null)}
                    style={{ display: 'none' }}
                  />
                  Todas las categorías
                </label>
                {categories.map(cat => (
                  <label key={cat} className={`${styles.filterLabel} ${currentCategory === cat ? styles.active : ""}`}>
                    <input 
                      type="radio" 
                      checked={currentCategory === cat}
                      onChange={() => setCurrentCategory(cat)}
                      style={{ display: 'none' }}
                    />
                  {cat}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Marca</h3>
            <div className={styles.filterList}>
              <label className={`${styles.filterLabel} ${!currentBrand ? styles.active : ""}`}>
                <input 
                  type="radio" 
                  checked={!currentBrand}
                  onChange={() => setCurrentBrand(null)}
                  style={{ display: 'none' }}
                />
                Todas las marcas
              </label>
              {brands.map(brand => (
                <label key={brand} className={`${styles.filterLabel} ${currentBrand === brand ? styles.active : ""}`}>
                  <input 
                    type="radio" 
                    checked={currentBrand === brand}
                    onChange={() => setCurrentBrand(brand)}
                    style={{ display: 'none' }}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Families */}
        {families.length > 0 && (
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Familia</h3>
            <div className={styles.filterList}>
              <label className={`${styles.filterLabel} ${!currentFamily ? styles.active : ""}`}>
                <input 
                  type="radio" 
                  checked={!currentFamily}
                  onChange={() => setCurrentFamily(null)}
                  style={{ display: 'none' }}
                />
                Todas las familias
              </label>
              {families.map(family => (
                <label key={family} className={`${styles.filterLabel} ${currentFamily === family ? styles.active : ""}`}>
                  <input 
                    type="radio" 
                    checked={currentFamily === family}
                    onChange={() => setCurrentFamily(family)}
                    style={{ display: 'none' }}
                  />
                  {family}
                </label>
              ))}
            </div>
          </div>
        )}

        {(currentCategory || currentBrand || currentFamily || searchTerm) && (
          <button 
            className={styles.clearFiltersBtn}
            onClick={() => {
              setSearchTerm('');
              setCurrentCategory(null);
              setCurrentBrand(null);
              setCurrentFamily(null);
              setCurrentSort('');
            }}
          >
            Limpiar todos los filtros
          </button>
        )}
      </aside>

      <div className={styles.grid}>
        <div className={styles.header}>
          <div className={styles.resultsCount}>
            <span style={{ fontWeight: 700, color: '#111827' }}>{totalCount}</span> productos encontrados
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Ordenar por:</label>
            <select 
              value={currentSort}
              onChange={(e) => setCurrentSort(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="">Más recientes</option>
              <option value="name_asc">Nombre: A - Z</option>
            </select>
          </div>
        </div>

        {paginatedProducts.length > 0 ? (
          <>
            <motion.div 
              key={currentPage + (currentCategory || '') + (currentBrand || '') + currentSort} // Force re-animation on filter/page change
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className={styles.productsGrid}
            >
              {paginatedProducts.map(product => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  disabled={currentPage <= 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={styles.pageBtn}
                >
                  <ChevronLeft size={20} /> Anterior
                </button>
                <div className={styles.pageInfo}>
                  Página <strong>{currentPage}</strong> de {totalPages}
                </div>
                <button 
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={styles.pageBtn}
                >
                  Siguiente <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.emptyState}
          >
            <div style={{ backgroundColor: '#f3f4f6', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <Search size={40} color="#9ca3af" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>No se encontraron productos</h3>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', maxWidth: '400px' }}>
              Intenta cambiar o quitar algunos filtros de búsqueda para ver más resultados.
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setCurrentCategory(null);
                setCurrentBrand(null);
                setCurrentFamily(null);
                setCurrentSort('');
              }}
              style={{
                marginTop: '2rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#111827',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#111827'}
            >
              Limpiar todos los filtros
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
