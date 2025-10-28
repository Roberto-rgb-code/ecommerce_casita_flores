import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { getWhatsAppService } from '@/lib/whatsapp';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret!);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Manejar el evento de pago exitoso
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      // Buscar la orden por session_id
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            products (
              title,
              image_url
            )
          )
        `)
        .eq('stripe_session_id', session.id)
        .single();

      if (orderError || !order) {
        console.error('Order not found:', orderError);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Actualizar el estado de la orden a 'paid'
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Error updating order status:', updateError);
        return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
      }

      // Enviar notificación de WhatsApp
      await sendWhatsAppNotification(order, session.metadata);

      console.log(`Order ${order.id} marked as paid and WhatsApp notification sent`);
      
      return NextResponse.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

// Función para enviar notificación de WhatsApp
async function sendWhatsAppNotification(order: any, metadata: any) {
  const whatsappNumber = "3322807617";
  
  // Construir mensaje con todos los datos
  const message = `🌹 *NUEVO PEDIDO PAGADO - LA CASITA DE LAS FLORES* 🌹

*Datos del Cliente:*
👤 Nombre: ${order.customer_name}
📧 Email: ${order.customer_email}
📱 Teléfono: ${order.customer_phone || 'No proporcionado'}

*Datos para la tarjeta de dedicatoria:*
${metadata.sender_name ? `👤 Quien envía: ${metadata.sender_name}` : '👤 Quien envía: Anónimo'}
👥 Quien recibe: ${metadata.recipient_name || 'No especificado'}
💌 Mensaje: ${metadata.dedication_message || 'Sin mensaje'}

*Datos importantes para realizar su entrega:*
📱 Número quien recibe: ${metadata.recipient_phone || 'No proporcionado'}
🏠 Domicilio: ${metadata.delivery_address || 'No especificado'}
🏢 Tipo: ${metadata.address_type === 'casa' ? 'Casa habitación' : metadata.address_type === 'local' ? 'Local comercial' : 'Empresa'}
${metadata.address_type !== 'casa' ? `📍 Área: ${metadata.company_area || 'No especificado'}` : ''}
📅 Día de entrega: ${metadata.delivery_date || 'No especificado'}
🚚 Ruta: ${metadata.delivery_route === 'matutina' ? 'Matutina (9am-2:30pm)' : 'Vespertina (2:30pm-6pm)'}

*Resumen del pedido:*
${order.order_items.map((item: any) => `• ${item.products?.title || 'Producto'} x${item.quantity} - $${item.price * item.quantity}`).join('\n')}

💰 Subtotal: $${metadata.subtotal || '0'}
🚚 Envío: ${metadata.shipping_cost === '0' ? 'Gratis' : `$${metadata.shipping_cost}`}
💰 *TOTAL PAGADO: $${metadata.total_amount || order.total_amount}*

*Estado del pago:* ✅ PAGADO EXITOSAMENTE
*ID de sesión Stripe:* ${order.stripe_session_id}

*Instrucciones:*
• El pedido está PAGADO y listo para preparar
• El pedido debe quedar liquidado para poder salir a ruta
• No manejamos entregas en horarios específicos
• Se entregan en el transcurso del horario de ruta elegido
• Los sábados no aplica ruta vespertina`;

  try {
    // Usar nuestro servicio propio de WhatsApp
    const whatsappService = getWhatsAppService();
    
    // Iniciar servicio si no está listo
    const status = whatsappService.getStatus();
    if (!status.isReady) {
      console.log('🚀 Iniciando WhatsApp Web...');
      await whatsappService.start();
      
      // Esperar un poco para que se conecte
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Enviar mensaje usando nuestro servicio
    const result = await whatsappService.sendMessage(whatsappNumber, message);
    
    if (result.success) {
      console.log('✅ Mensaje de WhatsApp enviado exitosamente');
      return { success: true, message: 'WhatsApp enviado', messageId: result.messageId };
    } else {
      console.error('❌ Error enviando WhatsApp:', result.error);
      
      // Fallback: mostrar mensaje en consola y generar URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/52${whatsappNumber}?text=${encodedMessage}`;
      
      console.log('=== MENSAJE DE WHATSAPP (FALLBACK) ===');
      console.log(message);
      console.log('URL para envío manual:', whatsappUrl);
      console.log('=====================================');
      
      return { success: false, message: 'Error enviando WhatsApp', whatsappUrl, error: result.error };
    }
  } catch (error: any) {
    console.error('❌ Error crítico enviando WhatsApp:', error);
    
    // Fallback: mostrar mensaje en consola
    console.log('=== MENSAJE DE WHATSAPP (FALLBACK CRÍTICO) ===');
    console.log(message);
    console.log('=============================================');
    
    return { success: false, message: 'Error crítico enviando WhatsApp', error: error.message };
  }
}
