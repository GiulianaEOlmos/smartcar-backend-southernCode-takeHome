import express from "express";
import {
  controlEngineHandler,
  getEnergyData,
  getSecurityStatus,
  getVehicleInfo,
} from "./../controllers/vehicleController";

const vehicleRoutes = express.Router();

const API_VERSION = "/v1";

vehicleRoutes.get(`${API_VERSION}/vehicles/:id`, getVehicleInfo);
vehicleRoutes.get(`${API_VERSION}/vehicles/:id/doors`, getSecurityStatus);
vehicleRoutes.get(
  `${API_VERSION}/vehicles/:id/:type(fuel|battery)`,
  getEnergyData
);
vehicleRoutes.post(`${API_VERSION}/vehicles/:id/engine`, controlEngineHandler);

export default vehicleRoutes;
