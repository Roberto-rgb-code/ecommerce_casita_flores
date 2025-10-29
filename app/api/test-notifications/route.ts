import { NextResponse } from 'next/server';
import { getWhatsAppService } from '@/lib/whatsapp';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function GET() {
  try {
    // Verificar estado del WhatsApp
    const whatsappService = getWhatsAppService();
    const whatsappStatus = whatsappService.getStatus();
    
    return NextResponse.json({
      success: true,
      whatsapp: whatsappStatus,
      message: 'Sistema de notificaciones verificado'
    });
  } catch (error: any) {
    console.error('Error verificando sistema:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { testWhatsApp, testEmail, email } = await request.json();
    
    const results: any = {};
    
    // Probar WhatsApp si se solicita
    if (testWhatsApp) {
      const whatsappService = getWhatsAppService();
      const status = whatsappService.getStatus();
      
      if (!status.isReady) {
        console.log('🚀 Iniciando WhatsApp Web...');
        await whatsappService.start();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      const testMessage = `🧪 *PRUEBA DE WHATSAPP - LA CASITA DE LAS FLORES* 🧪

*Esta es una prueba del sistema de notificaciones:*
📅 Fecha: ${new Date().toLocaleDateString('es-MX')}
⏰ Hora: ${new Date().toLocaleTimeString('es-MX')}
✅ Estado: Sistema funcionando correctamente

*Si recibes este mensaje, el WhatsApp está funcionando!* 🎉`;

      const whatsappResult = await whatsappService.sendMessage("3322807617", testMessage);
      results.whatsapp = whatsappResult;
    }
    
    // Probar Email si se solicita
    if (testEmail && email) {
      const testOrderData = {
        orderId: 'TEST-' + Date.now(),
        customerName: 'Cliente de Prueba',
        customerEmail: email,
        customerPhone: '33 1234 5678',
        items: [
          {
            title: 'Ramo de Rosas Rojas',
            quantity: 1,
            price: 250.00,
            image_url: 'https://lacasitadelasflores.mx/rosas-rojas.jpg'
          }
        ],
        subtotal: 250.00,
        shippingCost: 0,
        total: 250.00,
        deliveryDate: new Date().toISOString().split('T')[0],
        deliveryRoute: 'matutina',
        deliveryAddress: 'Calle de Prueba 123, Colonia Test, Guadalajara',
        recipientName: 'María García',
        recipientPhone: '33 9876 5432',
        senderName: 'Juan Pérez',
        dedicationMessage: '¡Esta es una prueba del sistema de email!',
        stripeSessionId: 'cs_test_' + Date.now()
      };

      const emailResult = await sendOrderConfirmationEmail(testOrderData);
      results.email = emailResult;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Pruebas completadas',
      results
    });
  } catch (error: any) {
    console.error('Error en pruebas:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
