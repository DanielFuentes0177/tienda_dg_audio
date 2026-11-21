"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./CheckoutPage.module.css";
import { ShoppingBag, ArrowRight, ShieldCheck, FileText } from "lucide-react";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    message: ""
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Guardar en la base de datos
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
          }))
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error al guardar la cotización");
      }

      // 2. Preparar mensaje de WhatsApp
      const phoneNumber = "525537270177";
      let waMessage = `¡Hola! Soy *${formData.customerName}*.\n\n`;
      waMessage += `He solicitado una cotización en su página web con el folio: *${data.quoteId.split('-')[0]}*\n\n`;
      waMessage += `*Artículos de interés:*\n`;
      
      items.forEach((item) => {
        waMessage += `• ${item.product.name} (Cant: ${item.quantity})\n`;
      });

      if (formData.message) {
        waMessage += `\n*Comentarios adicionales:*\n${formData.message}\n`;
      }

      waMessage += `\n¿Me podrían ayudar con la cotización de estos equipos? ¡Gracias!`;

      // 3. Abrir WhatsApp
      const encodedMessage = encodeURIComponent(waMessage);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");

      // 4. Mostrar pantalla de éxito y limpiar carrito
      setIsSubmitted(true);
      clearCart();
      
    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  if (isSubmitted) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <div style={{ backgroundColor: "var(--color-success-bg)", padding: "1.5rem", borderRadius: "50%", display: "inline-block", marginBottom: "1.5rem" }}>
              <ShieldCheck size={64} strokeWidth={1.5} color="var(--color-success)" />
            </div>
            <h2 style={{ color: "var(--text-main)", fontSize: "2rem", marginBottom: "1rem" }}>¡Solicitud Enviada con Éxito!</h2>
            <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "var(--text-muted)" }}>
              Hemos registrado tu solicitud. Un asesor la revisará y te contactará a la brevedad.
            </p>
            <Link href="/tienda" className={styles.backToStoreBtn}>
              Volver al catálogo <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <ShoppingBag size={80} strokeWidth={1.5} color="var(--border-soft)" style={{ margin: '0 auto 1.5rem' }} />
            <h2>No tienes artículos en tu lista</h2>
            <p>Agrega equipos desde el catálogo para solicitar una cotización formal.</p>
            <Link href="/tienda" className={styles.backToStoreBtn}>
              Ir al catálogo <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          <FileText className={styles.titleIcon} size={36} strokeWidth={2.5} />
          Solicitud de Cotización
        </h1>

        <div className={styles.content}>
          {/* Form Column */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Datos de Contacto</h2>
            <p className={styles.sectionSubtitle}>
              Por favor, completa tus datos para que un asesor pueda contactarte con tu cotización personalizada.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="customerName">Nombre Completo *</label>
                <input 
                  type="text" 
                  id="customerName"
                  name="customerName"
                  className={styles.input} 
                  placeholder="Ej. Juan Pérez"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="customerEmail">Correo Electrónico *</label>
                <input 
                  type="email" 
                  id="customerEmail"
                  name="customerEmail"
                  className={styles.input} 
                  placeholder="ejemplo@empresa.com"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="customerPhone">Teléfono / WhatsApp *</label>
                <input 
                  type="tel" 
                  id="customerPhone"
                  name="customerPhone"
                  className={styles.input} 
                  placeholder="55 1234 5678"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="message">Comentarios adicionales (Opcional)</label>
                <textarea 
                  id="message"
                  name="message"
                  className={styles.textarea} 
                  placeholder="¿Tienes alguna pregunta específica sobre instalación, tiempos de entrega o requerimientos del proyecto?"
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting || !formData.customerName.trim() || !formData.customerEmail.trim() || !formData.customerPhone.trim()}
              >
                {isSubmitting ? "Procesando..." : "Enviar y Continuar a WhatsApp"}
              </button>
              
              <p className={styles.infoText}>
                <ShieldCheck size={16} color="var(--color-success)" />
                Tus datos están seguros y serán usados únicamente para contactarte.
              </p>
            </form>
          </div>

          {/* Summary Column */}
          <div className={styles.summarySection}>
            <h2 className={styles.summaryTitle}>
              Resumen 
              <span className={styles.summaryBadge}>{totalItemsCount} artículos</span>
            </h2>
            
            <div className={styles.itemList}>
              {items.map((item) => (
                <div key={item.product.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    {item.product.imageUrl ? (
                      <Image 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", width: '100%', height: '100%' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)' }}>
                        <ShoppingBag size={20} />
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.product.name}</h3>
                    <div className={styles.itemMeta}>Cantidad: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
