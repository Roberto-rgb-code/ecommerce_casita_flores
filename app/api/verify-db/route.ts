import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Verificar productos disponibles
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, price')
      .limit(5);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json(
        { error: 'Error al obtener productos', details: productsError.message },
        { status: 500 }
      );
    }

    // Verificar órdenes existentes
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, customer_name, total_amount, status')
      .limit(5);

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Error al obtener órdenes', details: ordersError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      products: products || [],
      orders: orders || [],
      message: 'Base de datos verificada'
    });
  } catch (error: any) {
    console.error('Error in GET /api/verify-db:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}
