'use client';

import { useState, useEffect } from 'react';
import EnhancedImageGallery from './EnhancedImageGallery';
import MobileImageGallery from './MobileImageGallery';

interface ResponsiveImageGalleryProps {
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

export default function ResponsiveImageGallery(props: ResponsiveImageGalleryProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!isClient) {
    // Renderizar una versión básica durante la hidratación
    return (
      <div className={`${props.className} bg-gray-200 rounded-lg flex items-center justify-center`}>
        <div className="text-gray-500 text-center p-4">
          <span className="text-4xl">📦</span>
          <p className="text-xs mt-1">Cargando galería...</p>
        </div>
      </div>
    );
  }

  // Usar la galería móvil para dispositivos móviles
  if (isMobile) {
    return (
      <MobileImageGallery
        images={props.images}
        productName={props.productName}
        className={props.className}
      />
    );
  }

  // Usar la galería completa para desktop
  return (
    <EnhancedImageGallery
      {...props}
    />
  );
}
