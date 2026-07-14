import { PrismaClient } from "@prisma/client"
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient; pool: Pool }

const connectionString = process.env.DATABASE_URL

if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({ connectionString })
}
const adapter = new PrismaPg(globalForPrisma.pool)

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
