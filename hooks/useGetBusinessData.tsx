"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";

import { useSearchParams } from "next/navigation";
import { findBusiness } from "../services/business";

interface BusinessDataContextType {
  loading: string;
  business: any;
  businessId: string | null;
  setSucursalId: (id: string | null) => void;
  setBusiness: (business: any) => void;
  sucursalId: string | null;
  branchId: string | null;
  waiterId: string | null;
  brandColor: string;
}

const BusinessDataContext = createContext<BusinessDataContextType | undefined>(
  undefined
);

export const BusinessDataProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<string>("loading");
  const [business, setBusiness] = useState<any>(null);
  const [sucursalId, setSucursalId] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState<string>("");

  const searchParams = useSearchParams();
  const businessId = searchParams.get("id");
  const branchId = searchParams.get("sucursal");
  const waiterId = searchParams.get("mesero");
  const isFetching = useRef(false);

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessId || isFetching.current) {
        return;
      }

      isFetching.current = true;
      setLoading("loading");

      try {
        const res = await findBusiness(
          businessId,
          sucursalId || branchId,
          waiterId
        );

        setBusiness(res);
      } catch (error) {
        console.error("Error fetching business data:", error);
        setBusiness(null);
      } finally {
        setLoading("loaded");
        isFetching.current = false;
      }
    };

    fetchBusinessData();
  }, [businessId, branchId, waiterId, sucursalId]);

  useEffect(() => {
    console.log("business?.BrandColor:::: ", business?.BrandColor);
    if (!business?.BrandColor) return;
    console.log("CURRENT:: ", brandColor);
    if (business?.BrandColor !== brandColor) {
      setBrandColor(business.BrandColor);
    }
  }, [business?.BrandColor, brandColor]);

  const value = {
    loading,
    business,
    businessId,
    setSucursalId,
    setBusiness,
    sucursalId,
    branchId,
    waiterId,
    brandColor,
  };

  return (
    <BusinessDataContext.Provider value={value}>
      {children}
    </BusinessDataContext.Provider>
  );
};

export const useBusinessData = () => {
  const context = useContext(BusinessDataContext);
  if (context === undefined) {
    throw new Error(
      "useBusinessData must be used within a BusinessDataProvider"
    );
  }
  return context;
};

export default useBusinessData;
