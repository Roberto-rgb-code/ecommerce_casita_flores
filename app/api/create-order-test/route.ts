import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // Crear orden de prueba simple
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: 'Cliente de Prueba',
        customer_email: 'test@ejemplo.com',
        customer_phone: '33 1234 5678',
        total_amount: 250.00,
        status: 'paid',
        stripe_session_id: 'cs_test_' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Error al crear orden', details: orderError.message },
        { status: 500 }
      );
    }

    // Crear item de prueba
    const { data: item, error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: '2e8eef9e-4df3-4647-93a0-bb757ea9c192',
        quantity: 1,
        price: 250.00,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (itemError) {
      console.error('Error creating item:', itemError);
      return NextResponse.json(
        { error: 'Error al crear item', details: itemError.message },
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
    console.error('Error in POST /api/create-order-test:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}
