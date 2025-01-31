export interface BranchDTO {
  id: string;
  brand: string;
  owner: string;
  payload?: {
    address: string;
    country: string;
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
    country: string;
    cover: string;
    iconoWhite: string;
    mapsUrl: string;
    name: string;
    pricePlan: number;
  };
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

export interface StationDTO {
  id: string;
  branch: string;
  brand: string;
  category: string;
  payload?: object;
}
