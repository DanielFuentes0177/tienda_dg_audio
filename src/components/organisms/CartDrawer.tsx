"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./CartDrawer.module.css";
import { X, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";

export const CartDrawer = () => {
  const { 
    isDrawerOpen, 
    setIsDrawerOpen, 
    items, 
    updateQuantity, 
    removeFromCart, 
    cartTotal 
  } = useCart();

  // Bloquear scroll cuando el drawer está abierto
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  // formatPrice function removed

  return (
    <>
      <div 
        className={`${styles.overlay} ${isDrawerOpen ? styles.open : ""}`} 
        onClick={() => setIsDrawerOpen(false)}
      />
      
      <div className={`${styles.drawer} ${isDrawerOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <ShoppingBag size={24} />
            Lista de Cotización
          </h2>
          <button className={styles.closeBtn} aria-label="Cerrar lista de cotización" onClick={() => setIsDrawerOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <ShoppingBag size={48} opacity={0.2} />
              <p>Tu lista está vacía.</p>
              <Link href="/tienda" passHref style={{ textDecoration: 'none' }}>
                <button 
                  className={styles.checkoutBtn} 
                  style={{ width: 'auto', padding: '0.5rem 1.5rem', marginTop: '1rem' }}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Ver catálogo
                </button>
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  {item.product.imageUrl ? (
                    <Image 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      width={80}
                      height={80}
                      style={{ objectFit: "cover", borderRadius: "8px" }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-subtle)', borderRadius: '8px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '4px' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <span style={{ fontSize: '0.65rem', fontWeight: 500 }}>Sin foto</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.itemDetails}>
                  <div>
                    <h4 className={styles.itemName}>{item.product.name}</h4>
                    {/* Price removed */}
                  </div>
                  
                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button 
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.quantityValue}>{item.quantity}</span>
                      <button 
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <Link href="/checkout" passHref style={{ textDecoration: 'none' }}>
              <button className={styles.checkoutBtn} onClick={() => setIsDrawerOpen(false)}>
                Solicitar Cotización <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
