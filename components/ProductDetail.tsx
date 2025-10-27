"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartWithToast } from "@/contexts/CartContext";
import type { Product } from "@/contexts/CartContext";
import ResponsiveImageGallery from "./ResponsiveImageGallery";

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
  Truck: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="5.5" cy="18.5" r="2.5" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="18.5" cy="18.5" r="2.5" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Shield: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Heart: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  // Usar todas las imágenes del producto
  const productImages = [product.image, ...(product.additional_images || [])].filter(Boolean);
  
  // Debug: Log para verificar las imágenes
  console.log('ProductDetail - Product:', product);
  console.log('ProductDetail - ProductImages:', productImages);
  console.log('ProductDetail - Image count:', productImages.length);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Agregar la cantidad seleccionada
    for (let i = 0; i < quantity; i++) {
      addItemWithToast(product);
    }
    
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
        {/* Breadcrumb elegante */}
        <nav className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[var(--brand)] transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a productos
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
              <ResponsiveImageGallery 
                images={productImages}
                productName={product.title}
                className="w-full h-full"
                showThumbnails={false}
                showFullscreenButton={true}
                showBullets={true}
                showNav={true}
                autoPlay={false}
              />
              {product.badge && (
                <span className="absolute top-4 left-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--brand)] text-white">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails - solo mostrar si hay múltiples imágenes */}
            {productImages.length > 1 && (
              <div className="flex gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[var(--brand)]"
                        : "border-transparent hover:border-gray-300"
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
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Header del producto */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.title}
              </h1>
              <p className="text-lg text-gray-500 mt-2">Melrose</p>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Icon.Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating!)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.rating} ({product.reviews} reseñas)
                </span>
              </div>
            )}

            {/* Precio */}
            <div className="text-3xl font-bold text-gray-900">
              {product.price.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })}
            </div>

            {/* Descripción */}
            <div>
              <p className="text-base text-gray-700 leading-7">
                Un hermoso arreglo floral cuidadosamente seleccionado para crear momentos especiales. 
                Cada flor es elegida por su frescura y belleza, garantizando una experiencia única.
              </p>
            </div>

            {/* Características */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Características</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[var(--brand)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Flores frescas seleccionadas a mano
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[var(--brand)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Empaque premium para entrega
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[var(--brand)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Garantía de frescura por 7 días
                </li>
              </ul>
            </div>

            {/* Cantidad */}
            <div>
              <label className="text-sm font-medium text-gray-900">Cantidad</label>
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="text-lg font-medium">-</span>
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="text-lg font-medium">+</span>
                </button>
              </div>
            </div>

            {/* Botones */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full bg-[var(--brand)] text-white py-3 px-6 rounded-lg font-medium hover:bg-[var(--brand)]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAdding ? "Agregando al carrito..." : "Agregar al carrito"}
              </button>
              
              <button className="w-full border border-[var(--brand)] text-[var(--brand)] py-3 px-6 rounded-lg font-medium hover:bg-[var(--brand)] hover:text-white transition-colors flex items-center justify-center gap-2">
                <Icon.Heart className="w-5 h-5" />
                Agregar a favoritos
              </button>
            </div>

            {/* Información de envío */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icon.Truck className="h-5 w-5 text-[var(--brand)] mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Envío gratis</h3>
                    <p className="text-sm text-gray-500">
                      En compras mayores a $799 MXN. Entrega el mismo día en CDMX.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Icon.Shield className="h-5 w-5 text-[var(--brand)] mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Garantía de calidad</h3>
                    <p className="text-sm text-gray-500">
                      Si no estás satisfecho, te reembolsamos o reemplazamos tu pedido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
