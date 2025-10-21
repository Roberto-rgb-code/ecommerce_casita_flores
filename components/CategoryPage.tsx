"use client";

import { useState, useMemo, useEffect } from "react";
import { getProductsByCategory } from "@/lib/products";
import { Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Image from "next/image";

const Icon = {
  ArrowLeft: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Filter: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

type Category = {
  slug: string;
  title: string;
  description: string;
  image: string;
};

type CategoryPageProps = {
  category: Category;
};

export default function CategoryPage({ category }: CategoryPageProps) {
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high">("name");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos de la categoría desde Supabase
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Usar el slug de la categoría para buscar en la BD
        const results = await getProductsByCategory(category.slug);
        setProducts(results);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [category.slug]);

  // Filtrar productos por categoría
  const categoryProducts = useMemo(() => {
    let filtered = [...products];

    // Filtrar por rango de precio
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Ordenar
    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price);
      default:
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
  }, [products, sortBy, priceRange]);

  const clearFilters = () => {
    setPriceRange([0, 2000]);
    setSortBy("name");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero de la categoría */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={category.image}
            alt={category.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="container-max">
            <div className="max-w-2xl text-white">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
              >
                <Icon.ArrowLeft className="w-4 h-4" />
                Volver al inicio
              </Link>
              
              <h1 className="text-4xl md:text-6xl font-light mb-4">
                {category.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-max py-8">
        <div className="flex gap-8">
          {/* Sidebar de filtros */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              {/* Botón de filtros para móvil */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Icon.Filter className="w-5 h-5" />
                Filtros
              </button>

              {/* Panel de filtros */}
              <div className={`${showFilters ? "block" : "hidden"} lg:block bg-gray-50 rounded-2xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filtros</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[var(--brand)] hover:underline"
                  >
                    Limpiar
                  </button>
                </div>

                {/* Ordenar por */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Ordenar por</h4>
                  <div className="space-y-2">
                    {[
                      { value: "name", label: "Nombre" },
                      { value: "price-low", label: "Precio: menor a mayor" },
                      { value: "price-high", label: "Precio: mayor a menor" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={sortBy === option.value}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="text-[var(--brand)] focus:ring-[var(--brand)]"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rango de precio */}
                <div>
                  <h4 className="font-medium mb-3">Rango de precio</h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--brand)] focus:border-transparent"
                        placeholder="Mín"
                      />
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--brand)] focus:border-transparent"
                        placeholder="Máx"
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()} MXN
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="flex-1">
            {/* Información de resultados */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {categoryProducts.length} producto{categoryProducts.length !== 1 ? "s" : ""} en {category.title}
              </p>
            </div>

            {/* Grid de productos */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
              </div>
            ) : categoryProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} p={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay productos disponibles
                </h3>
                <p className="text-gray-500 mb-6">
                  Pronto tendremos más opciones en esta categoría
                </p>
                <Link href="/" className="btn">
                  Ver todos los productos
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
