"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { BranchModel } from "@/domain";
import { getBranchById } from "@/app/layers/data/dataPlatform/branchDataPlatform";

interface BranchContextProps {
  branch: BranchModel | null;
  loading: boolean;
  error: string | null;
  fetchBranch: (branchId: string) => Promise<void>;
}

const BranchContext = createContext<BranchContextProps | undefined>(undefined);

export const BranchProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [branch, setBranch] = useState<BranchModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranch = async (branchId: string) => {
    setLoading(true);
    try {
      const fetchedBranch = await getBranchById(branchId);
      setBranch(fetchedBranch);
      setError(null);
    } catch (err) {
      setError("Error fetching branch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BranchContext.Provider value={{ branch, loading, error, fetchBranch }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranchContext = (branchId: string) => {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider");
  }

  const { branch, loading, error, fetchBranch } = context;

  useEffect(() => {
    if (branchId) {
      fetchBranch(branchId);
    }
  }, [branchId]);

  return { branch, loading, error };
};
