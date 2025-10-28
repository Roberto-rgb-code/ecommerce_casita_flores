import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 });
    }

    const whatsappNumber = "3322807617";
    
    // Mensaje de prueba
    const testMessage = `🧪 *PRUEBA DE WHATSAPP - LA CASITA DE LAS FLORES* 🧪

${message}

*Fecha de prueba:* ${new Date().toLocaleString('es-MX')}
*Estado:* ✅ Sistema funcionando correctamente`;

    try {
      // Verificar si Twilio está configurado
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        
        // Enviar mensaje de prueba usando Twilio
        const result = await client.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
          to: process.env.TWILIO_WHATSAPP_TO || `whatsapp:+52${whatsappNumber}`,
          body: testMessage
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'Mensaje de prueba enviado exitosamente',
          twilioSid: result.sid,
          status: result.status
        });
      } else {
        // Si no hay configuración de Twilio, usar método alternativo
        const encodedMessage = encodeURIComponent(testMessage);
        const whatsappUrl = `https://wa.me/52${whatsappNumber}?text=${encodedMessage}`;
        
        return NextResponse.json({ 
          success: false, 
          message: 'Twilio no configurado',
          whatsappUrl,
          testMessage
        });
      }
    } catch (error: any) {
      console.error('Error en prueba de WhatsApp:', error);
      
      return NextResponse.json({ 
        success: false, 
        message: 'Error enviando mensaje de prueba',
        error: error.message,
        testMessage
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Error procesando solicitud',
      details: error.message 
    }, { status: 500 });
  }
}
