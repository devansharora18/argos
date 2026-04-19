import { Router } from "express";
import { getHealthHandler } from "../../handlers/health/getHealth";

export const healthRoutes = Router();

healthRoutes.get("/", getHealthHandler);
