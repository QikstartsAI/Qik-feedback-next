import { useBrandContext } from "../contexts/brandContext";

export const useBrand = (brandId: string) => {
  const { brand, loading, error } = useBrandContext(brandId);

  return { brand, loading, error };
};
