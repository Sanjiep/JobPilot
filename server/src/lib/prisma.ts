import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = "postgresql://postgres:password@localhost:5432/jobpilot"

declare global {
  var __prisma: PrismaClient | undefined
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = global.__prisma || new PrismaClient({ 
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') global.__prisma = prisma

export default prisma