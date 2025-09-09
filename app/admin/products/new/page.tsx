import Heading from "@/components/ui/Heading";
import GoBackButton from "@/components/ui/GoBackButton";
import AddProductForm from "@/components/products/AddProductForm";
import ProductForm from "@/components/products/ProductForm";

export default function CreateProductPage() {
  return (
    <>
      <Heading>Nuevo Producto</Heading>

      <GoBackButton />

      <AddProductForm>
        <ProductForm />
      </AddProductForm>
    </>
  );
}
