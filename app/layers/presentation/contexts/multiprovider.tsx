import React, { ReactNode } from "react";
import { BrandProvider } from "./brandContext";
import { BranchProvider } from "./branchContext";

const MultiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <BrandProvider>
      <BranchProvider>
      {children}
      </BranchProvider>
    </BrandProvider>
  );
};

export default MultiProvider;
