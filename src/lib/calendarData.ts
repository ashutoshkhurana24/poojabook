// ─── Types ──────────────────────────────────────────────────────────────────

export interface Nakshatra {
  id: number
  name: string
  deity: string
  nature: string
  color: string
  suitable: string[]
}

export interface Tithi {
  id: number
  name: string
  paksha: string
  auspicious: boolean
  suitable: string[]
}

export interface Muhurat {
  name: string
  icon: string
  bestNakshatras: string[]
  bestTithis: number[]
  description: string
}

export interface RegionalFestivalEntry {
  name: string
  month: number
  significance: string
}

export interface RegionData {
  region: string
  icon: string
  states: string[]
  festivals: RegionalFestivalEntry[]
}

export interface ScoredDate {
  date: string
  score: number
  nakshatra: Nakshatra
  tithi: Tithi | null
}

// ─── Nakshatras (27 lunar mansions) ─────────────────────────────────────────

export const NAKSHATRAS: Nakshatra[] = [
  { id: 1,  name: 'Ashwini',           deity: 'Ashwini Kumaras', nature: 'Swift',      color: '#FF6B6B', suitable: ['travel', 'medicine', 'new beginnings'] },
  { id: 2,  name: 'Bharani',           deity: 'Yama',            nature: 'Fierce',     color: '#FF8E53', suitable: ['agriculture', 'fire rituals'] },
  { id: 3,  name: 'Krittika',          deity: 'Agni',            nature: 'Mixed',      color: '#FFA500', suitable: ['cooking', 'sharp work'] },
  { id: 4,  name: 'Rohini',            deity: 'Brahma',          nature: 'Fixed',      color: '#4CAF50', suitable: ['planting', 'marriage', 'coronation'] },
  { id: 5,  name: 'Mrigashira',        deity: 'Soma',            nature: 'Soft',       color: '#81C784', suitable: ['travel', 'music', 'learning'] },
  { id: 6,  name: 'Ardra',             deity: 'Rudra',           nature: 'Sharp',      color: '#E53935', suitable: ['surgery', 'enemy resolution'] },
  { id: 7,  name: 'Punarvasu',         deity: 'Aditi',           nature: 'Movable',    color: '#42A5F5', suitable: ['renovation', 'travel', 'medicine'] },
  { id: 8,  name: 'Pushya',            deity: 'Brihaspati',      nature: 'Auspicious', color: '#FFD700', suitable: ['all auspicious works', 'coronation'] },
  { id: 9,  name: 'Ashlesha',          deity: 'Nagas',           nature: 'Sharp',      color: '#7B1FA2', suitable: ['tantra', 'occult work'] },
  { id: 10, name: 'Magha',             deity: 'Pitras',          nature: 'Fierce',     color: '#795548', suitable: ['ancestral rites', 'shraddha'] },
  { id: 11, name: 'Purva Phalguni',    deity: 'Bhaga',           nature: 'Fierce',     color: '#F06292', suitable: ['marriage', 'romance', 'art'] },
  { id: 12, name: 'Uttara Phalguni',   deity: 'Aryaman',         nature: 'Fixed',      color: '#4CAF50', suitable: ['marriage', 'friendship', 'legal'] },
  { id: 13, name: 'Hasta',             deity: 'Savitar',         nature: 'Light',      color: '#26C6DA', suitable: ['crafts', 'trade', 'medicine'] },
  { id: 14, name: 'Chitra',            deity: 'Vishwakarma',     nature: 'Soft',       color: '#EC407A', suitable: ['art', 'jewelry', 'architecture'] },
  { id: 15, name: 'Swati',             deity: 'Vayu',            nature: 'Movable',    color: '#66BB6A', suitable: ['trade', 'travel', 'planting'] },
  { id: 16, name: 'Vishakha',          deity: 'Indra-Agni',      nature: 'Mixed',      color: '#FFA726', suitable: ['harvest', 'agriculture'] },
  { id: 17, name: 'Anuradha',          deity: 'Mitra',           nature: 'Soft',       color: '#29B6F6', suitable: ['friendship', 'travel', 'devotion'] },
  { id: 18, name: 'Jyeshtha',          deity: 'Indra',           nature: 'Sharp',      color: '#EF5350', suitable: ['war', 'conflict resolution'] },
  { id: 19, name: 'Mula',              deity: 'Nirriti',         nature: 'Sharp',      color: '#8D6E63', suitable: ['research', 'destruction', 'medicine'] },
  { id: 20, name: 'Purva Ashadha',     deity: 'Apas',            nature: 'Fierce',     color: '#0288D1', suitable: ['water rituals', 'trade'] },
  { id: 21, name: 'Uttara Ashadha',    deity: 'Vishwadevas',     nature: 'Fixed',      color: '#388E3C', suitable: ['permanent works', 'victory'] },
  { id: 22, name: 'Shravana',          deity: 'Vishnu',          nature: 'Movable',    color: '#1565C0', suitable: ['learning', 'travel', 'listening'] },
  { id: 23, name: 'Dhanishta',         deity: 'Ashta Vasus',     nature: 'Movable',    color: '#F9A825', suitable: ['music', 'dance', 'wealth'] },
  { id: 24, name: 'Shatabhisha',       deity: 'Varuna',          nature: 'Movable',    color: '#00838F', suitable: ['healing', 'astronomy', 'secrets'] },
  { id: 25, name: 'Purva Bhadrapada',  deity: 'Aja Ekapada',     nature: 'Fierce',     color: '#6A1B9A', suitable: ['tantra', 'occult'] },
  { id: 26, name: 'Uttara Bhadrapada', deity: 'Ahir Budhnya',    nature: 'Fixed',      color: '#2E7D32', suitable: ['all auspicious works', 'charity'] },
  { id: 27, name: 'Revati',            deity: 'Pushan',          nature: 'Soft',       color: '#00ACC1', suitable: ['travel', 'completion', 'final rites'] },
]

// ─── Tithis (lunar days) ─────────────────────────────────────────────────────

export const TITHIS: Tithi[] = [
  { id: 1,  name: 'Prathama',    paksha: 'Shukla', auspicious: true,  suitable: ['new beginnings', 'travel'] },
  { id: 2,  name: 'Dwitiya',     paksha: 'Shukla', auspicious: true,  suitable: ['construction', 'travel'] },
  { id: 3,  name: 'Tritiya',     paksha: 'Shukla', auspicious: true,  suitable: ['marriage', 'jewelry'] },
  { id: 4,  name: 'Chaturthi',   paksha: 'Shukla', auspicious: false, suitable: ['Ganesha worship'] },
  { id: 5,  name: 'Panchami',    paksha: 'Shukla', auspicious: true,  suitable: ['medicine', 'art'] },
  { id: 6,  name: 'Shashthi',    paksha: 'Shukla', auspicious: true,  suitable: ['Kartikeya worship'] },
  { id: 7,  name: 'Saptami',     paksha: 'Shukla', auspicious: true,  suitable: ['Sun worship', 'travel'] },
  { id: 8,  name: 'Ashtami',     paksha: 'Shukla', auspicious: true,  suitable: ['Durga worship', 'courage'] },
  { id: 9,  name: 'Navami',      paksha: 'Shukla', auspicious: true,  suitable: ['Devi worship'] },
  { id: 10, name: 'Dashami',     paksha: 'Shukla', auspicious: true,  suitable: ['victory', 'Vijayadashami'] },
  { id: 11, name: 'Ekadashi',    paksha: 'Shukla', auspicious: true,  suitable: ['fasting', 'Vishnu worship'] },
  { id: 12, name: 'Dwadashi',    paksha: 'Shukla', auspicious: true,  suitable: ['Vishnu worship', 'charity'] },
  { id: 13, name: 'Trayodashi',  paksha: 'Shukla', auspicious: true,  suitable: ['Shiva worship', 'Pradosh'] },
  { id: 14, name: 'Chaturdashi', paksha: 'Shukla', auspicious: false, suitable: ['Shiva worship'] },
  { id: 15, name: 'Purnima',     paksha: 'Shukla', auspicious: true,  suitable: ['all auspicious works'] },
  { id: 30, name: 'Amavasya',    paksha: 'Krishna', auspicious: false, suitable: ['ancestral rites', 'pitru tarpan'] },
]

// ─── Muhurats ────────────────────────────────────────────────────────────────

export const MUHURATS: Record<string, Muhurat> = {
  marriage: {
    name: 'Vivah Muhurat',  icon: '💒',
    bestNakshatras: ['Rohini', 'Mrigashira', 'Magha', 'Uttara Phalguni', 'Hasta', 'Swati', 'Anuradha', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati'],
    bestTithis: [2, 3, 5, 7, 10, 11, 13],
    description: 'Most auspicious time for wedding ceremonies'
  },
  grihaPravesh: {
    name: 'Griha Pravesh',  icon: '🏠',
    bestNakshatras: ['Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Shravana', 'Dhanishta', 'Revati'],
    bestTithis: [2, 3, 5, 7, 10, 13],
    description: 'Best time for housewarming ceremonies'
  },
  namkaran: {
    name: 'Namkaran',       icon: '👶',
    bestNakshatras: ['Ashwini', 'Rohini', 'Mrigashira', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Shravana'],
    bestTithis: [1, 2, 3, 5, 7, 10, 11, 12, 13],
    description: 'Auspicious time for naming ceremony'
  },
  business: {
    name: 'Vyapar Muhurat', icon: '💼',
    bestNakshatras: ['Rohini', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Shravana', 'Dhanishta', 'Revati'],
    bestTithis: [2, 3, 5, 7, 11, 12, 13],
    description: 'Best time to start a new business'
  },
  travel: {
    name: 'Yatra Muhurat',  icon: '✈️',
    bestNakshatras: ['Ashwini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Swati', 'Anuradha', 'Shravana', 'Revati'],
    bestTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    description: 'Auspicious time to begin a journey'
  },
  pooja: {
    name: 'Pooja Muhurat',  icon: '🪔',
    bestNakshatras: ['Pushya', 'Rohini', 'Hasta', 'Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati'],
    bestTithis: [1, 2, 3, 5, 6, 7, 10, 11, 12, 13, 15],
    description: 'Most auspicious time to perform poojas'
  },
}

// ─── Regional Festivals ──────────────────────────────────────────────────────

export const REGIONAL_FESTIVALS: Record<string, RegionData> = {
  north: {
    region: 'North India', icon: '🏔️',
    states: ['UP', 'Bihar', 'MP', 'Rajasthan', 'Delhi', 'Punjab', 'Haryana'],
    festivals: [
      { name: 'Chhath Puja',    month: 10, significance: 'Sun God worship' },
      { name: 'Lohri',          month: 1,  significance: 'Harvest festival' },
      { name: 'Baisakhi',       month: 4,  significance: 'New Year harvest' },
      { name: 'Ram Navami',     month: 4,  significance: 'Lord Ram birthday' },
      { name: 'Govardhan Puja', month: 10, significance: 'Post Diwali puja' },
      { name: 'Teej',           month: 8,  significance: 'Women festival' },
      { name: 'Karva Chauth',   month: 10, significance: 'Married women fast' },
    ]
  },
  south: {
    region: 'South India', icon: '🌴',
    states: ['Tamil Nadu', 'Karnataka', 'Kerala', 'Andhra Pradesh', 'Telangana'],
    festivals: [
      { name: 'Pongal',            month: 1,  significance: 'Harvest thanksgiving' },
      { name: 'Ugadi',             month: 4,  significance: 'Telugu/Kannada New Year' },
      { name: 'Vishu',             month: 4,  significance: 'Malayalam New Year' },
      { name: 'Onam',              month: 8,  significance: 'Kerala harvest festival' },
      { name: 'Karthigai Deepam',  month: 11, significance: 'Festival of lights Tamil' },
      { name: 'Navaratri Golu',    month: 10, significance: 'Doll display festival' },
      { name: 'Vaikunta Ekadashi', month: 12, significance: 'Vishnu worship day' },
    ]
  },
  east: {
    region: 'East India', icon: '🌊',
    states: ['West Bengal', 'Odisha', 'Assam', 'Jharkhand'],
    festivals: [
      { name: 'Durga Puja',     month: 10, significance: 'Goddess Durga worship' },
      { name: 'Rath Yatra',     month: 7,  significance: 'Lord Jagannath chariot' },
      { name: 'Bihu',           month: 4,  significance: 'Assamese New Year' },
      { name: 'Poila Boishakh', month: 4,  significance: 'Bengali New Year' },
      { name: 'Saraswati Puja', month: 2,  significance: 'Goddess of knowledge' },
      { name: 'Kali Puja',      month: 10, significance: 'Goddess Kali worship' },
    ]
  },
  west: {
    region: 'West India', icon: '🏜️',
    states: ['Maharashtra', 'Gujarat', 'Goa', 'Rajasthan'],
    festivals: [
      { name: 'Ganesh Chaturthi', month: 8,  significance: '10-day Ganesha festival' },
      { name: 'Gudi Padwa',       month: 4,  significance: 'Marathi New Year' },
      { name: 'Navratri Garba',   month: 10, significance: 'Gujarati dance festival' },
      { name: 'Makar Sankranti',  month: 1,  significance: 'Kite festival Gujarat' },
      { name: 'Goa Carnival',     month: 2,  significance: 'Goan celebration' },
      { name: 'Bail Pola',        month: 8,  significance: 'Bullock worship Maharashtra' },
    ]
  },
}

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export const TITHI_NAME_TO_ID: Record<string, number> = {
  Prathama: 1, Dwitiya: 2, Tritiya: 3, Chaturthi: 4, Panchami: 5,
  Shashthi: 6, Saptami: 7, Ashtami: 8, Navami: 9, Dashami: 10,
  Ekadashi: 11, Dwadashi: 12, Trayodashi: 13, Chaturdashi: 14,
  Purnima: 15, Amavasya: 30,
}

// ─── Astronomical reference for 2026 ─────────────────────────────────────────
// Calibrated: Jan 29 2026 ≈ Mauni Amavasya; Jan 1 2026 ≈ Uttara Ashadha (idx 20)

const AMAVASYA_REF   = new Date('2026-01-29T12:00:00')
const LUNAR_MONTH    = 29.53          // days
const LUNAR_DAY_DUR  = LUNAR_MONTH / 30  // ≈ 0.984 days per tithi

const NAKSHATRA_REF     = new Date('2026-01-01T12:00:00')
const NAKSHATRA_REF_IDX = 20            // Uttara Ashadha (0-based)
const NAKSHATRA_PERIOD  = 27.32 / 27   // ≈ 1.012 days per nakshatra

// ─── Core utilities ───────────────────────────────────────────────────────────

export function getNakshatraForDate(dateStr: string, panchangNakshatra?: string): Nakshatra {
  if (panchangNakshatra) {
    const found = NAKSHATRAS.find(n => n.name === panchangNakshatra)
    if (found) return found
  }
  const date    = new Date(dateStr + 'T12:00:00')
  const dayDiff = (date.getTime() - NAKSHATRA_REF.getTime()) / 86_400_000
  const idx     = ((Math.floor(dayDiff / NAKSHATRA_PERIOD) + NAKSHATRA_REF_IDX) % 27 + 27) % 27
  return NAKSHATRAS[idx]
}

export function getTithiForDate(dateStr: string, panchangTithi?: string): Tithi | null {
  if (panchangTithi) {
    const id    = TITHI_NAME_TO_ID[panchangTithi]
    const found = TITHIS.find(t => t.id === id)
    if (found) return found
  }
  const date         = new Date(dateStr + 'T12:00:00')
  const dayDiff      = (date.getTime() - AMAVASYA_REF.getTime()) / 86_400_000
  const daysInMonth  = ((dayDiff % LUNAR_MONTH) + LUNAR_MONTH) % LUNAR_MONTH
  const tithiIdx     = Math.floor(daysInMonth / LUNAR_DAY_DUR) // 0-29
  if (tithiIdx === 29) return TITHIS.find(t => t.name === 'Amavasya') || null
  if (tithiIdx === 14) return TITHIS.find(t => t.name === 'Purnima') || null
  const tithiId = tithiIdx <= 14 ? tithiIdx + 1 : tithiIdx - 14
  return TITHIS.find(t => t.id === tithiId) || TITHIS[0]
}

export function calculateMuhuratScore(
  dateStr: string,
  eventType: string,
  panchangNakshatra?: string,
  panchangTithi?: string,
  isAuspicious?: boolean,
): number {
  const muhurat = MUHURATS[eventType]
  if (!muhurat) return 0

  const nakshatra = getNakshatraForDate(dateStr, panchangNakshatra)
  const tithi     = getTithiForDate(dateStr, panchangTithi)

  let score = 0
  if (muhurat.bestNakshatras.includes(nakshatra.name))         score += 50
  if (tithi && muhurat.bestTithis.includes(tithi.id))          score += 30
  if (tithi?.auspicious)                                       score += 10
  if (isAuspicious)                                            score += 5
  if ([0, 6].includes(new Date(dateStr + 'T00:00:00').getDay())) score += 10

  return Math.min(score, 100)
}

export function getDaysInMonth(month: number, year: number): string[] {
  const numDays = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: numDays }, (_, i) => {
    const d = String(i + 1).padStart(2, '0')
    const m = String(month + 1).padStart(2, '0')
    return `${year}-${m}-${d}`
  })
}

export function findBestDates(
  month: number,
  year: number,
  eventType: string,
  panchangMap: Map<string, { nakshatra?: string; tithi?: string; is_auspicious?: boolean }>,
): ScoredDate[] {
  const all = getDaysInMonth(month, year).map(date => {
    const p = panchangMap.get(date)
    return {
      date,
      score:     calculateMuhuratScore(date, eventType, p?.nakshatra, p?.tithi, p?.is_auspicious),
      nakshatra: getNakshatraForDate(date, p?.nakshatra),
      tithi:     getTithiForDate(date, p?.tithi),
    }
  }).sort((a, b) => b.score - a.score)

  const good = all.filter(d => d.score >= 60)
  return (good.length >= 3 ? good : all).slice(0, 5)
}

// ─── Region detection ─────────────────────────────────────────────────────────

const CITY_REGION_MAP: [string[], string][] = [
  [['mumbai', 'pune', 'nashik', 'surat', 'ahmedabad', 'vadodara', 'goa', 'jaipur', 'udaipur'], 'west'],
  [['delhi', 'varanasi', 'lucknow', 'agra', 'kanpur', 'bhopal', 'chandigarh', 'amritsar', 'ludhiana', 'patna', 'raipur'], 'north'],
  [['chennai', 'bangalore', 'bengaluru', 'hyderabad', 'kochi', 'coimbatore', 'madurai', 'mysore', 'mysuru', 'thiruvananthapuram', 'vijayawada', 'visakhapatnam'], 'south'],
  [['kolkata', 'bhubaneswar', 'guwahati', 'ranchi', 'cuttack'], 'east'],
]

export function getRegionForCity(city: string): string {
  if (!city) return 'all'
  const lower = city.toLowerCase()
  for (const [cities, region] of CITY_REGION_MAP) {
    if (cities.some(c => lower.includes(c))) return region
  }
  return 'all'
}

export function getFestivalRegion(festivalName: string): string | null {
  const lower = festivalName.toLowerCase()
  for (const [region, data] of Object.entries(REGIONAL_FESTIVALS)) {
    if (data.festivals.some(f => lower.includes(f.name.toLowerCase()) || f.name.toLowerCase().includes(lower))) {
      return region
    }
  }
  return null
}

export const REGION_COLORS: Record<string, string> = {
  north: 'bg-red-400',
  south: 'bg-green-500',
  east:  'bg-blue-500',
  west:  'bg-yellow-500',
}
