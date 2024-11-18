import { Request, Response } from "express";
import {
  fetchVehicleInfo,
  fetchSecurityStatus,
  fetchEnergyData,
  controlEngine,
} from "../services/gmService";
import {
  getVehicleInfo,
  getSecurityStatus,
  getEnergyData,
  controlEngineHandler,
} from "../controllers/vehicleController";
import {
  SmartCarAction,
  EngineCommand,
  ActionStatus,
  SmartCarStatus,
} from "../enums/index.enum";

jest.mock("../services/gmService", () => ({
  fetchVehicleInfo: jest.fn(),
  fetchSecurityStatus: jest.fn(),
  fetchEnergyData: jest.fn(),
  controlEngine: jest.fn(),
}));

const mockRequest = (params = {}, body = {}) =>
  ({
    params,
    body,
  } as Request);

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getVehicleInfo", () => {
  it("should return vehicle info for a valid ID", async () => {
    const mockVehicleInfo = {
      service: "getVehicleInfo",
      status: "200",
      data: {
        vin: { value: "123456" },
        color: { value: "Red" },
        fourDoorSedan: { value: "True" },
        twoDoorCoupe: { value: "False" },
        driveTrain: { value: "v8" },
      },
    };

    (fetchVehicleInfo as jest.Mock).mockResolvedValue(mockVehicleInfo);

    const req = mockRequest({ id: "1234" });
    const res = mockResponse();

    await getVehicleInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      vin: "123456",
      color: "Red",
      doorCount: 4,
      driveTrain: "v8",
    });
  });

  it("should return 500 if vehicle ID is missing", async () => {
    const req = mockRequest({});
    const res = mockResponse();

    await getVehicleInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Vehicle ID is required" });
  });
});

describe("getSecurityStatus", () => {
  it("should return security status for a valid ID", async () => {
    const mockSecurityStatus = {
      service: "getSecurityStatus",
      status: "200",
      data: {
        doors: {
          values: [
            { location: { value: "frontLeft" }, locked: { value: "True" } },
            { location: { value: "frontRight" }, locked: { value: "False" } },
          ],
        },
      },
    };
    (fetchSecurityStatus as jest.Mock).mockResolvedValue(mockSecurityStatus);

    const req = mockRequest({ id: "1234" });
    const res = mockResponse();

    await getSecurityStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { location: "frontLeft", locked: true },
      { location: "frontRight", locked: false },
    ]);
  });

  it("should return 500 if vehicle ID is missing", async () => {
    const req = mockRequest({});
    const res = mockResponse();

    await getSecurityStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Vehicle ID is required" });
  });
});

describe("getEnergyData", () => {
  it("should return fuel data for non-electric vehicles", async () => {
    const mockVehicleInfo = {
      service: "getVehicleInfo",
      status: "200",
      data: {
        driveTrain: { value: "v8" },
      },
    };

    const mockEnergyData = {
      service: "getEnergy",
      status: "200",
      data: {
        tankLevel: { value: "50" },
        batteryLevel: { value: "null" },
      },
    };

    (fetchVehicleInfo as jest.Mock).mockResolvedValue(mockVehicleInfo);
    (fetchEnergyData as jest.Mock).mockResolvedValue(mockEnergyData);

    const req = mockRequest({ id: "1234", type: "fuel" });
    const res = mockResponse();

    await getEnergyData(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ percent: 50 });
  });

  it("should return 500 if invalid energy type is provided", async () => {
    const req = mockRequest({ id: "1234", type: "invalid" });
    const res = mockResponse();

    await getEnergyData(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid energy type" });
  });

  it("should return error if it's asking fuel data for electric vehicles", async () => {
    const mockVehicleInfo = {
      service: "getVehicleInfo",
      status: "200",
      data: {
        driveTrain: { value: "electric" },
      },
    };

    const mockEnergyData = {
      service: "getEnergy",
      status: "200",
      data: {
        tankLevel: { value: "50" },
        batteryLevel: { value: "null" },
      },
    };

    (fetchVehicleInfo as jest.Mock).mockResolvedValue(mockVehicleInfo);
    (fetchEnergyData as jest.Mock).mockResolvedValue(mockEnergyData);

    const req = mockRequest({ id: "1234", type: "fuel" });
    const res = mockResponse();

    await getEnergyData(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Fuel data is not available for electric vehicles",
    });
  });
});

describe("controlEngineHandler", () => {
  it("should return success for valid START action", async () => {
    const mockEngineResponse = {
      service: "actionEngine",
      status: "200",
      actionResult: { status: ActionStatus.EXECUTED },
    };

    (controlEngine as jest.Mock).mockResolvedValue(mockEngineResponse);

    const req = mockRequest({ id: "1234" }, { action: SmartCarAction.START });
    const res = mockResponse();

    await controlEngineHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: SmartCarStatus.SUCCESS });
  });

  it("should return error for invalid action", async () => {
    const req = mockRequest({ id: "1234" }, { action: "INVALID_ACTION" });
    const res = mockResponse();

    await controlEngineHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid action. Use 'START' or 'STOP'.",
    });
  });
});
