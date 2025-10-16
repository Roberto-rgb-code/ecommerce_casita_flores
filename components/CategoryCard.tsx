import Image from "next/image";

export default function CategoryCard({
  title,
  image,
  href = "#",
}: {
  title: string;
  image: string;
  href?: string;
}) {
  // Mapear títulos a slugs
  const getSlug = (title: string) => {
    const slugMap: { [key: string]: string } = {
      "Amor": "/category/amor",
      "Cumpleaños": "/category/cumpleanos",
      "Aniversario": "/category/aniversario",
      "Condolencias": "/category/condolencias",
    };
    return slugMap[title] || href;
  };

  const categoryHref = getSlug(title);
  return (
    <a 
      href={categoryHref} 
      className="group relative rounded-3xl overflow-hidden card bg-white transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
    >
      <div className="relative aspect-square">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-all duration-700 scale-100 group-hover:scale-110 group-hover:rotate-1" 
        />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-all duration-700 group-hover:from-black/80 group-hover:via-black/40"></div>
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
        <span className="text-[11px] tracking-[.25em] text-white/80 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          OCASIONES
        </span>
        
        <h3 className="text-white text-2xl md:text-3xl font-light mb-4 transition-all duration-500 transform group-hover:-translate-y-2 drop-shadow-lg">
          {title}
        </h3>
        
        <span className="btn bg-white text-[var(--ink)] hover:bg-white/90 inline-flex items-center gap-2 self-start transform transition-all duration-500 opacity-80 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 shadow-lg">
          COMPRAR
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </a>
  );
}