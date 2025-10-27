import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import LottieAnimation from "@/components/LottieAnimation";
import { getProducts } from "@/lib/products";

// Forzar revalidación de caché cada 60 segundos
export const revalidate = 60;

export default async function Home() {
  // Obtener productos desde Supabase
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 to-white">
      {/* HERO PREMIUM CON CARRUSEL */}
      <section className="relative min-h-[700px] md:min-h-[800px] flex items-center overflow-hidden">
        {/* Overlay mejorado */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10" />

        {/* Background Carousel */}
        <div className="absolute inset-0 z-0">
          <HeroCarousel />
        </div>

        {/* Content mejorado */}
        <div className="relative z-20 py-20 w-full">
          <div className="container-max">
            <div className="max-w-3xl text-white">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-base font-medium mb-8 shadow-lg">
                ✨ Flores frescas entregadas hoy
              </span>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-8">
                Instantes efímeros,
                <br />
                <span className="block font-serif italic text-pink-100 drop-shadow-lg">eternos en cada arreglo</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-2xl leading-relaxed">
                Envía las flores más frescas de la CDMX. Entrega el mismo día en
                toda la zona metropolitana con nuestro servicio premium.
              </p>

              <div className="flex flex-wrap gap-6 mb-16">
                <a href="#favoritas" className="bg-gradient-to-r from-[var(--brand)] to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  COMPRAR AHORA
                </a>
                <a
                  href="#categorias"
                  className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-[var(--brand)] transition-all duration-300"
                >
                  VER CATÁLOGO
                </a>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-2xl">🚚</span>
                  <span className="text-white/80">Entrega mismo día</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-2xl">🌸</span>
                  <span className="text-white/80">Flores premium</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-2xl">💝</span>
                  <span className="text-white/80">Atención personalizada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DELIVERY LOCATIONS - Como Melrose */}
      <section className="border-b bg-white">
        <div className="container-max">
          <div className="py-6">
            <div className="text-center">
              <p className="text-sm text-[var(--muted)] mb-2">Para entrega en:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-[var(--ink)]">
                <span>Ciudad de México</span>
                <span>Estado de México</span>
                <span>Zona Metropolitana</span>
                <span>Cuernavaca</span>
                <span>Puebla</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAVORITAS */}
      <section id="favoritas" className="py-16 md:py-20">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-[var(--ink)] mb-4">
              Nuestras <span className="font-serif italic text-[var(--brand)]">Favoritas</span>
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
              Los arreglos más populares, cuidadosamente seleccionados para crear momentos inolvidables
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {products.slice(0, 6).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/todos-los-productos"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--brand)] to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Ver Todos los Productos
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Mostrar botón "Ver más" si hay más de 6 productos */}
          {products.length > 6 && (
            <div className="text-center mt-8">
              <a
                href="/todos-los-productos"
                className="btn-outline btn-large"
              >
                Ver más productos ({products.length - 6} más)
              </a>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORÍAS - Como Melrose */}
      <section id="categorias" className="py-20 md:py-24 bg-gradient-to-br from-gray-50 to-pink-50/30">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-[var(--ink)] mb-4">
              Flores para <span className="font-serif italic text-[var(--brand)]">toda ocasión</span>
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
              Encuentra el arreglo perfecto para cada momento especial de la vida
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(() => {
              // Categorías sincronizadas con las páginas de categoría
              const categories = [
                { slug: "amor", title: "Amor / Aniversario" },
                { slug: "cumpleanos", title: "Cumpleaños" },
                { slug: "amistad", title: "Amistad" },
                { slug: "agradecimiento", title: "Agradecimiento" },
                { slug: "graduacion", title: "Graduación" },
                { slug: "condolencias", title: "Condolencias" },
                { slug: "nacimiento", title: "Nacimiento" },
                { slug: "eventos", title: "Eventos" }
              ];
              
              return categories.map((category, index) => {
                const categoryProduct = products.find(p => p.category?.toLowerCase() === category.slug);
                // Usar imágenes del carousel del hero (1.png a 10.png)
                const heroImages = [
                  "/1.png", "/2.png", "/3.png", "/4.png", 
                  "/5.png", "/6.png", "/7.png", "/8.png"
                ];
                
                const imageUrl = categoryProduct?.image || heroImages[index] || "/1.png";
                
                return (
                  <CategoryCard
                    key={category.slug}
                    title={category.title}
                    image={imageUrl}
                    href={`/category/${category.slug}`}
                  />
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-[var(--brand-50)] text-[var(--brand)] border border-[var(--brand)]/20">
                ✨ La diferencia Casita
              </span>
              <h2 className="text-3xl md:text-4xl font-light">¿Por qué elegirnos?</h2>
              <p className="text-lg text-[var(--muted)] leading-relaxed">
                Cada arreglo es creado con flores frescas seleccionadas a mano por
                nuestros floristas expertos. Entregamos emociones, no solo flores.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="text-4xl flex-shrink-0">🌹</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Flores premium</h3>
                    <p className="text-[var(--muted)]">Importadas y nacionales de la más alta calidad</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-4xl flex-shrink-0">👨‍🎨</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Floristas expertos</h3>
                    <p className="text-[var(--muted)]">Más de 15 años creando momentos inolvidables</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-4xl flex-shrink-0">📸</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Foto de entrega</h3>
                    <p className="text-[var(--muted)]">Confirma que tu regalo llegó perfectamente</p>
                  </div>
                </div>
              </div>

              <a href="#footer" className="btn">
                Conocer más
              </a>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Hermoso arreglo floral de La Casita de las Flores"
                src="/9.png"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Como Melrose */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light">Lo que dicen nuestros clientes</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <LottieAnimation 
                src="https://lottie.host/3beae153-e97f-45a6-a4d6-d158018ab35b/dtvJTqAbFq.lottie"
                className="mb-4"
                width={80}
                height={80}
              />
              <p className="text-lg text-[var(--muted)] mb-6 leading-relaxed italic">
                Es como si hubieran leído mi mente para dar el regalo perfecto.
              </p>
              <div className="font-semibold text-[var(--ink)]">Teresa Maldonado</div>
            </div>

            <div className="text-center">
              <LottieAnimation 
                src="https://lottie.host/3beae153-e97f-45a6-a4d6-d158018ab35b/dtvJTqAbFq.lottie"
                className="mb-4"
                width={80}
                height={80}
              />
              <p className="text-lg text-[var(--muted)] mb-6 leading-relaxed italic">
                Aún para momentos difíciles, es extraordinaria la belleza de los arreglos de La Casita de las Flores.
              </p>
              <div className="font-semibold text-[var(--ink)]">Rosario Cervantes</div>
            </div>

            <div className="text-center">
              <LottieAnimation 
                src="https://lottie.host/3beae153-e97f-45a6-a4d6-d158018ab35b/dtvJTqAbFq.lottie"
                className="mb-4"
                width={80}
                height={80}
              />
              <p className="text-lg text-[var(--muted)] mb-6 leading-relaxed italic">
                Me robó el corazón, el alma y todas las sonrisas del mundo.
              </p>
              <div className="font-semibold text-[var(--ink)]">Andrea Montes</div>
            </div>

            <div className="text-center">
              <LottieAnimation 
                src="https://lottie.host/3beae153-e97f-45a6-a4d6-d158018ab35b/dtvJTqAbFq.lottie"
                className="mb-4"
                width={80}
                height={80}
              />
              <p className="text-lg text-[var(--muted)] mb-6 leading-relaxed italic">
                Encontré la mejor manera de consentir a mis princesas.
              </p>
              <div className="font-semibold text-[var(--ink)]">Esteban Becker</div>
            </div>

            <div className="text-center">
              <LottieAnimation 
                src="https://lottie.host/3beae153-e97f-45a6-a4d6-d158018ab35b/dtvJTqAbFq.lottie"
                className="mb-4"
                width={80}
                height={80}
              />
              <p className="text-lg text-[var(--muted)] mb-6 leading-relaxed italic">
                Hay algo diferente en la elegancia de sus arreglos.
              </p>
              <div className="font-semibold text-[var(--ink)]">Gonzalo y Sofía M.</div>
            </div>

            <div className="text-center">
              <LottieAnimation 
                src="https://lottie.host/3beae153-e97f-45a6-a4d6-d158018ab35b/dtvJTqAbFq.lottie"
                className="mb-4"
                width={80}
                height={80}
              />
              <p className="text-lg text-[var(--muted)] mb-6 leading-relaxed italic">
                Hablar con el equipo me ayudó a dar en el clavo con el arreglo perfecto.
              </p>
              <div className="font-semibold text-[var(--ink)]">Mónica Ibáñez</div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM SECTION - Como Melrose */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-2">Creamos momentos inolvidables 🤍</h2>
            <p className="text-[var(--muted)] text-lg">
              Follow @lacasitadlasflores
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product, i) => (
              <a
                key={product.id}
                href={`/product/${product.id}`}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                aria-label={`Ver producto ${product.title}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={product.title}
                  src={product.image || "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center text-white">
                    <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                    </svg>
                    <p className="text-sm font-medium">{product.title}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="https://www.instagram.com/lacasitadlasflores?igsh=bHZwaGJ0bWFtemJi&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Síguenos en Instagram
            </a>
          </div>
        </div>
      </section>

      {/* CALENDARIO DE ENTREGAS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-[var(--brand-50)] text-[var(--brand)] border border-[var(--brand)]/20 mb-4">
              📦 Entrega el mismo día
            </span>
            <h2 className="text-3xl md:text-4xl font-light mb-4">Calendario de Entregas</h2>
            <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
              Manejamos 3 horarios flexibles para que recibas tus flores en el momento perfecto
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Horario 1 */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-pink-100">
              <div className="text-4xl mb-4 text-center">🌅</div>
              <h3 className="text-2xl font-bold text-center mb-2">Horario 1</h3>
              <p className="text-3xl font-light text-center text-[var(--brand)] mb-4">9am - 12pm</p>
              <p className="text-sm text-center text-[var(--muted)]">Entregas matutinas</p>
            </div>

            {/* Horario 2 */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg border border-amber-100">
              <div className="text-4xl mb-4 text-center">☀️</div>
              <h3 className="text-2xl font-bold text-center mb-2">Horario 2</h3>
              <p className="text-3xl font-light text-center text-[var(--brand)] mb-4">12pm - 3pm</p>
              <p className="text-sm text-center text-[var(--muted)]">Entregas al mediodía</p>
            </div>

            {/* Horario 3 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
              <div className="text-4xl mb-4 text-center">🌆</div>
              <h3 className="text-2xl font-bold text-center mb-2">Horario 3</h3>
              <p className="text-3xl font-light text-center text-[var(--brand)] mb-4">3pm - 6pm</p>
              <p className="text-sm text-center text-[var(--muted)]">Entregas vespertinas</p>
            </div>
          </div>

          {/* Condiciones de pago */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-center">⏰ Horarios disponibles según tu hora de pago</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                  ✅
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Paga antes de las 9:00 AM</h4>
                  <p className="text-[var(--muted)]">Acceso a los 3 horarios: 9am-12pm, 12pm-3pm y 3pm-6pm</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Paga antes de las 11:00 AM</h4>
                  <p className="text-[var(--muted)]">Acceso a 2 horarios: 12pm-3pm y 3pm-6pm</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
                  🚀
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Paga antes de las 2:00 PM</h4>
                  <p className="text-[var(--muted)]">Acceso al horario: 3pm-6pm</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-[var(--brand-50)] border border-[var(--brand)]/20 rounded-xl">
              <p className="text-sm text-center text-[var(--ink)]">
                💡 <strong>Tip:</strong> Paga temprano para tener más opciones de horario y asegurar tu entrega en el momento ideal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEREMOS TUS CÓMPLICES - Como Melrose */}
      <section className="py-20 bg-gradient-to-br from-[var(--brand)] to-[var(--brand-700)] text-white">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-light mb-4">SEREMOS TUS CÓMPLICES</h2>
            <p className="text-xl text-white/90 mb-8">
              Nos encargaremos de hacer la atmósfera perfecta para el evento de tus sueños.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#favoritas" className="btn btn-large bg-white text-[var(--brand)] hover:bg-white/90">
                COTIZA CON NOSOTROS
              </a>
              <a
                href="tel:3322807617"
                className="btn-outline btn-large border-white text-white hover:bg-white hover:text-[var(--brand)]"
              >
                📞 LLAMAR
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
