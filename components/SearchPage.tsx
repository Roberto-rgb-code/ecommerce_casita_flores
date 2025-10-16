"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { searchProducts, getProducts } from "@/lib/products";
import { Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import Link from "next/link";

const Icon = {
  Search: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Filter: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  X: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high">("name");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos desde Supabase
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let results: Product[];
        if (searchQuery.trim()) {
          results = await searchProducts(searchQuery);
        } else {
          results = await getProducts();
        }
        setProducts(results);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [searchQuery]);

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La búsqueda se actualiza automáticamente con el estado
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearFilters = () => {
    setPriceRange([0, 2000]);
    setSortBy("name");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container-max py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-4">Buscar productos</h1>
          
          {/* Barra de búsqueda */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <div className="relative">
              <Icon.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar arreglos, flores, ocasiones..."
                className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Icon.X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
          </form>
        </div>

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

          {/* Resultados */}
          <div className="flex-1">
            {/* Información de resultados */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
                {searchQuery && ` para "${searchQuery}"`}
              </p>
            </div>

            {/* Grid de productos */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} p={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon.Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-500 mb-6">
                  Intenta con otros términos de búsqueda o ajusta los filtros
                </p>
                <button
                  onClick={clearSearch}
                  className="btn"
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
