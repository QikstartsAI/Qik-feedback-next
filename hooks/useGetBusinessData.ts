"use client";

import { useEffect, useState } from "react";
import { Brand } from "../lib/domain/entities";
import { useSearchParams } from "next/navigation";
import { useBrand } from "./useBrand";

function useGetBrandData() {
  const [loading, setLoading] = useState("loading");
  const [brand, setBrand] = useState<Brand | null>(null);
  const [sucursalId, setSucursalId] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState("var(--qik)");
  const searchParams = useSearchParams();
  const { getBrandById } = useBrand();

  const brandId = searchParams.get("id");
  const branchId = searchParams.get("branch");
  const waiterId = searchParams.get("waiter");

  useEffect(() => {
    if (brand?.payload?.logoImgURL) {
      // Set brand color based on brand data if available
      setBrandColor("var(--qik)");
    }
  }, [brand]);

  useEffect(() => {
    if (!brandId) return;
    const fetchData = async () => {
      setLoading("requesting");
      try {
        const res = await getBrandById(brandId);
        setBrand(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading("loaded");
      }
    };
    fetchData();
  }, [brandId, getBrandById]);

  return {
    loading,
    brand: brand,
    brandId: brandId,
    setSucursalId,
    sucursalId,
    branchId,
    waiterId,
    brandColor,
  };
}

export default useGetBrandData;
