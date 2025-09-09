import prisma from "@/src/lib/prisma";
import { categories } from "@/prisma/data/categories";
import { products } from "@/prisma/data/products";

async function main() {
  try {
    await prisma.category.createMany({ data: categories });
    await prisma.product.createMany({ data: products });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
