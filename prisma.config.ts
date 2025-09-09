import { defineConfig } from "prisma/config";
import path from "node:path";

// Solo carga el archivo .env en desarrollo
if (process.env.NODE_ENV !== "production") {
  process.loadEnvFile();
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("db", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
});
