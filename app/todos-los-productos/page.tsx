import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

// Forzar revalidación de caché cada 60 segundos
export const revalidate = 60;

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function TodosLosProductosPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const productsPerPage = 12;
  
  // Obtener todos los productos
  const allProducts = await getProducts();
  
  // Calcular paginación
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const products = allProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-12 bg-gray-50">
        <div className="container-max">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-light mb-4">
              Todos los Productos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra colección completa de arreglos florales
            </p>
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="py-12">
        <div className="container-max">
          {/* Información de resultados */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              Mostrando {startIndex + 1}-{Math.min(endIndex, allProducts.length)} de {allProducts.length} productos
            </p>
            
            {/* Ordenar por */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                <option value="newest">Más recientes</option>
                <option value="price-low">Precio: menor a mayor</option>
                <option value="price-high">Precio: mayor a menor</option>
                <option value="name">Nombre</option>
              </select>
            </div>
          </div>

          {/* Grid de productos */}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {products.map((product) => (
                  <ProductCard key={product.id} p={product} />
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  {/* Botón Anterior */}
                  {currentPage > 1 ? (
                    <a
                      href={`/todos-los-productos?page=${currentPage - 1}`}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      ← Anterior
                    </a>
                  ) : (
                    <span className="px-4 py-2 border border-gray-200 rounded-md text-gray-400 cursor-not-allowed">
                      ← Anterior
                    </span>
                  )}

                  {/* Números de página */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    // Mostrar solo algunas páginas alrededor de la actual
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                    ) {
                      return (
                        <a
                          key={pageNum}
                          href={`/todos-los-productos?page=${pageNum}`}
                          className={`px-4 py-2 border rounded-md transition-colors ${
                            pageNum === currentPage
                              ? "bg-pink-600 text-white border-pink-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </a>
                      );
                    } else if (
                      pageNum === currentPage - 3 ||
                      pageNum === currentPage + 3
                    ) {
                      return <span key={pageNum} className="px-2">...</span>;
                    }
                    return null;
                  })}

                  {/* Botón Siguiente */}
                  {currentPage < totalPages ? (
                    <a
                      href={`/todos-los-productos?page=${currentPage + 1}`}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Siguiente →
                    </a>
                  ) : (
                    <span className="px-4 py-2 border border-gray-200 rounded-md text-gray-400 cursor-not-allowed">
                      Siguiente →
                    </span>
                  )}
                </div>
              )}
            </>
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
                Pronto tendremos más opciones disponibles
              </p>
              <a href="/" className="btn">
                Volver al inicio
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
