import { useState, useCallback, useMemo } from 'react';

interface UseImageGalleryProps {
  images: string[];
  productName?: string;
}

export function useImageGallery({ images, productName = 'Producto' }: UseImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Convertir las imágenes al formato que espera react-image-gallery
  const galleryImages = useMemo(() => {
    return images.map((image, index) => ({
      original: image,
      thumbnail: image,
      originalAlt: `${productName} - Imagen ${index + 1}`,
      thumbnailAlt: `${productName} - Miniatura ${index + 1}`,
    }));
  }, [images, productName]);

  // Manejar cambios de imagen
  const handleSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Manejar pantalla completa
  const handleFullscreenChange = useCallback((isFullscreen: boolean) => {
    setIsFullscreen(isFullscreen);
  }, []);

  // Navegar a imagen anterior
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  // Navegar a imagen siguiente
  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, images.length]);

  // Ir a imagen específica
  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  }, [images.length]);

  // Manejar carga de imágenes
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/flores_hero1.jpeg';
    setIsLoading(false);
  }, []);

  return {
    galleryImages,
    currentIndex,
    isFullscreen,
    isLoading,
    handleSlide,
    handleFullscreenChange,
    goToPrevious,
    goToNext,
    goToSlide,
    handleImageLoad,
    handleImageError,
    setCurrentIndex,
    setIsLoading,
  };
}
