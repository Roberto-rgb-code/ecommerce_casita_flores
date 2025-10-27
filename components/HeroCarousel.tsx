"use client";

import { useState, useEffect } from "react";

// Imágenes del hero - Nuevas imágenes con mayor brillo
const HERO_IMAGES = [
  { src: "/1.png", alt: "Arreglo floral hermoso 1" },
  { src: "/2.png", alt: "Arreglo floral hermoso 2" },
  { src: "/3.png", alt: "Arreglo floral hermoso 3" },
  { src: "/4.png", alt: "Arreglo floral hermoso 4" },
  { src: "/5.png", alt: "Arreglo floral hermoso 5" },
  { src: "/6.png", alt: "Arreglo floral hermoso 6" },
  { src: "/7.png", alt: "Arreglo floral hermoso 7" },
  { src: "/8.png", alt: "Arreglo floral hermoso 8" },
  { src: "/9.png", alt: "Arreglo floral hermoso 9" },
  { src: "/10.png", alt: "Arreglo floral hermoso 10" },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {HERO_IMAGES.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={image.alt}
            src={image.src}
            className="h-full w-full object-cover brightness-110 contrast-105"
            style={{
              filter: 'brightness(1.1) contrast(1.05) saturate(1.1)',
            }}
          />
        </div>
      ))}
    </>
  );
}