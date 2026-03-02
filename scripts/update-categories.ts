import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const imageUrls: Record<string, string> = {
  'ganesh': 'https://i.pinimg.com/736x/60/aa/b1/60aab155a8e5a5d89a164a6ced57e2c3.jpg',
  'lakshmi': 'https://i.etsystatic.com/r/il/0738f0/280014557/219613015/il_fullxfull.2800145575_l1yw.jpg',
  'navgraha': 'https://artfactory.in/product_pictures/Navgraha%20Yantra-CP11008.jpg',
  'satyanarayan': 'https://pujabooking.com/wp-content/uploads/2017/11/Shri-Satya-Narayan-Katha.jpg',
  'rudrabhishek': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfr8wpAx5QPx2huLZWP_FX3s_p1gRsA5PqFw&s',
  'vishnu': 'https://nepalyogahome.com/wp-content/uploads/2021/07/Lord-Vishnu.jpg',
  'hanuman': 'https://m.media-amazon.com/images/I/51Dz-SS9o0L._AC_UF894,1000_QL80_.jpg',
  'Durga': 'https://miro.medium.com/v2/resize:fit:2000/1*szbNklJFDPngqSnlZ9gysw.jpeg',
}

async function main() {
  const categories = await prisma.poojaCategory.findMany()
  for (const cat of categories) {
    const url = imageUrls[cat.slug]
    if (url) {
      await prisma.poojaCategory.update({
        where: { id: cat.id },
        data: { imageUrl: url }
      })
      console.log('Updated:', cat.slug, '->', url.substring(0, 50) + '...')
    }
  }
  console.log('Done!')
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1) })
