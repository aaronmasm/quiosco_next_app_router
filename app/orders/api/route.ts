import prisma from "@/src/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    take: 5,
    where: {
      orderReadyAt: {
        not: null,
      },
    },
    orderBy: {
      orderReadyAt: "desc",
    },
    include: {
      OrderProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  return Response.json(orders);
}
