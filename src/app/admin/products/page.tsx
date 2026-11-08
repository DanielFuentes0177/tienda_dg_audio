"use client";

import React, { useState, useRef, useDeferredValue, useEffect } from "react";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { Product } from "@/types/product.types";
import { Button } from "@/components/atoms/Button";
import { ProductForm } from "@/components/organisms/ProductForm";
import { ImportPreviewModal } from "@/components/organisms/ImportPreviewModal";
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Search, ChevronLeft, ChevronRight, ChevronDown, Check } from "lucide-react";
import toast from "react-hot-toast";
import Papa from "papaparse";

const CustomAdminSelect = ({ value, options, onChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <div ref={ref} style={{ position: "relative", minWidth: "200px" }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: "100%", padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)", backgroundColor: "white", fontSize: "0.9rem", color: "var(--text-primary)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        {options.find((o: any) => o.value === value)?.label}
        <ChevronDown size={16} style={{ color: "#666", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {isOpen && (
        <div style={{ position: "absolute", top: "100%", left: 0, width: "100%", marginTop: "0.25rem", backgroundColor: "white", border: "1px solid var(--border-color)", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 50, padding: "0.25rem" }}>
          {options.map((opt: any) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              style={{ width: "100%", padding: "0.5rem 0.75rem", textAlign: "left", background: value === opt.value ? "#f3f4f6" : "transparent", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.1s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
              onMouseLeave={(e) => e.currentTarget.style.background = value === opt.value ? "#f3f4f6" : "transparent"}
            >
              <span style={{ fontSize: "0.85rem", color: value === opt.value ? "#111827" : "#4b5563", fontWeight: value === opt.value ? 600 : 400 }}>{opt.label}</span>
              {value === opt.value && <Check size={14} style={{ color: "#111827" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
  const [filterStock, setFilterStock] = useState<"all" | "in_stock" | "out_of_stock">("all");

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  // Import states
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewSummary, setPreviewSummary] = useState({ newCount: 0, modifiedCount: 0, unmodifiedCount: 0, imageConflictsCount: 0 });
  const [productsToImport, setProductsToImport] = useState<{ newProducts: any[], modifiedProducts: any[] }>({ newProducts: [], modifiedProducts: [] });

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearchTerm, filterImage, filterStatus, filterStock]);

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

    // 4. Filtro de Stock
    if (filterStock === "in_stock" && p.stock <= 0) return false;
    if (filterStock === "out_of_stock" && p.stock > 0) return false;

    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="section-light" style={{ paddingTop: "100px", paddingLeft: "2rem", paddingRight: "2rem", paddingBottom: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="section-title" style={{ margin: 0, fontSize: "2rem" }}>Gestión de Productos</h1>
        
        <div style={{ display: "flex", gap: "1rem", flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
          <div style={{ position: "relative", maxWidth: "300px", width: "100%", marginRight: "1rem" }}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 1rem 0.5rem 2.5rem",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                boxSizing: "border-box",
                outline: "none"
              }}
            />
            <Search size={18} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
          <input 
            type="file" 
            accept=".csv" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          <a href="/admin/products/seo" style={{ display: "inline-flex", alignItems: "center", padding: "0.6rem 1rem", background: "#e7e0cf", color: "#1e293b", borderRadius: 8, fontWeight: 600, textDecoration: "none" }}>SEO · Lotes de 100</a>
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
            style={{ display: "flex", gap: "0.5rem", backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
          >
            <Upload size={20} />
            {isUploading ? "Subiendo..." : "Importar CSV"}
          </Button>
          <Button onClick={() => handleOpenForm()} style={{ display: "flex", gap: "0.5rem" }} disabled={isUploading}>
            <Plus size={20} />
            Nuevo Producto
          </Button>
        </div>
        </div>
      </div>

      {!isFormOpen && (
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <CustomAdminSelect 
            value={filterImage} 
            onChange={setFilterImage}
            options={[
              { value: "all", label: "Todas las imágenes" },
              { value: "with", label: "Con Imagen" },
              { value: "without", label: "Sin Imagen" }
            ]}
          />
          <CustomAdminSelect 
            value={filterStatus} 
            onChange={setFilterStatus}
            options={[
              { value: "all", label: "Todos los estados" },
              { value: "active", label: "Activos" },
              { value: "inactive", label: "Inactivos" }
            ]}
          />
          <CustomAdminSelect 
            value={filterStock} 
            onChange={setFilterStock}
            options={[
              { value: "all", label: "Todo el stock" },
              { value: "in_stock", label: "En Stock" },
              { value: "out_of_stock", label: "Agotados" }
            ]}
          />
        </div>
      )}

      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "8px", marginBottom: "2rem" }}>
          Error: {error}
        </div>
      )}

      {isFormOpen ? (
        <div style={{ marginBottom: "2rem" }}>
          <ProductForm 
            initialData={editingProduct || undefined} 
            onSubmit={handleSubmit} 
            onCancel={handleCloseForm} 
          />
        </div>
      ) : (
        <div style={{ backgroundColor: "var(--bg-primary)", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid #eee" }}>
              <tr>
                <th style={{ padding: "1rem", width: "60px" }}>Img</th>
                <th style={{ padding: "1rem" }}>Producto</th>
                <th style={{ padding: "1rem" }}>Stock</th>
                <th style={{ padding: "1rem" }}>Estado</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: "0.6rem", color: "#9ca3af" }}>N/A</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 600 }}>{product.name}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                      {product.description ? `${String(product.description).substring(0, 50)}...` : ""}
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>{product.stock}</td>
                  <td style={{ padding: "1rem" }}>
                    {product.isActive ? (
                      <span style={{ backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.875rem", fontWeight: 600 }}>
                        Activo
                      </span>
                    ) : (
                      <span style={{ backgroundColor: "#ffebee", color: "#c62828", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.875rem", fontWeight: 600 }}>
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", alignItems: "center", flexWrap: "nowrap" }}>
                      <button 
                        onClick={() => handleOpenForm(product)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-accent)", padding: 0 }}
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(product.id, product.isActive)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: product.isActive ? "#666" : "#2e7d32", padding: 0 }}
                        title={product.isActive ? "Deshabilitar" : "Habilitar"}
                      >
                        {product.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button 
                        onClick={() => confirmDelete(product.id, product.name)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#c62828", padding: 0 }}
                        title="Eliminar permanentemente"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                    No hay productos registrados. Crea uno nuevo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eee", backgroundColor: "white" }}>
              <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} productos
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd", background: currentPage === 1 ? "#f5f5f5" : "white", cursor: currentPage === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <ChevronLeft size={18} />
                </button>
                <span style={{ fontSize: "0.875rem", fontWeight: 500, margin: "0 0.5rem" }}>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd", background: currentPage === totalPages ? "#f5f5f5" : "white", cursor: currentPage === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <ChevronRight size={18} />
                </button>
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
