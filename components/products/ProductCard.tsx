import { Product } from "@/generated/prisma/client";
import Image from "next/image";
import { formatCurrency, getImagePath } from "@/src/utils";
import AddProductButton from "@/components/products/AddProductButton";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const imagePath = getImagePath(product.image);

  return (
    <div className="flex flex-col bg-white border rounded shadow h-full overflow-hidden">
      <div className="relative w-full aspect-[4/5]">
        <Image
          src={imagePath}
          alt={`Imagen platillo ${product.name}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
        />
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <h3 className="text-2xl font-bold">{product.name}</h3>
        <p className="mt-4 font-black text-4xl text-amber-500">
          {formatCurrency(product.price)}
        </p>

        <AddProductButton product={product} />
      </div>
    </div>
  );
}
