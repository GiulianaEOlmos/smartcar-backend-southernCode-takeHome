import { ActionStatus } from "../enums/index.enum";

export interface GMVehicleInfoResponse {
  service: string;
  status: string;
  data: {
    vin: { type: string; value: string };
    color: { type: string; value: string };
    fourDoorSedan: { type: string; value: string };
    twoDoorCoupe: { type: string; value: string };
    driveTrain: { type: string; value: string };
  };
}

export interface GMSecurityResponse {
  service: string;
  status: string;
  data: {
    doors: {
      type: string;
      values: Array<{
        location: { type: string; value: string };
        locked: { type: string; value: string };
      }>;
    };
  };
}

export interface GMEnergyResponse {
  service: string;
  status: string;
  data: {
    tankLevel: { type: string; value: string | null };
    batteryLevel: { type: string; value: string | null };
  };
}

export interface GMEngineResponse {
  service: string;
  status: string;
  actionResult: {
    status: ActionStatus;
  };
}
