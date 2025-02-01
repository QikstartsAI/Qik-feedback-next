import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import EN from './languages/EN.json'
import ES from './languages/ES.json'

const resources = { 
  en: {
    translation: EN
  },
  es: {
    translation: ES
  }
}

i18next
.use(LanguageDetector) 
.use(initReactI18next)
.init({
  resources,
  fallbackLng: 'en',
});


