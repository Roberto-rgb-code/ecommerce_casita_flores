'use client';

import { useState } from 'react';

export default function EmailTest() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sendTestEmail = async () => {
    if (!email) {
      setResult({ success: false, message: 'Por favor ingresa un email' });
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail: email }),
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
        📧 Prueba de Email
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email de prueba:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="tu-email@ejemplo.com"
          />
        </div>
        
        <button
          onClick={sendTestEmail}
          disabled={loading}
          className="w-full bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Enviando...' : '📧 Enviar Email de Prueba'}
        </button>
        
        {result && (
          <div className={`p-4 rounded-md ${
            result.success 
              ? 'bg-green-100 border border-green-300 text-green-800' 
              : 'bg-red-100 border border-red-300 text-red-800'
          }`}>
            <h3 className="font-semibold mb-2">
              {result.success ? '✅ Éxito' : '❌ Error'}
            </h3>
            <p className="mb-2">{result.message}</p>
            
            {result.emailId && (
              <p className="text-sm">
                <strong>ID del email:</strong> {result.emailId}
              </p>
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
        <p>Esta herramienta envía un email de confirmación de compra de prueba</p>
        <p>Usa tu email real para verificar que llega correctamente</p>
      </div>
    </div>
  );
}
