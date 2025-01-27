import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { BrandModel } from "@/domain";
import { getBrandById } from "../../data/dataPlatform/brandDataPlatform";

interface BrandContextProps {
  brand: BrandModel | null;
  loading: boolean;
  error: string | null;
  fetchBrand: (brandId: string) => Promise<void>;
}

const BrandContext = createContext<BrandContextProps | undefined>(undefined);

export const BrandProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [brand, setBrand] = useState<BrandModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrand = async (brandId: string) => {
    setLoading(true);
    try {
      const fetchedBrand = await getBrandById(brandId);
      setBrand(fetchedBrand);
      setError(null);
    } catch (err) {
      setError("Error fetching brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrandContext.Provider value={{ brand, loading, error, fetchBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrandContext = (brandId: string) => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error("useBrand must be used within a BrandProvider");
  }

  const { brand, loading, error, fetchBrand } = context;

  useEffect(() => {
    if (brandId) {
      fetchBrand(brandId);
    }
  }, [brandId, fetchBrand]);

  return { brand, loading, error };
};
