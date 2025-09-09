import prisma from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Heading from "@/components/ui/Heading";
import GoBackButton from "@/components/ui/GoBackButton";
import EditProductForm from "@/components/products/EditProductForm";
import ProductForm from "@/components/products/ProductForm";

async function getProductById(id: number) {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    notFound();
  }

  return product;
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(+id);

  return (
    <>
      <Heading>Editar Producto: {product.name}</Heading>

      <GoBackButton />

      <EditProductForm>
        <ProductForm product={product} />
      </EditProductForm>
    </>
  );
}
