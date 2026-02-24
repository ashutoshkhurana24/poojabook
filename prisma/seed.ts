import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Categories
  const categories = await Promise.all([
    prisma.poojaCategory.upsert({
      where: { slug: 'ganesh' },
      update: {},
      create: { name: 'Ganesh', slug: 'ganesh', icon: '🐘', description: 'Lord Ganesha poojas for new beginnings' },
    }),
    prisma.poojaCategory.upsert({
      where: { slug: 'lakshmi' },
      update: {},
      create: { name: 'Lakshmi', slug: 'lakshmi', icon: '💰', description: 'Goddess Lakshmi poojas for wealth' },
    }),
    prisma.poojaCategory.upsert({
      where: { slug: 'navgraha' },
      update: {},
      create: { name: 'Navgraha', slug: 'navgraha', icon: '🪐', description: 'Navgraha shanti poojas' },
    }),
    prisma.poojaCategory.upsert({
      where: { slug: 'satyanarayan' },
      update: {},
      create: { name: 'Satyanarayan', slug: 'satyanarayan', icon: '🔱', description: 'Satyanarayan Katha and puja' },
    }),
    prisma.poojaCategory.upsert({
      where: { slug: 'rudrabhishek' },
      update: {},
      create: { name: 'Rudrabhishek', slug: 'rudrabhishek', icon: '🗿', description: 'Lord Shiva abhishek' },
    }),
    prisma.poojaCategory.upsert({
      where: { slug: 'vishnu' },
      update: {},
      create: { name: 'Vishnu', slug: 'vishnu', icon: '🪷', description: 'Lord Vishnu poojas' },
    }),
    prisma.poojaCategory.upsert({
      where: { slug: 'hanuman' },
      update: {},
      create: { name: 'Hanuman', slug: 'hanuman', icon: '🐒', description: 'Hanuman Chalisa and pooja' },
    }),
    prisma.poojaCategory.upsert({
      where: { slug: 'Durga' },
      update: {},
      create: { name: 'Durga', slug: 'Durga', icon: '⚔️', description: 'Goddess Durga poojas' },
    }),
  ])
  console.log('Categories created')

  // Locations
  const locations = await Promise.all([
    prisma.poojaLocation.upsert({
      where: { id: 'loc-1' },
      update: {},
      create: { id: 'loc-1', name: 'Mumba Devi Temple', address: 'Kamathipura', city: 'Mumbai', state: 'Maharashtra', pincode: '400012', templeName: 'Mumba Devi' },
    }),
    prisma.poojaLocation.upsert({
      where: { id: 'loc-2' },
      update: {},
      create: { id: 'loc-2', name: 'Siddhivinayak Temple', address: 'Prabhadevi', city: 'Mumbai', state: 'Maharashtra', pincode: '400025', templeName: 'Siddhivinayak' },
    }),
    prisma.poojaLocation.upsert({
      where: { id: 'loc-3' },
      update: {},
      create: { id: 'loc-3', name: 'Meenakshi Temple', address: 'Madurai', city: 'Madurai', state: 'Tamil Nadu', pincode: '625001', templeName: 'Meenakshi' },
    }),
    prisma.poojaLocation.upsert({
      where: { id: 'loc-4' },
      update: {},
      create: { id: 'loc-4', name: 'Tirumala Temple', address: 'Tirumala', city: 'Tirupati', state: 'Andhra Pradesh', pincode: '517501', templeName: 'Venkateswara' },
    }),
    prisma.poojaLocation.upsert({
      where: { id: 'loc-5' },
      update: {},
      create: { id: 'loc-5', name: 'Kashi Vishwanath', address: 'Varanasi', city: 'Varanasi', state: 'Uttar Pradesh', pincode: '221001', templeName: 'Kashi Vishwanath' },
    }),
    prisma.poojaLocation.upsert({
      where: { id: 'loc-6' },
      update: {},
      create: { id: 'loc-6', name: 'Kalighat Temple', address: 'Kolkata', city: 'Kolkata', state: 'West Bengal', pincode: '700026', templeName: 'Kali' },
    }),
    prisma.poojaLocation.upsert({
      where: { id: 'loc-7' },
      update: {},
      create: { id: 'loc-7', name: 'Dwarkadhish Temple', address: 'Dwarka', city: 'Dwarka', state: 'Gujarat', pincode: '361335', templeName: 'Dwarkadhish' },
    }),
    prisma.poojaLocation.upsert({
      where: { id: 'loc-8' },
      update: {},
      create: { id: 'loc-8', name: 'ISKCON Temple', address: 'Hare Krishna Hill', city: 'Bangalore', state: 'Karnataka', pincode: '560010', templeName: 'ISKCON' },
    }),
  ])
  console.log('Locations created')

  // Admin User
  const admin = await prisma.user.upsert({
    where: { phone: '+919999999999' },
    update: {},
    create: {
      phone: '+919999999999',
      name: 'Admin',
      email: 'admin@poojabook.com',
      role: 'ADMIN',
      isVerified: true,
    },
  })
  console.log('Admin created')

  // Create Vendor Users and Vendors
  const vendor1 = await prisma.user.upsert({
    where: { phone: '+919888888888' },
    update: {},
    create: {
      phone: '+919888888888',
      name: 'Pandit Sharma',
      email: 'sharma@poojabook.com',
      role: 'VENDOR',
      isVerified: true,
    },
  })

  const vendorData1 = await prisma.vendor.upsert({
    where: { userId: vendor1.id },
    update: {},
    create: {
      userId: vendor1.id,
      businessName: 'Sharma Pandit Services',
      description: 'Experienced pandit with 20+ years of experience in Mumbai and Thane',
      languages: JSON.stringify(['Hindi', 'Marathi', 'English']),
      serviceAreas: JSON.stringify(['Mumbai', 'Thane', 'Navi Mumbai']),
      isVerified: true,
      rating: 4.8,
    },
  })

  const vendor2 = await prisma.user.upsert({
    where: { phone: '+919877777777' },
    update: {},
    create: {
      phone: '+919877777777',
      name: 'Pandit Iyer',
      email: 'iyer@poojabook.com',
      role: 'VENDOR',
      isVerified: true,
    },
  })

  const vendorData2 = await prisma.vendor.upsert({
    where: { userId: vendor2.id },
    update: {},
    create: {
      userId: vendor2.id,
      businessName: 'Iyer Traditional Poojas',
      description: 'Traditional Tamil Brahmin pandit for all South Indian rituals',
      languages: JSON.stringify(['Tamil', 'Telugu', 'English']),
      serviceAreas: JSON.stringify(['Chennai', 'Bangalore', 'Coimbatore']),
      isVerified: true,
      rating: 4.9,
    },
  })

  const vendor3 = await prisma.user.upsert({
    where: { phone: '+919866666666' },
    update: {},
    create: {
      phone: '+919866666666',
      name: 'Pandit Tripathi',
      email: 'tripathi@poojabook.com',
      role: 'VENDOR',
      isVerified: true,
    },
  })

  const vendorData3 = await prisma.vendor.upsert({
    where: { userId: vendor3.id },
    update: {},
    create: {
      userId: vendor3.id,
      businessName: 'Varanasi Purohit Services',
      description: 'Expert in Kashi rituals, Ganga aarti, and all Varanasi traditions',
      languages: JSON.stringify(['Hindi', 'Sanskrit', 'English']),
      serviceAreas: JSON.stringify(['Varanasi', 'Allahabad', 'Ayodhya']),
      isVerified: true,
      rating: 4.7,
    },
  })
  console.log('Vendors created')

  // Poojas
  const poojas = [
    {
      title: 'Ganesh Puja',
      slug: 'ganesh-puja',
      description: 'Invoke the blessings of Lord Ganesha, the remover of obstacles. This puja is performed for new beginnings, success in ventures, and removal of hurdles.',
      instructions: 'Chant Om Gan Gan Gana Varte at the beginning and end. Offer modak, durva grass, and red flowers.',
      samagri: JSON.stringify(['Modak (21 pieces)', 'Durva Grass', 'Red Flowers', 'Coconut', 'Laddu', 'Sandalwood', 'Incense', 'Camphor']),
      duration: 60,
      basePrice: 1100,
      mode: 'IN_TEMPLE',
      categoryId: categories[0].id,
    },
    {
      title: 'Lakshmi Puja',
      slug: 'lakshmi-puja',
      description: 'Propitiate Goddess Lakshmi for wealth, prosperity, and abundance. Performed especially on Diwali and Friday.',
      instructions: 'Chant Lakshmi Ashtakam. Offer lotus, gold coins, and sweet rice.',
      samagri: JSON.stringify(['Lotus', 'Gold Coins', 'Sweet Rice', 'Kumkum', 'Sandalwood', 'Flowers', 'Fruits', 'Sweets']),
      duration: 90,
      basePrice: 2100,
      mode: 'IN_TEMPLE',
      categoryId: categories[1].id,
    },
    {
      title: 'Navgraha Shanti',
      slug: 'navgraha-shanti',
      description: 'Pacify the nine planetary influences for harmony in life. Recommended for those facing doshas.',
      instructions: 'Recite Navgraha stotram. Offer nine different grains and specific colored cloths.',
      samagri: JSON.stringify(['Nine Grains', 'Nine-colored Cloth', 'Camphor', 'Ghee', 'Incense', 'Fruits', 'Flowers']),
      duration: 120,
      basePrice: 5100,
      mode: 'AT_HOME',
      categoryId: categories[2].id,
    },
    {
      title: 'Satyanarayan Puja',
      slug: 'satyanarayan-puja',
      description: 'Perform this sacred puja for mental peace, prosperity, and fulfillment of wishes. Suitable for all.',
      instructions: 'Listen to or read Satyanarayan Katha. Offer banana, milk, and puri.',
      samagri: JSON.stringify(['Banana', 'Milk', 'Puri', 'Halwa', 'Flowers', 'Coconut', 'Sandalwood', 'Incense']),
      duration: 90,
      basePrice: 2500,
      mode: 'AT_HOME',
      categoryId: categories[3].id,
    },
    {
      title: 'Rudrabhishek',
      slug: 'rudrabhishek',
      description: 'Abhishek of Lord Shiva with milk, honey, ghee, and other sacred items. Very powerful for removing sins and granting moksha.',
      instructions: 'Chant Rudram and Chamakam. Offer bilva leaves, milk, honey, ghee.',
      samagri: JSON.stringify(['Milk', 'Honey', 'Ghee', 'Bilva Leaves', 'Coconut', 'Datura', 'Uttam Dravya', 'Incense']),
      duration: 150,
      basePrice: 8100,
      mode: 'AT_HOME',
      categoryId: categories[4].id,
    },
    {
      title: 'Vishnu Sahasranamam',
      slug: 'vishnu-sahasranamam',
      description: 'Recitation of the 1000 names of Lord Vishnu for peace, protection, and spiritual advancement.',
      instructions: 'Recite with devotion. Offer tulsi leaves and daman leaves.',
      samagri: JSON.stringify(['Tulsi Leaves', 'Daman Leaves', 'Flowers', 'Incense', 'Camphor', 'Fruits']),
      duration: 120,
      basePrice: 3100,
      mode: 'ONLINE',
      categoryId: categories[5].id,
    },
    {
      title: 'Hanuman Chalisa',
      slug: 'hanuman-chalisa',
      description: 'Recitation of Hanuman Chalisa for courage, strength, and protection from negative energies.',
      instructions: 'Recite Chalisa with folded hands. Offer laddus and red flowers.',
      samagri: JSON.stringify(['Laddu', 'Red Flowers', 'Sindoor', 'Fruits', 'Incense', 'Camphor']),
      duration: 45,
      basePrice: 510,
      mode: 'AT_HOME',
      categoryId: categories[6].id,
    },
    {
      title: 'Durga Puja',
      slug: 'durga-puja',
      description: 'Worship of Goddess Durga for power, courage, and removal of obstacles and evil influences.',
      instructions: 'Chant Durga Chalisa or Saptshati. Offer blood red flowers and fruits.',
      samagri: JSON.stringify(['Blood Red Flowers', 'Fruits', 'Coconut', 'Sindoor', 'Incense', 'Camphor', 'Sandalwood']),
      duration: 180,
      basePrice: 10100,
      mode: 'IN_TEMPLE',
      categoryId: categories[7].id,
    },
    {
      title: 'Ganga Aarti',
      slug: 'ganga-aarti',
      description: 'Experience the divine Ganga Aarti at Varanasi or have it performed at your home virtually.',
      instructions: 'Join virtually or receive recorded aarti with prasad delivery.',
      samagri: JSON.stringify(['Diya', 'Flowers', 'Incense', 'Camphor', 'Ganga Water (prasad)']),
      duration: 60,
      basePrice: 510,
      mode: 'ONLINE',
      categoryId: categories[4].id,
    },
    {
      title: 'Karthigai Deepam',
      slug: 'karthigai-deepam',
      description: 'Light lamps to invoke divine light and destroy darkness. Popular in South India.',
      instructions: 'Light 11 or 108 lamps. Recite Karthigai deepam stotram.',
      samagri: JSON.stringify(['Oil Lamps (11 or 108)', 'Ghee', 'Flowers', 'Fruits', 'Coconut']),
      duration: 45,
      basePrice: 810,
      mode: 'AT_HOME',
      categoryId: categories[3].id,
    },
    {
      title: 'Saraswati Puja',
      slug: 'saraswati-puja',
      description: 'Worship Goddess Saraswati for knowledge, wisdom, artistic abilities, and academic success.',
      instructions: 'Offer white flowers, books, and musical instruments.',
      samagri: JSON.stringify(['White Flowers', 'Books', 'Veena', 'Pearls', 'Sandalwood', 'Fruits']),
      duration: 60,
      basePrice: 1500,
      mode: 'IN_TEMPLE',
      categoryId: categories[0].id,
    },
    {
      title: 'Mahashivratri',
      slug: 'mahashivratri',
      description: 'The great night of Lord Shiva. Observe fast and perform abhishek for blessings.',
      instructions: 'Night vigil (jaagran), Rudra abhishek, Bilva path.',
      samagri: JSON.stringify(['Bilva Leaves', 'Milk', 'Honey', 'Ghee', 'Coconut', 'Fruits', 'Flowers']),
      duration: 240,
      basePrice: 15100,
      mode: 'AT_HOME',
      categoryId: categories[4].id,
    },
    {
      title: 'Diwali Lakshmi Puja',
      slug: 'diwali-lakshmi-puja',
      description: 'Special Lakshmi puja performed on Diwali evening for maximum benefits.',
      instructions: 'Perform during muhurta. Offer 101 or 1008 diyas.',
      samagri: JSON.stringify(['Diyas (101)', 'Lakshmi Statue', 'Gold Coins', 'Sweets', 'Flowers', 'Fruits']),
      duration: 90,
      basePrice: 3100,
      mode: 'AT_HOME',
      categoryId: categories[1].id,
    },
    {
      title: 'Guru Puja',
      slug: 'guru-puja',
      description: 'Worship your spiritual guru or Lord Ganesha as the guru for guidance and knowledge.',
      instructions: 'Offer flowers, fruits, and charna.',
      samagri: JSON.stringify(['Flowers', 'Fruits', 'Charna', 'Incense', 'Camphor', 'Coconut']),
      duration: 45,
      basePrice: 1100,
      mode: 'AT_HOME',
      categoryId: categories[0].id,
    },
    {
      title: 'Rahu Ketu Puja',
      slug: 'rahu-ketu-puja',
      description: 'Pacify Rahu and Ketu to reduce their malefic effects in your horoscope.',
      instructions: 'Offer black sesame, black gram, and dark items.',
      samagri: JSON.stringify(['Black Sesame', 'Black Gram', 'Dark Cloth', 'Iron', 'Fruits', 'Flowers']),
      duration: 90,
      basePrice: 5100,
      mode: 'AT_HOME',
      categoryId: categories[2].id,
    },
    {
      title: 'Mahalaxmi Vrat',
      slug: 'mahalaxmi-vrat',
      description: 'Observe 16 Mondays of Mahalaxmi vrat for continuous wealth and prosperity.',
      instructions: 'Fast and perform puja every Monday for 16 weeks.',
      samagri: JSON.stringify(['Lakshmi Yantra', 'Flowers', 'Fruits', 'Sweets', 'Coconut', 'Sandalwood']),
      duration: 60,
      basePrice: 2100,
      mode: 'AT_HOME',
      categoryId: categories[1].id,
    },
    {
      title: 'Ayudha Puja',
      slug: 'ayudha-puja',
      description: 'Worship tools, weapons, and instruments for divine blessing on your work.',
      instructions: 'Clean and decorate all tools. Offer flowers and fruits.',
      samagri: JSON.stringify(['Flowers', 'Fruits', 'Coconut', 'Incense', 'Camphor', 'New Cloth']),
      duration: 60,
      basePrice: 1800,
      mode: 'AT_HOME',
      categoryId: categories[0].id,
    },
    {
      title: 'Kanakadhara Stotram',
      slug: 'kanakadhara-stotram',
      description: 'Recitation of the powerful stotram by Adi Shankaracharya for immediate wealth.',
      instructions: 'Recite 21 times for best results.',
      samagri: JSON.stringify(['Gold', 'Yellow Cloth', 'Fruits', 'Flowers', 'Coconut']),
      duration: 30,
      basePrice: 510,
      mode: 'ONLINE',
      categoryId: categories[1].id,
    },
    {
      title: 'Vishnu Puja',
      slug: 'vishnu-puja',
      description: 'General Vishnu puja for protection, peace, and spiritual growth.',
      instructions: 'Chant Vishnu Sahasranamam or Ashtakam.',
      samagri: JSON.stringify(['Tulsi', 'Lotus', 'Peacock Feather', 'Fruits', 'Flowers', 'Incense']),
      duration: 75,
      basePrice: 2100,
      mode: 'AT_HOME',
      categoryId: categories[5].id,
    },
    {
      title: 'Matsya Puja',
      slug: 'matsya-puja',
      description: 'Worship Lord Vishnu in Matsya avatar for new beginnings and protection.',
      instructions: 'Offer fish-shaped modak and water-based items.',
      samagri: JSON.stringify(['Fish-shaped Modak', 'Water', 'Flowers', 'Coconut', 'Fruits']),
      duration: 45,
      basePrice: 910,
      mode: 'AT_HOME',
      categoryId: categories[5].id,
    },
  ]

  for (const poojaData of poojas) {
    const pooja = await prisma.pooja.upsert({
      where: { slug: poojaData.slug },
      update: {},
      create: poojaData,
    })
    console.log(`Created: ${pooja.title}`)

    // Add-ons
    const addOns = [
      { name: 'Premium Pandit', description: 'Highly experienced senior pandit', price: 500, poojaId: pooja.id },
      { name: 'Samagri Kit', description: 'All items pre-arranged and delivered', price: 300, poojaId: pooja.id },
      { name: 'Prasad Delivery', description: 'Prasad delivered to your home', price: 200, poojaId: pooja.id },
      { name: 'HD Video Coverage', description: 'Professional video recording', price: 1000, poojaId: pooja.id },
    ]
    for (const addon of addOns) {
      await prisma.addOn.upsert({
        where: { id: `${pooja.id}-${addon.name.toLowerCase().replace(/\s/g, '-')}` },
        update: {},
        create: addon,
      }).catch(() => {})
    }

    // Create slots for next 14 days
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]

      const times = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00']
      for (const time of times) {
        const location = locations[Math.floor(Math.random() * locations.length)]
        const vendor = [vendorData1, vendorData2, vendorData3][Math.floor(Math.random() * 3)]

        await prisma.poojaSlot.create({
          data: {
            poojaId: pooja.id,
            locationId: location.id,
            vendorId: vendor.id,
            date: dateStr,
            startTime: time,
            capacity: Math.floor(Math.random() * 3) + 1,
            bookedCount: Math.floor(Math.random() * 2),
            isAvailable: true,
          },
        }).catch(() => {})
      }
    }
  }
  console.log('Poojas and slots created')

  // Pandits
  const pandits = [
    {
      name: 'Pandit Ramesh Sharma',
      photo: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      bio: 'Vedic scholar with 25 years of experience performing Ganesh, Lakshmi, and Satyanarayan poojas. Based in Mumbai, served 5000+ families.',
      experienceYears: 25,
      languages: JSON.stringify(['Hindi', 'Sanskrit', 'Marathi', 'English']),
      specializations: JSON.stringify(['ganesh', 'lakshmi', 'satyanarayan']),
      city: 'Mumbai',
      state: 'Maharashtra',
      rating: 4.9,
      totalReviews: 328,
      totalPoojasCompleted: 5420,
      isVerified: true,
      verificationBadge: 'Vedic Certified',
    },
    {
      name: 'Pandit Suresh Iyer',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      bio: 'Traditional Tamil Brahmin pandit specializing in South Indian rituals. Expert in Rudrabhishek and Navgraha Shanti.',
      experienceYears: 22,
      languages: JSON.stringify(['Tamil', 'Telugu', 'Sanskrit', 'English']),
      specializations: JSON.stringify(['rudrabhishek', 'navgraha', 'vishnu']),
      city: 'Chennai',
      state: 'Tamil Nadu',
      rating: 4.8,
      totalReviews: 256,
      totalPoojasCompleted: 4100,
      isVerified: true,
      verificationBadge: 'Traditional Expert',
    },
    {
      name: 'Pandit Arun Tripathi',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Varanasi-based purohit with expertise in Ganga Aarti, Rudrabhishek, and all Kashi rituals. Performed over 10,000 poojas.',
      experienceYears: 30,
      languages: JSON.stringify(['Hindi', 'Sanskrit', 'Bhojpuri']),
      specializations: JSON.stringify(['rudrabhishek', 'ganesh', 'hanuman']),
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      rating: 4.95,
      totalReviews: 512,
      totalPoojasCompleted: 10200,
      isVerified: true,
      verificationBadge: 'Kashi Purohit',
    },
    {
      name: 'Pandit Venkatesh Bhat',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      bio: 'Expert in Vaishnavite poojas, Vishnu Sahasranamam, and South Indian traditions. Based in Bangalore.',
      experienceYears: 18,
      languages: JSON.stringify(['Kannada', 'Tamil', 'Telugu', 'Sanskrit']),
      specializations: JSON.stringify(['vishnu', 'satyanarayan', 'ganesh']),
      city: 'Bangalore',
      state: 'Karnataka',
      rating: 4.7,
      totalReviews: 189,
      totalPoojasCompleted: 2800,
      isVerified: true,
      verificationBadge: 'Vaishnav Expert',
    },
    {
      name: 'Pandit Mahendra Dixit',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      bio: 'Specialized in Durga puja, Navgraha Shanti, and Mahashivratri celebrations. Based in Kolkata.',
      experienceYears: 28,
      languages: JSON.stringify(['Bengali', 'Hindi', 'Sanskrit']),
      specializations: JSON.stringify(['durga', 'navgraha', 'rudrabhishek']),
      city: 'Kolkata',
      state: 'West Bengal',
      rating: 4.85,
      totalReviews: 420,
      totalPoojasCompleted: 7500,
      isVerified: true,
      verificationBadge: 'Shakti Expert',
    },
    {
      name: 'Pandit Prashant Joshi',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      bio: 'Modern approach pandit who combines traditional rituals with virtual pooja services. Expert in Hanuman Chalisa and Satyanarayan.',
      experienceYears: 15,
      languages: JSON.stringify(['Marathi', 'Hindi', 'English', 'Sanskrit']),
      specializations: JSON.stringify(['hanuman', 'satyanarayan', 'ganesh']),
      city: 'Pune',
      state: 'Maharashtra',
      rating: 4.6,
      totalReviews: 145,
      totalPoojasCompleted: 1800,
      isVerified: true,
      verificationBadge: 'Online Expert',
    },
  ]

  for (const panditData of pandits) {
    await prisma.pandit.create({ data: panditData }).catch(() => {})
  }
  console.log('Pandits created')

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
