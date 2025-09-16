"use client";

import { ReactNode } from "react";

import { APIProvider } from "@vis.gl/react-google-maps";

import { ThemeProvider } from "@/components/theme-provider";
import { CustomerProvider } from "./CustomerContext";
import { BrandProvider } from "./BrandContext";
import { BranchProvider } from "./BranchContext";
import { FeedbackProvider } from "./FeedbackContext";

interface MultiProviderProps {
  children: ReactNode;
}

export const MultiProvider = ({ children }: MultiProviderProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.NEXT_PUBLIC_VITE_APP_GOOGLE_API_KEY || "";
  
  return (
    <APIProvider
      apiKey={apiKey}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <CustomerProvider>
          <BrandProvider>
            <BranchProvider>
              <FeedbackProvider>{children}</FeedbackProvider>
            </BranchProvider>
          </BrandProvider>
        </CustomerProvider>
      </ThemeProvider>
      {/* <BusinessDataProvider>{children}</BusinessDataProvider> */}
    </APIProvider>
  );
};
