"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import { getLocaleFromCountry } from "@/lib/utils/getLocaleFromCountry";
import RequestLocationDialog from "@/lib/components/RequestLocationDialog";
import useGetBusinessData from "@/lib/hooks/useGetBusinessData";
import { Toaster } from "@/lib/components/ui/Toaster";
import Loader from "@/lib/components/Loader";
import { MultiProvider } from "@/data";

// Dynamically import Wizard with ssr: false, rename back to Wizard
const Wizard = dynamic(
  () =>
    import("@/lib/layers/ui/components/wizard/wizard").then(
      (mod) => mod.Wizard
    ),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

// Keep original dynamic Hero import
const Hero = dynamic(() => import("./Hero"), {
  suspense: true,
});

function FeedbackFormContent() {
  const { business, loading } = useGetBusinessData();
  if (loading === "loading" || business == null || business == undefined) {
    return <Loader />;
  }

  return (
    <>
      <div className="min-h-[calc(100vh-103px)]">
        <Hero />
        <Wizard />
      </div>
      {business?.Powers?.includes("GEOLOCATION") && <RequestLocationDialog />}
      <Toaster />
    </>
  );
}

export default function FeedbackFormRoot() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("id");
  const defaultLocale = "en"; // You might want to adjust this based on your needs

  return (
    <MultiProvider locale={defaultLocale}>
      <FeedbackFormContent />
      {/* <Suspense fallback={<Loader />}></Suspense> */}
    </MultiProvider>
  );
}
