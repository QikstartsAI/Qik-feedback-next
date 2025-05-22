"use client";

import { ReactNode, useEffect, useRef } from "react";
import { I18nextProvider } from "react-i18next"; // Removed useTranslation here
import i18nInstance from "@/lib/i18n"; // Import the configured i18n instance

interface TranslationsProviderProps {
  children: ReactNode;
  locale: string; // Locale is now required as it's driven by business
}

export default function TranslationsProvider({
  children,
  locale, // Locale is passed from the parent (page)
}: TranslationsProviderProps) {
  // Use a ref to track if the language has been set initially
  const localeSetRef = useRef(false);

  useEffect(() => {
    // Only run this effect once per locale change or on initial mount with locale
    if (
      locale &&
      i18nInstance.isInitialized &&
      i18nInstance.language !== locale
    ) {
      i18nInstance.changeLanguage(locale);
      localeSetRef.current = true; // Mark as set for this locale
    } else if (locale && !i18nInstance.isInitialized) {
      // Handle case where i18n might not be fully initialized yet when locale is first passed
      // This listener ensures language is set once initialized
      const initCallback = () => {
        if (i18nInstance.language !== locale) {
          i18nInstance.changeLanguage(locale);
          localeSetRef.current = true;
        }
        i18nInstance.off("initialized", initCallback); // Clean up listener
      };
      i18nInstance.on("initialized", initCallback);
      // Clean up listener if component unmounts before initialization
      return () => {
        i18nInstance.off("initialized", initCallback);
      };
    }
  }, [locale]); // Rerun effect if locale prop changes

  // We still use the global i18nInstance configured in lib/i18n.ts
  // but force its language based on the locale prop.
  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
