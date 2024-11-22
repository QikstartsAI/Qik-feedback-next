import { HttpClient } from "@/data";
import { BranchDTO, BranchModel, GetBranchParams } from '@/domain'

const httpClient = new HttpClient(
  "http://a807d22c5dcaf4392b29c14778d84f37-1961716059.us-east-1.elb.amazonaws.com/v1/api/"
);

export const getAllBranch = async (params: GetBranchParams) : Promise<BranchModel[]> => {
  try {
    const branchList = await httpClient.get('/branch', params);
    return branchList as BranchModel[];
  } catch (error) {
    console.error("Error fetching branch:", error);
    throw error;
  }
};

export const createBranch = async (branchData: BranchDTO) => {
  try {
    const newBranch = await httpClient.post("/branch", branchData);
    return newBranch;
  } catch (error) {
    console.error("Error creating branch:", error);
    throw error;
  }
};

export const getBranchById = async (branchId: string) : Promise<BranchModel> => {
  try {
    const branch = await httpClient.get(`/branch/${branchId}`);
    return branch as BranchModel;
  } catch (error) {
    console.error("Error fetching branch:", error);
    throw error;
  }
};