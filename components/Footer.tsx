export default function Footer() {
  return (
    <footer id="footer" className="footer-wrapper">
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="container-max">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3 className="newsletter-title">
                Recibe ofertas exclusivas 🌸
              </h3>
              <p className="newsletter-description">
                Suscríbete y recibe un 10% de descuento en tu primera compra
              </p>
            </div>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                Suscribirme
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container-max">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <div className="footer-logo">
                <svg className="w-8 h-8 text-[var(--brand)]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                  <path d="M12 6c-1.1 0-2 .9-2 2 0 .7.4 1.3.9 1.7-.5.3-.9.9-.9 1.6 0 .7.4 1.3.9 1.7-.5.3-.9.9-.9 1.6 0 1.1.9 2 2 2s2-.9 2-2c0-.7-.4-1.3-.9-1.7.5-.3.9-.9.9-1.6 0-.7-.4-1.3-.9-1.7.5-.3.9-.9.9-1.6 0-1.1-.9-2-2-2z" strokeWidth="1.5"/>
                </svg>
                <div>
                  <div className="footer-logo-main">LA CASITA</div>
                  <div className="footer-logo-accent">DE LAS FLORES</div>
                </div>
              </div>
              <p className="footer-tagline">
                Flores frescas con entrega el mismo día en CDMX y zona metropolitana
              </p>
              <div className="footer-socials">
                <a 
                  href="https://www.instagram.com/lacasitadlasflores?igsh=bHZwaGJ0bWFtemJi&utm_source=qr" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link" 
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3.5" strokeWidth="2"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                  </svg>
                </a>
                <a 
                  href="https://www.tiktok.com/@lacasitadlasflores?_t=ZS-90Q7GIGwzi6&_r=1" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link" 
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a 
                  href="https://wa.me/523322807617" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link" 
                  aria-label="WhatsApp"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Horarios de Entrega */}
            <div className="footer-column">
              <h4 className="footer-column-title">📅 Horarios de Entrega</h4>
              <ul className="footer-links">
                <li className="footer-link text-sm">
                  <strong>Horario 1:</strong> 9am - 12pm
                </li>
                <li className="footer-link text-sm">
                  <strong>Horario 2:</strong> 12pm - 3pm
                </li>
                <li className="footer-link text-sm">
                  <strong>Horario 3:</strong> 3pm - 6pm
                </li>
              </ul>
              <div className="mt-3 text-xs text-[var(--muted)] space-y-1">
                <p>• Paga antes de 9am: horarios 1, 2 y 3</p>
                <p>• Paga antes de 11am: horarios 2 y 3</p>
                <p>• Paga antes de 2pm: horario 3</p>
              </div>
            </div>

            {/* Contacto */}
            <div className="footer-column">
              <h4 className="footer-column-title">📍 Contacto</h4>
              <ul className="footer-links">
                <li>
                  <a 
                    href="https://maps.app.goo.gl/36fZtJwo9Y2gXzdC6?g_st=iw" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link hover:text-[var(--brand)]"
                  >
                    Bahía de Santiago 847<br />
                    Parques de Santa María<br />
                    Tlaquepaque
                  </a>
                </li>
                <li>
                  <a href="tel:3322807617" className="footer-link hover:text-[var(--brand)]">
                    📞 33 2280 7617
                  </a>
                </li>
                <li>
                  <a 
                    href="https://wa.me/523322807617" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link hover:text-[var(--brand)]"
                  >
                    💬 WhatsApp
                  </a>
                </li>
              </ul>
            </div>

            {/* Información */}
            <div className="footer-column">
              <h4 className="footer-column-title">Información</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Devoluciones y reembolsos</a></li>
                <li><a href="#" className="footer-link">Métodos de pago</a></li>
                <li><a href="#" className="footer-link">Cobertura</a></li>
                <li><a href="#" className="footer-link">Envío y seguimiento</a></li>
                <li><a href="#" className="footer-link">Preguntas frecuentes</a></li>
              </ul>
            </div>

            {/* Redes Sociales */}
            <div className="footer-column">
              <h4 className="footer-column-title">Síguenos</h4>
              <ul className="footer-links">
                <li>
                  <a 
                    href="https://www.instagram.com/lacasitadlasflores?igsh=bHZwaGJ0bWFtemJi&utm_source=qr" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link hover:text-[var(--brand)]"
                  >
                    📷 Instagram
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.tiktok.com/@lacasitadlasflores?_t=ZS-90Q7GIGwzi6&_r=1" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link hover:text-[var(--brand)]"
                  >
                    🎵 TikTok
                  </a>
                </li>
                <li><a href="#" className="footer-link">Eventos corporativos</a></li>
                <li><a href="#" className="footer-link">Blog</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container-max">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {new Date().getFullYear()} La Casita de las Flores. Todos los derechos reservados.
            </p>
            <div className="footer-payment">
              <span className="footer-payment-text">Aceptamos:</span>
              <div className="footer-payment-methods">
                <span className="footer-payment-icon">💳</span>
                <span className="footer-payment-icon">🏦</span>
                <span className="footer-payment-icon">📱</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}