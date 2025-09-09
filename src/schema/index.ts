import { z } from "zod";

export const OrderSchema = z.object({
  name: z.string().min(1, "Tu Nombre es Obligatorio"),
  total: z.number().min(1, "Hay errores en la orden"),
  order: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
      subtotal: z.number(),
    }),
  ),
});

export const OrderIdSchema = z.object({
  orderId: z.coerce.number().int().positive(),
});

export const SearchSchema = z.object({
  search: z.string().trim().min(1, { error: "La búsqueda no puede ir vacía" }),
});

export const ProductSchema = z.object({
  name: z.string().trim().min(1, "El Nombre del Producto no puede ir vacío"),
  price: z
    .string()
    .trim()
    .transform((value) => parseFloat(value))
    .refine((value) => value > 0, "Precio no válido")
    .or(z.number().min(1, "El Precio es Obligatorio")),
  categoryId: z
    .string()
    .trim()
    .transform((value) => parseInt(value))
    .refine((value) => value > 0, "La Categoría es Obligatoria")
    .or(z.number().min(1, "La Categoría es Obligatoria")),
  image: z.string().min(1, "La Imagen es obligatoria"),
});
