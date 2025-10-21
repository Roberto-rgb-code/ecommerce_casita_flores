"use client";

import { useState, useEffect } from "react";

// Imágenes fijas del hero
const HERO_IMAGES = [
  { src: "/flores_hero1.jpeg", alt: "Arreglo floral hermoso 1" },
  { src: "/flores_hero2.jpeg", alt: "Arreglo floral hermoso 2" },
  { src: "/flores_hero3.jpeg", alt: "Arreglo floral hermoso 3" },
  { src: "/flores_hero4.jpeg", alt: "Arreglo floral hermoso 4" },
  { src: "/flores_hero5.jpeg", alt: "Arreglo floral hermoso 5" },
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
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </>
  );
}