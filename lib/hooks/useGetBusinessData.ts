"use client";

import { useEffect, useState } from "react";
import { findBusiness } from "@/lib/services/business";
import { Business } from "@/lib/types/business";
import { useSearchParams } from "next/navigation";

const useGetBusinessData = () => {
  const [loading, setLoading] = useState("loading");
  const [business, setBusiness] = useState<Business | null>(null);
  const [sucursalId, setSucursalId] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState("var(--qik)");
  const searchParams = useSearchParams();

  const businessId = searchParams.get("id");
  const branchId = searchParams.get("sucursal");
  const waiterId = searchParams.get("mesero");

  useEffect(() => {
    if (business?.BrandColor) {
      setBrandColor(business?.BrandColor);
    }
  }, [business]);
  useEffect(() => {
    if (!businessId) return;
    const fetchData = async () => {
      try {
        const res =
          (await findBusiness(businessId, sucursalId || branchId, waiterId)) ||
          null;

        setBusiness(res);
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          setLoading("loaded");
        }, 200);
      }
    };
    fetchData();
  }, [businessId, branchId, waiterId, sucursalId]);

  return {
    loading,
    business,
    businessId,
    setSucursalId,
    sucursalId,
    branchId,
    waiterId,
    brandColor,
  };
};

export default useGetBusinessData;
