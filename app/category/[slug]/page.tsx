import { notFound } from "next/navigation";
import CategoryPage from "@/components/CategoryPage";

import { getProducts } from "@/lib/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const categories = [
  {
    slug: "amor",
    title: "Amor",
    description: "Expresa tu amor con nuestros hermosos arreglos florales",
  },
  {
    slug: "cumpleaños",
    title: "Cumpleaños",
    description: "Celebra un año más de vida con flores frescas y coloridas",
  },
  {
    slug: "aniversario",
    title: "Aniversario",
    description: "Conmemora momentos especiales con arreglos elegantes",
  },
  {
    slug: "eventos",
    title: "Eventos",
    description: "Flores perfectas para cualquier evento especial",
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
    image: categoryProduct?.image || "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80"
  };

  return <CategoryPage category={categoryWithImage} />;
}
