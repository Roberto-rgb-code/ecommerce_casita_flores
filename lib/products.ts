import { supabase } from './supabase';

export type Product = {
  id: string;
  title: string;
  price: number;
  rating?: number;
  reviews?: number;
  image: string;
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
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    price: data.price,
    rating: data.rating || 0,
    reviews: data.reviews || 0,
    image: data.image_url || '',
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
    badge: product.badge || undefined,
    description: product.description,
    category: product.category,
    stock: product.stock,
    is_active: product.is_active,
  }));
}
