import { useDistanceMatrix } from "@/app/hooks/useDistanceMatrix";
import { setCookie } from "@/app/lib/utils";
import { Branch, Business } from "@/app/types/business";

import { useEffect, useState } from "react";

const useLocation = (
  business: Business | null,
  setSucursalId: (id: string | null) => void
) => {
  const [requestLocation, setRequestLocation] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [locationConfirmated, setLocationConfirmated] = useState(false);

  const { closestDestination, setDistanceMatrix } = useDistanceMatrix();
  const [originPosition, setOriginPosition] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });

  function getLocation() {
    setLoadingPermissions(true);
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
    setLoadingPermissions(false);
  }

  function denyPositionPermission() {
    setLocationPermission(false);
    setLoadingPermissions(false);
    setCookie("grantedLocation", "no", 365);
  }

  const getBranchesList = () => {
    const branchesPlusBrand = business?.sucursales ?? [];
    const matrizInfo = business ? [business as Business] : [];
    return locationPermission
      ? getBestOption()
      : branchesPlusBrand.concat(matrizInfo);
  };

  const getBestOption = () => {
    return Array.isArray(closestDestination)
      ? closestDestination
      : [closestDestination];
  };

  const onLocationSelect = (branch: Branch | undefined) => {
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

    if (!locationConfirmated) {
      checkFirstTime();
    }
  }, [locationConfirmated]);

  return {
    requestLocation,
    denyLocation,
    getLocation,
    branches: getBranchesList(),
    onLocationSelect,
    loading: loadingPermissions,
  };
};

export { useLocation };
