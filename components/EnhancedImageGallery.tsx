'use client';

import { useState, useEffect, useCallback } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './ImageGallery.css';
import UnoptimizedImage from './UnoptimizedImage';

interface EnhancedImageGalleryProps {
  images: string[];
  productName?: string;
  className?: string;
  showThumbnails?: boolean;
  showFullscreenButton?: boolean;
  showBullets?: boolean;
  showNav?: boolean;
  autoPlay?: boolean;
  slideInterval?: number;
}

export default function EnhancedImageGallery({
  images,
  productName = 'Producto',
  className = '',
  showThumbnails = true,
  showFullscreenButton = true,
  showBullets = true,
  showNav = true,
  autoPlay = false,
  slideInterval = 3000,
}: EnhancedImageGalleryProps) {
  const [isClient, setIsClient] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Manejar cambios de imagen
  const handleSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Manejar pantalla completa
  const handleFullscreenChange = useCallback((isFullscreen: boolean) => {
    setIsFullscreen(isFullscreen);
  }, []);

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

  // Convertir las imágenes al formato que espera react-image-gallery
  const galleryImages = images.map((image, index) => ({
    original: image,
    thumbnail: image,
    originalAlt: `${productName} - Imagen ${index + 1}`,
    thumbnailAlt: `${productName} - Miniatura ${index + 1}`,
  }));

  if (!isClient) {
    // Renderizar una imagen simple durante la hidratación
    return (
      <div className={className}>
        <div className="relative w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Cargando galería...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      <ImageGallery
        items={galleryImages}
        showThumbnails={showThumbnails && images.length > 1}
        showFullscreenButton={showFullscreenButton}
        showPlayButton={false}
        showBullets={showBullets && images.length > 1}
        showNav={showNav && images.length > 1}
        autoPlay={autoPlay}
        slideInterval={slideInterval}
        slideDuration={450}
        useBrowserFullscreen={true}
        showIndex={false}
        lazyLoad={true}
        onErrorImageURL="/flores_hero1.jpeg"
        onSlide={handleSlide}
        onScreenChange={handleFullscreenChange}
        renderItem={(item) => (
          <div className="image-gallery-image">
            <UnoptimizedImage
              src={item.original || '/flores_hero1.jpeg'}
              alt={item.originalAlt || `${productName} - Imagen`}
              fill
              className="w-full h-full"
            />
          </div>
        )}
        renderThumbInner={(item) => (
          <div className="image-gallery-thumbnail-inner">
            <UnoptimizedImage
              src={item.thumbnail || '/flores_hero1.jpeg'}
              alt={item.thumbnailAlt || `${productName} - Miniatura`}
              width={80}
              height={80}
              className="w-full h-full"
            />
          </div>
        )}
        renderLeftNav={(onClick, disabled) => (
          <button
            type="button"
            className={`image-gallery-left-nav ${disabled ? 'disabled' : ''}`}
            disabled={disabled}
            onClick={onClick}
            aria-label="Imagen anterior"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
        )}
        renderRightNav={(onClick, disabled) => (
          <button
            type="button"
            className={`image-gallery-right-nav ${disabled ? 'disabled' : ''}`}
            disabled={disabled}
            onClick={onClick}
            aria-label="Siguiente imagen"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        )}
        renderFullscreenButton={(onClick, isFullscreen) => (
          <button
            type="button"
            className="image-gallery-fullscreen-button"
            onClick={onClick}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            )}
          </button>
        )}
      />
      
      {/* Indicador de imagen actual */}
      {images.length > 1 && !isFullscreen && (
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
