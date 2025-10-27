-- ============================================
-- ACTUALIZAR IMÁGENES DEL PRODUCTO "rosas"
-- La Casita de las Flores
-- ============================================

-- Primero, verificar que el campo additional_images existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'additional_images';

-- Actualizar el producto "rosas" con imágenes adicionales
UPDATE products 
SET additional_images = ARRAY[
  'https://lautikiuizleznasrjta.supabase.co/storage/v1/object/public/product-image/products/1761075941472-97vhayfks2v.jpg',
  'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=600&fit=crop'
]
WHERE title ILIKE '%rosas%' OR title ILIKE '%rose%';

-- Verificar la actualización
SELECT 
  id,
  title,
  image_url,
  additional_images,
  array_length(additional_images, 1) as additional_images_count
FROM products 
WHERE title ILIKE '%rosas%' OR title ILIKE '%rose%';

-- Mostrar todos los productos con sus imágenes
SELECT 
  title,
  CASE 
    WHEN image_url IS NOT NULL THEN 'Sí' 
    ELSE 'No' 
  END as tiene_imagen_principal,
  CASE 
    WHEN additional_images IS NOT NULL AND array_length(additional_images, 1) > 0 THEN array_length(additional_images, 1)::text
    ELSE '0'
  END as imagenes_adicionales
FROM products 
ORDER BY title;
