import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  fetchVehicleInfo,
  fetchSecurityStatus,
  fetchEnergyData,
  controlEngine,
} from "../services/gmService";
import { ActionStatus, EngineCommand } from "../enums/index.enum";
import {
  GMVehicleInfoResponse,
  GMSecurityResponse,
  GMEnergyResponse,
  GMEngineResponse,
} from "../interfaces/gmAPI.interface";

const mock = new MockAdapter(axios);

const URL_BASE = process.env.GM_API_URL || "http://gmapi.azurewebsites.net";

describe("GM Service Tests", () => {
  afterEach(() => {
    mock.reset();
  });

  test("fetchVehicleInfo should return vehicle info", async () => {
    const mockData: GMVehicleInfoResponse = {
      service: "getVehicleInfo",
      status: "200",
      data: {
        vin: {
          type: "String",
          value: "123123412412",
        },
        color: {
          type: "String",
          value: "Metallic Silver",
        },
        fourDoorSedan: {
          type: "Boolean",
          value: "True",
        },
        twoDoorCoupe: {
          type: "Boolean",
          value: "False",
        },
        driveTrain: {
          type: "String",
          value: "v8",
        },
      },
    };

    mock.onPost(`${URL_BASE}/getVehicleInfoService`).reply(200, mockData);

    const response = await fetchVehicleInfo("1234");
    expect(response).toEqual(mockData);
  });

  test("fetchSecurityStatus should return security status", async () => {
    const mockData: GMSecurityResponse = {
      service: "getSecurityStatus",
      status: "200",
      data: {
        doors: {
          type: "Array",
          values: [
            {
              location: {
                type: "String",
                value: "frontLeft",
              },
              locked: {
                type: "Boolean",
                value: "False",
              },
            },
            {
              location: {
                type: "String",
                value: "frontRight",
              },
              locked: {
                type: "Boolean",
                value: "True",
              },
            },
            {
              location: {
                type: "String",
                value: "backLeft",
              },
              locked: {
                type: "Boolean",
                value: "False",
              },
            },
            {
              location: {
                type: "String",
                value: "backRight",
              },
              locked: {
                type: "Boolean",
                value: "True",
              },
            },
          ],
        },
      },
    };

    mock.onPost(`${URL_BASE}/getSecurityStatusService`).reply(200, mockData);

    const response = await fetchSecurityStatus("1234");
    expect(response).toEqual(mockData);
  });

  test("fetchEnergyData should return energy data", async () => {
    const mockData: GMEnergyResponse = {
      service: "getEnergy",
      status: "200",
      data: {
        tankLevel: {
          type: "Number",
          value: "30.2",
        },
        batteryLevel: {
          type: "Null",
          value: "null",
        },
      },
    };

    mock.onPost(`${URL_BASE}/getEnergyService`).reply(200, mockData);

    const response = await fetchEnergyData("1234");
    expect(response).toEqual(mockData);
  });

  test("controlEngine should return engine control response", async () => {
    const mockData: GMEngineResponse = {
      service: "actionEngine",
      status: "200",
      actionResult: {
        status: ActionStatus.EXECUTED,
      },
    };

    mock
      .onPost(`${URL_BASE}/actionEngineService`, {
        id: "1234",
        command: EngineCommand.START,
        responseType: "JSON",
      })
      .reply(200, mockData);

    const response = await controlEngine("1234", EngineCommand.START);
    expect(response).toEqual(mockData);
  });

  test("fetchVehicleInfo should throw an error for invalid status", async () => {
    mock.onPost(`${URL_BASE}/getVehicleInfoService`).reply(200, {
      service: "getVehicleInfo",
      status: "500",
      data: {},
    });

    await expect(fetchVehicleInfo("1234")).rejects.toThrow(
      "Error fetching vehicle info from GM API"
    );
  });
});
