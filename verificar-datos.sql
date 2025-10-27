-- ============================================
-- VERIFICAR DATOS DEL PRODUCTO "rosas"
-- La Casita de las Flores
-- ============================================

-- Verificar si la columna existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'additional_images';

-- Ver todos los productos que contengan "rosas"
SELECT 
  id,
  title,
  image_url,
  additional_images,
  array_length(additional_images, 1) as additional_images_count
FROM products 
WHERE title ILIKE '%rosas%' OR title ILIKE '%rose%';

-- Ver todos los productos con sus imágenes
SELECT 
  id,
  title,
  image_url,
  additional_images,
  CASE 
    WHEN additional_images IS NOT NULL AND array_length(additional_images, 1) > 0 
    THEN array_length(additional_images, 1)::text
    ELSE '0'
  END as imagenes_adicionales
FROM products 
ORDER BY title;
