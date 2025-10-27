'use client';

interface ImageDebugProps {
  images: string[];
  productName?: string;
}

export default function ImageDebug({ images, productName = 'Producto' }: ImageDebugProps) {
  return (
    <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-yellow-800 mb-2">🐛 Debug - Imágenes del Producto</h3>
      <div className="text-sm text-yellow-700">
        <p><strong>Producto:</strong> {productName}</p>
        <p><strong>Total de imágenes:</strong> {images.length}</p>
        <div className="mt-2">
          <p><strong>URLs de imágenes:</strong></p>
          <ul className="list-disc list-inside ml-4">
            {images.map((image, index) => (
              <li key={index} className="break-all">
                {index + 1}. {image}
              </li>
            ))}
          </ul>
        </div>
        {images.length === 0 && (
          <p className="text-red-600 font-bold">⚠️ No hay imágenes disponibles</p>
        )}
      </div>
    </div>
  );
}
