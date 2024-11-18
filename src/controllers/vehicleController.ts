import { Request, Response } from "express";
import {
  GMEnergyResponse,
  GMSecurityResponse,
  GMVehicleInfoResponse,
} from "./../interfaces/gmAPI.interface";
import {
  SmartCarDoorsResponse,
  SmartCarEnergyResponse,
  SmartCarEngineResponse,
  SmartCarVehicleInfoResponse,
} from "./../interfaces/smartCarAPI.interface";
import {
  controlEngine,
  fetchEnergyData,
  fetchSecurityStatus,
  fetchVehicleInfo,
} from "../services/gmService";
import {
  ActionStatus,
  EngineCommand,
  SmartCarAction,
  SmartCarStatus,
} from "../enums/index.enum";

export const getVehicleInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error("Vehicle ID is required");
    }

    const gmResponse: GMVehicleInfoResponse = await fetchVehicleInfo(id);

    if (gmResponse.status !== "200") {
      throw new Error("Error from GM API");
    }

    const { vin, color, fourDoorSedan, twoDoorCoupe, driveTrain } =
      gmResponse.data;

    function determineDoorCount(
      fourDoorSedan: { value: string },
      twoDoorCoupe: { value: string }
    ): number {
      if (fourDoorSedan.value === "True" && twoDoorCoupe.value === "True") {
        throw new Error("Both vehicle types cannot be true");
      } else if (fourDoorSedan.value === "True") {
        return 4;
      } else if (twoDoorCoupe.value === "True") {
        return 2;
      } else {
        throw new Error("Unknown vehicle type");
      }
    }

    const vehicleInfo: SmartCarVehicleInfoResponse = {
      vin: vin.value,
      color: color.value,
      doorCount: determineDoorCount(fourDoorSedan, twoDoorCoupe),
      driveTrain: driveTrain.value,
    };

    res.status(200).json(vehicleInfo);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getSecurityStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error("Vehicle ID is required");
    }

    const gmResponse: GMSecurityResponse = await fetchSecurityStatus(id);

    if (gmResponse.status !== "200") {
      throw new Error("Error fetching security status from GM API");
    }

    const doorsData: SmartCarDoorsResponse[] = gmResponse.data.doors.values.map(
      (door) => ({
        location: door.location.value,
        locked: door.locked.value.toLowerCase() === "true",
      })
    );

    res.status(200).json(doorsData);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getEnergyData = async (req: Request, res: Response) => {
  try {
    const { id, type } = req.params;

    if (!id) {
      throw new Error("Vehicle ID is required");
    }

    if (!type) {
      throw new Error("Energy type is required");
    }

    const [vehicleInfo, energyInfo] = await Promise.all([
      fetchVehicleInfo(id),
      fetchEnergyData(id),
    ]);

    const { driveTrain } = vehicleInfo.data;

    const driveTrainValue = driveTrain.value.toLowerCase();
    const isElectric = driveTrainValue.includes("electric");
    const isHybrid = driveTrainValue.includes("hybrid");

    if (type === "fuel" && isElectric && !isHybrid) {
      throw new Error("Fuel data is not available for electric vehicles");
    }
    if (type === "battery" && !isElectric && !isHybrid) {
      throw new Error(
        "Battery data is not available for non-electric vehicles"
      );
    }

    let result: SmartCarEnergyResponse;

    switch (type) {
      case "fuel":
        result = {
          percent: parseFloat(energyInfo.data.tankLevel.value || "0"),
        };
        break;

      case "battery":
        result = {
          percent: parseFloat(energyInfo.data.batteryLevel.value || "0"),
        };
        break;

      default:
        throw new Error("Invalid energy type");
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const controlEngineHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!id) {
      throw new Error("Vehicle ID is required");
    }

    if (!Object.values(SmartCarAction).includes(action)) {
      throw new Error("Invalid action. Use 'START' or 'STOP'.");
    }

    const command =
      action === SmartCarAction.START
        ? EngineCommand.START
        : EngineCommand.STOP;

    const gmResponse = await controlEngine(id, command);

    const result: SmartCarEngineResponse = {
      status:
        gmResponse.actionResult.status === ActionStatus.EXECUTED
          ? SmartCarStatus.SUCCESS
          : SmartCarStatus.ERROR,
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
