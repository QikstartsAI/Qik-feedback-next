"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";

import { useSearchParams } from "next/navigation";
import { Brand } from "../lib/domain/entities";
import { useBrand } from "./useBrand";

interface BrandDataContextType {
  loading: string;
  brand: Brand | null;
  brandId: string | null;
  setSucursalId: (id: string | null) => void;
  setBrand: (brand: Brand | null) => void;
  sucursalId: string | null;
  branchId: string | null;
  waiterId: string | null;
  brandColor: string;
}

const BrandDataContext = createContext<BrandDataContextType | undefined>(
  undefined
);

export const BrandDataProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<string>("loading");
  const [brand, setBrand] = useState<Brand | null>(null);
  const [sucursalId, setSucursalId] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState<string>("var(--qik)");
  const { getBrandById } = useBrand();

  const searchParams = useSearchParams();
  const brandId = searchParams.get("id");
  const branchId = searchParams.get("sucursal");
  const waiterId = searchParams.get("mesero");
  const isFetching = useRef(false);

  useEffect(() => {
    const fetchBrandData = async () => {
      if (!brandId || isFetching.current) {
        return;
      }

      isFetching.current = true;
      setLoading("loading");

      try {
        const res = await getBrandById(brandId);
        setBrand(res);
      } catch (error) {
        console.error("Error fetching brand data:", error);
        setBrand(null);
      } finally {
        setLoading("loaded");
        isFetching.current = false;
      }
    };

    fetchBrandData();
  }, [brandId, getBrandById]);

  useEffect(() => {
    if (brand?.payload?.logoImgURL) {
      // Set brand color based on brand data if available
      setBrandColor("var(--qik)");
    }
  }, [brand]);

  const value = {
    loading,
    brand,
    brandId,
    setSucursalId,
    setBrand,
    sucursalId,
    branchId,
    waiterId,
    brandColor,
  };

  return (
    <BrandDataContext.Provider value={value}>
      {children}
    </BrandDataContext.Provider>
  );
};

export const useBrandData = () => {
  const context = useContext(BrandDataContext);
  if (context === undefined) {
    throw new Error("useBrandData must be used within a BrandDataProvider");
  }
  return context;
};

export default useBrandData;
