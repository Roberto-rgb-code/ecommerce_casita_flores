'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SupabaseImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  onError?: () => void;
}

export default function SupabaseImage({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  priority = false,
  sizes,
  onError,
}: SupabaseImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Función para procesar URLs de Supabase Storage
  const processSupabaseUrl = (url: string): string => {
    if (!url) return '/flores_hero1.jpeg';
    
    // Si es una URL de Supabase Storage, asegurar que tenga el formato correcto
    if (url.includes('supabase.co') || url.includes('supabase.in')) {
      // Verificar si la URL ya tiene parámetros de transformación
      if (url.includes('?')) {
        return url;
      }
      // Agregar parámetros para optimización si es necesario
      return url;
    }
    
    return url;
  };

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Si hay error, mostrar imagen de fallback
  if (imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-center p-4">
          <span className="text-4xl">📦</span>
          <p className="text-xs mt-1">Imagen no disponible</p>
        </div>
      </div>
    );
  }

  const processedSrc = processSupabaseUrl(src);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-400 text-sm">Cargando...</span>
        </div>
      )}
      
      {fill ? (
        <Image
          src={processedSrc}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          sizes={sizes}
        />
      ) : (
        <Image
          src={processedSrc}
          alt={alt}
          width={width}
          height={height}
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          sizes={sizes}
        />
      )}
    </div>
  );
}
