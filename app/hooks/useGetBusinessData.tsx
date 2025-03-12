"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { findBusiness } from "@/app/services/business";
import { Business } from "@/app/types/business";
import { useSearchParams } from "next/navigation";

interface BusinessDataContextProps {
  loading: string;
  business: Business | null;
  businessId: string | null;
  setSucursalId: (id: string | null) => void;
  sucursalId: string | null;
  branchId: string | null;
  waiterId: string | null;
}

const BusinessDataContext = createContext<BusinessDataContextProps | undefined>(
  undefined
);

export const BusinessDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState("loading");
  const [business, setBusiness] = useState<Business | null>(null);
  const [sucursalId, setSucursalId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const businessId = searchParams.get("id");
  const branchId = searchParams.get("sucursal");
  const waiterId = searchParams.get("mesero");

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

  return (
    <BusinessDataContext.Provider
      value={{
        loading,
        business,
        businessId,
        setSucursalId,
        sucursalId,
        branchId,
        waiterId,
      }}
    >
      {children}
    </BusinessDataContext.Provider>
  );
};

export const useGetBusinessData = (): BusinessDataContextProps => {
  const context = useContext(BusinessDataContext);
  if (!context) {
    throw new Error(
      "useBusinessData must be used within a BusinessDataProvider"
    );
  }
  return context;
};
