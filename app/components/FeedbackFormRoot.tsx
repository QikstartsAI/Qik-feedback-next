"use client";
import { lazy, useEffect, useState, Suspense } from "react";
import useGetBusinessData from "../hooks/useGetBusinessData";
import Loader from "./Loader";
import Thanks from "./Thanks";
import { Toaster } from "./ui/Toaster";
import Intro from "./feedback/Intro";
import { CustomerRole } from "../types/customer";
import GusCustomForm from "./feedback/customForms/GusCustomForm";
import HootersCustomForm from "./feedback/customForms/HootersCustomForm";
import CustomIntro from "@/app/components/feedback/customForms/CustomIntro";
import HootersThanks from "@/app/components/HootersThanks";
import SimpleForm from "./feedback/customForms/SimpleForm";
import SimpleThanks from "./SimpleThanks";
import { DSC_SOLUTIONS_ID } from "../constants/general";
import RequestLocationDialog from "./RequestLocationDialog";
import { setCookie } from "../lib/utils";
import { useDistanceMatrix } from "../hooks/useDistanceMatrix";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Branch } from "../types/business";
import BenitoMiamiForm from "./feedback/customForms/BenitoMiamiForm";
import DelcampoCustomForm from "./feedback/customForms/PolloCustomForm";

const Hero = lazy(() => import("./Hero"));
const FeedbackForm = lazy(() => import("./feedback/FeedbackForm"));
const FeedbackFormServices = lazy(
  () => import("./feedback/FeedbackFormServices")
);
const CUSTOM_HOOTERS_FORM_ID = "hooters";
const CUSTOM_YOGURT_FORM_ID = "yogurt-amazonas";
const CUSTOM_POLLOSDCAMPO_FORM_ID = "pollos-d-campo";
const CUSTOM_GUS_FORM_ID = "pollo-gus";
const CUSTOM_CEBICHES_FORM_ID = "los-cebiches-de-la-ruminahui";
const CUSTOM_PIQUEOS_MORITOS = "piqueos-y-moritos";
const INKA_BURGER = "MyzictjAWrtusZhk0sGh";
const CUSTOM_BENIT_MIAMI_ID = {
  branch: "ttIvaTT3WjuLnJtOIbqu",
  sucursal: "miami",
};
export default function FeedbackFormRoot() {
  const {
    business,
    loading,
    businessId,
    branchId,
    waiterId,
    setSucursalId,
    sucursalId,
  } = useGetBusinessData();
  const [customerType, setCustomerType] = useState<CustomerRole | null>(null);
  const toggleCustomer = (customerType: CustomerRole) => {
    setCustomerType(customerType);
  };
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isQr, setIsQr] = useState(false);
  const [rating, setRating] = useState("");
  const isHootersForm = businessId === CUSTOM_HOOTERS_FORM_ID;
  const enableGeolocation = [
    CUSTOM_HOOTERS_FORM_ID,
    CUSTOM_YOGURT_FORM_ID,
    CUSTOM_POLLOSDCAMPO_FORM_ID,
    CUSTOM_CEBICHES_FORM_ID,
    CUSTOM_PIQUEOS_MORITOS,
    INKA_BURGER
  ].includes(businessId ?? "");
  const isGusForm = businessId === CUSTOM_GUS_FORM_ID;
  const isDscSolutions = businessId === DSC_SOLUTIONS_ID;
  const isDelCampo = businessId === CUSTOM_POLLOSDCAMPO_FORM_ID;
  const isBenitoMiami =
    businessId === CUSTOM_BENIT_MIAMI_ID.branch &&
    branchId === CUSTOM_BENIT_MIAMI_ID.sucursal;
  const [customerName, setCustomerName] = useState("");
  const [requestLocation, setRequestLocation] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [originPosition, setOriginPosition] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });
  const [locationConfirmated, setLocationConfirmated] = useState(false);
  const { closestDestination, setDistanceMatrix } = useDistanceMatrix();
  const [grantingPermissions, setGrantingPermissions] = useState(false);

  function getLocation() {
    setGrantingPermissions(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        grantPositionPermission,
        denyPositionPermission
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  function denyLocation() {
    setLocationPermission(false);
  }

  function grantPositionPermission(position: any) {
    setLocationPermission(true);
    setCookie("grantedLocation", "yes", 365);
    const origin = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    setOriginPosition(origin);
    setGrantingPermissions(false);
  }

  function denyPositionPermission() {
    setLocationPermission(false);
    setGrantingPermissions(false);
    setCookie("grantedLocation", "no", 365);
  }

  const getBranchesListByPermission = () => {
    const branchesPlusBrand = business?.sucursales ?? [];
    const matrizInfo = business ? [business as Branch] : [];
    return locationPermission
      ? getBestOption()
      : branchesPlusBrand.concat(matrizInfo);
  };

  const getBestOption = () => {
    return Array.isArray(closestDestination)
      ? closestDestination
      : [closestDestination];
  };

  const handleConfirmLocation = (branch: Branch | undefined) => {
    setRequestLocation(false);
    if (!branch) return;
    setSucursalId(branch.BusinessId);
    setLocationConfirmated(true);
  };

  useEffect(() => {
    if (
      originPosition.latitude == null ||
      originPosition.longitude == null ||
      !business
    ) {
      return;
    }
    setDistanceMatrix({
      origin: originPosition,
      destinations: business?.sucursales,
    });
  }, [originPosition, business, setDistanceMatrix]);

  useEffect(() => {
    function checkFirstTime() {
      setRequestLocation(true);
    }

    if (loading === "loaded" && !locationConfirmated) {
      checkFirstTime();
    }
  }, [loading, locationConfirmated]);

  if (isSubmitted && rating !== "4" && rating !== "5" && !isDscSolutions) {
    if (isHootersForm || isGusForm || isDelCampo) {
      return (
        <HootersThanks
          businessCountry={business?.Country || "EC"}
          variant={isHootersForm ? "hooters" : isDelCampo ? "delcampo" : "gus"}
        />
      );
    } else {
      return (
        <Thanks
          businessCountry={business?.Country || "EC"}
          businessName={business?.Name || ""}
          customerName={customerName}
        />
      );
    }
  }
  if (!isQr && isSubmitted && isDscSolutions) {
    return <SimpleThanks />;
  }
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
            <>
              {!isDscSolutions ? (
                <div className="min-h-[calc(100vh-103px)]">
                  <Hero
                    business={business}
                    locationPermission={locationPermission}
                  />
                  {!customerType &&
                    (isHootersForm || isGusForm || isDelCampo ? (
                      <CustomIntro
                        business={business}
                        toogleCustomerType={toggleCustomer}
                        variant={
                          isHootersForm
                            ? "hooters"
                            : isDelCampo
                            ? "delcampo"
                            : "gus"
                        }
                      />
                    ) : (
                      <Intro
                        business={business}
                        toogleCustomerType={toggleCustomer}
                      />
                    ))}
                  {customerType &&
                    (isHootersForm ? (
                      <HootersCustomForm
                        business={business}
                        setIsSubmitted={setIsSubmitted}
                        setRating={setRating}
                        customerType={customerType}
                        branchId={sucursalId}
                        waiterId={waiterId}
                      />
                    ) : isGusForm ? (
                      <GusCustomForm
                        business={business}
                        setIsSubmitted={setIsSubmitted}
                        setRating={setRating}
                        customerType={customerType}
                      />
                    ) : isBenitoMiami ? (
                      <BenitoMiamiForm
                        business={business}
                        setIsSubmitted={setIsSubmitted}
                        setRating={setRating}
                        customerType={customerType}
                        setCustomerName={setCustomerName}
                      />
                    ) : isDelCampo ? (
                      <DelcampoCustomForm
                        business={business}
                        setIsSubmitted={setIsSubmitted}
                        setRating={setRating}
                        customerType={customerType}
                        setCustomerName={setCustomerName}
                        branchId={sucursalId}
                        waiterId={waiterId}
                      />
                    ) : (
                      <FeedbackForm
                        business={business}
                        setIsSubmitted={setIsSubmitted}
                        setRating={setRating}
                        customerType={customerType}
                        setCustomerName={setCustomerName}
                      />
                    ))}
                </div>
              ) : (
                <SimpleForm
                  business={business}
                  setIsSubmitted={setIsSubmitted}
                  setRating={setRating}
                  setIsQr={setIsQr}
                  branchId={branchId}
                  waiterId={waiterId}
                />
              )}
            </>
          )}
          <Toaster />
        </div>
        {enableGeolocation && (
          <RequestLocationDialog
            branches={getBranchesListByPermission()}
            open={requestLocation}
            getLocation={getLocation}
            denyLocation={denyLocation}
            onConfirm={handleConfirmLocation}
            grantingPermissions={grantingPermissions}
            variant={
              isHootersForm
                ? "hooters"
                : isDelCampo
                ? "delcampo"
                : isGusForm
                ? "gus"
                : undefined
            }
          />
        )}
      </Suspense>
    </APIProvider>
  );
}
