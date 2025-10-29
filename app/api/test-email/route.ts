import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { testEmail } = await request.json();
    
    if (!testEmail) {
      return NextResponse.json({ error: 'Email de prueba requerido' }, { status: 400 });
    }

    // Datos de prueba
    const testOrderData = {
      orderId: 'TEST-' + Date.now(),
      customerName: 'Cliente de Prueba',
      customerEmail: testEmail,
      customerPhone: '33 1234 5678',
      items: [
        {
          title: 'Ramo de Rosas Rojas',
          quantity: 1,
          price: 250.00,
          image_url: 'https://lacasitadelasflores.mx/rosas-rojas.jpg'
        },
        {
          title: 'Tarjeta de Dedicatoria',
          quantity: 1,
          price: 15.00
        }
      ],
      subtotal: 265.00,
      shippingCost: 0,
      total: 265.00,
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryRoute: 'matutina',
      deliveryAddress: 'Calle de Prueba 123, Colonia Test, Guadalajara',
      recipientName: 'María García',
      recipientPhone: '33 9876 5432',
      senderName: 'Juan Pérez',
      dedicationMessage: '¡Feliz cumpleaños! Que tengas un día maravilloso lleno de amor y alegría.',
      stripeSessionId: 'cs_test_' + Date.now()
    };

    // Enviar email de prueba
    const result = await sendOrderConfirmationEmail(testOrderData);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email de prueba enviado exitosamente',
        emailId: result.emailId,
        testData: testOrderData
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Error enviando email de prueba',
        error: result.error
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error en prueba de email:', error);
    return NextResponse.json({
      success: false,
      message: 'Error procesando solicitud de prueba',
      error: error.message
    }, { status: 500 });
  }
}
