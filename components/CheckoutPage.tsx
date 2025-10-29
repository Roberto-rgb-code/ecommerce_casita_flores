"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "./AuthModal";

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
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    city: "",
    zipCode: "",
    deliveryDate: "",
    deliveryTimeSlot: "",
    // Nuevos campos para dedicatoria
    senderName: "",
    recipientName: "",
    dedicationMessage: "",
    isAnonymous: false,
    // Campos para entrega
    recipientPhone: "",
    deliveryAddress: "",
    addressType: "casa", // casa, local, empresa
    companyArea: "",
    deliveryRoute: "matutina", // matutina, vespertina
    // Campos para envío
    distance: 0,
    shippingCost: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Función para calcular el costo de envío
  const calculateShippingCost = (distance: number) => {
    if (distance <= 10) {
      return 0; // Gratis hasta 10km
    } else if (distance <= 15) {
      return 0; // Gratis hasta 15km (corregido según especificaciones)
    } else {
      const extraKm = distance - 15;
      return extraKm * 13; // $13 pesos por km extra después de 15km
    }
  };

  // Función para calcular distancia usando Google Maps API
  const calculateDistance = async (address: string) => {
    const storeAddress = "Bahía de Santiago 847, parques de Santa María, Tlaquepaque";
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Maps API key no configurada');
      return 12; // Fallback: distancia promedio
    }
    
    try {
      // Usar Google Maps Distance Matrix API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(storeAddress)}&destinations=${encodeURIComponent(address)}&units=metric&key=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
        const distanceText = data.rows[0].elements[0].distance.text;
        const distanceValue = data.rows[0].elements[0].distance.value; // en metros
        const distanceKm = distanceValue / 1000; // convertir a kilómetros
        
        console.log(`Distancia calculada: ${distanceKm.toFixed(2)} km`);
        return Math.round(distanceKm);
      } else {
        console.warn('Error en Google Maps API:', data.status, data.error_message);
        // Fallback a distancia promedio si hay error (billing no habilitado)
        return 12; // Distancia promedio en Guadalajara
      }
    } catch (error) {
      console.error('Error calculando distancia:', error);
      // Fallback a distancia promedio si hay error
      return 12; // Distancia promedio en Guadalajara
    }
  };

  // Función para calcular envío cuando cambie la dirección
  const handleAddressChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const address = e.target.value;
    setFormData({
      ...formData,
      deliveryAddress: address,
    });

    // Calcular distancia si hay una dirección válida
    if (address.length > 10) {
      try {
        const distance = await calculateDistance(address);
        const shippingCost = calculateShippingCost(distance);
        setFormData(prev => ({
          ...prev,
          distance,
          shippingCost,
        }));
      } catch (error) {
        console.error('Error calculating distance:', error);
      }
    }
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
    
    // Verificar si el usuario está autenticado
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setIsProcessing(true);
    setError("");

    try {
      // Transformar items al formato esperado por la API
      const formattedItems = cartState.items.map(item => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
      }));

      // Crear sesión de checkout con Stripe
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: formattedItems,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          deliveryDate: formData.deliveryDate,
          deliveryTimeSlot: formData.deliveryTimeSlot,
          customerPhone: formData.phone,
          customerAddress: formData.deliveryAddress,
          customerCity: formData.city,
          customerZipCode: formData.zipCode,
          // Nuevos campos para dedicatoria
          senderName: formData.senderName,
          recipientName: formData.recipientName,
          dedicationMessage: formData.dedicationMessage,
          isAnonymous: formData.isAnonymous,
          // Campos para entrega
          recipientPhone: formData.recipientPhone,
          deliveryAddress: formData.deliveryAddress,
          addressType: formData.addressType,
          companyArea: formData.companyArea,
          deliveryRoute: formData.deliveryRoute,
          // Campos para envío
          distance: formData.distance,
          shippingCost: formData.shippingCost,
          totalAmount: cartState.total + formData.shippingCost,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago');
      }

      // Redirigir a Stripe Checkout
      if (data.url) {
        // Redirigir a Stripe Checkout
        // El WhatsApp se enviará automáticamente cuando el pago sea exitoso via webhook
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió URL de pago');
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago');
      setIsProcessing(false);
    }
  };

  // Función para enviar mensaje de WhatsApp
  const sendWhatsAppMessage = (orderData: any) => {
    const whatsappNumber = "3322807617";
    const message = `🌹 *NUEVO PEDIDO - LA CASITA DE LAS FLORES* 🌹

*Datos del Cliente:*
👤 Nombre: ${formData.firstName} ${formData.lastName}
📧 Email: ${formData.email}
📱 Teléfono: ${formData.phone}

*Datos para la tarjeta de dedicatoria:*
${formData.senderName ? `👤 Quien envía: ${formData.senderName}` : '👤 Quien envía: Anónimo'}
👥 Quien recibe: ${formData.recipientName}
💌 Mensaje: ${formData.dedicationMessage || 'Sin mensaje'}

*Datos importantes para realizar su entrega:*
📱 Número quien recibe: ${formData.recipientPhone}
🏠 Domicilio: ${formData.deliveryAddress}
🏢 Tipo: ${formData.addressType === 'casa' ? 'Casa habitación' : formData.addressType === 'local' ? 'Local comercial' : 'Empresa'}
${formData.addressType !== 'casa' ? `📍 Área: ${formData.companyArea}` : ''}
📅 Día de entrega: ${formData.deliveryDate}
🚚 Ruta: ${formData.deliveryRoute === 'matutina' ? 'Matutina (9am-2:30pm)' : 'Vespertina (2:30pm-6pm)'}

*Resumen del pedido:*
${orderData.items.map((item: any) => `• ${item.title} x${item.quantity} - $${item.price * item.quantity}`).join('\n')}

💰 Subtotal: $${cartState.total}
🚚 Envío: ${formData.shippingCost === 0 ? 'Gratis' : `$${formData.shippingCost}`}
💰 *TOTAL: $${cartState.total + formData.shippingCost}*

*Instrucciones:*
• El pedido debe quedar liquidado para poder salir a ruta
• No manejamos entregas en horarios específicos
• Se entregan en el transcurso del horario de ruta elegido
• Los sábados no aplica ruta vespertina`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Abrir WhatsApp en una nueva ventana
    window.open(whatsappUrl, '_blank');
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

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

              {/* Información de Contacto y Dedicatoria */}
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-6">📋 Información de Contacto y Dedicatoria</h2>
                
                {/* Información del Cliente */}
                <div className="mb-8">
                  <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                    Datos del Cliente
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre <span className="text-red-500">*</span>
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
                          Apellido <span className="text-red-500">*</span>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
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
                          Teléfono <span className="text-red-500">*</span>
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
                </div>

                {/* Información de la Dedicatoria */}
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                    Datos para la Tarjeta de Dedicatoria
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ¿Quién envía? <span className="text-gray-500">(opcional)</span>
                        </label>
                        <input
                          type="text"
                          name="senderName"
                          value={formData.senderName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Dejar vacío para anónimo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ¿Quién recibe? <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="recipientName"
                          value={formData.recipientName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensaje para la tarjeta de dedicatoria
                      </label>
                      <textarea
                        name="dedicationMessage"
                        value={formData.dedicationMessage}
                        onChange={(e) => setFormData({...formData, dedicationMessage: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        rows={3}
                        placeholder="Escribe tu mensaje especial..."
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isAnonymous"
                        checked={formData.isAnonymous}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">
                        Envío anónimo
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dirección de Envío */}
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Icon.MapPin className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold">🚚 Dirección de Envío</h2>
                </div>

                <div className="space-y-6">
                  {/* Datos del Destinatario */}
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                      Datos del Destinatario
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono de quien recibe <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="recipientPhone"
                          value={formData.recipientPhone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Número de contacto para la entrega"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dirección Completa */}
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                      Dirección Completa
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Domicilio completo <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="deliveryAddress"
                          value={formData.deliveryAddress}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          rows={2}
                          placeholder="Calle, número, interior, colonia..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ciudad <span className="text-red-500">*</span>
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
                            Código Postal <span className="text-red-500">*</span>
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de domicilio
                        </label>
                        <select
                          name="addressType"
                          value={formData.addressType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="casa">🏠 Casa habitación</option>
                          <option value="local">🏪 Local comercial</option>
                          <option value="empresa">🏢 Empresa</option>
                        </select>
                      </div>

                      {formData.addressType !== "casa" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Área específica <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="companyArea"
                            value={formData.companyArea}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="Ej: Recepción, Oficina 205, Área de ventas..."
                            required={formData.addressType !== "casa"}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fecha y Horario de Entrega */}
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-6">📅 Fecha y Horario de Entrega</h2>
                
                <div className="space-y-6">
                  {/* Selección de Fecha */}
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                      Selecciona la Fecha
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de entrega <span className="text-red-500">*</span>
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
                  </div>

                  {/* Selección de Ruta */}
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                      Selecciona la Ruta
                    </h3>
                    <div className="space-y-3">
                      <div className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                        formData.deliveryRoute === "matutina" 
                          ? "border-pink-500 bg-pink-50" 
                          : "border-gray-200 hover:border-pink-300"
                      }`}>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="deliveryRoute"
                            value="matutina"
                            checked={formData.deliveryRoute === "matutina"}
                            onChange={handleInputChange}
                            className="mr-3 text-pink-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900">🌅 Ruta Matutina</div>
                            <div className="text-sm text-gray-600">9:00 AM - 2:30 PM</div>
                          </div>
                        </label>
                      </div>
                      
                      <div className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                        formData.deliveryRoute === "vespertina" 
                          ? "border-pink-500 bg-pink-50" 
                          : "border-gray-200 hover:border-pink-300"
                      }`}>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="deliveryRoute"
                            value="vespertina"
                            checked={formData.deliveryRoute === "vespertina"}
                            onChange={handleInputChange}
                            className="mr-3 text-pink-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900">🌆 Ruta Vespertina</div>
                            <div className="text-sm text-gray-600">2:30 PM - 6:00 PM</div>
                            {formData.deliveryDate && new Date(formData.deliveryDate).getDay() === 6 && (
                              <div className="text-xs text-red-500 mt-1">⚠️ No disponible los sábados</div>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Información de horarios */}
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-pink-800 mb-2">ℹ️ Información Importante</h3>
                    <div className="text-xs text-pink-700 space-y-1">
                      <p>• <strong>No manejamos entregas en horarios específicos</strong></p>
                      <p>• <strong>Se entregan en el transcurso del horario de ruta elegido</strong></p>
                      <p>• <strong>Los sábados no aplica ruta vespertina</strong></p>
                      <p>• <strong>Su pedido debe quedar liquidado para poder salir a ruta</strong></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de WhatsApp */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📱</span>
                  </div>
                  <h3 className="text-sm font-semibold text-green-800">Confirmación por WhatsApp</h3>
                </div>
                <p className="text-xs text-green-700">
                  Después del pago, se enviará automáticamente un mensaje a WhatsApp con todos los detalles del pedido para confirmar la entrega.
                </p>
              </div>

              {/* Botón de pago */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Procesando..." : `Pagar ${(cartState.total + formData.shippingCost).toLocaleString("es-MX", { style: "currency", currency: "MXN" })}`}
              </button>
              
              {/* Información de autenticación */}
              {!user && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🔐</span>
                    </div>
                    <h3 className="text-sm font-semibold text-blue-800">Autenticación Requerida</h3>
                  </div>
                  <p className="text-xs text-blue-700">
                    Debes iniciar sesión para completar tu compra. Es rápido y seguro.
                  </p>
                </div>
              )}

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
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.product.image && (
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.product.title}
                      </h3>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {(item.product.price * item.quantity).toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
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
                  <span className={formData.shippingCost === 0 ? "text-green-600 font-medium" : "text-gray-900"}>
                    {formData.shippingCost === 0 ? "Gratis" : `$${formData.shippingCost.toFixed(2)} MXN`}
                  </span>
                </div>
                {formData.distance > 0 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Distancia: {formData.distance} km</span>
                    <span>Desde: Bahía de Santiago 847</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    {(cartState.total + formData.shippingCost).toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
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
      
      {/* Modal de Autenticación */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
}
