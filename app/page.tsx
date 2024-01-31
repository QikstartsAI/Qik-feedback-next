"use client";

import { lazy, useState } from "react";

import Loader from "./components/Loader";
import Thanks from "./components/Thanks";
import { Toaster } from "./components/ui/Toaster";
import { useGetCurrentBusinessByIdImmutable } from "@/app/hooks/services/businesses";
import { useGetWaiterByBusinessOrSucursalImmutable } from "@/app/hooks/services/waiters";

const Hero = lazy(() => import("./components/Hero"));
const FeedbackForm = lazy(() => import("./components/feedback/FeedbackForm"));

export default function Home() {
  const { data: business, isLoading: loadingBusiness } =
    useGetCurrentBusinessByIdImmutable();
  const { data: waiter } = useGetWaiterByBusinessOrSucursalImmutable();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState("");
  if (isSubmitted && rating !== "4" && rating !== "5") {
    return <Thanks businessCountry={business?.Country || "EC"} />;
  }
  return (
    <div className="min-h-screen">
      {!business && loadingBusiness && <Loader />}
      {!!business && !loadingBusiness && (
        <>
          <Hero />
          <FeedbackForm setIsSubmitted={setIsSubmitted} setRating={setRating} />
        </>
      )}
      <Toaster />
    </div>
  );
}
