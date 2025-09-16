"use client";

import { useState, useEffect } from "react";
import { Branch, Business } from "@/lib/domain/entities";

interface OriginPosition {
  latitude: number | null;
  longitude: number | null;
}

export function useGeolocationBasic(businessId: string | null = null, business: Business | null = null) {
  const [locationPermission, setLocationPermission] = useState(false);
  const [originPosition, setOriginPosition] = useState<OriginPosition>({ 
    latitude: null, 
    longitude: null 
  });
  const [closestDestination, setClosestDestination] = useState<Branch | null>(null);
  const [requestLocation, setRequestLocation] = useState(false);
  const [grantingPermissions, setGrantingPermissions] = useState(false);
  const [distanceLoading, setDistanceLoading] = useState(false);

  // Check if geolocation is enabled for this business
  const enableGeolocation = businessId ? [
    'hooters',
    'yogurt-amazonas',
    'pollos-del-campo',
    'cebiches-ruminahui',
    'inka-burger',
    'piqueos-moritos',
  ].includes(businessId) : false;

  // Check if user has previously granted location permission
  useEffect(() => {
    if (typeof window !== "undefined") {
      const grantedLocation = document.cookie
        .split('; ')
        .find(row => row.startsWith('grantedLocation='))
        ?.split('=')[1];
      
      if (grantedLocation === "yes") {
        setLocationPermission(true);
      }
    }
  }, []);

  const setCookie = (name: string, value: string, days: number) => {
    if (typeof window !== "undefined") {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
  };

  const grantPositionPermission = (position: GeolocationPosition) => {
    setLocationPermission(true);
    setOriginPosition({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    setGrantingPermissions(false);
    setCookie("grantedLocation", "yes", 365);
  };

  const denyPositionPermission = () => {
    setLocationPermission(false);
    setGrantingPermissions(false);
    setCookie("grantedLocation", "no", 365);
  };

  const getLocation = () => {
    setGrantingPermissions(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        grantPositionPermission,
        denyPositionPermission,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      denyPositionPermission();
    }
  };

  const getBranchesListByPermission = () => {
    if (!business?.sucursales) return [];
    
    const branchesPlusBrand = business.sucursales ?? [];
    
    return locationPermission && closestDestination
      ? [closestDestination] // Solo sucursal más cercana
      : branchesPlusBrand; // Todas las sucursales
  };

  return {
    // State
    locationPermission,
    originPosition,
    closestDestination,
    requestLocation,
    grantingPermissions,
    distanceLoading,
    
    // Computed
    enableGeolocation,
    availableBranches: getBranchesListByPermission(),
    
    // Actions
    getLocation,
    setRequestLocation,
    grantPositionPermission,
    denyPositionPermission,
  };
}
