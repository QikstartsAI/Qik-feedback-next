export interface BranchModel {
  id: string;
  brand: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  payload: object;
}

export interface BrandModel {
  id: string;
  logo: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  payload: object;
}

export interface CatalogModel {
  id: string;
  category: string;
  key: string;
  name: string;
  parent: string;
  createdAt: Date;
  updatedAt: Date;
  payload: object;
}

export interface CustomerModel {
  id: string;
  email: string;
  customerType: string;
  origin: string;
  createdAt: Date;
  updatedAt: Date;
  payload: object;
}

export interface FeedbackModel {
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
  createdAt: Date;
  updatedAt: Date;
  payload: object;
}

export interface StationModel {
  id: string;
  branch: string;
  brand: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  payload: object;
}
