import {
  GMVehicleInfoResponse,
  GMSecurityResponse,
  GMEnergyResponse,
  GMEngineResponse,
} from "../interfaces/gmAPI.interface";
import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import { EngineCommand } from "../enums/index.enum";

dotenv.config();

const URL_BASE = process.env.GM_API_URL || "http://gmapi.azurewebsites.net";

if (!URL_BASE) {
  throw new Error("GM API URL is required");
}

export const fetchVehicleInfo = async (
  id: string
): Promise<GMVehicleInfoResponse> => {
  const response: AxiosResponse<GMVehicleInfoResponse> = await axios.post(
    `${URL_BASE}/getVehicleInfoService`,
    {
      id,
      responseType: "JSON",
    }
  );

  if (response.data.status !== "200") {
    throw new Error("Error fetching vehicle info from GM API");
  }

  return response.data;
};

export const fetchSecurityStatus = async (
  id: string
): Promise<GMSecurityResponse> => {
  const response: AxiosResponse<GMSecurityResponse> = await axios.post(
    `${URL_BASE}/getSecurityStatusService`,
    {
      id,
      responseType: "JSON",
    }
  );

  if (response.data.status !== "200") {
    throw new Error("Error fetching security status from GM API");
  }

  return response.data;
};

export const fetchEnergyData = async (
  id: string
): Promise<GMEnergyResponse> => {
  const response: AxiosResponse<GMEnergyResponse> = await axios.post(
    `${URL_BASE}/getEnergyService`,
    {
      id,
      responseType: "JSON",
    }
  );

  if (response.data.status !== "200") {
    throw new Error("Error fetching energy data from GM API");
  }

  return response.data;
};

export const controlEngine = async (
  id: string,
  command: EngineCommand
): Promise<GMEngineResponse> => {
  const response: AxiosResponse<GMEngineResponse> = await axios.post(
    `${URL_BASE}/actionEngineService`,
    {
      id,
      command,
      responseType: "JSON",
    }
  );

  if (response.data.status !== "200") {
    throw new Error("Error controlling the engine via GM API");
  }

  return response.data;
};
