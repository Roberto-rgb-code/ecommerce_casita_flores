import WhatsAppTest from '@/components/WhatsAppTest';

export default function TestWhatsAppPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌹 La Casita de las Flores
          </h1>
          <p className="text-gray-600">
            Herramienta de prueba para el sistema de WhatsApp automático
          </p>
        </div>
        
        <WhatsAppTest />
        
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📋 Instrucciones de Configuración
          </h2>
          
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Opción 1: Twilio WhatsApp (Automático)</h3>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Ve a <a href="https://console.twilio.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.twilio.com</a></li>
                <li>Crea una cuenta gratuita</li>
                <li>Ve a "Messaging" → "Try it out" → "Send a WhatsApp message"</li>
                <li>Configura WhatsApp Sandbox</li>
                <li>Agrega las credenciales a tu archivo .env.local</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Opción 2: Método Manual (Sin configuración)</h3>
              <p>El sistema funciona sin configuración adicional. Cuando no hay Twilio configurado, genera una URL de WhatsApp Web para envío manual.</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">Variables de Entorno Necesarias:</h3>
              <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
{`TWILIO_ACCOUNT_SID=tu-account-sid-aqui
TWILIO_AUTH_TOKEN=tu-auth-token-aqui
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+523322807617`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
