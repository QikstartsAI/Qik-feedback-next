import { BranchDTO, BranchModel, GetBranchParams } from "../../domain";
import { HttpClient } from "../httpClient";

const httpClient = new HttpClient();

export const getAllBranch = async (
  params: GetBranchParams
): Promise<BranchModel[]> => {
  try {
    const branchList = await httpClient.get("/branch", params);
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

export const getBranchById = async (branchId: string): Promise<BranchModel> => {
  try {
    const branch = await httpClient.get(`/branch/${branchId}`);
    console.log("branch:", branch);
    return branch as BranchModel;
  } catch (error) {
    console.error("Error fetching branch:", error);
    throw error;
  }
};
