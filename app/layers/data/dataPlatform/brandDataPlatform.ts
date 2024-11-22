import { HttpClient } from "@/data";
import { BrandDTO, BrandModel, GetBrandParams } from '@/domain'

const httpClient = new HttpClient(
  "http://a807d22c5dcaf4392b29c14778d84f37-1961716059.us-east-1.elb.amazonaws.com/v1/api/"
);

export const getAllBrands = async (params: GetBrandParams) : Promise<BrandModel[]> => {
  try {
    const brandList = await httpClient.get('/brand', params);
    return brandList as BrandModel[];
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const createBrand = async (brandData: BrandDTO) => {
  try {
    const newBrand = await httpClient.post("/brand", brandData);
    return newBrand;
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error;
  }
};

export const getBrandById = async (brandId: string) : Promise<BrandModel> => {
  try {
    const brand = await httpClient.get(`/brand/${brandId}`);
    return brand as BrandModel;
  } catch (error) {
    console.error("Error fetching brand:", error);
    throw error;
  }
};