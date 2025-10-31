"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartWithToast } from "@/contexts/CartContext";
import type { Product } from "@/contexts/CartContext";

const Icon = {
  ArrowLeft: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Star: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
    </svg>
  ),
  Heart: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Calendar: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Clock: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
};

type ProductDetailProps = {
  product: Product;
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItemWithToast } = useCartWithToast();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Crear array de imágenes
  const productImages = [
    product.image,
    ...(product.additional_images || [])
  ].filter(Boolean);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addItemWithToast(product);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href="#favoritas" className="hover:text-gray-700 transition-colors">
              Productos
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de imágenes - Estilo Melrose */}
          <div className="flex gap-4">
            {/* Thumbnails verticales */}
            <div className="flex flex-col space-y-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index 
                      ? 'border-gray-900' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/flores_hero1.jpeg';
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Imagen principal */}
            <div className="flex-1">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={productImages[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/flores_hero1.jpeg';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Información del producto - Estilo Melrose */}
          <div className="space-y-6">
            {/* Título */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
                {product.title}
              </h1>
            </div>

            {/* Precio */}
            <div className="text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)} MXN
            </div>

            {/* Descripción */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                Un hermoso arreglo floral cuidadosamente seleccionado para crear momentos especiales. 
                Cada flor es elegida por su frescura y belleza, garantizando una experiencia única.
              </p>
            </div>

            {/* Opciones de entrega */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Elige el día de entrega:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value="27 de octubre de 2025"
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                  />
                  <Icon.Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Elige la hora de entrega:
                </label>
                <div className="relative">
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white appearance-none">
                    <option>12:01 - 16:00</option>
                    <option>16:01 - 20:00</option>
                  </select>
                  <Icon.Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Información especial */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
              En San Valentin y Día de las Madres, debido a el alta demanda de ambas fechas, no manejamos entregas con horario especial. 
              La ruta comienza a las 9am y termina a las 6pm.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 bg-gray-100 text-gray-900 py-4 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isAdding ? "Agregando..." : "AGREGAR A CARRITO"}
                </button>
                
                <div className="flex items-center gap-2">
                  <button className="bg-gray-900 text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                    COMPRAR AHORA
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="w-16 px-3 py-4 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>
            </div>


            {/* Contacto */}
            <div className="flex justify-end space-x-3">
              <a 
                href={`https://wa.me/523322807617?text=Hola,%20me%20interesa%20el%20producto%20${product.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
              <a 
                href="tel:3322807617"
                className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
