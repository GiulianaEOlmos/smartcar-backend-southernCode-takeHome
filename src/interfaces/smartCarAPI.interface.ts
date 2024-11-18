import { SmartCarStatus } from "../enums/index.enum";

export interface SmartCarVehicleInfoResponse {
  vin: string;
  color: string;
  doorCount: number;
  driveTrain: string;
}

export interface SmartCarDoorsResponse {
  location: string;
  locked: boolean;
}

export interface SmartCarEnergyResponse {
  percent: number;
}

export interface SmartCarEngineResponse {
  status: SmartCarStatus;
}
