import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

prisma.poojaCategory.findFirst({ where: { slug: 'ganesh' }})
  .then(c => console.log(JSON.stringify(c, null, 2)))
  .then(() => prisma.$disconnect())
