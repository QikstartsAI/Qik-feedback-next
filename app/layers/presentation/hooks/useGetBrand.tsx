"use client";

import { useSearchParams } from "next/navigation";
import { useBrandContext } from "../contexts/brandContext";
import { useBranchContext } from "../contexts/branchContext";
import { useState } from "react";
import { BizDTO } from "../../domain";

const useGetBrand = () => {
  const [sucursalId, setSucursalId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const brandId = searchParams.get("id");
  const branchId = searchParams.get("sucursal");
  const waiterId = searchParams.get("mesero");

  const biz: BizDTO = {
    Address: null,
    BusinessId: null,
    Country: null,
    Cover: null,
    Icono: null,
    IconoWhite: null,
    MapsUrl: null,
    Name: null,
    PricePlan: null,
    sucursales: [],
  }

  if (brandId === null) {
    return { errors: ["Brand ID is missing from query parameters"] };
  }
  
  const { brand, loading: brandLoading, error: brandError } = useBrandContext(brandId);
  
  let loading = brandLoading;
  let errors = [brandError];
  
  if (brand !== null) {
    biz.Address = brand.payload.address;
    biz.BusinessId = brand.id;
    biz.Country = brand.payload.country;
    biz.Cover = brand.payload.cover;
    biz.IconoWhite = brand.payload.iconoWhite;
    biz.MapsUrl = brand.payload.mapsUrl;
    biz.Name = brand.payload.name;
    biz.PricePlan = brand.payload.pricePlan;
  }

  // si branchid no es null, traer la sucursal como BizDTO, de otra manera traer brand como BizDTO
  if (branchId !== null) {
    const { branch, loading: branchLoading, error: branchError } = useBranchContext(sucursalId || branchId);
    loading = loading || branchLoading;
    errors = [...errors, branchError];
    if (branch) {
      biz.Address = branch.payload.address;
      biz.BusinessId = branch.id;
      biz.Country = branch.payload.country;
      biz.Cover = branch.payload.cover;
      biz.Icono = branch.payload.icon;
      biz.IconoWhite = branch.payload.iconoWhite;
      biz.MapsUrl = branch.payload.mapsUrl;
      biz.Name = branch.payload.name;
    }
  }

  return {
    brand: biz,
    brandId,
    branchId,
    waiterId,
    sucursalId,
    setSucursalId,
    loading,
    errors: errors.filter((error) => error !== null),
  };
};

export default useGetBrand;
