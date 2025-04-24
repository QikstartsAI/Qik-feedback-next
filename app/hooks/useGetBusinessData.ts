"use client";

import { useEffect, useState } from "react";
import { findBusiness } from "@/app/services/business";
import { Business } from "@/app/types/business";
import { useSearchParams } from "next/navigation";
import { getBusinessCustomers } from "../lib/getBusinessCustomers";

function useGetBusinessData() {
  const [loading, setLoading] = useState("loading");
  const [business, setBusiness] = useState<Business | null>(null);
  const [sucursalId, setSucursalId] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState("var(--qik)");
  const searchParams = useSearchParams();

  const businessId = searchParams.get("id");
  const branchId = searchParams.get("sucursal");
  const waiterId = searchParams.get("mesero");

  // useEffect(() => {
  //   console.log("BUSINESS:", businessId);
  //   const fetchBusinessCustomers = async () => {
  //     if (businessId) {
  //       const customers = await getBusinessCustomers(businessId, true);
  //       console.log("Customers", customers);
  //     }
  //   };
  //   fetchBusinessCustomers();
  // }, [businessId]);

  useEffect(() => {
    if (business?.BrandColor) {
      setBrandColor(business?.BrandColor);
    }
  }, [business]);
  useEffect(() => {
    if (!businessId) return;
    const fetchData = async () => {
      setLoading("requesting");
      try {
        const res =
          (await findBusiness(businessId, sucursalId || branchId, waiterId)) ||
          null;

        setBusiness(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading("loaded");
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
}

export default useGetBusinessData;
