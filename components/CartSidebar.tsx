"use client";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthModal from "./AuthModal";

const Icon = {
  Close: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Plus: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Minus: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Trash: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function CartSidebar() {
  const { state, dispatch } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Verificar si el usuario está autenticado
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Si está autenticado, cerrar carrito y navegar al checkout
    dispatch({ type: "CLOSE_CART" });
    router.push("/checkout");
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => dispatch({ type: "CLOSE_CART" })}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <h2 className="text-xl font-semibold">Carrito de compras</h2>
          <button
            onClick={() => dispatch({ type: "CLOSE_CART" })}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar carrito"
          >
            <Icon.Close className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 6h15l-1.5 9H8L6 3H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="10" cy="20" r="1.6" />
                  <circle cx="18" cy="20" r="1.6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-500 mb-6">Agrega algunos productos para comenzar</p>
              <button
                onClick={() => dispatch({ type: "CLOSE_CART" })}
                className="btn"
              >
                Ir a la tienda
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {state.items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.product.title}
                    </h3>
                    <p className="text-sm text-gray-500">Melrose</p>
                    <p className="text-lg font-semibold text-[var(--brand)]">
                      {item.product.price.toLocaleString("es-MX", { 
                        style: "currency", 
                        currency: "MXN" 
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch({
                          type: "UPDATE_QUANTITY",
                          payload: { id: item.product.id, quantity: item.quantity - 1 }
                        })}
                        className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <Icon.Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => dispatch({
                          type: "UPDATE_QUANTITY",
                          payload: { id: item.product.id, quantity: item.quantity + 1 }
                        })}
                        className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Icon.Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => dispatch({
                        type: "REMOVE_ITEM",
                        payload: item.product.id
                      })}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Eliminar producto"
                    >
                      <Icon.Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-black/10 p-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span className="text-[var(--brand)]">
                {state.total.toLocaleString("es-MX", { 
                  style: "currency", 
                  currency: "MXN" 
                })}
              </span>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={handleCheckout}
                className="w-full btn btn-large block text-center"
              >
                Proceder al pago
              </button>
              <button
                onClick={() => dispatch({ type: "CLOSE_CART" })}
                className="w-full btn-outline"
              >
                Continuar comprando
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode="login"
      />
    </>
  );
}
