"use client";

import { lazy, Suspense } from "react";
import Loader from "./Loader";
import { Toaster } from "./ui/Toaster";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Wizard } from "../layers/ui/components/wizard/wizard";
import TranslationsProvider from "../providers/TranslationsProvider"; // Import the provider
import { getLocaleFromCountry } from "@/lib/utils/getLocaleFromCountry"; // Import the new function
import RequestLocationDialog from "./RequestLocationDialog";
import useGetBusinessData from "../hooks/useGetBusinessData";

const Hero = lazy(() => import("./Hero"));

export default function FeedbackFormRoot() {
  const { business, loading } = useGetBusinessData();

  // Determine locale based on business country
  const locale = getLocaleFromCountry(business?.Country);

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_VITE_APP_GOOGLE_API_KEY ?? ""}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <Suspense fallback={<Loader />}>
        <TranslationsProvider locale={locale}>
          <div>
            {loading === "loading" || loading === "requesting" ? (
              <Loader />
            ) : (
              <div className="min-h-[calc(100vh-103px)]">
                <Hero business={business} />
                <Wizard business={business} />
              </div>
            )}
            <Toaster />
          </div>
          {business?.Powers?.includes("GEOLOCATION") && (
            <RequestLocationDialog />
          )}
        </TranslationsProvider>
      </Suspense>
    </APIProvider>
  );
}
