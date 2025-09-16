"use client";

import { useState, useEffect } from "react";
import { MAPBOX_API_KEY } from "@/app/constants/general";
import { Branch } from "@/lib/domain/entities";

interface OriginPosition {
  latitude: number;
  longitude: number;
}

interface DistanceMatrixParams {
  origin: OriginPosition;
  destinations: Branch[];
}

interface DistanceMatrixResult {
  closestDestination: Branch | null;
  loading: boolean;
  error: string | null;
}

export function useDistanceMatrix() {
  const [distanceMatrixParams, setDistanceMatrixParams] = useState<DistanceMatrixParams | null>(null);
  const [closestDestination, setClosestDestination] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!distanceMatrixParams || !MAPBOX_API_KEY || MAPBOX_API_KEY === 'undefined') {
      return;
    }

    const calculateDistances = async () => {
      setLoading(true);
      setError(null);

      try {
        const { origin, destinations } = distanceMatrixParams;

        // Prepare points for Mapbox Matrix API
        const originPoint = `${origin.longitude},${origin.latitude}`;
        const destinationPoints = destinations
          .map((branch) => {
            // Use Geopoint if available, otherwise use location.geopoint
            const geopoint = branch.Geopoint || branch.payload.location.geopoint;
            return `${geopoint.lon || geopoint.longitude},${geopoint.lat || geopoint.latitude}`;
          })
          .join(";");

        const points = `${originPoint};${destinationPoints}`;
        const destinationsPoints = Array.from({ length: destinations.length }, (_, i) => i + 1);

        // Call Mapbox Matrix API
        const response = await fetch(
          `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${points}?sources=0&destinations=${destinationsPoints.join(";")}&annotations=distance,duration&access_token=${MAPBOX_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Mapbox API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.code === "NoRoute") {
          console.error("There is origin but for the distance routes were not found.");
          setError("No se pudieron calcular las rutas");
          return;
        }

        if (data.distances && data.distances[0]) {
          const distances = data.distances[0];
          const minDistance = Math.min(...distances);
          const closestIndex = distances.indexOf(minDistance);
          setClosestDestination(destinations[closestIndex]);
        }
      } catch (err) {
        console.error("Error calculating distances:", err);
        setError(err instanceof Error ? err.message : "Error al calcular distancias");
      } finally {
        setLoading(false);
      }
    };

    calculateDistances();
  }, [distanceMatrixParams]);

  const setDistanceMatrix = (params: DistanceMatrixParams) => {
    setDistanceMatrixParams(params);
  };

  return {
    closestDestination,
    loading,
    error,
    setDistanceMatrix,
  };
}