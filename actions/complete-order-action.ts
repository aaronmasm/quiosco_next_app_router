"use server";

import prisma from "@/src/lib/prisma";
import { revalidateTag } from "next/cache";
import { OrderIdSchema } from "@/src/schema";

export async function completeOrder(orderId: unknown) {
  const result = OrderIdSchema.safeParse({ orderId });

  if (!result.success) {
    console.error(result.error.issues);
    throw new Error("Order ID inválido");
  }

  const { orderId: validOrderId } = result.data;

  try {
    // Actualiza la orden
    await prisma.order.update({
      where: { id: validOrderId },
      data: {
        status: true,
        orderReadyAt: new Date(), // Date() sin argumentos ya toma el timestamp actual
      },
    });

    // Invalida el caché de órdenes para que se refresque automáticamente
    revalidateTag("orders");
  } catch (e) {
    console.error(e);
    throw new Error("No se pudo completar la orden");
  }
}
