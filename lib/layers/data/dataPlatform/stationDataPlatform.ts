import { GetStationParams, StationDTO, StationModel } from "../../domain";
import { HttpClient } from "../httpClient";

const httpClient = new HttpClient();

export const getAllStations = async (
  params: GetStationParams
): Promise<StationModel[]> => {
  try {
    const stationList = await httpClient.get("/station", params);
    return stationList as StationModel[];
  } catch (error) {
    console.error("Error fetching stations:", error);
    throw error;
  }
};

export const createStation = async (stationData: StationDTO) => {
  try {
    const newStation = await httpClient.post("/station", stationData);
    return newStation;
  } catch (error) {
    console.error("Error creating station:", error);
    throw error;
  }
};

export const getStationById = async (
  stationId: string
): Promise<StationModel> => {
  try {
    const station = await httpClient.get(`/station/${stationId}`);
    return station as StationModel;
  } catch (error) {
    console.error("Error fetching station:", error);
    throw error;
  }
};
