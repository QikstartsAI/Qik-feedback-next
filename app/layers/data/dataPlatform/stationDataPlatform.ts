import { HttpClient } from "@/data";
import { StationDTO, StationModel, GetStationParams } from '@/domain'

const httpClient = new HttpClient(
  "http://a807d22c5dcaf4392b29c14778d84f37-1961716059.us-east-1.elb.amazonaws.com/v1/api/"
);

export const getAllStations = async (params: GetStationParams) : Promise<StationModel[]> => {
  try {
    const stationList = await httpClient.get('/station', params);
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

export const getStationById = async (stationId: string) : Promise<StationModel> => {
  try {
    const station = await httpClient.get(`/station/${stationId}`);
    return station as StationModel;
  } catch (error) {
    console.error("Error fetching station:", error);
    throw error;
  }
};