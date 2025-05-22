import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Function to dynamically load translation files
const loadResource = (language: string, namespace: string) =>
  import(`../public/locales/${language}/${namespace}.json`);

i18n
  // Load translations using the backend loader
  .use(Backend(loadResource))
  // Detect user language
  // Learn more: https://github.com/i18next/i18next-browser-languagedetector
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Init i18next
  // Learn more: https://www.i18next.com/overview/configuration-options
  .init({
    debug: process.env.NODE_ENV === "development", // Enable debug messages in development
    fallbackLng: "en", // Fallback language
    ns: ["common"], // Default namespace(s)
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    // Backend options are not needed when passing the loader function directly
    detection: {
      // Order and from where user language should be detected
      order: [
        "querystring",
        "cookie",
        "localStorage",
        "sessionStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
      caches: ["cookie"], // Cache detected language in cookies
    },
  });

export default i18n;
