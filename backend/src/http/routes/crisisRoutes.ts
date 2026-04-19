import { Router } from "express";
import { postReportBodySchema } from "../../contracts/api/crisis";
import { postReportHandler } from "../../handlers/crisis/postReport";
import { asyncHandler } from "../../utils/asyncHandler";
import { validateBody } from "../middleware/validateBody";

export const crisisRoutes = Router();

crisisRoutes.post(
	"/report",
	validateBody(postReportBodySchema),
	asyncHandler(postReportHandler),
);
