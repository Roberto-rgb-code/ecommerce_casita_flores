'use client';

import { useState } from 'react';

export default function WhatsAppTest() {
  const [message, setMessage] = useState('Esta es una prueba del sistema de WhatsApp automático');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sendTestMessage = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/test-whatsapp', {
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

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        🧪 Prueba de WhatsApp
      </h2>
      
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
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Enviando...' : '📱 Enviar Prueba de WhatsApp'}
        </button>
        
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
            
            {result.twilioSid && (
              <p className="text-sm">
                <strong>Twilio SID:</strong> {result.twilioSid}
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
            
            {result.testMessage && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium">
                  Ver mensaje completo
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {result.testMessage}
                </pre>
              </details>
            )}
            
            {result.error && (
              <p className="text-sm text-red-600 mt-2">
                <strong>Error:</strong> {result.error}
              </p>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>Esta herramienta envía mensajes de prueba al número: 3322807617</p>
        <p>Úsala para verificar que el sistema de WhatsApp funciona correctamente</p>
      </div>
    </div>
  );
}
