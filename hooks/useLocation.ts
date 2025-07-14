import { useState, useCallback, useEffect } from "react";
import { Branch } from "@/lib/domain/entities";
import { useDistanceMatrix } from "./useDistanceMatrix";

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<
    boolean | null
  >(null);

  const { closestDestination, setDistanceMatrix } = useDistanceMatrix();

  const getCurrentLocation = useCallback(async (): Promise<{
    latitude: number | null;
    longitude: number | null;
  }> => {
    setIsLoadingLocation(true);
    setLocationError(null);

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by this browser");
        setIsLoadingLocation(false);
        resolve({ latitude: null, longitude: null });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { latitude, longitude };
          setUserLocation(location);
          setHasLocationPermission(true);
          setIsLoadingLocation(false);
          resolve(location);
        },
        (error) => {
          let errorMessage = "Unable to retrieve your location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied";
              setHasLocationPermission(false);
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
            default:
              errorMessage = "An unknown error occurred";
              break;
          }

          setLocationError(errorMessage);
          setIsLoadingLocation(false);
          resolve({ latitude: null, longitude: null });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }, []);

  const findNearestBranch = useCallback(
    async (branches: Branch[]): Promise<Branch | null> => {
      if (branches.length === 0) return null;

      // If we don't have user location, return the first branch as fallback
      if (!userLocation.latitude || !userLocation.longitude) {
        return branches[0];
      }

      // Set up distance matrix calculation
      setDistanceMatrix({
        origin: userLocation,
        destinations: branches,
      });

      // Return the closest destination when it's calculated
      return closestDestination || branches[0];
    },
    [userLocation, closestDestination, setDistanceMatrix]
  );

  const requestLocationPermission = useCallback(async () => {
    const location = await getCurrentLocation();
    return location.latitude !== null && location.longitude !== null;
  }, [getCurrentLocation]);

  // Clear location data
  const clearLocation = useCallback(() => {
    setUserLocation({ latitude: null, longitude: null });
    setLocationError(null);
    setHasLocationPermission(null);
  }, []);

  return {
    userLocation,
    isLoadingLocation,
    locationError,
    hasLocationPermission,
    getCurrentLocation,
    findNearestBranch,
    requestLocationPermission,
    clearLocation,
    closestDestination,
  };
};
