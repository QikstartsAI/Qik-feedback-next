"use client";

import { ReactNode } from "react";

import { APIProvider } from "@vis.gl/react-google-maps";
import TranslationsProvider from "@/lib/providers/TranslationsProvider";
import { BusinessDataProvider } from "@/lib/hooks/useGetBusinessData";

interface MultiProviderProps {
  children: ReactNode;
  locale: string;
}

export const MultiProvider = ({ children, locale }: MultiProviderProps) => {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_VITE_APP_GOOGLE_API_KEY ?? ""}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <TranslationsProvider locale={locale}>
        <BusinessDataProvider>{children}</BusinessDataProvider>
      </TranslationsProvider>
    </APIProvider>
  );
};
