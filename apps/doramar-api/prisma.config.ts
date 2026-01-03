import "dotenv/config"
import path from "path"
import type { PrismaConfig } from "prisma"
import { env } from "prisma/config"
export default {
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
} satisfies PrismaConfig
