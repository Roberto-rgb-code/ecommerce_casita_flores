'use client';

import { useState, useEffect, useRef } from 'react';
import { useImageGallery } from '@/hooks/useImageGallery';

interface MobileImageGalleryProps {
  images: string[];
  productName?: string;
  className?: string;
}

export default function MobileImageGallery({
  images,
  productName = 'Producto',
  className = '',
}: MobileImageGalleryProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    currentIndex,
    goToPrevious,
    goToNext,
    goToSlide,
    handleImageError,
  } = useImageGallery({ images, productName });

  // Configuración para móviles
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      goToNext();
    }
    if (isRightSwipe && currentIndex > 0) {
      goToPrevious();
    }

    setIsDragging(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-center p-4">
          <span className="text-4xl">📦</span>
          <p className="text-xs mt-1">Sin imagen</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {/* Imagen principal */}
      <div
        ref={containerRef}
        className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt={`${productName} - Imagen ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isDragging ? 'scale-105' : 'scale-100'
          }`}
          onError={handleImageError}
          draggable={false}
        />

        {/* Indicador de múltiples imágenes */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Navegación táctil */}
        {images.length > 1 && (
          <>
            {/* Área izquierda para navegar anterior */}
            <div
              className="absolute left-0 top-0 w-1/3 h-full cursor-pointer"
              onClick={goToPrevious}
              aria-label="Imagen anterior"
            />
            
            {/* Área derecha para navegar siguiente */}
            <div
              className="absolute right-0 top-0 w-1/3 h-full cursor-pointer"
              onClick={goToNext}
              aria-label="Siguiente imagen"
            />
          </>
        )}
      </div>

      {/* Miniaturas para móvil */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index
                  ? 'border-pink-500 scale-105'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}

      {/* Indicadores de puntos */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index
                  ? 'bg-pink-500 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
