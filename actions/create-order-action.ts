"use server";

import prisma from "@/src/lib/prisma";
import { revalidateTag } from "next/cache";
import { OrderSchema } from "@/src/schema";

export async function createOrder(data: unknown) {
  const result = OrderSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.issues,
    };
  }

  const { name, total, order } = result.data;

  try {
    await prisma.order.create({
      data: {
        name,
        total,
        OrderProducts: {
          create: order.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
          })),
        },
      },
    });
    revalidateTag("orders");
  } catch (e) {
    console.error(e);
  }
}
