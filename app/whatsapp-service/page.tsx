import WhatsAppServiceTest from '@/components/WhatsAppServiceTest';

export default function WhatsAppServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌹 La Casita de las Flores
          </h1>
          <p className="text-gray-600">
            Servicio Propio de WhatsApp - Sin dependencias externas
          </p>
        </div>
        
        <WhatsAppServiceTest />
        
        <div className="max-w-4xl mx-auto mt-8 grid md:grid-cols-2 gap-6">
          {/* Instrucciones */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📋 Instrucciones de Uso
            </h2>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">1. Primera vez:</h3>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Inicia el servidor de desarrollo</li>
                  <li>Ve a esta página</li>
                  <li>Revisa la consola del servidor</li>
                  <li>Escanea el código QR con WhatsApp</li>
                  <li>¡Listo para enviar mensajes!</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">2. Uso diario:</h3>
                <p>El servicio se mantiene conectado automáticamente. Solo necesitas escanear el QR una vez.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">3. En producción:</h3>
                <p>El servicio se conecta automáticamente cuando se necesita enviar un mensaje.</p>
              </div>
            </div>
          </div>
          
          {/* Ventajas */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🎯 Ventajas del Servicio Propio
            </h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✅</span>
                <div>
                  <strong>Gratuito:</strong> Sin costos mensuales ni por mensaje
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✅</span>
                <div>
                  <strong>Sin límites:</strong> Envía tantos mensajes como necesites
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✅</span>
                <div>
                  <strong>Tu número:</strong> Usa tu número personal de WhatsApp
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✅</span>
                <div>
                  <strong>Control total:</strong> No dependes de servicios externos
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✅</span>
                <div>
                  <strong>Privacidad:</strong> Tus datos no salen de tu servidor
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✅</span>
                <div>
                  <strong>Personalizable:</strong> Puedes modificar el código como quieras
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Comparación */}
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📊 Comparación: Servicio Propio vs Twilio
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Característica</th>
                  <th className="text-center p-2">Servicio Propio</th>
                  <th className="text-center p-2">Twilio</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b">
                  <td className="p-2">Costo</td>
                  <td className="text-center p-2 text-green-600 font-semibold">Gratuito</td>
                  <td className="text-center p-2 text-red-600">$0.005 por mensaje</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Límites</td>
                  <td className="text-center p-2 text-green-600 font-semibold">Sin límites</td>
                  <td className="text-center p-2 text-yellow-600">Límites por plan</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Configuración</td>
                  <td className="text-center p-2 text-green-600 font-semibold">QR una vez</td>
                  <td className="text-center p-2 text-yellow-600">API keys</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Dependencias</td>
                  <td className="text-center p-2 text-green-600 font-semibold">Ninguna</td>
                  <td className="text-center p-2 text-red-600">Servicio externo</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Control</td>
                  <td className="text-center p-2 text-green-600 font-semibold">Total</td>
                  <td className="text-center p-2 text-yellow-600">Limitado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
