'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage, type Locale } from '@/contexts/LanguageContext'

const LANGUAGES: { code: Locale; nativeLabel: string; label: string }[] = [
  { code: 'en', nativeLabel: 'English',   label: 'English'   },
  { code: 'hi', nativeLabel: 'हिंदी',      label: 'Hindi'     },
  { code: 'ta', nativeLabel: 'தமிழ்',      label: 'Tamil'     },
  { code: 'te', nativeLabel: 'తెలుగు',     label: 'Telugu'    },
  { code: 'kn', nativeLabel: 'ಕನ್ನಡ',      label: 'Kannada'   },
  { code: 'bn', nativeLabel: 'বাংলা',      label: 'Bengali'   },
  { code: 'mr', nativeLabel: 'मराठी',      label: 'Marathi'   },
  { code: 'ml', nativeLabel: 'മലയാളം',    label: 'Malayalam' },
]

export default function LanguageSelector() {
  const { locale, changeLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = LANGUAGES.find(l => l.code === locale) ?? LANGUAGES[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-orange-200 bg-white hover:bg-orange-50 text-sm font-medium text-gray-700 transition-all"
        aria-label={t('language.select')}
      >
        <span className="text-base">🌐</span>
        <span className="hidden sm:inline">{current.nativeLabel}</span>
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-3 py-2 bg-orange-50 border-b border-orange-100">
            <p className="text-xs text-orange-600 font-semibold">🌐 {t('language.select')}</p>
          </div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { changeLanguage(lang.code); setIsOpen(false) }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-orange-50 transition-colors ${
                locale === lang.code ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
              }`}
            >
              <div>
                <p className="text-sm font-medium">{lang.nativeLabel}</p>
                <p className="text-xs text-gray-400">{lang.label}</p>
              </div>
              {locale === lang.code && <span className="text-orange-500 text-sm">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
