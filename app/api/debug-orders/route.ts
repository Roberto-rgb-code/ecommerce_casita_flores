import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Verificar si hay órdenes en la base de datos
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            title,
            image_url,
            category
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Error al obtener las órdenes', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      orders: orders || [],
      count: orders?.length || 0,
      message: orders?.length > 0 ? 'Órdenes encontradas' : 'No hay órdenes en la base de datos'
    });
  } catch (error: any) {
    console.error('Error in GET /api/debug-orders:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Crear una orden de prueba
    const testOrder = {
      customer_name: 'Cliente de Prueba',
      customer_email: 'test@ejemplo.com',
      customer_phone: '33 1234 5678',
      total_amount: 250.00,
      status: 'paid',
      shipping_address: {
        address: 'Calle de Prueba 123',
        city: 'Guadalajara',
        zipCode: '44100'
      },
      delivery_date: new Date().toISOString().split('T')[0],
      delivery_time_slot: 'matutina',
      stripe_session_id: 'cs_test_' + Date.now()
    };

    // Insertar orden
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating test order:', orderError);
      return NextResponse.json(
        { error: 'Error al crear orden de prueba', details: orderError.message },
        { status: 500 }
      );
    }

    // Crear item de prueba
    const testItem = {
      order_id: order.id,
      product_id: '2e8eef9e-4df3-4647-93a0-bb757ea9c192', // ID del producto existente
      quantity: 1,
      price: 250.00
    };

    const { data: item, error: itemError } = await supabase
      .from('order_items')
      .insert(testItem)
      .select()
      .single();

    if (itemError) {
      console.error('Error creating test item:', itemError);
      return NextResponse.json(
        { error: 'Error al crear item de prueba', details: itemError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Orden de prueba creada exitosamente',
      order: order,
      item: item
    });
  } catch (error: any) {
    console.error('Error in POST /api/debug-orders:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}
