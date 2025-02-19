import { Country } from "@/app/types/business";

export interface BranchDTO {
  id: string;
  brand: string;
  owner: string;
  payload?: {
    address: string;
    country: Country;
    cover: string;
    icon: string;
    iconoWhite: string;
    mapsUrl: string;
    name: string;
  };
}

export interface BrandDTO {
  id: string;
  logo: string;
  owner: string;
  payload?: {
    address: string;
    country: Country;
    cover: string;
    iconoWhite: string;
    mapsUrl: string;
    name: string;
    pricePlan: number;
  };
}

export interface BizDTO {
  Address: string | null;
  BusinessId: string | null;
  Country: Country | null;
  Cover: string | null;
  Icono: string | null;
  IconoWhite: string | null;
  MapsUrl: string | null;
  Name: string | null;
  PricePlan: number | null;
  sucursales: [] | null;
}

export interface CatalogDTO {
  id: string;
  category: string;
  key: string;
  name: string;
  parent: string;
  payload?: object;
}

export interface CustomerDTO {
  id: string;
  email: string;
  customerType: string;
  origin: string;
  payload?: object;
}

export interface FeedbackDTO {
  id: string;
  reference: {
    branch: string;
    brand: string;
    customer: string;
    owner: string;
    station: string;
  };
  type: {
    key: string;
    type: string;
  };
  payload?: object;
}

export interface SetValueDTO {
  id: string;
  value: string;
}

export interface StationDTO {
  id: string;
  branch: string;
  brand: string;
  category: string;
  payload?: object;
}