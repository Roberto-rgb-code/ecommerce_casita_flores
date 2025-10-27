-- ============================================
-- SCRIPT ÚNICO: Crear columna + Actualizar rosas
-- La Casita de las Flores
-- ============================================

-- 1. Crear la columna additional_images
ALTER TABLE products ADD COLUMN IF NOT EXISTS additional_images TEXT[];

-- 2. Actualizar productos existentes con array vacío
UPDATE products SET additional_images = ARRAY[]::TEXT[] WHERE additional_images IS NULL;

-- 3. Actualizar el producto "rosas" con imágenes adicionales
UPDATE products 
SET additional_images = ARRAY[
  'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
]
WHERE title ILIKE '%rosas%' OR title ILIKE '%rose%';

-- 4. Verificar que funcionó
SELECT 
  title,
  image_url,
  additional_images,
  array_length(additional_images, 1) as total_imagenes_adicionales
FROM products 
WHERE title ILIKE '%rosas%' OR title ILIKE '%rose%';
