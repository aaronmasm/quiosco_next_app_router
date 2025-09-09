import prisma from "@/src/lib/prisma";
import { unstable_cache } from "next/cache";
import Heading from "@/components/ui/Heading";
import ProductCard from "@/components/products/ProductCard";

async function getProducts(category: string) {
  return prisma.product.findMany({
    where: {
      category: {
        slug: category,
      },
    },
  });
}

const getProductsCached = (category: string) =>
  unstable_cache(
    async () => getProducts(category),
    ["products-by-category", category],
    {
      tags: ["products"],
      revalidate: 3600,
    },
  )();

export default async function OrderPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const products = await getProductsCached(category);

  return (
    <>
      <Heading>Elige y personaliza tu pedido a continuación</Heading>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 items-stretch">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
