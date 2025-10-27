import { supabase } from './supabase';

// Helper function para procesar additional_images
function processAdditionalImages(additionalImages: any): string[] | null {
  if (!additionalImages) return null;
  
  if (typeof additionalImages === 'string') {
    try {
      return JSON.parse(additionalImages);
    } catch (e) {
      console.error('Error parsing additional_images JSON:', e);
      return null;
    }
  } else if (Array.isArray(additionalImages)) {
    return additionalImages;
  }
  
  return null;
}

export type Product = {
  id: string;
  title: string;
  price: number;
  rating?: number;
  reviews?: number;
  image: string;
  additional_images?: string[] | null;
  badge?: string;
  description?: string | null;
  category?: string | null;
  stock?: number;
  is_active?: boolean;
};

// Obtener todos los productos activos
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  // Mapear a formato compatible con el e-commerce
  return (data || []).map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    image: product.image_url || '',
    additional_images: processAdditionalImages(product.additional_images),
    badge: product.badge || undefined,
    description: product.description,
    category: product.category,
    stock: product.stock,
    is_active: product.is_active,
  }));
}

// Obtener un producto por ID
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('id, title, description, price, image_url, additional_images, category, badge, rating, reviews, stock, is_active')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  if (!data) return null;

  // Debug: Log para verificar los datos
  console.log('getProductById - Raw data:', data);
  console.log('getProductById - additional_images:', data.additional_images);
  console.log('getProductById - Processed additional_images:', processAdditionalImages(data.additional_images));

  return {
    id: data.id,
    title: data.title,
    price: data.price,
    rating: data.rating || 0,
    reviews: data.reviews || 0,
    image: data.image_url || '',
    additional_images: processAdditionalImages(data.additional_images),
    badge: data.badge || undefined,
    description: data.description,
    category: data.category,
    stock: data.stock,
    is_active: data.is_active,
  };
}

// Obtener productos por categoría
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return (data || []).map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    image: product.image_url || '',
    additional_images: product.additional_images || null,
    badge: product.badge || undefined,
    description: product.description,
    category: product.category,
    stock: product.stock,
    is_active: product.is_active,
  }));
}

// Buscar productos
export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return (data || []).map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    image: product.image_url || '',
    additional_images: product.additional_images || null,
    badge: product.badge || undefined,
    description: product.description,
    category: product.category,
    stock: product.stock,
    is_active: product.is_active,
  }));
}
