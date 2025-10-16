"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnnouncementBar from "./AnnouncementBar";
import CartSidebar from "./CartSidebar";
import AuthModal from "./AuthModal";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

/* ==== ICONOS SVG ===== */
const Icon = {
  Search: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  User: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M20 21a8 8 0 1 0-16 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),
  Cart: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M6 6h15l-1.5 9H8L6 3H3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10" cy="20" r="1.6" />
      <circle cx="18" cy="20" r="1.6" />
    </svg>
  ),
  Close: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Menu: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Facebook: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M13 20v-7h2.4l.4-3H13V8.1c0-.9.3-1.5 1.6-1.5H16V3.9A19 19 0 0 0 14.1 4C11.9 4 10.5 5.2 10.5 7.8V10H8v3h2.5v7h2.5Z" fill="currentColor"/>
    </svg>
  ),
  Instagram: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
    </svg>
  ),
  Pinterest: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M12 3C7.6 3 4 6.4 4 10.7c0 3.2 2 6 4.7 6 .7 0 1.3-.6 1.5-1.3l.5-2.1c.1-.4.1-.7 0-1-.2-.5-.3-1-.3-1.6 0-2 1.5-3.6 3.4-3.6 1.7 0 3 1.1 3 2.8 0 2.1-.9 3.9-2 3.9-.7 0-1.2-.6-1-1.4.2-.9.6-2 .6-2.7 0-.6-.3-1.1-1-1.1-1 0-1.8 1-1.8 2.4 0 .9.3 1.5.3 1.5l-1.2 5c-.3 1.2 0 2.7 0 2.8h.1c.8-1.2 1.6-2.4 1.9-3.6.2.9 1.4 1.6 2.6 1.6 3.5 0 6-3.1 6-7.1C20 6.2 16.5 3 12 3Z" fill="currentColor"/>
    </svg>
  ),
  Flower: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <path d="M12 6c-1.1 0-2 .9-2 2 0 .7.4 1.3.9 1.7-.5.3-.9.9-.9 1.6 0 .7.4 1.3.9 1.7-.5.3-.9.9-.9 1.6 0 1.1.9 2 2 2s2-.9 2-2c0-.7-.4-1.3-.9-1.7.5-.3.9-.9.9-1.6 0-.7-.4-1.3-.9-1.7.5-.3.9-.9.9-1.6 0-1.1-.9-2-2-2z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
};

const NAV = [
  { href: "#favoritas", label: "Best Sellers" },
  { href: "#categorias", label: "Amor" },
  { href: "#categorias", label: "Cumpleaños" },
  { href: "#categorias", label: "Aniversario" },
  { href: "#categorias", label: "Eventos" },
  { href: "#footer", label: "Envíos" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [elevated, setElevated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Sesión cerrada exitosamente', 'success');
      setShowUserMenu(false);
    } catch (error) {
      showToast('Error al cerrar sesión', 'error');
    }
  };

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className={`header-wrapper ${elevated ? "header-elevated" : ""}`}>
        {/* Announcement Bar */}
        <AnnouncementBar />

        {/* Tira superior */}
        <div className="header-top">
          <div className="container-max flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" aria-label="Facebook" className="social-link">
                <Icon.Facebook className="w-4 h-4"/>
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="social-link">
                <Icon.Instagram className="w-4 h-4"/>
              </a>
              <a href="https://pinterest.com" aria-label="Pinterest" className="social-link">
                <Icon.Pinterest className="w-4 h-4"/>
              </a>
            </div>
            <div className="header-tagline">
              <Icon.Flower className="w-3 h-3 opacity-60"/>
              <span>FLORES FRESCAS DIARIAS</span>
              <Icon.Flower className="w-3 h-3 opacity-60"/>
            </div>
            <div className="flex gap-4 text-xs">
              <a href="tel:8000000000" className="phone-link">📞 800 000 0000</a>
              <a href="tel:5500000000" className="phone-link">📞 55 0000 0000</a>
            </div>
          </div>
        </div>

        {/* Barra principal - MÁS GRANDE */}
        <div className="header-main-large">
          <div className="container-max flex items-center justify-between gap-4">
            {/* Logo - MÁS GRANDE */}
            <Link href="/" className="logo-link group">
              <div className="logo-container">
                <div className="logo-text">
                  <span className="logo-main-large">LA CASITA</span>
                  <span className="logo-accent-large">DE LAS FLORES</span>
                </div>
              </div>
            </Link>

            {/* Búsqueda desktop */}
            <form onSubmit={handleSearch} className="search-desktop">
              <Icon.Search className="search-icon"/>
              <input
                type="text"
                placeholder="Buscar arreglos, flores, ocasiones…"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Nav desktop */}
            <nav className="nav-desktop">
              {NAV.map(n => (
                <a key={n.label} href={n.href} className="nav-link-large">
                  {n.label}
                </a>
              ))}
            </nav>

            {/* Acciones */}
            <div className="header-actions">
              <button 
                aria-label="Buscar" 
                className="action-btn-large lg:hidden" 
                onClick={() => setShowSearch(v => !v)}
              >
                <Icon.Search className="w-6 h-6"/>
              </button>
              
              {user ? (
                <div className="relative">
                  <button 
                    aria-label="Mi cuenta" 
                    className="action-btn-large"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <Icon.User className="w-6 h-6"/>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.displayName || 'Usuario'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link 
                        href="/mis-pedidos" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Mis Pedidos
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  aria-label="Iniciar sesión" 
                  className="action-btn-large"
                  onClick={() => setShowAuthModal(true)}
                >
                  <Icon.User className="w-6 h-6"/>
                </button>
              )}
              
              <button 
                aria-label="Carrito" 
                className="action-btn-large cart-btn"
                onClick={() => cartDispatch({ type: "TOGGLE_CART" })}
              >
                <Icon.Cart className="w-6 h-6"/>
                {cartState.itemCount > 0 && (
                  <span className="cart-badge">
                    {cartState.itemCount}
                  </span>
                )}
              </button>
              
              <button 
                aria-label={open ? "Cerrar menú" : "Abrir menú"} 
                className="action-btn-large lg:hidden"
                onClick={() => setOpen(v => !v)}
              >
                {open ? <Icon.Close className="w-6 h-6"/> : <Icon.Menu className="w-6 h-6"/>}
              </button>
            </div>
          </div>
        </div>

        {/* Búsqueda mobile expandible */}
        {showSearch && (
          <div className="search-mobile">
            <div className="container-max">
              <form onSubmit={handleSearch} className="search-mobile-wrapper">
                <Icon.Search className="search-icon"/>
                <input
                  type="text"
                  placeholder="Buscar arreglos, flores, ocasiones…"
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="search-btn">Buscar</button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Menú móvil mejorado */}
      {open && (
        <>
          <div className="mobile-overlay" onClick={() => setOpen(false)} />
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <nav className="mobile-nav">
                {NAV.map((n, i) => (
                  <a 
                    key={n.label} 
                    href={n.href} 
                    onClick={() => setOpen(false)} 
                    className="mobile-nav-link"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {n.label}
                  </a>
                ))}
              </nav>
              
              <div className="mobile-menu-footer">
                <div className="mobile-socials">
                  <a href="https://facebook.com" aria-label="Facebook" className="mobile-social-link">
                    <Icon.Facebook className="w-5 h-5"/>
                  </a>
                  <a href="https://instagram.com" aria-label="Instagram" className="mobile-social-link">
                    <Icon.Instagram className="w-5 h-5"/>
                  </a>
                  <a href="https://pinterest.com" aria-label="Pinterest" className="mobile-social-link">
                    <Icon.Pinterest className="w-5 h-5"/>
                  </a>
                </div>
                <div className="mobile-phones">
                  <a href="tel:8000000000" className="mobile-phone">📞 800 000 0000</a>
                  <a href="tel:5500000000" className="mobile-phone">📞 55 0000 0000</a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}