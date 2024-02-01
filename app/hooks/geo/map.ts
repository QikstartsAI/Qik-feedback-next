"use client";
import { haversine } from "@/app/utils/map";
import { useEffect, useState, useMemo } from "react";
import {
  useGetBusinessSucursalesImmutable,
  useGetCurrentBusinessByIdImmutable,
  useGetCurrentBusinessSucursalesImmutable,
} from "@/app/hooks/services/businesses";
import { useGetCurrentPosition } from "./position";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface useGetDistancesFromSucursalesProps {
  currentPosition?: Position;
  sucursales?: BusinessSucursalI[];
  distanceLimit?: number;
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
  distanceLimit = 0.05, // km
}: useGetDistancesFromSucursalesProps) => {
  const [sucursal, setSucursal] = useState<null | BusinessSucursalI>(null);
  const { distances } = useGetDistancesFromSucursales({
    currentPosition,
    sucursales,
  });

  useEffect(() => {
    if (!distances) return;

    const minDistance = Math.min(...distances);
    if (minDistance > distanceLimit) return;

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

export const useGetNearestSucursalOrBusiness = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sucursalId = searchParams;

  const { data: business } = useGetCurrentBusinessByIdImmutable();
  // const{ data: sucursalFromId } = useGetCurrent
  const businessId = !!business?.QRGeolocationIsActive ? business?.id : null;

  const { data: sucursales } = useGetBusinessSucursalesImmutable({
    businessId,
  });

  const { position } = useGetCurrentPosition({
    enabled: !!business?.QRGeolocationIsActive,
  });

  const { sucursal } = useGetNearestSucursal({
    currentPosition: position,
    sucursales,
    distanceLimit: 0.05,
  });

  useEffect(() => {
    if (!sucursal) return;
    if (!!sucursal) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set("sucursal", sucursal.id);
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`);
    }
  }, [sucursal]);

  return {
    sucursal,
    business,
    position,
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
