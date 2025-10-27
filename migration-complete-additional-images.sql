-- ============================================
-- MIGRACIÓN COMPLETA PARA additional_images
-- La Casita de las Flores
-- ============================================

-- PASO 1: Agregar la columna additional_images si no existe
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS additional_images TEXT[];

-- PASO 2: Agregar comentario a la columna
COMMENT ON COLUMN products.additional_images IS 'Array de URLs de imágenes adicionales del producto';

-- PASO 3: Actualizar productos existentes para que tengan array vacío en lugar de NULL
UPDATE products 
SET additional_images = ARRAY[]::TEXT[] 
WHERE additional_images IS NULL;

-- PASO 4: Verificar que la migración se aplicó correctamente
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'additional_images';

-- PASO 5: Mostrar el estado actual de la tabla
SELECT 
  COUNT(*) as total_products,
  COUNT(image_url) as products_with_main_image,
  COUNT(additional_images) as products_with_additional_images
FROM products;

-- PASO 6: Actualizar el producto "rosas" con imágenes adicionales
UPDATE products 
SET additional_images = ARRAY[
  'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
]
WHERE title ILIKE '%rosas%' OR title ILIKE '%rose%';

-- PASO 7: Verificar la actualización del producto rosas
SELECT 
  id,
  title,
  image_url,
  additional_images,
  array_length(additional_images, 1) as additional_images_count
FROM products 
WHERE title ILIKE '%rosas%' OR title ILIKE '%rose%';

-- PASO 8: Mostrar todos los productos con sus imágenes
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
