-- Script simple para agregar la columna additional_images
ALTER TABLE products ADD COLUMN IF NOT EXISTS additional_images TEXT[];

-- Actualizar productos existentes
UPDATE products SET additional_images = ARRAY[]::TEXT[] WHERE additional_images IS NULL;

-- Verificar que funcionó
SELECT column_name FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'additional_images';
