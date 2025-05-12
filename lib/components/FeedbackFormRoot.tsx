"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

import { APIProvider } from "@vis.gl/react-google-maps";
import TranslationsProvider from "@/lib/providers/TranslationsProvider"; // Import the provider
import { getLocaleFromCountry } from "@/lib/utils/getLocaleFromCountry"; // Import the new function
import RequestLocationDialog from "@/lib/components/RequestLocationDialog";
import useGetBusinessData from "@/lib/hooks/useGetBusinessData";
import { Toaster } from "@/lib/components/ui/Toaster";
import Loader from "@/lib/components/Loader";

// Dynamically import Wizard with ssr: false, rename back to Wizard
const Wizard = dynamic(
  () =>
    import("@/lib/layers/ui/components/wizard/wizard").then(
      (mod) => mod.Wizard
    ),
  {
    ssr: false,
    loading: () => <Loader />, // Use dynamic loading state
  }
);

// Keep original dynamic Hero import
const Hero = dynamic(() => import("./Hero"), {
  suspense: true, // Or loading: () => <Loader />
});

export default function FeedbackFormRoot() {
  const { business, loading } = useGetBusinessData();

  // Determine locale based on business country
  const locale = getLocaleFromCountry(business?.Country);

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_VITE_APP_GOOGLE_API_KEY ?? ""}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <TranslationsProvider locale={locale}>
        {/* Suspense boundary might still be useful for Hero or other lazy components */}
        <Suspense fallback={<Loader />}>
          <div>
            {loading === "loading" ||
            business == null ||
            business == undefined ? (
              <Loader />
            ) : (
              <>
                <div className="min-h-[calc(100vh-103px)]">
                  {/* Use original names */}
                  <Hero business={business} />
                  <Wizard business={business} />
                </div>
                {business?.Powers?.includes("GEOLOCATION") && (
                  <RequestLocationDialog />
                )}
              </>
            )}
            <Toaster />
          </div>
        </Suspense>
      </TranslationsProvider>
    </APIProvider>
  );
}
