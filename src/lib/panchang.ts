import panchangData from '@/data/panchang.json'

export interface PankajItem {
  date: string
  tithi: string
  paksha: string
  nakshatra: string
  festivals: string[]
  is_auspicious: boolean
  pooja_suggestions: string[]
  type: 'major' | 'minor' | 'ekadashi' | 'amavasya' | 'purnima'
}

export const getPanchangData = (): PankajItem[] => {
  return panchangData as PankajItem[]
}

export const getUpcomingAuspiciousDays = (count: number = 8): PankajItem[] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return getPanchangData()
    .filter(item => {
      const itemDate = new Date(item.date)
      itemDate.setHours(0, 0, 0, 0)
      return itemDate >= today && item.is_auspicious
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, count)
}

export const getPanchangForDate = (dateStr: string): PankajItem | undefined => {
  return getPanchangData().find(item => item.date === dateStr)
}

export const getPanchangForMonth = (year: number, month: number): PankajItem[] => {
  const monthStr = String(month + 1).padStart(2, '0')
  return getPanchangData().filter(item => item.date.startsWith(`${year}-${monthStr}`))
}

export const getFestivalDates = (type?: string): PankajItem[] => {
  let data = getPanchangData().filter(item => item.festivals.length > 0)
  if (type) {
    data = data.filter(item => item.type === type)
  }
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export const getPoojaSuggestionDates = (poojaSlug: string): PankajItem[] => {
  return getPanchangData()
    .filter(item => item.pooja_suggestions.includes(poojaSlug))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)
}

export const formatDateHindi = (date: Date): string => {
  const hindiMonths = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ]
  const hindiDays = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार']
  return `${hindiDays[date.getDay()]} ${date.getDate()} ${hindiMonths[date.getMonth()]}`
}

export const RAHU_KAAL: Record<string, string> = {
  'Sunday': '4:30 PM - 6:00 PM',
  'Monday': '7:30 AM - 9:00 AM',
  'Tuesday': '3:00 PM - 4:30 PM',
  'Wednesday': '12:00 PM - 1:30 PM',
  'Thursday': '1:30 PM - 3:00 PM',
  'Friday': '10:30 AM - 12:00 PM',
  'Saturday': '9:00 AM - 10:30 AM',
}

export const getRahuKaal = (): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const today = new Date().getDay()
  return RAHU_KAAL[days[today]] || ''
}

export const getDayName = (dateStr: string): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const date = new Date(dateStr + 'T00:00:00')
  return days[date.getDay()]
}
