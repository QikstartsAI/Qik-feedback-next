import { CatalogDTO, CatalogModel, GetCatalogParams } from "../../domain";
import { HttpClient } from "../httpClient";

const httpClient = new HttpClient();

export const getAllCatalogs = async (
  params: GetCatalogParams
): Promise<CatalogModel[]> => {
  try {
    const catalogList = await httpClient.get("/catalog", params);
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

export const getCatalogById = async (
  catalogId: string
): Promise<CatalogModel> => {
  try {
    const catalog = await httpClient.get(`/catalog/${catalogId}`);
    return catalog as CatalogModel;
  } catch (error) {
    console.error("Error fetching catalog:", error);
    throw error;
  }
};
