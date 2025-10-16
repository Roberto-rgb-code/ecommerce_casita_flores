import { notFound } from "next/navigation";
import { getProducts, getProductById } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";

type Props = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
