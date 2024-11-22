import { HttpClient } from "@/data";
import { CatalogDTO, CatalogModel, GetCatalogParams } from '@/domain'

const httpClient = new HttpClient(
  "http://a807d22c5dcaf4392b29c14778d84f37-1961716059.us-east-1.elb.amazonaws.com/v1/api/"
);

export const getAllCatalogs = async (params: GetCatalogParams) : Promise<CatalogModel[]> => {
  try {
    const catalogList = await httpClient.get('/catalog', params);
    return catalogList as CatalogModel[];
  } catch (error) {
    console.error("Error fetching catalogs:", error);
    throw error;
  }
};

export const createCatalog = async (catalogData: CatalogDTO) => {
  try {
    const newCatalog = await httpClient.post("/catalog", catalogData);
    return newCatalog;
  } catch (error) {
    console.error("Error creating catalog:", error);
    throw error;
  }
};

export const getCatalogById = async (catalogId: string) : Promise<CatalogModel> => {
  try {
    const catalog = await httpClient.get(`/catalog/${catalogId}`);
    return catalog as CatalogModel;
  } catch (error) {
    console.error("Error fetching catalog:", error);
    throw error;
  }
};