import React, { useState } from "react";
import { Product } from "@/types/product.types";
import styles from "./ProductForm.module.css";
import { useImageUpload } from "@/hooks/useImageUpload";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, X, Star, UploadCloud, ImageOff } from "lucide-react";

type ImageItem = 
  | { type: 'existing', url: string }
  | { type: 'new', file: File, previewUrl: string };

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}

export const ProductForm = ({ initialData, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    stock: initialData?.stock || 0,
    isActive: initialData?.isActive !== false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { uploadImage, isUploading } = useImageUpload();

  const initialImages: ImageItem[] = (Array.isArray(initialData?.images) && initialData.images.length > 0
    ? initialData.images 
    : (initialData?.imageUrl ? [initialData.imageUrl] : [])).map((url: string) => ({ type: 'existing', url }));
    
  const [images, setImages] = useState<ImageItem[]>(initialImages);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: string | number | boolean = value;
    if (type === "number") {
      parsedValue = value === "" ? "" : Number(value);
    } else if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const validateAndAddFiles = (files: FileList | File[]) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const addedFiles: ImageItem[] = [];

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`El archivo ${file.name} supera los 5MB.`);
        return;
      }
      if (!validTypes.includes(file.type)) {
        toast.error(`Formato no soportado para ${file.name}.`);
        return;
      }
      addedFiles.push({ type: 'new', file, previewUrl: URL.createObjectURL(file) });
    });

    setImages(prev => [...prev, ...addedFiles]);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === images.length - 1) return;

    setImages(prev => {
      const newImages = [...prev];
      const newIndex = direction === 'left' ? index - 1 : index + 1;
      const temp = newImages[index];
      newImages[index] = newImages[newIndex];
      newImages[newIndex] = temp;
      return newImages;
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const loadingToast = toast.loading("Guardando producto...");
    
    try {
      const finalUrls: string[] = [];
      
      for (const item of images) {
        if (item.type === 'existing') {
          finalUrls.push(item.url);
        } else {
          const url = await uploadImage(item.file);
          if (url) {
            finalUrls.push(url);
          } else {
            throw new Error("No se pudo subir una de las imágenes");
          }
        }
      }

      const primaryImageUrl = finalUrls.length > 0 ? finalUrls[0] : null;

      await onSubmit({ 
        ...formData, 
        imageUrl: primaryImageUrl || "",
        images: finalUrls 
      });
      
      toast.dismiss(loadingToast);
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Ocurrió un error al guardar el producto", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const MAX_IMAGES_HINT = "JPG, PNG o WEBP · máx. 5 MB por imagen";
  const busy = isSubmitting || isUploading;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.col}>
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Información</h3>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-name">Nombre del producto</label>
            <input id="pf-name" required type="text" name="name" value={formData.name as string} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.field}>
            <div className={styles.rowBetween}>
              <label className={styles.label} htmlFor="pf-desc">Descripción</label>
              <span className={styles.hint}>{String(formData.description ?? "").length} caracteres</span>
            </div>
            <textarea id="pf-desc" required name="description" value={formData.description as string} onChange={handleChange} className={styles.textarea} />
            <span className={styles.hint}>Es el texto que ve el cliente y el que usa Google. Conviene que tenga al menos 200 caracteres.</span>
          </div>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Imágenes <span className={styles.hint}>({images.length})</span></h3>
          <div
            className={`${styles.drop} ${isDragging ? styles.dropActive : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) validateAndAddFiles(e.dataTransfer.files);
            }}
            onClick={() => document.getElementById("image-upload")?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); document.getElementById("image-upload")?.click(); } }}
          >
            <UploadCloud size={28} />
            <p className={styles.dropTitle}>Arrastra imágenes aquí o haz clic para elegirlas</p>
            <p className={styles.dropHint}>{MAX_IMAGES_HINT}</p>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/jpeg, image/png, image/webp"
              onChange={(e) => { if (e.target.files) validateAndAddFiles(e.target.files); e.target.value = ""; }}
              style={{ display: "none" }}
            />
          </div>

          {images.length > 0 && (
            <div className={styles.grid}>
              {images.map((item, i) => (
                <div key={i} className={`${styles.tile} ${i === 0 ? styles.tileMain : ""}`}>
                  {i === 0 && <span className={styles.badge}><Star size={11} fill="currentColor" /> Portada</span>}
                  <div className={styles.imgBox}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.type === "existing" ? item.url : item.previewUrl}
                      alt={`Imagen ${i + 1}`}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                    <ImageOff size={22} />
                  </div>
                  <div className={styles.tileBar}>
                    <button type="button" className={styles.tileBtn} disabled={i === 0} onClick={() => moveImage(i, "left")} title="Mover antes" aria-label="Mover imagen antes"><ArrowLeft size={15} /></button>
                    <button type="button" className={styles.tileBtn} disabled={i === images.length - 1} onClick={() => moveImage(i, "right")} title="Mover después" aria-label="Mover imagen después"><ArrowRight size={15} /></button>
                    <button type="button" className={`${styles.tileBtn} ${styles.tileDanger}`} onClick={() => removeImage(i)} title="Quitar imagen" aria-label="Quitar imagen"><X size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {images.length > 1 && <p className={styles.hint} style={{ marginTop: "0.75rem" }}>La primera imagen es la portada: aparece en el catálogo y al compartir el enlace.</p>}
        </section>
      </div>

      <aside className={styles.col}>
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Publicación</h3>
          <div className={styles.switchRow}>
            <div>
              <div className={styles.label}>Visible en la tienda</div>
              <div className={styles.hint}>{formData.isActive ? "Los clientes pueden verlo." : "Oculto: no aparece en la tienda."}</div>
            </div>
            <span className={styles.switch}>
              <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive as boolean} onChange={handleChange} aria-label="Visible en la tienda" />
              <span className={styles.track} />
            </span>
          </div>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Inventario</h3>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-stock">Stock</label>
            <input id="pf-stock" required type="number" min={0} name="stock" value={formData.stock as number} onChange={handleChange} className={styles.input} />
            <span className={styles.hint}>El catálogo trabaja por cotización; puedes dejarlo en 0.</span>
          </div>
        </section>

        <div className={styles.actions}>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={busy}>
            {busy ? "Guardando..." : "Guardar producto"}
          </button>
          <button type="button" className={styles.btn} onClick={onCancel} disabled={busy}>Cancelar</button>
        </div>
      </aside>
    </form>
  );
};
