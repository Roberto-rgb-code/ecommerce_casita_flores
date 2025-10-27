"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartWithToast } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import ImageGallery from "./ImageGallery";

type Product = {
  id: string;
  title: string;
  price: number;
  rating?: number;
  reviews?: number;
  image: string;
  additional_images?: string[] | null;
  badge?: string;
};

export default function ProductCard({ p }: { p: Product }) {
  const { addItemWithToast } = useCartWithToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Crear array de todas las imágenes disponibles
  const allImages = [p.image, ...(p.additional_images || [])].filter(Boolean);
  
  // Efecto para el carrusel automático cuando está en hover
  useEffect(() => {
    if (!isHovered || allImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 1500); // Cambiar imagen cada 1.5 segundos

    return () => clearInterval(interval);
  }, [isHovered, allImages.length]);

  // Resetear índice cuando sale del hover
  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0);
    }
  }, [isHovered]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addItemWithToast(p);
    
    // Simular delay de agregado
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <article 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container con efecto de elevación */}
      <div className="relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
        {/* Imagen */}
         <Link href={`/product/${p.id}`} className="block relative">
           <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
             {/* Carrusel automático de imágenes */}
             <Image 
               src={allImages[currentImageIndex] || "/flores_hero1.jpeg"} 
               alt={p.title} 
               fill 
               className="object-cover transition-all duration-700 group-hover:scale-110" 
               onError={(e) => {
                 const target = e.target as HTMLImageElement;
                 target.src = '/flores_hero1.jpeg';
               }}
             />
            
            {/* Overlay gradient en hover */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Badge */}
            {p.badge && (
              <span className="absolute left-4 top-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg z-10">
                {p.badge}
              </span>
            )}
            
             {/* Multiple images indicator */}
             {allImages.length > 1 && (
               <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-full z-10">
                 {currentImageIndex + 1}/{allImages.length}
               </div>
             )}
            
            {/* Quick View Button */}
            <div className={`absolute inset-x-0 bottom-4 flex justify-center transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <button 
                onClick={() => window.location.href = `/product/${p.id}`}
                className="px-6 py-2.5 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900 hover:bg-white transition-all shadow-lg hover:shadow-xl z-10"
              >
                Vista Rápida
              </button>
            </div>
          </div>
        </Link>

        {/* Info Section mejorada */}
        <div className="p-6 space-y-4">
          {/* Category tag */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--brand)] uppercase tracking-wider">Premium</span>
            {p.rating && (
              <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                <span className="text-yellow-400">★</span>
                <span>{p.rating}</span>
                {p.reviews && <span>({p.reviews})</span>}
              </div>
            )}
          </div>

          {/* Title */}
          <Link href={`/product/${p.id}`}>
            <h3 className="text-lg font-semibold text-[var(--ink)] line-clamp-2 group-hover:text-[var(--brand)] transition-colors cursor-pointer leading-snug">
              {p.title}
            </h3>
          </Link>

          {/* Price and Button */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-[var(--brand)] to-pink-600 bg-clip-text text-transparent">
                {p.price.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
              </p>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className="relative px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--brand)] to-pink-600 text-white font-semibold text-sm transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group/btn"
            >
              <span className="relative z-10">
                {isAdding ? "✓" : "Agregar"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-100 to-transparent rounded-bl-full opacity-50" />
      </div>

      {/* Shadow effect on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-200/20 to-purple-200/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </article>
  );
}
