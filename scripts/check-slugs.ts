import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

prisma.pooja.findMany({
  select: { title: true, slug: true }
})
  .then(poojas => console.log(JSON.stringify(poojas, null, 2)))
  .then(() => prisma.$disconnect())
