import { notFound } from "next/navigation";
import CategoryPage from "@/components/CategoryPage";

import { getProducts } from "@/lib/products";

// Forzar revalidación de caché cada 60 segundos
export const revalidate = 60;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const categories = [
  {
    slug: "best-sellers",
    title: "Best sellers",
    description: "Nuestros productos más populares y vendidos",
  },
  {
    slug: "ramos-y-bouquets",
    title: "Ramos y bouquets",
    description: "Hermosos arreglos florales para cualquier ocasión",
  },
  {
    slug: "mix-floral",
    title: "Mix Floral",
    description: "Combinaciones únicas de flores y colores",
  },
  {
    slug: "corazones",
    title: "Corazones",
    description: "Arreglos con forma de corazón para expresar amor",
  },
  {
    slug: "baules",
    title: "Baules",
    description: "Elegantes baules florales para ocasiones especiales",
  },
  {
    slug: "cajas-circulares",
    title: "Cajas circulares",
    description: "Arreglos en cajas circulares perfectas para regalar",
  },
  {
    slug: "para-ellos",
    title: "Para ellos",
    description: "Arreglos florales especialmente diseñados para hombres",
  },
  {
    slug: "globos",
    title: "Globos",
    description: "Combinaciones de flores y globos para celebrar",
  },
  {
    slug: "peluches",
    title: "Peluches",
    description: "Adorables arreglos con peluches y flores",
  },
  {
    slug: "pasteles",
    title: "Pasteles",
    description: "Arreglos florales con forma de pastel",
  },
];

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPageRoute({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // Obtener productos para encontrar una imagen representativa
  const products = await getProducts();
  const categoryProduct = products.find(p => p.category?.toLowerCase() === category.slug);
  
  const categoryWithImage = {
    ...category,
    image: categoryProduct?.image || "/flores_hero1.jpeg"
  };

  return <CategoryPage category={categoryWithImage} />;
}
