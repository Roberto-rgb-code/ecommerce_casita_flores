import { NextResponse } from 'next/server';
import { getWhatsAppService } from '@/lib/whatsapp';

export async function POST(request: Request) {
  try {
    const { message, to = "3322807617" } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 });
    }

    const whatsappService = getWhatsAppService();
    const status = whatsappService.getStatus();

    // Si no está listo, iniciar el servicio
    if (!status.isReady) {
      await whatsappService.start();
      
      // Esperar un poco para que se conecte
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newStatus = whatsappService.getStatus();
      if (!newStatus.isReady) {
        return NextResponse.json({
          success: false,
          message: 'WhatsApp no está listo',
          status: newStatus,
          qrCode: newStatus.qrCode
        });
      }
    }

    // Enviar mensaje
    const result = await whatsappService.sendMessage(to, message);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error en endpoint WhatsApp:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Error procesando solicitud'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const whatsappService = getWhatsAppService();
    const status = whatsappService.getStatus();
    
    return NextResponse.json({
      status: status.status,
      isReady: status.isReady,
      qrCode: status.qrCode
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
