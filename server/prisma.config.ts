import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    name: "db",
    provider: "postgresql",
    url: "postgresql://postgres:password@localhost:5432/jobpilot",
  },
})