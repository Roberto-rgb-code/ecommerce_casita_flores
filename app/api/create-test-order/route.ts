import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // Crear una orden de prueba simple
    const testOrder = {
      customer_name: 'Cliente de Prueba',
      customer_email: 'test@ejemplo.com',
      customer_phone: '33 1234 5678',
      total_amount: 250.00,
      status: 'paid',
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

    return NextResponse.json({
      success: true,
      message: 'Orden de prueba creada exitosamente',
      order: order
    });
  } catch (error: any) {
    console.error('Error in POST /api/create-test-order:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}
