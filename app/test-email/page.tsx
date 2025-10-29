import EmailTest from '@/components/EmailTest';

export default function TestEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌹 La Casita de las Flores
          </h1>
          <p className="text-gray-600">
            Prueba del Sistema de Email con Resend API
          </p>
        </div>
        
        <EmailTest />
        
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📋 Información del Sistema
          </h2>
          
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">✅ Configurado:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Resend API instalado y configurado</li>
                <li>API Key configurada en variables de entorno</li>
                <li>Servicio de email creado con templates HTML</li>
                <li>Integrado con webhook de Stripe</li>
                <li>Envió automático después de compras exitosas</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2">📧 Características del Email:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Diseño responsive y profesional</li>
                <li>Información completa del pedido</li>
                <li>Datos de dedicatoria incluidos</li>
                <li>Información de entrega detallada</li>
                <li>Total y desglose de precios</li>
                <li>Información de contacto</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">🚀 Flujo Automático:</h3>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Cliente completa compra exitosa</li>
                <li>Stripe webhook se activa</li>
                <li>Se envía WhatsApp automáticamente</li>
                <li>Se envía Email de confirmación automáticamente</li>
                <li>Cliente recibe ambas notificaciones</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
