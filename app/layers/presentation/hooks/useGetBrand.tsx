"use client";

import { useSearchParams } from "next/navigation";
import { useBrandContext } from "../contexts/brandContext";
import { useState } from "react";
import { Business } from "@/app/types/business";

const useGetBrand = () => {
  const [sucursalId, setSucursalId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const brandId = searchParams.get("id");
  const branchId = searchParams.get("sucursal");
  const waiterId = searchParams.get("mesero");

  if (brandId === null) {
    return { error: "Brand ID is missing from query parameters" };
  }

  const { brand, loading, error } = useBrandContext(brandId);
  return {
    brand: brand?.payload || null,
    brandId,
    branchId,
    waiterId,
    sucursalId,
    setSucursalId,
    loading,
    error,
  };
};

export default useGetBrand;
