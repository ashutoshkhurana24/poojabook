// ─── Types ──────────────────────────────────────────────────────────────────

export interface SamagriItem {
  item: string
  quantity: string
  essential: boolean
}

export interface ProcessStep {
  step: number
  title: string
  duration: string
  desc: string
}

export interface Benefit {
  benefit: string
  icon: string
  desc: string
}

export interface Mantra {
  name: string
  text: string
  repetitions: number
}

export interface BestTime {
  time: string
  days: string[]
  tithis: string[]
  occasions: string[]
}

export interface WhatIsThis {
  summary: string
  details: string
  significance: string
}

export interface PoojaGuide {
  id: string
  name: string
  icon: string
  category: string
  deity: string
  slug: string
  shortDesc: string
  coverImage?: string
  duration: string
  difficulty: 'Easy' | 'Medium' | 'Advanced'
  region: string
  languages?: string[]
  bestTime: BestTime
  whatIsThis?: WhatIsThis
  whenToPerform?: string[]
  samagri: SamagriItem[]
  process?: ProcessStep[]
  benefits: Benefit[]
  mantras?: Mantra[]
  relatedPoojas: string[]
  bookingCTA?: { text: string; url: string }
}

// ─── Guide Data ───────────────────────────────────────────────────────────────

export const POOJA_GUIDES: PoojaGuide[] = [
  // ── Ganesh Puja ──────────────────────────────────────────────────────────
  {
    id: 'ganesh-puja',
    name: 'Ganesh Puja',
    icon: '🐘',
    category: 'Daily Worship',
    deity: 'Lord Ganesha',
    slug: 'ganesh-puja',
    shortDesc: 'Remove obstacles and invite prosperity',
    duration: '30–45 minutes',
    difficulty: 'Easy',
    region: 'Pan India',
    languages: ['Hindi', 'Sanskrit', 'Tamil', 'Telugu', 'Marathi'],
    bestTime: {
      time: 'Morning (6 AM – 10 AM)',
      days: ['Wednesday', 'Sunday'],
      tithis: ['Chaturthi'],
      occasions: ['Before any new venture', 'Ganesh Chaturthi', 'Every Wednesday', 'Sankashti Chaturthi'],
    },
    whatIsThis: {
      summary: 'Ganesh Puja is the worship of Lord Ganesha, the elephant-headed deity who is the remover of obstacles and the god of beginnings, wisdom, and prosperity.',
      details: 'Lord Ganesha is always worshipped first before any Hindu ritual or new beginning. He is believed to clear the path of obstacles and bless devotees with intelligence and success. Performing Ganesh Puja regularly brings positive energy into the home and ensures smooth progress in all life endeavors.',
      significance: 'Ganesha is the first deity invoked in any Hindu ceremony. His blessings are essential before marriages, business ventures, travel, or any important life event.',
    },
    whenToPerform: [
      'Every Wednesday — Ganesha\'s special day',
      'Ganesh Chaturthi — the grand annual festival (August/September)',
      'Before starting any new business or venture',
      'Before exams or important interviews',
      'Before beginning construction of a new home',
      'Every morning as daily worship (Nitya Puja)',
      'Sankashti Chaturthi — monthly fasting and worship day',
    ],
    samagri: [
      { item: 'Ganesha idol or photo',                            quantity: '1',           essential: true  },
      { item: 'Red/orange flowers',                               quantity: 'Handful',     essential: true  },
      { item: 'Durva grass (3/5/7 blades)',                       quantity: '21 blades',   essential: true  },
      { item: 'Modak (sweet)',                                    quantity: '5 or 11',     essential: true  },
      { item: 'Coconut',                                          quantity: '1',           essential: true  },
      { item: 'Incense sticks (Agarbatti)',                       quantity: '5',           essential: true  },
      { item: 'Ghee lamp (Diya)',                                 quantity: '1–2',         essential: true  },
      { item: 'Camphor (Kapoor)',                                 quantity: 'Small piece', essential: true  },
      { item: 'Red cloth (Aasan)',                                quantity: '1',           essential: false },
      { item: 'Panchamrit (milk, curd, honey, sugar, ghee)',      quantity: 'Small bowl',  essential: false },
      { item: 'Roli (red vermillion)',                            quantity: 'Pinch',       essential: false },
      { item: 'Akshat (unbroken rice)',                           quantity: 'Handful',     essential: false },
      { item: 'Banana',                                           quantity: '2',           essential: false },
      { item: 'Betel leaves & nuts',                             quantity: '5 each',      essential: false },
    ],
    process: [
      { step: 1,  title: 'Purification',        duration: '5 min',  desc: 'Clean the puja space and take a bath. Wear clean clothes, preferably in yellow or orange.' },
      { step: 2,  title: 'Setup the Altar',     duration: '5 min',  desc: 'Place the Ganesha idol on a clean red cloth. Arrange all samagri neatly around the idol.' },
      { step: 3,  title: 'Light the Diya',      duration: '2 min',  desc: 'Light the ghee lamp and incense sticks. The flame symbolizes the removal of darkness and ignorance.' },
      { step: 4,  title: 'Sankalp',             duration: '2 min',  desc: 'Take water in your right hand and state your intention (sankalp) — why you are performing this puja.' },
      { step: 5,  title: 'Avahan (Invitation)', duration: '3 min',  desc: 'Invite Lord Ganesha into the idol by chanting "Om Ganeshaya Namah" 108 times or 21 times.' },
      { step: 6,  title: 'Shodashopachara',     duration: '10 min', desc: 'Offer 16 items one by one: water, flowers, durva grass, modak, camphor, betel leaves, and more.' },
      { step: 7,  title: 'Ganesh Chalisa',      duration: '10 min', desc: 'Recite Ganesh Chalisa or Ganesh Stotram. You can also play a recorded version.' },
      { step: 8,  title: 'Aarti',               duration: '5 min',  desc: 'Perform aarti with the camphor flame in a circular motion while singing "Jai Ganesh Deva".' },
      { step: 9,  title: 'Prasad Distribution', duration: '3 min',  desc: 'Distribute modak and fruits as prasad to all family members.' },
      { step: 10, title: 'Visarjan',             duration: '2 min',  desc: 'Respectfully conclude the puja by seeking forgiveness for any mistakes made during the ritual.' },
    ],
    benefits: [
      { benefit: 'Removes Obstacles',       icon: '🚧', desc: 'Clears the path of hurdles in career, business, and personal life' },
      { benefit: 'Brings Wisdom',           icon: '🧠', desc: 'Enhances intelligence, decision-making, and clarity of thought' },
      { benefit: 'Prosperity & Wealth',     icon: '💰', desc: 'Attracts financial abundance and material success' },
      { benefit: 'Peace of Mind',           icon: '☮️', desc: 'Reduces anxiety and brings mental calmness' },
      { benefit: 'Success in New Ventures', icon: '🚀', desc: 'Ensures smooth start and completion of new projects' },
      { benefit: 'Family Harmony',          icon: '👨‍👩‍👧', desc: 'Strengthens family bonds and removes domestic disputes' },
    ],
    mantras: [
      { name: 'Mool Mantra',    text: 'Om Gam Ganapataye Namah',                               repetitions: 108 },
      { name: 'Vakratunda',     text: 'Vakratunda Mahakaya Suryakoti Samaprabha\nNirvighnam Kuru Me Deva Sarva Karyeshu Sarvada', repetitions: 21 },
      { name: 'Ganesh Gayatri', text: 'Om Ekadantaya Vidmahe\nVakratundaya Dhimahi\nTanno Danti Prachodayat', repetitions: 11 },
    ],
    relatedPoojas: ['lakshmi-puja', 'satyanarayan-puja', 'navgraha-shanti'],
    bookingCTA: { text: 'Book Ganesh Puja with Expert Pandit', url: '/poojas/ganesh-puja' },
  },

  // ── Lakshmi Puja ─────────────────────────────────────────────────────────
  {
    id: 'lakshmi-puja',
    name: 'Lakshmi Puja',
    icon: '🪷',
    category: 'Wealth & Prosperity',
    deity: 'Goddess Lakshmi',
    slug: 'lakshmi-puja',
    shortDesc: 'Invite wealth, abundance, and good fortune',
    duration: '45–60 minutes',
    difficulty: 'Medium',
    region: 'Pan India',
    languages: ['Hindi', 'Sanskrit', 'Bengali', 'Tamil', 'Telugu'],
    bestTime: {
      time: 'Evening (6 PM – 8 PM)',
      days: ['Friday'],
      tithis: ['Purnima', 'Amavasya (Diwali night)'],
      occasions: ['Diwali', 'Every Friday', 'Sharad Purnima', 'Akshaya Tritiya', 'Dhanteras'],
    },
    whatIsThis: {
      summary: 'Lakshmi Puja is the worship of Goddess Lakshmi, the divine embodiment of wealth, fortune, beauty, and prosperity.',
      details: 'Goddess Lakshmi is the consort of Lord Vishnu and is revered as the bringer of all forms of prosperity — material, spiritual, and familial. The puja on Diwali night is among the most auspicious Hindu observances. Regular Friday worship of Lakshmi is believed to remove poverty and attract abundance.',
      significance: 'Performing Lakshmi Puja with devotion and a pure heart is said to invite Lakshmi into the home permanently, transforming financial destiny and filling life with auspiciousness.',
    },
    whenToPerform: [
      'Every Friday — Lakshmi\'s special weekly day',
      'Diwali (Kartik Amavasya) — the most important Lakshmi Puja night',
      'Akshaya Tritiya — considered one of the most auspicious days',
      'Dhanteras — two days before Diwali',
      'Sharad Purnima (October full moon)',
      'Before opening a new business or shop',
      'During Navratri for Mahalakshmi worship',
    ],
    samagri: [
      { item: 'Lakshmi idol (silver or brass preferred)',  quantity: '1',       essential: true  },
      { item: 'Lotus or marigold flowers (yellow/gold)',   quantity: 'Handful', essential: true  },
      { item: 'Coins (any denomination)',                  quantity: '11',      essential: true  },
      { item: 'Kheer or sweet (naivedya)',                 quantity: '1 bowl',  essential: true  },
      { item: 'Ghee lamp (gold/brass diya)',               quantity: '1',       essential: true  },
      { item: 'Incense sticks',                           quantity: '5',       essential: true  },
      { item: 'Kumkum (red powder)',                       quantity: 'Pinch',   essential: true  },
      { item: 'Turmeric (haldi)',                         quantity: 'Pinch',   essential: true  },
      { item: 'Red cloth',                                quantity: '1',       essential: false },
      { item: 'Cowrie shells',                            quantity: '11',      essential: false },
      { item: 'Betel leaves & nuts',                     quantity: '11 each', essential: false },
      { item: 'Kalash (copper vessel with water)',        quantity: '1',       essential: false },
    ],
    process: [
      { step: 1, title: 'Clean & Decorate',      duration: '10 min', desc: 'Thoroughly clean the puja room. Make rangoli at the entrance to welcome Goddess Lakshmi.' },
      { step: 2, title: 'Set Up the Altar',       duration: '5 min',  desc: 'Place Lakshmi idol on a red cloth. Arrange coins, kalash, and flowers around the idol.' },
      { step: 3, title: 'Light Diyas',            duration: '3 min',  desc: 'Light all diyas in the house. Start from the main entrance and move inward.' },
      { step: 4, title: 'Ganesh Puja First',      duration: '5 min',  desc: 'Always begin by offering prayers to Lord Ganesha before starting Lakshmi Puja.' },
      { step: 5, title: 'Shodashopachara',        duration: '15 min', desc: 'Offer water, flowers, kumkum, turmeric, and sweets to the goddess with devotion.' },
      { step: 6, title: 'Recite Lakshmi Stotra',  duration: '10 min', desc: 'Recite Sri Suktam, Lakshmi Stotram, or Lakshmi Chalisa with full devotion.' },
      { step: 7, title: 'Aarti',                  duration: '5 min',  desc: 'Perform the Lakshmi Aarti moving the lamp in circular motions while singing the aarti hymn.' },
      { step: 8, title: 'Distribute Prasad',      duration: '5 min',  desc: 'Share the sweet prasad (kheer/burfi) with all family members and neighbors.' },
    ],
    benefits: [
      { benefit: 'Financial Abundance',   icon: '💰', desc: 'Attracts wealth and removes financial struggles permanently' },
      { benefit: 'Business Growth',       icon: '📈', desc: 'Blesses new businesses, investments, and career opportunities' },
      { benefit: 'Good Fortune',          icon: '🍀', desc: 'Brings luck, auspiciousness, and positive opportunities' },
      { benefit: 'Home Prosperity',       icon: '🏠', desc: 'Fills the home with happiness, abundance, and peace' },
      { benefit: 'Spiritual Wealth',      icon: '🌟', desc: 'Grants inner richness, contentment, and gratitude' },
    ],
    mantras: [
      { name: 'Maha Lakshmi Mantra', text: 'Om Shreem Mahalakshmiyei Namah',           repetitions: 108 },
      { name: 'Sri Suktam (opening)',text: 'Om Hiranya-Varnam Harineem\nSuvarna-Rajata-Srajaam\nChandraam Hiranmayeem Lakshmeem\nJaatavedo Ma Aavaha', repetitions: 11 },
    ],
    relatedPoojas: ['ganesh-puja', 'satyanarayan-puja', 'kuber-puja'],
    bookingCTA: { text: 'Book Lakshmi Puja with Expert Pandit', url: '/poojas/lakshmi-puja' },
  },

  // ── Satyanarayan Puja ─────────────────────────────────────────────────────
  {
    id: 'satyanarayan-puja',
    name: 'Satyanarayan Puja',
    icon: '🙏',
    category: 'Thanksgiving & Blessings',
    deity: 'Lord Vishnu (Satyanarayan form)',
    slug: 'satyanarayan-puja',
    shortDesc: 'Express gratitude and seek divine blessings',
    duration: '2–3 hours',
    difficulty: 'Medium',
    region: 'Pan India',
    languages: ['Hindi', 'Sanskrit', 'Marathi', 'Gujarati', 'Bengali'],
    bestTime: {
      time: 'Evening (5 PM – 8 PM)',
      days: ['Purnima', 'Ekadashi', 'Any auspicious day'],
      tithis: ['Purnima', 'Ekadashi'],
      occasions: ['Griha Pravesh', 'Marriage', 'New business launch', 'Birthday', 'After achieving a major goal'],
    },
    whatIsThis: {
      summary: 'Satyanarayan Puja is a sacred Hindu ritual of thanksgiving and supplication performed to Lord Vishnu in his Satyanarayan form, the embodiment of truth and prosperity.',
      details: 'The Satyanarayan Vrat Katha (sacred story) is read aloud during the puja, narrating how devotees who performed this puja were rewarded and those who neglected it faced hardships. This puja is traditionally performed to fulfil vows, mark life milestones, and seek continued blessings for the entire family.',
      significance: 'Satyanarayan Puja is one of the most complete pujas in Hinduism — it encompasses worship, reading of sacred texts, fasting, and communal sharing of prasad. It is believed to fulfill all righteous desires.',
    },
    whenToPerform: [
      'Purnima (full moon day) — traditional monthly observance',
      'Ekadashi — Vishnu\'s sacred lunar day',
      'After purchasing a new home (Griha Pravesh)',
      'After a wedding or engagement',
      'After business launch or career milestone',
      'On birthdays or anniversaries',
      'To fulfill a vow (mannat) made to Lord Vishnu',
    ],
    samagri: [
      { item: 'Vishnu/Satyanarayan photo or idol',   quantity: '1',       essential: true  },
      { item: 'Panchamrit (5 sacred liquids)',        quantity: '1 bowl',  essential: true  },
      { item: 'Ripe bananas',                         quantity: '5',       essential: true  },
      { item: 'Wheat flour (for prasad/sheera)',      quantity: '250 g',   essential: true  },
      { item: 'Sugar',                                quantity: '100 g',   essential: true  },
      { item: 'Pure ghee',                            quantity: '100 g',   essential: true  },
      { item: 'Yellow flowers (marigold or champak)', quantity: 'Handful', essential: true  },
      { item: 'Tulsi (Holy Basil) leaves',            quantity: 'Handful', essential: true  },
      { item: 'Kalash (copper pot)',                  quantity: '1',       essential: false },
      { item: 'Mango leaves',                         quantity: '5',       essential: false },
      { item: 'Betel leaves & nuts',                 quantity: '5 each',  essential: false },
      { item: 'Camphor',                              quantity: 'Small',   essential: false },
    ],
    process: [
      { step: 1, title: 'Preparation',          duration: '15 min', desc: 'Invite family, friends, and pandits. Set up the altar with Vishnu photo, kalash, and decorations.' },
      { step: 2, title: 'Ganesh Vandana',        duration: '10 min', desc: 'Begin with Ganesh Puja to remove any obstacles from the ceremony.' },
      { step: 3, title: 'Kalash Sthapana',       duration: '10 min', desc: 'Set up the sacred water pot (kalash) with mango leaves and coconut — it represents the cosmic ocean.' },
      { step: 4, title: 'Satyanarayan Puja',     duration: '30 min', desc: 'Offer flowers, tulsi, panchamrit, and naivedya to Lord Satyanarayan with full devotion.' },
      { step: 5, title: 'Katha (Sacred Story)',   duration: '45 min', desc: 'Read or listen to the five-chapter Satyanarayan Katha narrating the glory of this puja.' },
      { step: 6, title: 'Aarti',                 duration: '10 min', desc: 'Perform the Vishnu aarti with all family members participating.' },
      { step: 7, title: 'Prasad Preparation',    duration: '20 min', desc: 'Prepare sheera (wheat halwa) as the sacred prasad using the offered ingredients.' },
      { step: 8, title: 'Prasad Distribution',   duration: '10 min', desc: 'Distribute prasad to all attendees. Prasad must not be refused or wasted.' },
    ],
    benefits: [
      { benefit: 'Fulfills Wishes',      icon: '⭐', desc: 'Known across generations to fulfill heartfelt and sincere desires' },
      { benefit: 'Family Wellbeing',     icon: '👨‍👩‍👧', desc: 'Protects the entire family from misfortune and disease' },
      { benefit: 'Thanksgiving',         icon: '🙏', desc: 'Provides a sacred way to express gratitude for life\'s blessings' },
      { benefit: 'Spiritual Growth',     icon: '🌟', desc: 'Deepens devotion and strengthens the spiritual foundation of the home' },
      { benefit: 'Home Harmony',         icon: '🏠', desc: 'Brings peace, unity, and positive energy into the household' },
    ],
    mantras: [
      { name: 'Vishnu Mool Mantra', text: 'Om Namo Bhagavate Vasudevaya',                 repetitions: 108 },
      { name: 'Satyanarayan Mantra',text: 'Om Namo Narayanaya\nSatyam Param Dhimahi',    repetitions: 21  },
    ],
    relatedPoojas: ['ganesh-puja', 'lakshmi-puja', 'vishnu-puja'],
    bookingCTA: { text: 'Book Satyanarayan Puja with Expert Pandit', url: '/poojas/satyanarayan-puja' },
  },

  // ── Rudrabhishek ─────────────────────────────────────────────────────────
  {
    id: 'rudrabhishek',
    name: 'Rudrabhishek',
    icon: '🕉️',
    category: 'Shiva Worship',
    deity: 'Lord Shiva (Rudra form)',
    slug: 'rudrabhishek',
    shortDesc: 'Sacred Shiva abhishek for health and liberation',
    duration: '1.5–2 hours',
    difficulty: 'Advanced',
    region: 'Pan India',
    languages: ['Sanskrit', 'Hindi', 'Tamil', 'Telugu'],
    bestTime: {
      time: 'Early Morning (4 AM – 7 AM) or Evening (6 PM – 8 PM)',
      days: ['Monday', 'Pradosh (13th lunar day)'],
      tithis: ['Trayodashi', 'Chaturdashi', 'Amavasya'],
      occasions: ['Maha Shivratri', 'Shravan month', 'Every Monday', 'Pradosh Vrat'],
    },
    whatIsThis: {
      summary: 'Rudrabhishek is a powerful Vedic ritual involving the ceremonial bathing (abhishek) of the Shiva Lingam with sacred liquids while chanting the Rudrashtadhyayi and Sri Rudram hymns.',
      details: 'Abhishek means "anointing" — during Rudrabhishek, the Shiva Lingam is bathed with milk, curd, ghee, honey, sugar water, coconut water, and Gangajal while the pandit chants powerful Vedic hymns. This ancient ritual dates back to the Vedic period and is described in the Yajurveda. Each liquid has specific spiritual significance and bestows different blessings.',
      significance: 'The Sri Rudram is considered one of the most powerful Vedic hymns. Performing Rudrabhishek during Shravan month or on Maha Shivratri is believed to grant moksha (liberation) and fulfil all righteous desires.',
    },
    whenToPerform: [
      'Every Monday — Lord Shiva\'s sacred day',
      'Maha Shivratri — the grand annual Shiva festival',
      'Shravan month (July–August) — most auspicious for Shiva worship',
      'Pradosh Vrat (13th lunar day, morning and evening)',
      'When facing serious health issues in the family',
      'For removal of Kaal Sarp Dosha',
      'For planetary doshas affecting life',
    ],
    samagri: [
      { item: 'Shiva Lingam (idol or natural)',   quantity: '1',       essential: true  },
      { item: 'Panchamrit (5 liquids)',            quantity: '500 ml',  essential: true  },
      { item: 'Gangajal (Ganga water)',            quantity: '500 ml',  essential: true  },
      { item: 'Bilva (Bel) leaves',               quantity: '108',     essential: true  },
      { item: 'White flowers (Dhatura, Lotus)',    quantity: 'Handful', essential: true  },
      { item: 'Vibhuti (sacred ash)',              quantity: 'Pinch',   essential: true  },
      { item: 'Rudraksha (if available)',          quantity: '1',       essential: false },
      { item: 'Dhatura fruit',                    quantity: '1',       essential: false },
      { item: 'Cannabis (Bhaang) leaves',         quantity: 'Small',   essential: false },
      { item: 'Black sesame seeds',               quantity: 'Handful', essential: false },
      { item: 'Sandalwood paste',                 quantity: 'Small',   essential: false },
      { item: 'Camphor',                          quantity: 'Pieces',  essential: true  },
    ],
    process: [
      { step: 1,  title: 'Preparation',          duration: '15 min', desc: 'Fast (or eat only fruits) before the puja. Set up the Shiva Lingam on a raised platform.' },
      { step: 2,  title: 'Ganesh & Kalash Puja', duration: '10 min', desc: 'Begin with Ganesh vandana and establish the sacred water pot (kalash).' },
      { step: 3,  title: 'Invocation',           duration: '5 min',  desc: 'Chant "Om Namah Shivaya" 108 times to invoke Lord Shiva\'s presence.' },
      { step: 4,  title: 'Panchamrit Abhishek',  duration: '20 min', desc: 'Pour milk, curd, ghee, honey, and sugar syrup over the Shiva Lingam while chanting.' },
      { step: 5,  title: 'Gangajal Abhishek',    duration: '5 min',  desc: 'Pour Gangajal (holy Ganga water) over the Shiva Lingam.' },
      { step: 6,  title: 'Sri Rudram Chanting',  duration: '30 min', desc: 'The pandit chants the Sri Rudram (11 chapters) from the Yajurveda — the core of the ritual.' },
      { step: 7,  title: 'Bilva Patra Offering', duration: '10 min', desc: 'Offer 108 bilva leaves to the Shiva Lingam — each one offered with "Om Namah Shivaya".' },
      { step: 8,  title: 'Aarti & Pradakshina',  duration: '10 min', desc: 'Perform aarti and circumambulate the Shiva Lingam 3 or 7 times.' },
      { step: 9,  title: 'Prasad',               duration: '5 min',  desc: 'Distribute prasad (usually milk, fruits, and sweets) to all devotees.' },
      { step: 10, title: 'Visarjan',             duration: '5 min',  desc: 'Offer final prayers and seek Shiva\'s blessings for health, peace, and liberation.' },
    ],
    benefits: [
      { benefit: 'Health & Healing',     icon: '💚', desc: 'Powerful remedy for chronic illness and physical ailments' },
      { benefit: 'Liberation (Moksha)',  icon: '🕉️', desc: 'Purifies karma and moves devotees closer to spiritual liberation' },
      { benefit: 'Removes Doshas',       icon: '⚡', desc: 'Effective remedy for Kaal Sarp Dosha, Pitra Dosha, and planetary afflictions' },
      { benefit: 'Mental Peace',         icon: '☮️', desc: 'Destroys fear, anxiety, and mental turbulence' },
      { benefit: 'Divine Protection',    icon: '🛡️', desc: 'Shiva\'s grace protects the family from all forms of negative energy' },
    ],
    mantras: [
      { name: 'Panchakshara Mantra', text: 'Om Namah Shivaya',                               repetitions: 108 },
      { name: 'Mahamrityunjaya',     text: 'Om Tryambakam Yajamahe\nSugandhim Pushti-Vardhanam\nUrvarukamiva Bandhanan\nMrityor Mukshiya Maamritat', repetitions: 108 },
    ],
    relatedPoojas: ['ganesh-puja', 'durga-puja', 'navgraha-shanti'],
    bookingCTA: { text: 'Book Rudrabhishek with Expert Pandit', url: '/poojas/rudrabhishek' },
  },

  // ── Durga Puja ───────────────────────────────────────────────────────────
  {
    id: 'durga-puja',
    name: 'Durga Puja',
    icon: '⚔️',
    category: 'Festivals & Navratri',
    deity: 'Goddess Durga (Shakti)',
    slug: 'durga-puja',
    shortDesc: 'Invoke the divine feminine for strength and victory',
    duration: '1–2 hours',
    difficulty: 'Medium',
    region: 'Pan India (especially East & North)',
    languages: ['Sanskrit', 'Hindi', 'Bengali', 'Tamil'],
    bestTime: {
      time: 'Morning or Evening',
      days: ['Tuesday', 'Friday'],
      tithis: ['Ashtami', 'Navami', 'Chaturdashi'],
      occasions: ['Navratri', 'Durga Ashtami', 'Maha Navami', 'Bengal Durga Puja (October)'],
    },
    whatIsThis: {
      summary: 'Durga Puja is the worship of Goddess Durga — the supreme manifestation of Shakti (divine feminine power) — especially during the nine-night festival of Navratri.',
      details: 'Durga is the warrior goddess who defeated the demon Mahishasura after a fierce battle lasting nine nights and ten days. Each of her ten arms holds a weapon, symbolising her power to destroy all forms of evil. In Bengal, Durga Puja is the grand cultural festival of the year, while across India, it is observed during Navratri with fasting, special prayers, and Garba dances.',
      significance: 'Worshipping Goddess Durga grants the inner strength to overcome life\'s challenges, protects the devotee from evil forces, and bestows victory in all endeavors.',
    },
    whenToPerform: [
      'During Navratri — nine nights of Shakti worship (twice yearly)',
      'Durga Ashtami — the 8th day of Navratri, the most powerful day',
      'Maha Navami — 9th day when the goddess is in full power',
      'Every Tuesday and Friday',
      'When facing enemies, legal disputes, or serious challenges',
      'Durga Puja festival (October, especially in Bengal)',
    ],
    samagri: [
      { item: 'Durga idol or Yantra or photo',       quantity: '1',       essential: true  },
      { item: 'Red flowers (hibiscus preferred)',    quantity: 'Handful', essential: true  },
      { item: 'Red cloth',                           quantity: '1',       essential: true  },
      { item: 'Kumkum and Sindoor',                  quantity: 'Pinch',   essential: true  },
      { item: 'Coconut (with shell)',                quantity: '1',       essential: true  },
      { item: 'Ghee diya',                           quantity: '1',       essential: true  },
      { item: 'Incense sticks',                     quantity: '5',       essential: true  },
      { item: 'Camphor',                            quantity: 'Pieces',  essential: true  },
      { item: 'Navdurga photos',                    quantity: '9',       essential: false },
      { item: 'Durga Saptashati book',              quantity: '1',       essential: false },
      { item: 'Kalash',                             quantity: '1',       essential: false },
      { item: 'Marigold garland',                   quantity: '1',       essential: false },
    ],
    process: [
      { step: 1, title: 'Sankalp & Invocation',    duration: '10 min', desc: 'State your intention and invite Goddess Durga with the Durga Dhyana mantra.' },
      { step: 2, title: 'Kalash Sthapana',          duration: '10 min', desc: 'Establish the sacred kalash, the symbolic form of Goddess Durga, with water and mango leaves.' },
      { step: 3, title: 'Shodashopachara',          duration: '20 min', desc: 'Offer 16 services including flowers, kumkum, incense, food, and water.' },
      { step: 4, title: 'Durga Saptashati',         duration: '40 min', desc: 'Recite or listen to chapters from the Durga Saptashati — 700 verses glorifying the goddess.' },
      { step: 5, title: 'Aarti',                    duration: '5 min',  desc: 'Sing "Jai Ambe Gauri" while performing the aarti with camphor flame.' },
      { step: 6, title: 'Pushpanjali',              duration: '10 min', desc: 'Offer flowers to the goddess three times while chanting the Pushpanjali mantra.' },
      { step: 7, title: 'Kanya Puja (optional)',    duration: '15 min', desc: 'On Ashtami/Navami, worship nine young girls as the nine forms of Durga.' },
      { step: 8, title: 'Prasad Distribution',      duration: '5 min',  desc: 'Distribute kheer, halwa, or puri as prasad to all devotees.' },
    ],
    benefits: [
      { benefit: 'Inner Strength',        icon: '💪', desc: 'Grants courage to face life\'s biggest challenges' },
      { benefit: 'Protection from Evil',  icon: '🛡️', desc: 'Shields devotees from negative energies and enemies' },
      { benefit: 'Victory',               icon: '🏆', desc: 'Ensures triumph in legal battles, competitions, and disputes' },
      { benefit: 'Removes Fear',          icon: '☮️', desc: 'Destroys deep-seated fears and brings fearlessness' },
      { benefit: 'Spiritual Power',       icon: '🌟', desc: 'Awakens the divine feminine energy (Shakti) within the devotee' },
    ],
    mantras: [
      { name: 'Durga Mool Mantra', text: 'Om Dum Durgayei Namah',                         repetitions: 108 },
      { name: 'Mahishasura Mardini', text: 'Ayigiri Nandini Nandita Medini\nVishwa Vinodini Nandinu Te', repetitions: 21 },
    ],
    relatedPoojas: ['ganesh-puja', 'kali-puja', 'navgraha-shanti'],
    bookingCTA: { text: 'Book Durga Puja with Expert Pandit', url: '/poojas/durga-puja' },
  },

  // ── Navgraha Shanti ───────────────────────────────────────────────────────
  {
    id: 'navgraha-shanti',
    name: 'Navgraha Shanti',
    icon: '🌟',
    category: 'Planetary Remedies',
    deity: 'Nine Planetary Deities (Navagrahas)',
    slug: 'navgraha-shanti',
    shortDesc: 'Pacify the nine planets and align cosmic energies',
    duration: '2–3 hours',
    difficulty: 'Advanced',
    region: 'Pan India',
    languages: ['Sanskrit', 'Hindi', 'Tamil', 'Telugu'],
    bestTime: {
      time: 'Morning (Sunrise to 10 AM)',
      days: ['Sunday (Sun), Monday (Moon), Tuesday (Mars)'],
      tithis: ['Amavasya', 'Purnima', 'Any auspicious tithi'],
      occasions: ['Before major life decisions', 'When facing consistent bad luck', 'After reading horoscope (Kundali)'],
    },
    whatIsThis: {
      summary: 'Navgraha Shanti is a Vedic ritual to pacify and gain the blessings of the nine celestial bodies (Navagrahas) that govern different aspects of human life.',
      details: 'The nine planets — Sun (Surya), Moon (Chandra), Mars (Mangal), Mercury (Budh), Jupiter (Guru), Venus (Shukra), Saturn (Shani), Rahu, and Ketu — are believed to profoundly influence our lives. When these planets are malefic in one\'s horoscope, they cause suffering, delays, and misfortune. This puja propitiates all nine planets simultaneously.',
      significance: 'Navgraha Shanti is especially recommended after consulting a Jyotish (Vedic astrologer) when planetary doshas like Shani Sade Sati, Kaal Sarp Dosha, or Mangal Dosha are identified.',
    },
    whenToPerform: [
      'When experiencing persistent bad luck or failures',
      'Before starting a major new phase of life (marriage, business)',
      'During Shani Sade Sati (Saturn\'s 7.5-year transit)',
      'When Kaal Sarp Dosha is present in the horoscope',
      'During Rahu/Ketu transit periods',
      'For Mangal Dosha before marriage',
      'When health problems persist despite treatment',
    ],
    samagri: [
      { item: 'Navagraha Yantra or 9 deity photos', quantity: '1 set', essential: true  },
      { item: 'Nine types of grains (nava dhanya)', quantity: 'Mixed', essential: true  },
      { item: 'Nine coloured cloths',               quantity: '9',    essential: true  },
      { item: 'Flowers (9 types)',                  quantity: 'Each', essential: true  },
      { item: 'Sesame seeds (black & white)',        quantity: '100g', essential: true  },
      { item: 'Ghee (pure cow\'s ghee)',             quantity: '250g', essential: true  },
      { item: 'Hawan kund (fire pit)',               quantity: '1',    essential: true  },
      { item: 'Gangajal',                           quantity: '500ml',essential: true  },
      { item: 'Camphor',                            quantity: 'Pieces',essential: true  },
      { item: 'Nine fruits',                        quantity: '9',    essential: false },
      { item: 'Nine incense sticks',                quantity: '9',    essential: false },
      { item: 'Rudraksha mala',                     quantity: '1',    essential: false },
    ],
    process: [
      { step: 1, title: 'Purification',          duration: '10 min', desc: 'Fast or eat only fruits before the puja. The space is purified with Gangajal.' },
      { step: 2, title: 'Ganesh Vandana',         duration: '10 min', desc: 'Perform Ganesh Puja to ensure the ritual proceeds without obstacles.' },
      { step: 3, title: 'Kalash Sthapana',        duration: '10 min', desc: 'Establish nine kalashes representing the nine planets.' },
      { step: 4, title: 'Navagraha Sthapana',     duration: '15 min', desc: 'Place the Navagraha Yantra or deity photos. Each planet is invoked individually.' },
      { step: 5, title: 'Navagraha Stotra',       duration: '30 min', desc: 'Recite the Navagraha Stotra and specific mantras for each planet 108 times.' },
      { step: 6, title: 'Havan (Sacred Fire)',    duration: '45 min', desc: 'Perform havan with specific offerings for each planet to pacify their malefic effects.' },
      { step: 7, title: 'Aarti',                  duration: '10 min', desc: 'Perform aarti for all nine planets.' },
      { step: 8, title: 'Daan (Charitable Giving)',duration: '10 min',desc: 'Donate items associated with malefic planets (e.g., black sesame for Shani).' },
      { step: 9, title: 'Prasad',                 duration: '5 min',  desc: 'Distribute prasad containing nine types of grains and sweets.' },
    ],
    benefits: [
      { benefit: 'Planetary Peace',       icon: '🌟', desc: 'Pacifies all nine planets, reducing malefic effects on life' },
      { benefit: 'Removes Doshas',        icon: '⚡', desc: 'Remedies Kaal Sarp, Mangal, Shani Sade Sati and other doshas' },
      { benefit: 'Career Success',        icon: '💼', desc: 'Removes obstacles and delays in career and professional growth' },
      { benefit: 'Marriage Harmony',      icon: '💒', desc: 'Resolves Mangal Dosha and ensures marital happiness' },
      { benefit: 'Health Recovery',       icon: '💚', desc: 'Helps in recovering from chronic ailments linked to planetary influences' },
    ],
    mantras: [
      { name: 'Surya Mantra',  text: 'Om Hraam Hreem Hraum Sah Suryaya Namah',           repetitions: 7000 },
      { name: 'Shani Mantra',  text: 'Om Praang Preeng Praung Sah Shanaischaraya Namah', repetitions: 23000 },
      { name: 'Navagraha Stotra (opening)', text: 'Brahmaa Muraaris Tripuraantakaari\nBhaanus Shashee Bhumisuton Budhash Cha\nGurusch Shukras Shani Raahu Ketavah\nKurvantu Sarve Mama Suprabhaatam', repetitions: 1 },
    ],
    relatedPoojas: ['rudrabhishek', 'ganesh-puja', 'durga-puja'],
    bookingCTA: { text: 'Book Navgraha Shanti with Expert Pandit', url: '/poojas/navgraha-shanti' },
  },

  // ── Hanuman Puja ──────────────────────────────────────────────────────────
  {
    id: 'hanuman-puja',
    name: 'Hanuman Puja',
    icon: '🐒',
    category: 'Daily Worship',
    deity: 'Lord Hanuman',
    slug: 'hanuman-puja',
    shortDesc: 'Gain strength, courage, and divine protection',
    duration: '30–45 minutes',
    difficulty: 'Easy',
    region: 'Pan India',
    bestTime: {
      time: 'Early Morning (5 AM – 8 AM)',
      days: ['Tuesday', 'Saturday'],
      tithis: ['Purnima', 'Chaturdashi'],
      occasions: ['Hanuman Jayanti', 'Every Tuesday', 'During difficult times'],
    },
    whatIsThis: {
      summary: 'Hanuman Puja is the worship of Lord Hanuman — the greatest devotee of Lord Rama, a symbol of strength, loyalty, courage, and selfless service.',
      details: 'Hanuman is the son of Vayu (the wind god) and possesses immense physical and spiritual strength. He is the protector who guards against evil spirits and negative energies. Reciting the Hanuman Chalisa — 40 verses praising Hanuman — is the most widespread form of his worship and is believed to grant immediate protection.',
      significance: 'Hanuman worship is particularly effective against ghosts, evil spirits, Saturn\'s malefic effects (Shani), and mental afflictions. His blessings give devotees the strength to face any adversity.',
    },
    whenToPerform: [
      'Every Tuesday and Saturday',
      'Hanuman Jayanti (Chaitra Purnima)',
      'During Saturn\'s Sade Sati or Dhaiya periods',
      'When experiencing fear, anxiety, or depression',
      'For protection from black magic or evil eye (Nazar)',
      'Before athletic competitions or physical challenges',
    ],
    samagri: [
      { item: 'Hanuman idol or photo',          quantity: '1',       essential: true  },
      { item: 'Sindoor (red vermillion)',        quantity: 'Pinch',   essential: true  },
      { item: 'Red flowers (jasmine or rose)',   quantity: 'Handful', essential: true  },
      { item: 'Sesame oil (for anointing)',      quantity: '50 ml',   essential: true  },
      { item: 'Besan (gram flour) ladoos',       quantity: '5 or 11', essential: true  },
      { item: 'Banana',                         quantity: '5',       essential: true  },
      { item: 'Diya and incense',               quantity: '1 each',  essential: true  },
      { item: 'Hanuman Chalisa book',           quantity: '1',       essential: false },
    ],
    process: [
      { step: 1, title: 'Morning Bath & Preparation', duration: '10 min', desc: 'Take a bath before sunrise. Wear orange or red clothes as these are sacred to Hanuman.' },
      { step: 2, title: 'Light Diya & Incense',       duration: '3 min',  desc: 'Light a diya with sesame oil and red incense sticks.' },
      { step: 3, title: 'Apply Sindoor',               duration: '5 min',  desc: 'Offer sindoor to the idol. Hanuman is adorned with sindoor as a devotion to Lord Rama.' },
      { step: 4, title: 'Hanuman Chalisa',             duration: '15 min', desc: 'Recite the Hanuman Chalisa 1, 3, 7, or 11 times. Focus on each verse with full devotion.' },
      { step: 5, title: 'Sundar Kand (optional)',      duration: '30 min', desc: 'Read the Sundar Kand from Ramcharitmanas for deeper blessings.' },
      { step: 6, title: 'Aarti',                       duration: '5 min',  desc: 'Perform Hanuman aarti. Offer ladoos and banana as prasad.' },
      { step: 7, title: 'Circumambulation',            duration: '5 min',  desc: 'Walk around the Hanuman temple or idol 3 or 7 times.' },
    ],
    benefits: [
      { benefit: 'Courage & Strength',   icon: '💪', desc: 'Bestows physical strength, mental courage, and fearlessness' },
      { benefit: 'Protection',           icon: '🛡️', desc: 'Guards against evil spirits, black magic, and the evil eye' },
      { benefit: 'Shani Relief',         icon: '⭐', desc: 'Reduces the malefic effects of Saturn (Shani) in the horoscope' },
      { benefit: 'Mental Health',        icon: '🧠', desc: 'Alleviates depression, fear, and mental disturbances' },
    ],
    mantras: [
      { name: 'Hanuman Mool Mantra', text: 'Om Hanumate Namah',                           repetitions: 108 },
      { name: 'Bajrang Baan Opening',text: 'Nishchay Premanahi Suno Dhari\nBajrang Bal Ki Hota Hai Jori', repetitions: 3   },
    ],
    relatedPoojas: ['ganesh-puja', 'rudrabhishek', 'navgraha-shanti'],
    bookingCTA: { text: 'Book Hanuman Puja with Expert Pandit', url: '/poojas/hanuman-puja' },
  },

  // ── Krishna Puja ──────────────────────────────────────────────────────────
  {
    id: 'krishna-puja',
    name: 'Krishna Puja',
    icon: '🦚',
    category: 'Devotional Worship',
    deity: 'Lord Krishna',
    slug: 'krishna-puja',
    shortDesc: 'Receive joy, love, and divine wisdom',
    duration: '30–45 minutes',
    difficulty: 'Easy',
    region: 'Pan India (especially Mathura, Vrindavan, Gujarat)',
    bestTime: {
      time: 'Midnight (11:30 PM – 12:30 AM on Janmashtami)',
      days: ['Wednesday', 'Any day with devotion'],
      tithis: ['Ashtami', 'Ekadashi'],
      occasions: ['Janmashtami', 'Gita Jayanti', 'Every Wednesday'],
    },
    samagri: [
      { item: 'Krishna idol or Bal Gopal',       quantity: '1',       essential: true  },
      { item: 'Yellow or peacock blue flowers',  quantity: 'Handful', essential: true  },
      { item: 'Tulsi leaves (sacred)',           quantity: 'Handful', essential: true  },
      { item: 'Butter and mishri (crystallized sugar)', quantity: '1 bowl', essential: true },
      { item: 'Panchamrit',                      quantity: '1 bowl',  essential: true  },
      { item: 'Flute (small replica, optional)', quantity: '1',       essential: false },
      { item: 'Yellow cloth',                    quantity: '1',       essential: false },
      { item: 'Peacock feather',                 quantity: '1',       essential: false },
    ],
    process: [
      { step: 1, title: 'Adorn the Altar',     duration: '10 min', desc: 'Dress the Krishna idol in new clothes. Offer peacock feathers and flowers.' },
      { step: 2, title: 'Panchamrit Abhishek', duration: '10 min', desc: 'Bathe the idol with panchamrit while chanting "Om Kleem Krishnaya Namah".' },
      { step: 3, title: 'Offer Tulsi & Butter', duration: '5 min', desc: 'Offer fresh tulsi leaves and butter (Krishna\'s favourite) to the deity.' },
      { step: 4, title: 'Recite Bhagavad Gita', duration: '10 min',desc: 'Read one chapter of the Bhagavad Gita or any Krishna stotra.' },
      { step: 5, title: 'Bhajan Singing',        duration: '10 min',desc: 'Sing devotional bhajans: "Hare Krishna", "Achyutam Keshavam", or "Govinda Jai Jai".' },
      { step: 6, title: 'Aarti',                 duration: '5 min', desc: 'Perform aarti and distribute butter-mishri prasad to all.' },
      { step: 7, title: 'Fasting (optional)',    duration: 'All day', desc: 'Observe a fast until midnight on Janmashtami for full spiritual merit.' },
    ],
    benefits: [
      { benefit: 'Joy & Bliss',        icon: '😊', desc: 'Fills life with joy, positivity, and spiritual delight' },
      { benefit: 'Wisdom',             icon: '🧠', desc: 'Grants understanding of the Bhagavad Gita\'s eternal wisdom' },
      { benefit: 'Love & Relationships',icon: '💕', desc: 'Blesses devotees with love, compassion, and harmonious relationships' },
      { benefit: 'Liberation',         icon: '🕉️', desc: 'Krishna\'s grace leads to ultimate spiritual freedom' },
    ],
    mantras: [
      { name: 'Maha Mantra (Hare Krishna)', text: 'Hare Krishna Hare Krishna\nKrishna Krishna Hare Hare\nHare Rama Hare Rama\nRama Rama Hare Hare', repetitions: 108 },
      { name: 'Krishna Moola Mantra',       text: 'Om Kleem Krishnaya Namah',                                                                        repetitions: 108 },
    ],
    relatedPoojas: ['ganesh-puja', 'satyanarayan-puja', 'lakshmi-puja'],
    bookingCTA: { text: 'Book Krishna Puja with Expert Pandit', url: '/poojas/krishna-puja' },
  },

  // ── Griha Pravesh Puja ───────────────────────────────────────────────────
  {
    id: 'griha-pravesh',
    name: 'Griha Pravesh Puja',
    icon: '🏠',
    category: 'Auspicious Ceremonies',
    deity: 'Lord Ganesha, Vastu Devata, Lakshmi',
    slug: 'griha-pravesh',
    shortDesc: 'Bless your new home with divine energy',
    duration: '2–3 hours',
    difficulty: 'Medium',
    region: 'Pan India',
    bestTime: {
      time: 'Morning (Sunrise to Noon)',
      days: ['Wednesday', 'Thursday', 'Friday'],
      tithis: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami'],
      occasions: ['Moving into a new home', 'After renovation', 'After buying a new property'],
    },
    whatIsThis: {
      summary: 'Griha Pravesh is the sacred Hindu housewarming ceremony performed when entering a new home, purifying the space and invoking divine blessings for the household.',
      details: 'Derived from Sanskrit (Griha = house, Pravesh = entry), this puja ensures that the new home is free from Vastu doshas, negative energies, and past occupants\' karmic imprints. The ceremony involves multiple rituals including havan, Vastu puja, and Lakshmi invocation.',
      significance: 'Hindu tradition holds that entering a new home without performing Griha Pravesh invites inauspiciousness. This puja aligns the home\'s energy with the family\'s well-being.',
    },
    whenToPerform: [
      'When moving into a newly built home',
      'When moving into a purchased or rented home',
      'After major renovation or reconstruction',
      'After the death of a family member (special rules apply)',
      'Only on auspicious muhurat days — consult a pandit',
    ],
    samagri: [
      { item: 'Kalash (copper/silver pot)',     quantity: '1',       essential: true  },
      { item: 'Mango leaves',                  quantity: '21',      essential: true  },
      { item: 'Coconut',                       quantity: '1',       essential: true  },
      { item: 'Turmeric (haldi)',              quantity: '100 g',   essential: true  },
      { item: 'Gangajal',                      quantity: '500 ml',  essential: true  },
      { item: 'Havan samagri (fire offering)', quantity: '1 packet',essential: true  },
      { item: 'Cow dung cakes',               quantity: '5',       essential: false },
      { item: 'Nariyal (coconut milk)',        quantity: '1',       essential: false },
      { item: 'New vessels for kitchen',      quantity: '1 set',   essential: false },
      { item: 'Vastu Yantra',                 quantity: '1',       essential: false },
    ],
    process: [
      { step: 1, title: 'Ganesh Puja',         duration: '20 min', desc: 'Begin with Ganesh worship to remove all obstacles from the entry.' },
      { step: 2, title: 'Vastu Puja',          duration: '20 min', desc: 'Worship Vastu Devata and propitiate the spirit of the land and house.' },
      { step: 3, title: 'Havan (Sacred Fire)', duration: '30 min', desc: 'Perform havan to purify the space with sacred fire and chanting.' },
      { step: 4, title: 'Kalash Sthapana',     duration: '10 min', desc: 'Place the kalash at the entrance as a symbol of prosperity.' },
      { step: 5, title: 'Griha Lakshmi Puja',  duration: '20 min', desc: 'Invoke Goddess Lakshmi to make the home prosperous and auspicious.' },
      { step: 6, title: 'Boil Milk',           duration: '10 min', desc: 'Boil milk in the kitchen until it overflows — symbolizes abundance.' },
      { step: 7, title: 'Room Purification',   duration: '10 min', desc: 'Sprinkle Gangajal in every room while chanting purification mantras.' },
      { step: 8, title: 'Aarti & Feast',       duration: '15 min', desc: 'Perform aarti and share a meal (feast) with family and guests.' },
    ],
    benefits: [
      { benefit: 'Home Purification',    icon: '✨', desc: 'Removes negative energies and Vastu doshas from the space' },
      { benefit: 'Family Prosperity',    icon: '🏠', desc: 'Ensures the home becomes a center of happiness and abundance' },
      { benefit: 'Protection',           icon: '🛡️', desc: 'Divine protection for all members of the household' },
      { benefit: 'New Beginnings',       icon: '🌅', desc: 'Marks a blessed and auspicious start for the family\'s new chapter' },
    ],
    mantras: [
      { name: 'Vastu Mantra', text: 'Om Vastu Purushaaya Namah\nShanti Bhavatu Sarvatra', repetitions: 108 },
    ],
    relatedPoojas: ['ganesh-puja', 'lakshmi-puja', 'vastu-puja'],
    bookingCTA: { text: 'Book Griha Pravesh Puja with Expert Pandit', url: '/poojas/griha-pravesh' },
  },

  // ── Vastu Puja ────────────────────────────────────────────────────────────
  {
    id: 'vastu-puja',
    name: 'Vastu Puja',
    icon: '🧭',
    category: 'Auspicious Ceremonies',
    deity: 'Vastu Purush & Lord Brahma',
    slug: 'vastu-puja',
    shortDesc: 'Harmonize your living space with cosmic energies',
    duration: '1–2 hours',
    difficulty: 'Medium',
    region: 'Pan India',
    bestTime: {
      time: 'Morning (8 AM – 12 PM)',
      days: ['Wednesday', 'Thursday'],
      tithis: ['Dwitiya', 'Tritiya', 'Panchami', 'Dashami'],
      occasions: ['Before construction begins', 'When Vastu doshas are identified', 'After purchasing land'],
    },
    samagri: [
      { item: 'Vastu Yantra',               quantity: '1',       essential: true  },
      { item: 'Copper plate for yantra',    quantity: '1',       essential: true  },
      { item: 'Gangajal',                   quantity: '500 ml',  essential: true  },
      { item: 'Havan samagri',              quantity: '1 packet',essential: true  },
      { item: 'Kumkum, turmeric, sindoor',  quantity: 'Each',    essential: true  },
      { item: 'Mixed flowers',              quantity: 'Handful', essential: true  },
      { item: 'Coconut',                    quantity: '1',       essential: true  },
      { item: 'Sea salt (for cleansing)',   quantity: '100 g',   essential: false },
    ],
    process: [
      { step: 1, title: 'Space Cleansing',   duration: '15 min', desc: 'Cleanse the space thoroughly. Sprinkle sea salt in corners to remove negative energy.' },
      { step: 2, title: 'Vastu Yantra Puja', duration: '20 min', desc: 'Worship the Vastu Yantra and invoke Vastu Purush (the spirit of the land).' },
      { step: 3, title: 'Havan',             duration: '30 min', desc: 'Perform havan at the centre of the space with specific Vastu mantras.' },
      { step: 4, title: 'Room Cleansing',    duration: '15 min', desc: 'Sprinkle Gangajal in all rooms, especially corners and entry points.' },
      { step: 5, title: 'Brahma Sthapana',   duration: '10 min', desc: 'Place a Brahma yantra at the Brahmasthan (centre of the house).' },
      { step: 6, title: 'Aarti & Prasad',    duration: '10 min', desc: 'Perform aarti and distribute prasad to all present.' },
    ],
    benefits: [
      { benefit: 'Vastu Correction',    icon: '🧭', desc: 'Removes Vastu doshas without demolition of walls' },
      { benefit: 'Peace & Harmony',     icon: '☮️', desc: 'Restores the natural cosmic energy flow in the living space' },
      { benefit: 'Health Improvement',  icon: '💚', desc: 'Correcting Vastu alleviates chronic health issues linked to the home' },
      { benefit: 'Financial Growth',    icon: '💰', desc: 'Proper Vastu alignment attracts prosperity and removes financial blocks' },
    ],
    mantras: [
      { name: 'Vastu Purush Mantra', text: 'Om Vastu Purushaaya Namah\nNamas Te Vastu Purusha\nBhoomi Bhaar Dharandhara', repetitions: 108 },
    ],
    relatedPoojas: ['griha-pravesh', 'ganesh-puja', 'lakshmi-puja'],
    bookingCTA: { text: 'Book Vastu Puja with Expert Pandit', url: '/poojas/vastu-puja' },
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getPoojaGuide(slug: string): PoojaGuide | undefined {
  return POOJA_GUIDES.find(g => g.slug === slug)
}

export const GUIDE_CATEGORIES = [
  'All',
  'Daily Worship',
  'Wealth & Prosperity',
  'Thanksgiving & Blessings',
  'Shiva Worship',
  'Festivals & Navratri',
  'Planetary Remedies',
  'Devotional Worship',
  'Auspicious Ceremonies',
]

export const DIFFICULTY_COLORS = {
  Easy:     'bg-green-100 text-green-700',
  Medium:   'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
}
