import { Suspense } from "react";
import SearchPage from "@/components/SearchPage";

function SearchPageWrapper() {
  return <SearchPage />;
}

export default function Search() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando búsqueda...</p>
        </div>
      </div>
    }>
      <SearchPageWrapper />
    </Suspense>
  );
}
