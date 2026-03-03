'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export type Locale = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'bn' | 'mr' | 'ml'

interface LanguageContextValue {
  locale: Locale
  changeLanguage: (lang: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  changeLanguage: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')
  const [translations, setTranslations] = useState<Record<string, unknown>>({})

  const loadTranslations = useCallback(async (lang: Locale) => {
    try {
      const res = await fetch(`/locales/${lang}/common.json`)
      if (!res.ok) throw new Error('not found')
      setTranslations(await res.json())
    } catch {
      if (lang !== 'en') {
        const fallback = await fetch('/locales/en/common.json')
        setTranslations(await fallback.json())
      }
    }
  }, [])

  useEffect(() => {
    const saved = (localStorage.getItem('preferred_language') as Locale) || 'en'
    setLocale(saved)
    loadTranslations(saved)
  }, [loadTranslations])

  const changeLanguage = useCallback((lang: Locale) => {
    setLocale(lang)
    localStorage.setItem('preferred_language', lang)
    loadTranslations(lang)
  }, [loadTranslations])

  const t = useCallback((key: string): string => {
    const parts = key.split('.')
    let current: unknown = translations
    for (const part of parts) {
      if (current == null || typeof current !== 'object') return key
      current = (current as Record<string, unknown>)[part]
    }
    return typeof current === 'string' ? current : key
  }, [translations])

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
