"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/products";

type HeroCarouselProps = {
  products: Product[];
};

export default function HeroCarousel({ products }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Usar los primeros 6 productos como imágenes del carrusel
  const heroImages = products.slice(0, 6);

  useEffect(() => {
    if (heroImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Si no hay productos, mostrar imagen de placeholder
  if (heroImages.length === 0) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">🌸</div>
          <p className="text-lg">Próximamente más productos</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {heroImages.map((product, index) => (
        <div
          key={product.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={product.title}
            src={product.image || "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </>
  );
}