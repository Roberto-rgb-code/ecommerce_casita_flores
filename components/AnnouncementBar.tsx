"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
  "🌸 Envío por toda la zona metropolitana",
  "⏱️ Entrega el mismo día - Pide antes de las 2pm",
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[var(--brand)] text-white py-2.5 text-center overflow-hidden">
      <div className="relative h-6">
        {MESSAGES.map((message, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center text-sm font-medium transition-all duration-500 ${
              index === currentIndex 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-2"
            }`}
          >
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}