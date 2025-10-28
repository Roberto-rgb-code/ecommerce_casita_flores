'use client';

import { useState, useEffect } from 'react';

export default function WhatsAppServiceTest() {
  const [message, setMessage] = useState('Esta es una prueba del sistema de WhatsApp propio');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);

  // Verificar estado del servicio
  const checkStatus = async () => {
    try {
      const response = await fetch('/api/whatsapp');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error verificando estado:', error);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Verificar cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const sendTestMessage = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ 
        success: false, 
        message: 'Error de conexión',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!status) return 'bg-gray-100';
    if (status.isReady) return 'bg-green-100 border-green-300 text-green-800';
    if (status.qrCode) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    return 'bg-red-100 border-red-300 text-red-800';
  };

  const getStatusText = () => {
    if (!status) return 'Verificando...';
    if (status.isReady) return '✅ Conectado y listo';
    if (status.qrCode) return '📱 Esperando escaneo de QR';
    return '❌ Desconectado';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        🚀 Servicio Propio de WhatsApp
      </h2>
      
      {/* Estado del servicio */}
      <div className={`p-4 rounded-md border mb-6 ${getStatusColor()}`}>
        <h3 className="font-semibold mb-2">Estado del Servicio:</h3>
        <p className="text-sm">{getStatusText()}</p>
        {status?.qrCode && (
          <div className="mt-3">
            <p className="text-sm mb-2">
              <strong>Escanea este código QR con WhatsApp:</strong>
            </p>
            <div className="bg-white p-2 rounded border inline-block">
              <div className="text-xs text-gray-600">
                (El código QR aparecerá en la consola del servidor)
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje de prueba:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Escribe tu mensaje de prueba..."
          />
        </div>
        
        <button
          onClick={sendTestMessage}
          disabled={loading || !status?.isReady}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Enviando...' : '📱 Enviar Prueba de WhatsApp'}
        </button>
        
        {!status?.isReady && (
          <div className="text-center text-sm text-gray-500">
            <p>⚠️ El servicio debe estar conectado para enviar mensajes</p>
            <p>Revisa la consola del servidor para ver el código QR</p>
          </div>
        )}
        
        {result && (
          <div className={`p-4 rounded-md ${
            result.success 
              ? 'bg-green-100 border border-green-300 text-green-800' 
              : 'bg-yellow-100 border border-yellow-300 text-yellow-800'
          }`}>
            <h3 className="font-semibold mb-2">
              {result.success ? '✅ Éxito' : '⚠️ Información'}
            </h3>
            <p className="mb-2">{result.message}</p>
            
            {result.messageId && (
              <p className="text-sm">
                <strong>ID del mensaje:</strong> {result.messageId}
              </p>
            )}
            
            {result.whatsappUrl && (
              <div className="mt-3">
                <p className="text-sm mb-2">
                  <strong>URL para envío manual:</strong>
                </p>
                <a 
                  href={result.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                >
                  {result.whatsappUrl}
                </a>
              </div>
            )}
            
            {result.error && (
              <p className="text-sm text-red-600 mt-2">
                <strong>Error:</strong> {result.error}
              </p>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 text-xs text-gray-500">
        <h4 className="font-semibold mb-2">📋 Ventajas del Servicio Propio:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>✅ Completamente gratuito</li>
          <li>✅ Sin límites de mensajes</li>
          <li>✅ Usa tu número personal</li>
          <li>✅ No requiere configuración externa</li>
          <li>✅ Control total del sistema</li>
        </ul>
      </div>
    </div>
  );
}
