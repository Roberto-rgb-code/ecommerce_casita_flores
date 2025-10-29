'use client';

import { useState, useEffect } from 'react';

export default function TestNotificationsPage() {
  const [whatsappStatus, setWhatsappStatus] = useState<any>(null);
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/test-notifications');
      const data = await response.json();
      setWhatsappStatus(data.whatsapp);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const runTests = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      const response = await fetch('/api/test-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testWhatsApp: true,
          testEmail: testEmail ? true : false,
          email: testEmail
        }),
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setLoading(false);
      fetchStatus();
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Diagnóstico del Sistema
          </h1>
          <p className="text-gray-600">
            Verificación de WhatsApp y Email + Estado de Órdenes
          </p>
        </div>

        {/* Estado del WhatsApp */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📱 Estado del WhatsApp
          </h2>
          
          {whatsappStatus ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Estado:</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  whatsappStatus.isReady 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {whatsappStatus.status}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="font-medium">Conectado:</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  whatsappStatus.isReady 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {whatsappStatus.isReady ? '✅ Sí' : '❌ No'}
                </span>
              </div>

              {whatsappStatus.qrCode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium mb-2">
                    ⚠️ WhatsApp necesita autenticación
                  </p>
                  <p className="text-yellow-700 text-sm">
                    El código QR se ha generado en la consola del servidor. 
                    Escanea el QR con tu WhatsApp para conectar.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500">Cargando estado...</div>
          )}
        </div>

        {/* Estado de las Órdenes */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            🛒 Estado de las Órdenes
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Total de órdenes:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {orders.length}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-medium">Órdenes pagadas:</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {orders.filter(o => o.status === 'paid').length}
              </span>
            </div>

            {orders.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Últimas 3 órdenes:</h3>
                <div className="space-y-2">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">#{order.id.slice(0, 8)}</span>
                          <span className="text-gray-600 ml-2">{order.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                          <span className="font-medium">${order.total_amount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pruebas */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            🧪 Ejecutar Pruebas
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email para prueba (opcional):
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="tu-email@ejemplo.com"
              />
            </div>
            
            <button
              onClick={runTests}
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Ejecutando pruebas...' : '🚀 Ejecutar Pruebas Completas'}
            </button>
          </div>
        </div>

        {/* Resultados */}
        {results && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📊 Resultados de las Pruebas
            </h2>
            
            <div className={`p-4 rounded-md ${
              results.success 
                ? 'bg-green-100 border border-green-300 text-green-800' 
                : 'bg-red-100 border border-red-300 text-red-800'
            }`}>
              <h3 className="font-semibold mb-2">
                {results.success ? '✅ Pruebas Exitosas' : '❌ Error en Pruebas'}
              </h3>
              
              {results.results && (
                <div className="space-y-4">
                  {results.results.whatsapp && (
                    <div>
                      <h4 className="font-medium">📱 WhatsApp:</h4>
                      <pre className="text-sm bg-white p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(results.results.whatsapp, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {results.results.email && (
                    <div>
                      <h4 className="font-medium">📧 Email:</h4>
                      <pre className="text-sm bg-white p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(results.results.email, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
              
              {results.error && (
                <p className="text-sm text-red-600 mt-2">
                  <strong>Error:</strong> {results.error}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Información de Debug */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            🔍 Información de Debug
          </h2>
          
          <div className="space-y-2 text-sm text-blue-700">
            <p><strong>Problema 1:</strong> WhatsApp no se envía después de compra exitosa</p>
            <p><strong>Problema 2:</strong> Las ventas no se registran en el admin</p>
            <p><strong>Solución:</strong> Usar esta página para diagnosticar ambos problemas</p>
            
            <div className="mt-4 p-3 bg-white rounded border">
              <p className="font-medium text-blue-800 mb-2">Pasos para resolver:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Verificar que WhatsApp esté conectado (estado verde arriba)</li>
                <li>Si no está conectado, escanear QR en consola del servidor</li>
                <li>Ejecutar pruebas para verificar envío de mensajes</li>
                <li>Verificar que las órdenes aparezcan en la lista</li>
                <li>Si no aparecen, revisar configuración de Supabase</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
