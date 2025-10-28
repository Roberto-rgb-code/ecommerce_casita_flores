import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

// Stripe client con API versión compatible
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { 
      items, 
      customerEmail, 
      customerName,
      customerPhone,
      deliveryDate,
      deliveryTimeSlot,
      customerAddress,
      customerCity,
      customerZipCode,
      senderName,
      recipientName,
      dedicationMessage,
      isAnonymous,
      recipientPhone,
      deliveryAddress,
      addressType,
      companyArea,
      deliveryRoute,
      distance,
      shippingCost,
      totalAmount
    } = await request.json();

    // Validar datos
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Carrito vacío' },
        { status: 400 }
      );
    }

    // Usar el total calculado que incluye envío
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const total = totalAmount || (subtotal + (shippingCost || 0));

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
      success_url: `${process.env.NEXT_PUBLIC_URL || 'https://lacasitadelasflores.mx'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://lacasitadelasflores.mx'}/checkout`,
      customer_email: customerEmail,
      metadata: {
        customer_name: customerName || '',
        customer_email: customerEmail || '',
        customer_phone: customerPhone || '',
        delivery_date: deliveryDate || '',
        delivery_time_slot: deliveryTimeSlot || '',
        delivery_address: deliveryAddress || '',
        sender_name: senderName || '',
        recipient_name: recipientName || '',
        dedication_message: dedicationMessage || '',
        is_anonymous: isAnonymous ? 'true' : 'false',
        recipient_phone: recipientPhone || '',
        address_type: addressType || '',
        company_area: companyArea || '',
        delivery_route: deliveryRoute || '',
        distance: distance?.toString() || '0',
        shipping_cost: shippingCost?.toString() || '0',
        subtotal: subtotal.toString(),
        total_amount: total.toString(),
      },
    });

    // Guardar orden en Supabase (estado pendiente)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName || 'Invitado',
        customer_email: customerEmail || '',
        customer_phone: customerPhone || null,
        total_amount: total,
        status: 'pending',
        shipping_address: {
          address: deliveryAddress || customerAddress || '',
          city: customerCity || '',
          zipCode: customerZipCode || '',
          state: '',
          country: 'México'
        },
        delivery_date: deliveryDate || null,
        delivery_time_slot: deliveryTimeSlot || null,
        stripe_session_id: session.id,
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

