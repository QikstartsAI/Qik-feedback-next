import React, { useCallback, useEffect, useState } from "react";
import "@mapbox/mapbox-sdk";
import { Branch } from "../types/business";

import Matrix from "@mapbox/mapbox-sdk/services/matrix";
import { MAPBOX_API_KEY } from "@/lib/constants/general";

export const useDistanceMatrix = () => {
  const matrixService = React.useMemo(
    () => Matrix({ accessToken: MAPBOX_API_KEY || "" }),
    []
  );

  const [origin, setOrigin] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });
  const [destinations, setDestinations] = useState<Branch[]>([]);
  const [closestDestination, setClosestDestination] = useState<Branch>();
  const coordinates = destinations.map((destination) => [
    destination.Geopoint?._long,
    destination.Geopoint?._lat,
  ]);

  const setDistanceMatrix = useCallback(
    ({
      origin,
      destinations = [],
    }: {
      origin: { latitude: number | null; longitude: number | null };
      destinations?: Branch[];
    }) => {
      setOrigin(origin);
      setDestinations(destinations);
    },
    []
  );

  const getDistanceMatrix = useCallback(async () => {
    try {
      if (origin.latitude === null || origin.longitude === null) {
        return;
      }
      coordinates.unshift([origin.longitude, origin.latitude]);

      const points = coordinates.map((coordinate) => ({
        coordinates: coordinate as [number, number],
      }));

      if (!matrixService) {
        console.error("Matrix service not initialized");
        return;
      }

      const destinationsPoints = points
        .map((_, index) => index)
        .filter((index) => index !== 0);

      const response = await matrixService
        .getMatrix({
          points: points,
          sources: [0],
          destinations: destinationsPoints,
          profile: "driving",
          annotations: ["distance", "duration"],
        })
        .send();

      if (response.statusCode !== 200) {
        return;
      }

      if (response.body.code === "NoRoute") {
        console.error(
          "There is origin but for the distance routes were not found."
        );
        return;
      }
      const distances = response.body.distances;
      if (distances) {
        const minDistance: number = Math.min(...distances[0]);
        setClosestDestination(destinations[distances[0].indexOf(minDistance)]);
      } else {
        console.error("There is an error with distances in the response.");
        return;
      }
    } catch (err) {
      console.error("Error fetching data to the API: ", err);
    }
  }, [
    coordinates,
    destinations,
    origin.latitude,
    origin.longitude,
    matrixService,
  ]);

  useEffect(() => {
    if (
      origin.latitude == null ||
      origin.longitude == null ||
      destinations.length === 0
    ) {
      return;
    }
    getDistanceMatrix();
  }, [origin, destinations, coordinates, getDistanceMatrix]);

  return { closestDestination, setDistanceMatrix };
};
