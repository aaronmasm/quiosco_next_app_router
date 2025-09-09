import prisma from "@/src/lib/prisma";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import Heading from "@/components/ui/Heading";
import ProductSearchForm from "@/components/products/ProductSearchForm";
import ProductsTable from "@/components/products/ProductsTable";
import ProductsPagination from "@/components/products/ProductsPagination";

const getProductCount = unstable_cache(
  async () => prisma.product.count(),
  ["admin-products-count"],
  {
    tags: ["products"],
    revalidate: 60,
  },
);

const getProducts = (page: number, pageSize: number) =>
  unstable_cache(
    async () => {
      const skip = (page - 1) * pageSize;
      return prisma.product.findMany({
        take: pageSize,
        skip,
        include: {
          category: true,
        },
      });
    },
    ["admin-products-list", String(page), String(pageSize)],
    {
      tags: ["products"],
      revalidate: 60,
    },
  )();

export type ProductsWithCategory = Awaited<ReturnType<typeof getProducts>>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page ?? 1) || 1;
  const pageSize = 10;

  // Validar que la página sea un número positivo válido
  if (page < 1 || !Number.isInteger(page)) {
    redirect("/admin/products");
  }

  try {
    const productsData = getProducts(page, pageSize);
    const totalProductsData = getProductCount();
    const [products, totalProducts] = await Promise.all([
      productsData,
      totalProductsData,
    ]);

    const totalPages = Math.ceil(totalProducts / pageSize);

    // Solo redirigir si hay productos y la página solicitada es mayor al total
    if (totalProducts > 0 && page > totalPages) {
      redirect("/admin/products");
    }

    return (
      <div className="flex min-h-screen flex-col">
        <Heading>Administrar Productos</Heading>

        <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
          <Link
            href="/admin/products/new"
            className="bg-amber-400 w-full lg:w-auto text-xl px-10 py-3 text-center
            font-bold cursor-pointer hover:bg-amber-500 transition-colors"
          >
            Crear Producto
          </Link>

          <ProductSearchForm />
        </div>

        <div className="flex-1">
          {products.length > 0 ? (
            <ProductsTable products={products} />
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">
                No hay productos disponibles
              </p>
              <Link
                href="/admin/products/new"
                className="bg-amber-400 hover:bg-amber-500 px-6 py-2 rounded transition-colors"
              >
                Crear primer producto
              </Link>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <ProductsPagination page={page} totalPages={totalPages} />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error al cargar productos:", error);
    return (
      <div className="flex min-h-screen flex-col">
        <Heading>Administrar Productos</Heading>
        <div className="text-center py-20">
          <p className="text-red-500 text-lg mb-4">
            Error al cargar los productos
          </p>
          <Link
            href="/admin/products"
            className="bg-amber-400 hover:bg-amber-500 px-6 py-2 rounded transition-colors"
          >
            Intentar de nuevo
          </Link>
        </div>
      </div>
    );
  }
}
