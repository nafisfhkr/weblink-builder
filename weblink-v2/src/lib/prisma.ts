import { PrismaClient } from "@prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

let prisma: PrismaClient

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not defined")
}

try {
  const adapter = new PrismaMariaDb(connectionString)
  prisma = globalForPrisma.prisma || new PrismaClient({ adapter })
} catch (error) {
  console.error("Failed to initialize Prisma Client:", error)
  throw error
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export { prisma }
