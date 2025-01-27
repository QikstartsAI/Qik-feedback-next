import React, { ReactNode } from "react";
import { BrandProvider } from "./brandContext";

const MultiProvider = ({ children }: { children: ReactNode }) => {
  return <BrandProvider>{children}</BrandProvider>;
};

export default MultiProvider;
