import { JSX } from "react";
import prisma from "@/src/lib/prisma";
import { unstable_cache } from "next/cache";
import { SearchSchema } from "@/src/schema";
import Heading from "@/components/ui/Heading";
import ProductSearchForm from "@/components/products/ProductSearchForm";
import ProductsTable from "@/components/products/ProductsTable";

const searchProducts = (searchTerm: string) =>
  unstable_cache(
    async () =>
      prisma.product.findMany({
        where: {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        include: {
          category: true,
        },
      }),
    ["admin-products-search", searchTerm],
    {
      tags: ["products"],
      revalidate: 60,
    },
  )();

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}): Promise<JSX.Element> {
  const params = await searchParams;
  const result = SearchSchema.safeParse(params);

  if (!result.success) {
    throw new Error("Término de búsqueda inválido");
  }

  const { search } = result.data;
  const products = await searchProducts(search);

  return (
    <>
      <Heading>Resultados de Búsqueda: {search}</Heading>

      <div className="flex flex-col lg:flex-row lg:justify-end gap-5">
        <ProductSearchForm />
      </div>

      {products.length ? (
        <ProductsTable products={products} />
      ) : (
        <p className="text-center text-lg">No hay resultados</p>
      )}
    </>
  );
}
