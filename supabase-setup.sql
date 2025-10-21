-- ============================================
-- SETUP DE BASE DE DATOS SUPABASE
-- La Casita de las Flores - E-commerce
-- ============================================

-- Tabla: products (Productos)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  additional_images TEXT[], -- Array de URLs de imágenes adicionales
  badge VARCHAR(50),
  rating DECIMAL(3, 2) DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: orders (Órdenes de compra)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSONB,
  delivery_date DATE,
  delivery_time_slot VARCHAR(50),
  stripe_session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: order_items (Items de cada orden)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Políticas de seguridad (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede leer productos activos
DROP POLICY IF EXISTS "Public can read active products" ON public.products;
CREATE POLICY "Public can read active products" ON public.products
  FOR SELECT USING (is_active = true);

-- Política: Cualquiera puede insertar órdenes
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Política: Cualquiera puede insertar items de orden
DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
CREATE POLICY "Public can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Insertar algunos productos de ejemplo (opcional)
INSERT INTO public.products (title, description, price, category, image_url, badge, rating, reviews, stock) VALUES
  ('50 Rosas Rojas Premium', 'Hermoso arreglo de 50 rosas rojas frescas, perfectas para expresar amor y pasión', 1299.00, 'amor', '/50 rosas rojas.jpg', 'Más vendido', 5.0, 128, 10),
  ('50 Rosas Azules Exclusivas', 'Elegante ramo de 50 rosas azules, únicas y especiales para ocasiones memorables', 1499.00, 'amor', '/50 rosas azules.jpg', 'Exclusivo', 4.9, 87, 5),
  ('500 Rosas Espectaculares', 'Impresionante arreglo de 500 rosas rojas, el regalo más grandioso', 8999.00, 'amor', '/500 rosas.jpg', 'Premium', 5.0, 45, 3),
  ('Corazón Jumbo con Rosas y Ferreros', 'Hermosa caja en forma de corazón con rosas y chocolates Ferrero Rocher', 899.00, 'cumpleaños', '/corazon jumbo con rosas y ferreros.jpg', 'Popular', 4.8, 156, 15),
  ('Corazón Mediano con Rosas', 'Caja corazón mediana con rosas frescas, perfecta para sorprender', 649.00, 'amistad', '/corazón mediano con rosas.jpg', NULL, 4.7, 92, 20),
  ('Ramo 200 Rosas y Rox', 'Lujoso ramo de 200 rosas combinadas, un regalo inolvidable', 3499.00, 'amor', '/ramo 200 rosas y rox.jpg', 'Premium', 4.9, 63, 8)
ON CONFLICT DO NOTHING;

-- ============================================
-- INSTRUCCIONES DE USO:
-- 1. Ve a tu proyecto en Supabase
-- 2. Abre el "SQL Editor"
-- 3. Copia y pega este script
-- 4. Ejecuta el script
-- 5. Verifica que las tablas se crearon en "Table Editor"
-- ============================================

-- Para verificar que todo se creó correctamente:
SELECT 'Tablas creadas correctamente' as status;
SELECT COUNT(*) as total_products FROM public.products;
SELECT COUNT(*) as total_orders FROM public.orders;

