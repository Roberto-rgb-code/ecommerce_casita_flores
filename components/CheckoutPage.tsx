"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Icon = {
  ArrowLeft: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  MapPin: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
};

export default function CheckoutPage() {
  const { state: cartState, dispatch } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    deliveryDate: "",
    deliveryTimeSlot: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para obtener horarios disponibles según la hora actual
  const getAvailableTimeSlots = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    const timeSlots = [
      { value: "09-12", label: "9:00 AM - 12:00 PM", available: false },
      { value: "12-15", label: "12:00 PM - 3:00 PM", available: false },
      { value: "15-18", label: "3:00 PM - 6:00 PM", available: false },
    ];

    // Lógica de horarios según el pago
    if (currentHour < 9) {
      // Pagando antes de las 9am: liberar horarios 1, 2 y 3
      timeSlots[0].available = true;
      timeSlots[1].available = true;
      timeSlots[2].available = true;
    } else if (currentHour < 11) {
      // Pagando antes de las 11am: liberar horarios 2 y 3
      timeSlots[1].available = true;
      timeSlots[2].available = true;
    } else if (currentHour < 14) {
      // Pagando antes de las 2pm: liberar horario 3
      timeSlots[2].available = true;
    }

    return timeSlots.filter(slot => slot.available);
  };

  const availableTimeSlots = getAvailableTimeSlots();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    try {
      // Crear sesión de checkout con Stripe
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartState.items,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          deliveryDate: formData.deliveryDate,
          deliveryTimeSlot: formData.deliveryTimeSlot,
          customerPhone: formData.phone,
          customerAddress: formData.address,
          customerCity: formData.city,
          customerZipCode: formData.zipCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago');
      }

      // Redirigir a Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió URL de pago');
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago');
      setIsProcessing(false);
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-600 mb-8">
            Agrega algunos productos antes de proceder al checkout
          </p>
          <Link href="/" className="btn">
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Icon.ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-light">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulario */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Información de contacto */}
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-6">Información de Contacto</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Dirección de envío */}
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Icon.MapPin className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold">Dirección de Envío</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Selección de fecha y horario de entrega */}
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-6">Fecha y Horario de Entrega</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Entrega
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horario de Entrega
                    </label>
                    <select
                      name="deliveryTimeSlot"
                      value={formData.deliveryTimeSlot}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecciona un horario</option>
                      {availableTimeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    {availableTimeSlots.length === 0 && (
                      <p className="text-red-500 text-sm mt-2">
                        No hay horarios disponibles para hoy. Intenta mañana.
                      </p>
                    )}
                  </div>

                  {/* Información de horarios */}
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-pink-800 mb-2">Horarios de Entrega</h3>
                    <div className="text-xs text-pink-700 space-y-1">
                      <p>• <strong>Antes de las 9:00 AM:</strong> Horarios 1, 2 y 3 disponibles</p>
                      <p>• <strong>Antes de las 11:00 AM:</strong> Horarios 2 y 3 disponibles</p>
                      <p>• <strong>Antes de las 2:00 PM:</strong> Solo horario 3 disponible</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de pago */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Procesando..." : `Pagar ${cartState.total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}`}
              </button>

              <p className="text-xs text-center text-gray-500">
                Al continuar, aceptas nuestros términos y condiciones. El pago se procesará de forma segura con Stripe.
              </p>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div>
            <div className="bg-white rounded-2xl p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-6">Resumen del Pedido</h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {(item.price * item.quantity).toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    {cartState.total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    {cartState.total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                  </span>
                </div>
              </div>

              {/* Garantías */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Entrega el mismo día</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Flores frescas garantizadas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
