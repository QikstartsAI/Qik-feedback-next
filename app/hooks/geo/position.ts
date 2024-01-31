"use client";
import { useEffect, useState } from "react";

interface useGetCurrentPositionProps {
  enabled?: boolean;
}

export const useGetCurrentPosition = ({
  enabled = false,
}: useGetCurrentPositionProps = {}) => {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  const [permissions, setPermissions] = useState<PermissionStatus | null>(null);

  const [position, setPosition] = useState<Position>({
    latitude: null,
    longitude: null,
  });

  function success(pos: GeolocationPosition) {
    setPosition({
      latitude: pos?.coords?.latitude,
      longitude: pos?.coords?.longitude,
    });
  }

  function errors(err: any) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {
    if (!enabled || !navigator) {
      console.warn("geolocation disabled");
      return;
    }
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          setPermissions(result);
          if (result.state === "granted") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "prompt") {
            //If prompt then the user will be asked to give permission
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [enabled]);

  return {
    permissions,
    position,
  };
};
