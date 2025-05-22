export interface GetBranchParams {
  brand?: string;
  owner?: string;
  page?: number;
  pageSize?: number;
}

export interface GetBrandParams {
  name?: string;
  owner?: string;
  page?: number;
  pageSize?: number;
}

export interface GetCatalogParams {
  category?: string;
  parent?: string;
  query?: string;
}

export interface GetCustomerParams {
  customerType?: string;
  origin?: string;
  page?: number;
  pageSize?: number;
}

export interface GetFeedbackParams {
  branch?: string;
  brand?: string;
  customer?: string;
  owner?: string;
  page?: number;
  pageSize?: number;
  station?: string;
  type?: string;
}

export interface GetStationParams {
  branch?: string;
  category?: string;
  query?: string;
}