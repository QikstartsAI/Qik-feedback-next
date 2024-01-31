import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// locales
import localeES from "@/locales/es";
import localeEN from "@/locales/en";
import localeFR from "@/locales/fr";

export const resources = {
  es: localeES,
  en: localeEN,
  fr: localeFR,
};

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: "es",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
