"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // If no images, we will show a placeholder layout so the UI layout is visible
  const displayImages = images && images.length > 0 
    ? images 
    : [
        "/images/placeholder.jpg", 
        "/images/placeholder.jpg", 
        "/images/placeholder.jpg"
      ]; // Temporary placeholders to show the layout

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: '100%' }}>
      {/* Thumbnails (Vertical Carousel) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80px', overflowY: 'auto', paddingRight: '0.5rem', maxHeight: '600px', scrollbarWidth: 'none' }}>
        {displayImages.map((img, index) => (
          <div 
            key={index}
            onClick={() => setActiveIndex(index)}
            style={{ 
              width: '80px', 
              height: '80px', 
              position: 'relative', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              cursor: 'pointer',
              border: activeIndex === index ? '2px solid var(--text-main)' : '1px solid var(--border-soft)',
              opacity: activeIndex === index ? 1 : 0.6,
              transition: 'all 0.2s ease',
              flexShrink: 0,
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            {images && images.length > 0 ? (
              <Image 
                src={img} 
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="80px"
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div style={{ flex: 1, backgroundColor: 'var(--bg-primary)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative', aspectRatio: '1/1' }}>
        {images && images.length > 0 ? (
          <Image 
            src={displayImages[activeIndex]} 
            alt={productName}
            fill
            style={{ objectFit: 'contain', padding: '1rem' }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-subtle)' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span style={{ fontSize: '1.125rem', fontWeight: 500 }}>Sin foto disponible</span>
          </div>
        )}
      </div>
    </div>
  );
};
