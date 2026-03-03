'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-xl mb-4">PoojaBook</h3>
            <p className="text-sm text-gray-300">{t('footer.tagline')}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/poojas" className="hover:text-accent">{t('footer.browsePoojas')}</a></li>
              <li><a href="/about" className="hover:text-accent">{t('footer.aboutUs')}</a></li>
              <li><a href="/contact" className="hover:text-accent">{t('footer.contactUs')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/poojas?mode=IN_TEMPLE" className="hover:text-accent">{t('footer.templePoojas')}</a></li>
              <li><a href="/poojas?mode=AT_HOME" className="hover:text-accent">{t('footer.atHomePoojas')}</a></li>
              <li><a href="/poojas?mode=ONLINE" className="hover:text-accent">{t('footer.onlinePoojas')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
            <p className="text-sm text-gray-300">support@poojabook.com</p>
            <p className="text-sm text-gray-300">+91 98765 43210</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          © 2026 PoojaBook. {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}
