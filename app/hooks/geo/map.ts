"use client";
import { haversine } from "@/app/utils/map";
import { useEffect, useState, useMemo } from "react";
import { useGetCurrentBusinessSucursalesImmutable } from "../services/businesses";
import { useGetCurrentPosition } from "./position";

interface useGetDistancesFromSucursalesProps {
  currentPosition?: Position;
  sucursales?: BusinessSucursalI[];
}

export const useGetDistancesFromSucursales = ({
  currentPosition,
  sucursales,
}: useGetDistancesFromSucursalesProps) => {
  const calculateDistances = () => {
    if (!currentPosition || !sucursales) return;
    const position = currentPosition;
    const distances = sucursales?.map((item) => {
      const distance = haversine(
        position?.latitude as number,
        position?.longitude as number,
        item?.Coordinates?.latitude as number,
        item?.Coordinates?.longitude as number
      );
      return distance;
    });
    return distances;
  };

  const distances = useMemo(() => {
    return calculateDistances();
  }, [currentPosition, sucursales]);

  return {
    distances,
  };
};

export const useGetNearestSucursal = ({
  currentPosition,
  sucursales,
}: useGetDistancesFromSucursalesProps) => {
  const [sucursal, setSucursal] = useState<null | BusinessSucursalI>(null);
  const { distances } = useGetDistancesFromSucursales({
    currentPosition,
    sucursales,
  });

  useEffect(() => {
    if (!distances) return;
    const minDistance = Math.min(...distances);
    const index = distances.indexOf(minDistance);
    const sucursal = sucursales?.[index];
    setSucursal(sucursal ?? null);
  }, [distances]);

  return {
    sucursal,
    distances,
  };
};

export const useGetCurrentNearestSucursal = ({
  currentPosition,
}: {
  currentPosition: Position;
}) => {
  const { data: sucursales } = useGetCurrentBusinessSucursalesImmutable();
  const { sucursal, distances } = useGetNearestSucursal({
    currentPosition,
    sucursales,
  });
  return {
    sucursales,
    sucursal,
    distances,
  };
};

export const useGetCurrentSucursalOfCurrentPosition = ({
  enabled = false,
}: {
  enabled: boolean;
}) => {
  const { position } = useGetCurrentPosition({ enabled });
  const { sucursal, sucursales, distances } = useGetCurrentNearestSucursal({
    currentPosition: position,
  });
  return {
    position,
    sucursal,
    sucursales,
    distances,
  };
};
