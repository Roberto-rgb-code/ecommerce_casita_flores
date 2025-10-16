import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const {  items, customerEmail, customerName } = await request.json();

    // Validar datos
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Carrito vacío' },
        { status: 400 }
      );
    }

    // Calcular total
    const total = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Crear sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'mxn',
          product_data: {
            name: item.title,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Stripe usa centavos
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout`,
      customer_email: customerEmail,
      metadata: {
        customer_name: customerName || '',
        customer_email: customerEmail || '',
      },
    });

    // Guardar orden en Supabase (estado pendiente)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName || 'Invitado',
        customer_email: customerEmail || '',
        total_amount: total,
        status: 'pending',
        shipping_address: {},
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
    } else if (order) {
      // Guardar items de la orden
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      await supabase.from('order_items').insert(orderItems);
    }

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear sesión de pago' },
      { status: 500 }
    );
  }
}

