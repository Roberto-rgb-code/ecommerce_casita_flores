import twilio from 'twilio';

class WhatsAppService {
  private twilioClient: twilio.Twilio | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeTwilio();
  }

  private initializeTwilio() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      console.warn('⚠️ Twilio no configurado: Faltan TWILIO_ACCOUNT_SID o TWILIO_AUTH_TOKEN');
      return;
    }

    try {
      this.twilioClient = twilio(accountSid, authToken);
      this.isInitialized = true;
      console.log('✅ Twilio inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando Twilio:', error);
    }
  }

  async sendMessage(to: string, message: string) {
    // Verificar si Twilio está configurado
    if (!this.isInitialized || !this.twilioClient) {
      const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
      const whatsappTo = process.env.TWILIO_WHATSAPP_TO || `whatsapp:+52${to}`;

      console.warn('⚠️ Twilio no configurado. Usando fallback (URL de WhatsApp Web)');
      
      // Fallback: Generar URL de WhatsApp Web
      const encodedMessage = encodeURIComponent(message);
      const phoneNumber = whatsappTo.replace('whatsapp:', '').replace('+', '');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      
      console.log('=== MENSAJE DE WHATSAPP (FALLBACK) ===');
      console.log(message);
      console.log('URL para envío manual:', whatsappUrl);
      console.log('=====================================');

      return {
        success: false,
        message: 'Twilio no configurado',
        whatsappUrl,
        error: 'Twilio no está configurado. Usa las variables de entorno.'
      };
    }

    try {
      const from = process.env.TWILIO_WHATSAPP_FROM;

      if (!from) {
        throw new Error('TWILIO_WHATSAPP_FROM no está configurado');
      }

      // Formatear número para Twilio
      // El parámetro 'to' puede venir como: "3322807617", "+523322807617", "whatsapp:+523322807617"
      let formattedTo = to;
      
      // Remover prefijo 'whatsapp:' si existe
      if (formattedTo.startsWith('whatsapp:')) {
        formattedTo = formattedTo.replace('whatsapp:', '');
      }
      
      // Si ya tiene formato correcto (empieza con +), usar tal cual
      // Si no tiene +, verificar si tiene código de país y agregar +
      if (!formattedTo.startsWith('+')) {
        // Si empieza con 52, agregar +
        if (formattedTo.startsWith('52')) {
          formattedTo = '+' + formattedTo;
        } else {
          // Asumir México (+52) si no tiene código de país
          formattedTo = '+52' + formattedTo.replace(/[^\d]/g, '');
        }
      }
      
      // Agregar prefijo 'whatsapp:' que requiere Twilio
      formattedTo = `whatsapp:${formattedTo}`;

      // Enviar mensaje vía Twilio
      const result = await this.twilioClient.messages.create({
        from: from,
        to: formattedTo,
        body: message
      });

      console.log('✅ Mensaje de WhatsApp enviado exitosamente via Twilio');
      console.log('   Message SID:', result.sid);
      console.log('   Status:', result.status);

      return {
        success: true,
        messageId: result.sid,
        status: result.status,
        message: 'Mensaje enviado correctamente via Twilio'
      };
    } catch (error: any) {
      console.error('❌ Error enviando mensaje vía Twilio:', error);
      
      // Fallback en caso de error
      const whatsappTo = process.env.TWILIO_WHATSAPP_TO || `whatsapp:+52${to}`;
      const encodedMessage = encodeURIComponent(message);
      const phoneNumber = whatsappTo.replace('whatsapp:', '').replace('+', '');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      console.log('=== MENSAJE DE WHATSAPP (FALLBACK POR ERROR) ===');
      console.log(message);
      console.log('URL para envío manual:', whatsappUrl);
      console.log('Error:', error.message);
      console.log('==============================================');

      return {
        success: false,
        message: 'Error enviando mensaje',
        whatsappUrl,
        error: error.message
      };
    }
  }

  getStatus() {
    return {
      isReady: this.isInitialized,
      isTwilioConfigured: !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN,
      status: this.isInitialized 
        ? 'Twilio conectado' 
        : (process.env.TWILIO_ACCOUNT_SID ? 'Error de configuración' : 'No configurado'),
      provider: 'Twilio'
    };
  }

  // Método para compatibilidad (no necesario con Twilio pero mantenido por compatibilidad)
  async start() {
    this.initializeTwilio();
    return { success: true, message: 'Twilio inicializado' };
  }

  async stop() {
    // Twilio no requiere detención, pero mantenemos el método por compatibilidad
    console.log('ℹ️ Twilio no requiere detención');
    return { success: true };
  }
}

// Instancia singleton
let whatsappService: WhatsAppService | null = null;

export function getWhatsAppService() {
  if (!whatsappService) {
    whatsappService = new WhatsAppService();
  }
  return whatsappService;
}

export default WhatsAppService;
