"use client";

import { lazy, Suspense } from "react";
import { useGetBusinessData } from "../hooks/useGetBusinessData";
import Loader from "./Loader";
import { Toaster } from "./ui/Toaster";
import RequestLocationDialog from "./RequestLocationDialog";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Wizard } from "../layers/ui/components/wizard/wizard";
import Thanks from "./Thanks";

const Hero = lazy(() => import("./Hero"));

export default function FeedbackFormRoot() {
  const { business, loading } = useGetBusinessData();

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_VITE_APP_GOOGLE_API_KEY ?? ""}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <Suspense fallback={<Loader />}>
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
        {/* {business?.Powers?.includes("GEOLOCATION") && <RequestLocationDialog />} */}
      </Suspense>
    </APIProvider>
  );
}
