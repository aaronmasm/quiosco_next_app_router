"use client";

import { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { ProductSchema } from "@/src/schema";
import { updateProduct } from "@/actions/update-product-action";

export default function EditProductForm({ children }: { children: ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const id = +params.id!;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      price: formData.get("price"),
      categoryId: formData.get("categoryId"),
      image: formData.get("image"),
    };

    const result = ProductSchema.safeParse(data);

    if (!result.success) {
      const seen = new Set<string>();
      for (const issue of result.error.issues) {
        const field = (issue.path?.[0] as string) || "form";
        if (seen.has(field)) continue;
        seen.add(field);
        toast.error(issue.message, {
          toastId: `validation-${field}`, // evita duplicados al reintentar
        });
      }
      return;
    }

    try {
      const response = await updateProduct(result.data, id);

      // Manejar errores devueltos por la acción del servidor
      if (response?.errors) {
        response.errors.forEach((issue) => {
          toast.error(issue.message);
        });
        return;
      }

      toast.success("Producto actualizado correctamente", {
        toastId: "product-update",
      });
      form.reset();
      router.push("/admin/products");
    } catch (e) {
      console.error(e);
      toast.error("Hubo un error al actualizar el producto", {
        toastId: "update-error",
      });
    }
  };

  return (
    <div className="bg-white mt-10 px-5 py-10 rounded-md shadow-md max-w-3xl mx-auto">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {children}
        <input
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-800 transition-colors text-white w-full mt-5 p-3 uppercase
          font-bold cursor-pointer"
          value="Guardar Cambios"
        />
      </form>
    </div>
  );
}
