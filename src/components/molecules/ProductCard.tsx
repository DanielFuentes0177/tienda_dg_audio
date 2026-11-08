"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { CatalogProduct } from "@/lib/public-product";
import { useCart } from "@/context/CartContext";
import styles from "./ProductCard.module.css";
import { getProductPath } from "@/lib/seo/productSeoPilot4";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: CatalogProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addToCart } = useCart();
  
  const cartItem = items.find(item => item.product.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;

  // formatPrice function removed

  return (
    <div className={styles.card}>
      <Link href={getProductPath(product.id)} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className={styles.imageContainer}>
          {product.imageUrl ? (
            <Image 
              src={product.imageUrl} 
              alt={product.name}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', color: '#9ca3af' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Sin foto</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className={styles.content}>
        <div className={styles.category}>{product.category || "General"}</div>
        <Link href={getProductPath(product.id)} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>
        {/* Price removed */}
        
        <button 
          className={styles.addToCartBtn} 
          onClick={() => addToCart(product)}
        >
          <ShoppingCart size={16} />
          Agregar a Cotización
        </button>
      </div>
    </div>
  );
};
