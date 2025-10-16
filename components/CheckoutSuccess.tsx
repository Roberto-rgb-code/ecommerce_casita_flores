"use client";

import Link from "next/link";

const Icon = {
  CheckCircle: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Home: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="9,22 9,12 15,12 15,22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Package: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="3.27,6.96 12,12.01 20.73,6.96" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full text-center px-6">
        {/* Icono de éxito */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon.CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-light text-gray-900 mb-4">
          ¡Pedido confirmado!
        </h1>

        {/* Mensaje */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Gracias por tu compra. Hemos recibido tu pedido y lo estamos preparando con mucho cuidado.
          Recibirás un email de confirmación en breve.
        </p>

        {/* Información del pedido */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon.Package className="w-5 h-5 text-[var(--brand)]" />
            <span className="font-medium text-gray-900">Número de pedido</span>
          </div>
          <p className="text-2xl font-mono text-[var(--brand)]">
            #{Math.random().toString(36).substr(2, 8).toUpperCase()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Tiempo estimado de entrega: 2-4 horas
          </p>
        </div>

        {/* Próximos pasos */}
        <div className="space-y-4 mb-8">
          <h3 className="font-medium text-gray-900">Próximos pasos:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--brand)] rounded-full"></span>
              Recibirás un email de confirmación
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--brand)] rounded-full"></span>
              Nuestro florista preparará tu arreglo
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--brand)] rounded-full"></span>
              Te notificaremos cuando esté en camino
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--brand)] rounded-full"></span>
              Recibirás una foto de la entrega
            </li>
          </ul>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <Link href="/" className="w-full btn btn-large">
            <Icon.Home className="w-5 h-5 mr-2" />
            Volver al inicio
          </Link>
          <Link href="tel:8000000000" className="w-full btn-outline">
            📞 Contactar soporte
          </Link>
        </div>

        {/* Información adicional */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            ¿Tienes alguna pregunta? No dudes en contactarnos al{" "}
            <a href="tel:8000000000" className="text-[var(--brand)] hover:underline">
              800 000 0000
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
