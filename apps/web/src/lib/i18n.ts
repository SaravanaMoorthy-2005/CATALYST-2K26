import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import ta from '../locales/ta.json'
import hi from '../locales/hi.json'

const savedLanguage =
  typeof window !== 'undefined'
    ? localStorage.getItem('careguardian_lang') ||
      (navigator.language.startsWith('ta') ? 'ta' : navigator.language.startsWith('hi') ? 'hi' : 'en')
    : 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ta: { translation: ta },
    hi: { translation: hi },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export function changeLanguage(lang: 'en' | 'ta' | 'hi') {
  i18n.changeLanguage(lang)
  if (typeof window !== 'undefined') {
    localStorage.setItem('careguardian_lang', lang)
    document.documentElement.lang = lang
  }
}

export default i18n
