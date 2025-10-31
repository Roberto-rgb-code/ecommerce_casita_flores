import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { getWhatsAppService } from '@/lib/whatsapp';
import { sendOrderConfirmationEmail } from '@/lib/email';

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

      // Enviar notificaciones (WhatsApp + Email)
      const metadata = session.metadata || {};
      await Promise.all([
        sendWhatsAppNotification(order, metadata),
        sendOrderConfirmationEmail({
          orderId: order.id,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerPhone: order.customer_phone,
          items: order.order_items.map((item: any) => ({
            title: item.products?.title || 'Producto',
            quantity: item.quantity,
            price: item.price,
            image_url: item.products?.image_url
          })),
          subtotal: parseFloat(metadata.subtotal || '0'),
          shippingCost: parseFloat(metadata.shipping_cost || '0'),
          total: parseFloat(metadata.total_amount || order.total_amount),
          deliveryDate: metadata.delivery_date || '',
          deliveryRoute: metadata.delivery_route || '',
          deliveryAddress: metadata.delivery_address || '',
          recipientName: metadata.recipient_name || '',
          recipientPhone: metadata.recipient_phone || '',
          senderName: metadata.sender_name,
          dedicationMessage: metadata.dedication_message,
          stripeSessionId: order.stripe_session_id
        })
      ]);

      console.log(`Order ${order.id} marked as paid and notifications sent (WhatsApp + Email)`);
      
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
  // Número del negocio para recibir notificaciones de pedidos
  const businessNumber = process.env.TWILIO_WHATSAPP_TO || "3322807617";
  
  // Número del comprador para enviar confirmación
  const customerPhone = order.customer_phone;
  
  // Mensaje para el NEGOCIO (notificación de nuevo pedido)
  const businessMessage = `🌹 *NUEVO PEDIDO PAGADO - LA CASITA DE LAS FLORES* 🌹

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
• Se entregan en el transcurso del horario de ruta elegido`;

  // Mensaje para el COMPRADOR (confirmación de compra)
  const customerMessage = `🌹 *¡GRACIAS POR TU COMPRA! - LA CASITA DE LAS FLORES* 🌹

Hola ${order.customer_name.split(' ')[0]},

✅ *Tu pedido ha sido confirmado y el pago fue exitoso*

*Detalles de tu pedido:*
${order.order_items.map((item: any) => `• ${item.products?.title || 'Producto'} x${item.quantity} - $${item.price * item.quantity}`).join('\n')}

💰 Subtotal: $${metadata.subtotal || '0'}
🚚 Envío: ${metadata.shipping_cost === '0' ? 'Gratis' : `$${metadata.shipping_cost}`}
💰 *TOTAL PAGADO: $${metadata.total_amount || order.total_amount}*

*Información de entrega:*
📅 Fecha: ${metadata.delivery_date || 'Por confirmar'}
🚚 Horario: ${metadata.delivery_route === 'matutina' ? 'Matutina (9am-2:30pm)' : 'Vespertina (2:30pm-6pm)'}
🏠 Dirección: ${metadata.delivery_address || 'Por confirmar'}

*ID de pedido:* ${order.id}
*ID de sesión Stripe:* ${order.stripe_session_id}

Nos pondremos en contacto contigo si necesitamos más información.
¡Gracias por confiar en nosotros! 💐`;

  try {
    // Usar servicio de Twilio
    const whatsappService = getWhatsAppService();
    
    // Enviar mensaje al NEGOCIO (notificación)
    const businessResult = await whatsappService.sendMessage(businessNumber.replace('whatsapp:', '').replace('+52', ''), businessMessage);
    
    // Enviar mensaje al COMPRADOR (confirmación) si tiene teléfono
    let customerResult = null;
    if (customerPhone) {
      // Limpiar y formatear teléfono del cliente para Twilio
      // Remover espacios, guiones, paréntesis
      let cleanCustomerPhone = customerPhone.replace(/[^\d+]/g, '');
      
      // Si no tiene código de país, agregar +52 (México)
      if (!cleanCustomerPhone.startsWith('+')) {
        // Si empieza con 52, agregar +
        if (cleanCustomerPhone.startsWith('52')) {
          cleanCustomerPhone = '+' + cleanCustomerPhone;
        } else {
          // Si no tiene código de país, agregar +52
          cleanCustomerPhone = '+52' + cleanCustomerPhone;
        }
      }
      
      // Remover el prefijo 'whatsapp:' si existe
      cleanCustomerPhone = cleanCustomerPhone.replace(/^whatsapp:/, '');
      
      customerResult = await whatsappService.sendMessage(cleanCustomerPhone, customerMessage);
    }
    
    // Verificar resultados
    if (businessResult.success) {
      console.log('✅ Mensaje de WhatsApp enviado al NEGOCIO via Twilio');
      console.log('   Message SID:', businessResult.messageId);
      
      if (customerResult?.success) {
        console.log('✅ Mensaje de WhatsApp enviado al COMPRADOR via Twilio');
        console.log('   Message SID:', customerResult.messageId);
      } else if (customerPhone && customerResult) {
        console.log('⚠️ No se pudo enviar mensaje al comprador:', customerResult.error);
      }
      
      return { 
        success: true, 
        message: 'WhatsApp enviado via Twilio', 
        businessMessageId: businessResult.messageId,
        customerMessageId: customerResult?.messageId || null
      };
    } else {
      console.error('❌ Error enviando WhatsApp al negocio:', businessResult.error);
      console.log('=== MENSAJE DE WHATSAPP NEGOCIO (FALLBACK) ===');
      console.log(businessMessage);
      if (businessResult.whatsappUrl) {
        console.log('URL para envío manual:', businessResult.whatsappUrl);
      }
      console.log('==============================================');
      
      return { 
        success: false, 
        message: 'Error enviando WhatsApp', 
        whatsappUrl: businessResult.whatsappUrl, 
        error: businessResult.error 
      };
    }
  } catch (error: any) {
    console.error('❌ Error crítico enviando WhatsApp:', error);
    
    // Fallback: mostrar mensajes en consola
    console.log('=== MENSAJE DE WHATSAPP NEGOCIO (FALLBACK CRÍTICO) ===');
    console.log(businessMessage);
    console.log('====================================================');
    
    if (customerPhone) {
      console.log('=== MENSAJE DE WHATSAPP COMPRADOR (FALLBACK CRÍTICO) ===');
      console.log(customerMessage);
      console.log('=======================================================');
    }
    
    return { success: false, message: 'Error crítico enviando WhatsApp', error: error.message };
  }
}
