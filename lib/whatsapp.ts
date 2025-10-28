import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

class WhatsAppService {
  private client: Client | null = null;
  private isReady = false;
  private qrCode: string | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: "casita-flores-whatsapp"
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      }
    });

    this.client.on('qr', (qr) => {
      console.log('📱 Escanea este código QR con WhatsApp:');
      qrcode.generate(qr, { small: true });
      this.qrCode = qr;
    });

    this.client.on('ready', () => {
      console.log('✅ WhatsApp está listo!');
      this.isReady = true;
      this.qrCode = null;
    });

    this.client.on('authenticated', () => {
      console.log('✅ WhatsApp autenticado correctamente');
    });

    this.client.on('auth_failure', (msg) => {
      console.error('❌ Error de autenticación:', msg);
    });

    this.client.on('disconnected', (reason) => {
      console.log('⚠️ WhatsApp desconectado:', reason);
      this.isReady = false;
    });
  }

  async start() {
    if (!this.client) {
      this.initializeClient();
    }
    
    if (!this.client) {
      throw new Error('No se pudo inicializar el cliente de WhatsApp');
    }
    
    try {
      await this.client.initialize();
      console.log('🚀 Iniciando WhatsApp Web...');
    } catch (error) {
      console.error('❌ Error iniciando WhatsApp:', error);
    }
  }

  async sendMessage(to: string, message: string) {
    if (!this.isReady || !this.client) {
      throw new Error('WhatsApp no está listo. Estado: ' + (this.isReady ? 'Listo' : 'No listo'));
    }

    try {
      // Formatear número (agregar código de país si no lo tiene)
      const formattedNumber = to.startsWith('+') ? to : `+52${to}`;
      
      // Enviar mensaje
      const result = await this.client.sendMessage(formattedNumber, message);
      
      console.log('✅ Mensaje enviado exitosamente:', result.id._serialized);
      return {
        success: true,
        messageId: result.id._serialized,
        message: 'Mensaje enviado correctamente'
      };
    } catch (error: any) {
      console.error('❌ Error enviando mensaje:', error);
      return {
        success: false,
        error: error.message,
        message: 'Error enviando mensaje'
      };
    }
  }

  getStatus() {
    return {
      isReady: this.isReady,
      qrCode: this.qrCode,
      status: this.isReady ? 'Conectado' : this.qrCode ? 'Esperando QR' : 'Desconectado'
    };
  }

  async stop() {
    if (this.client) {
      try {
        await this.client.destroy();
        this.isReady = false;
        console.log('🛑 WhatsApp detenido');
      } catch (error) {
        console.error('❌ Error deteniendo WhatsApp:', error);
      }
    }
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
