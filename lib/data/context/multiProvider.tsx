"use client";

import { ReactNode } from "react";

import { APIProvider } from "@vis.gl/react-google-maps";

import { ThemeProvider } from "@/components/theme-provider";
import { CustomerProvider } from "./CustomerContext";
import { BranchProvider } from "./BranchContext";

interface MultiProviderProps {
  children: ReactNode;
}

export const MultiProvider = ({ children }: MultiProviderProps) => {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_VITE_APP_GOOGLE_API_KEY ?? ""}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <CustomerProvider>
          <BranchProvider>{children}</BranchProvider>
        </CustomerProvider>
      </ThemeProvider>
      {/* <BusinessDataProvider>{children}</BusinessDataProvider> */}
    </APIProvider>
  );
};
