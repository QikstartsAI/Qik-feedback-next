"use client";
import "@/i18n";
import { lazy, useState, useEffect } from "react";
import Loader from "./components/Loader";
import Thanks from "./components/Thanks";
import { Toaster } from "./components/ui/Toaster";
import { useGetCurrentBusinessByIdImmutable } from "@/app/hooks/services/businesses";
import { useGetWaiterByBusinessOrSucursalImmutable } from "@/app/hooks/services/waiters";
import { useFormStore } from "@/app/stores/form";
import { useGetNearestSucursalOrBusiness } from "./hooks/geo/map";

const Hero = lazy(() => import("./components/Hero"));
const FeedbackForm = lazy(() => import("./components/feedback/FeedbackForm"));

export default function Home() {
  const { data: business, isLoading: loadingBusiness } =
    useGetCurrentBusinessByIdImmutable(); // global state
  const { sucursal } = useGetNearestSucursalOrBusiness();
  const { data: waiter, mutate: mutateWaiter } =
    useGetWaiterByBusinessOrSucursalImmutable(); // global state
  const { rating, isSubmitted } = useFormStore(); // global state

  console.log("🚀 ~ Home ~ waiter:", waiter);

  useEffect(() => {
    if (!!sucursal) {
      mutateWaiter();
    }
  }, [sucursal]);

  if (isSubmitted && rating !== "4" && rating !== "5") {
    return <Thanks businessCountry={business?.Country || "EC"} />;
  }

  return (
    <div className="min-h-screen">
      {!business && loadingBusiness && <Loader />}
      {!!business && !loadingBusiness && (
        <>
          <Hero />
          <FeedbackForm />
        </>
      )}
      <Toaster />
    </div>
  );
}
