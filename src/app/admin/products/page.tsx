"use client";

import React, { useState, useRef, useDeferredValue, useEffect } from "react";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { Product } from "@/types/product.types";
import { ProductForm } from "@/components/organisms/ProductForm";
import { ImportPreviewModal } from "@/components/organisms/ImportPreviewModal";
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Download, Search, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import styles from "./products.module.css";
import toast from "react-hot-toast";
import Papa from "papaparse";

export default function AdminProductsPage() {
  const { products, isLoading, error, addProduct, updateProduct, toggleProductStatus, hardDeleteProduct } = useAdminProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  // Filtros
  const [filterImage, setFilterImage] = useState<"all" | "with" | "without">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  // Import states
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewSummary, setPreviewSummary] = useState({ newCount: 0, modifiedCount: 0, unmodifiedCount: 0, imageConflictsCount: 0 });
  const [productsToImport, setProductsToImport] = useState<{ newProducts: any[], modifiedProducts: any[] }>({ newProducts: [], modifiedProducts: [] });

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearchTerm, filterImage, filterStatus]);

  const handleOpenForm = (product?: Product) => {
    setEditingProduct(product || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const loadingToast = toast.loading("Procesando archivo CSV...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const mappedProducts = results.data.map((row: any) => {
            const imgCol = row.Imagen || row.Imagen_URL || row.Imagen_1 || row.Image || null;
            
            return {
              ...(row.ID_Producto ? { id: row.ID_Producto } : {}),
              name: row.Nombre_Producto || row.Producto_Comercial || "Sin Nombre",
              description: row.Descripcion_Comercial || row.Descripcion_Corta || "",
              stock: 0,
              category: row.Categoria || null,
              brand: row.Marca || null,
              family: row.Familia_Catalogo || null,
              subcategory: row.Subcategoria || null,
              model: row.Modelo || null,
              ...(imgCol ? { imageUrl: imgCol, images: [imgCol] } : {}),
              isActive: row.Publicar !== 'No',
            };
          });

          toast.loading("Generando previsualización de importación...", { id: loadingToast });

          const response = await fetch('/api/products/import-preview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mappedProducts)
          });

          const resData = await response.json();
          if (!response.ok) throw new Error(resData.error);

          setPreviewSummary({
            newCount: resData.newProducts.length,
            modifiedCount: resData.modifiedProducts.length,
            unmodifiedCount: resData.unmodifiedCount,
            imageConflictsCount: resData.imageConflictsCount
          });

          setProductsToImport({
            newProducts: resData.newProducts,
            modifiedProducts: resData.modifiedProducts
          });

          toast.dismiss(loadingToast);
          setIsPreviewModalOpen(true);
          setIsUploading(false);
        } catch (err: any) {
          toast.error(`Error: ${err.message}`, { id: loadingToast });
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
      error: (error: any) => {
        toast.error(`Error al leer el archivo: ${error.message}`, { id: loadingToast });
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  const handleConfirmImport = async (imageAction: "keep" | "replace") => {
    setIsUploading(true);
    const loadingToast = toast.loading("Guardando productos en la base de datos...");
    try {
      const allToImport = [
        ...productsToImport.newProducts,
        ...productsToImport.modifiedProducts
      ];

      const response = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: allToImport,
          imageAction
        })
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error);

      toast.success(`Se importaron ${resData.count} productos exitosamente`, { id: loadingToast });
      setIsPreviewModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(`Error: ${err.message}`, { id: loadingToast });
      setIsUploading(false);
    }
  };

  const handleSubmit = async (data: Partial<Product>) => {
    const action = editingProduct 
      ? updateProduct(editingProduct.id, data) 
      : addProduct(data);
      
    toast.promise(action, {
      loading: editingProduct ? "Actualizando producto..." : "Guardando producto...",
      success: editingProduct ? "Producto actualizado correctamente" : "Producto creado correctamente",
      error: (err) => err.message || "Error al guardar el producto"
    });

    try {
      await action;
      handleCloseForm();
    } catch (e) {
      // Error manejado por toast
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    toast.promise(toggleProductStatus(id, currentStatus), {
      loading: currentStatus ? "Deshabilitando..." : "Habilitando...",
      success: currentStatus ? "Producto deshabilitado (oculto)" : "Producto habilitado (visible)",
      error: (err) => err.message || "Error al cambiar estado"
    });
  };

  const confirmDelete = (id: string, name: string) => {
    toast((t) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p style={{ margin: 0, fontWeight: 500 }}>¿Eliminar permanentemente <b>{name}</b>?</p>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>Esta acción no se puede deshacer.</p>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button 
            onClick={() => toast.dismiss(t.id)}
            style={{ padding: "0.25rem 0.75rem", borderRadius: "4px", border: "1px solid #ccc", background: "white", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button 
            onClick={() => {
              toast.dismiss(t.id);
              handleDelete(id);
            }}
            style={{ padding: "0.25rem 0.75rem", borderRadius: "4px", border: "none", background: "#ef4444", color: "white", cursor: "pointer" }}
          >
            Eliminar Físicamente
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleDelete = async (id: string) => {
    toast.promise(hardDeleteProduct(id), {
      loading: "Eliminando producto...",
      success: "Producto eliminado permanentemente",
      error: (err) => err.message || "Error al eliminar"
    });
  };

  if (isLoading && products.length === 0) {
    return (
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "200px", height: "40px", background: "#f0f0f0", borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
          <div style={{ width: "150px", height: "40px", background: "#f0f0f0", borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
        </div>
        <div style={{ width: "100%", height: "400px", background: "#f0f0f0", borderRadius: "12px", animation: "pulse 1.5s infinite" }} />
        <style>{`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  const filteredProducts = products.filter(p => {
    // 1. Búsqueda por texto
    if (deferredSearchTerm) {
      const searchLower = String(deferredSearchTerm).toLowerCase();
      const matchesSearch = (
        (p.name && String(p.name).toLowerCase().includes(searchLower)) ||
        (p.description && String(p.description).toLowerCase().includes(searchLower)) ||
        (p.model && String(p.model).toLowerCase().includes(searchLower))
      );
      if (!matchesSearch) return false;
    }

    // 2. Filtro de Imagen
    if (filterImage === "with" && !p.imageUrl) return false;
    if (filterImage === "without" && p.imageUrl) return false;

    // 3. Filtro de Estado
    if (filterStatus === "active" && !p.isActive) return false;
    if (filterStatus === "inactive" && p.isActive) return false;


    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeCount = products.filter((p) => p.isActive).length;
  const withoutImageCount = products.filter((p) => !p.imageUrl).length;
  const hasFilters = Boolean(searchTerm) || filterImage !== "all" || filterStatus !== "all";
  const clearFilters = () => { setSearchTerm(""); setFilterImage("all"); setFilterStatus("all"); };
  const applyStat = (status: typeof filterStatus, image: typeof filterImage) => { setFilterStatus(status); setFilterImage(image); };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Productos</h1>
          <p className={styles.subtitle}>Administra el catálogo de la tienda: visibilidad, imágenes e importación.</p>
        </div>
        <div className={styles.actions}>
          <input type="file" accept=".csv" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileUpload} />
          <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <Upload size={18} /> {isUploading ? "Subiendo..." : "Importar CSV"}
          </button>
          <a className={`${styles.btn} ${styles.btnGhost}`} href="/api/products/export" download>
            <Download size={18} /> Descargar Excel
          </a>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleOpenForm()} disabled={isUploading}>
            <Plus size={18} /> Nuevo producto
          </button>
        </div>
      </div>

      {!isFormOpen && (
        <>
          <div className={styles.stats}>
            <button type="button" className={`${styles.stat} ${filterStatus === "all" && filterImage === "all" ? styles.statActive : ""}`} onClick={() => applyStat("all", "all")}>
              <span className={styles.statValue}>{products.length}</span><span className={styles.statLabel}>Productos en total</span>
            </button>
            <button type="button" className={`${styles.stat} ${filterStatus === "active" && filterImage === "all" ? styles.statActive : ""}`} onClick={() => applyStat("active", "all")}>
              <span className={styles.statValue}>{activeCount}</span><span className={styles.statLabel}>Visibles en la tienda</span>
            </button>
            <button type="button" className={`${styles.stat} ${filterStatus === "inactive" && filterImage === "all" ? styles.statActive : ""}`} onClick={() => applyStat("inactive", "all")}>
              <span className={styles.statValue}>{products.length - activeCount}</span><span className={styles.statLabel}>Ocultos</span>
            </button>
            <button type="button" className={`${styles.stat} ${styles.statWarn} ${filterImage === "without" && filterStatus === "all" ? styles.statActive : ""}`} onClick={() => applyStat("all", "without")}>
              <span className={styles.statValue}>{withoutImageCount}</span><span className={styles.statLabel}>Sin imagen</span>
            </button>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.search}>
              <Search size={18} />
              <input className={styles.input} type="search" placeholder="Buscar por nombre, modelo o descripción" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Buscar productos" />
            </div>
            <select className={styles.select} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)} aria-label="Filtrar por estado">
              <option value="all">Todos los estados</option>
              <option value="active">Visibles</option>
              <option value="inactive">Ocultos</option>
            </select>
            <select className={styles.select} value={filterImage} onChange={(e) => setFilterImage(e.target.value as typeof filterImage)} aria-label="Filtrar por imagen">
              <option value="all">Con o sin imagen</option>
              <option value="with">Con imagen</option>
              <option value="without">Sin imagen</option>
            </select>
            {hasFilters && <button type="button" className={styles.clear} onClick={clearFilters}>Limpiar filtros</button>}
            <span className={styles.count}>{filteredProducts.length} de {products.length} productos</span>
          </div>
        </>
      )}

      {error && <div className={styles.error}>Error: {error}</div>}

      {isFormOpen ? (
        <div style={{ marginBottom: "2rem" }}>
          <ProductForm initialData={editingProduct || undefined} onSubmit={handleSubmit} onCancel={handleCloseForm} />
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th style={{ width: "130px" }}>Estado</th>
                  <th className={styles.thCenter} style={{ width: "230px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className={styles.product}>
                        <div className={styles.thumb}>
                          {product.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.imageUrl} alt="" loading="lazy" />
                          ) : (
                            <ImageOff size={20} aria-label="Sin imagen" />
                          )}
                        </div>
                        <div className={styles.info}>
                          <div className={styles.name} title={product.name}>{product.name}</div>
                          <div className={styles.meta}>
                            {product.brand && <span className={styles.chip}>{product.brand}</span>}
                            {product.model && <span className={styles.chip}>{product.model}</span>}
                            {product.category && <span className={styles.chip}>{product.category}</span>}
                            {!product.imageUrl && <span className={`${styles.chip} ${styles.noImg}`}>Sin imagen</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${product.isActive ? styles.on : styles.off}`}>
                        {product.isActive ? "Visible" : "Oculto"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button className={styles.rowBtn} onClick={() => handleOpenForm(product)} aria-label={`Editar ${product.name}`}>
                          <Edit size={15} /> Editar
                        </button>
                        <button
                          className={`${styles.rowBtn} ${styles.iconBtn}`}
                          onClick={() => handleToggleStatus(product.id, product.isActive)}
                          title={product.isActive ? "Ocultar de la tienda" : "Mostrar en la tienda"}
                          aria-label={product.isActive ? `Ocultar ${product.name}` : `Mostrar ${product.name}`}
                        >
                          {product.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          className={`${styles.rowBtn} ${styles.iconBtn} ${styles.danger}`}
                          onClick={() => confirmDelete(product.id, product.name)}
                          title="Eliminar permanentemente"
                          aria-label={`Eliminar ${product.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProducts.length === 0 && (
            <div className={styles.empty}>
              {products.length === 0 ? "Aún no hay productos. Crea el primero con “Nuevo producto”." : "Ningún producto coincide con los filtros."}
              {hasFilters && <div style={{ marginTop: "0.5rem" }}><button type="button" className={styles.clear} onClick={clearFilters}>Limpiar filtros</button></div>}
            </div>
          )}
          {totalPages > 1 && (
            <div className={styles.pager}>
              <span>Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length}</span>
              <div className={styles.pagerBtns}>
                <button className={`${styles.rowBtn} ${styles.iconBtn}`} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} aria-label="Página anterior"><ChevronLeft size={16} /></button>
                <span>Página {currentPage} de {totalPages}</span>
                <button className={`${styles.rowBtn} ${styles.iconBtn}`} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} aria-label="Página siguiente"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Import Preview Modal */}
      <ImportPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        onConfirm={handleConfirmImport}
        summary={previewSummary}
        isImporting={isUploading}
      />
    </div>
  );
}
