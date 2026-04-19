import { Router } from "express";
import { postReportBodySchema } from "../../contracts/api/crisis";
import { getCrisisHandler } from "../../handlers/crisis/getCrisis";
import { getTimelineHandler } from "../../handlers/crisis/getTimeline";
import { getAssignmentHandler } from "../../handlers/personnel/getAssignment";
import { postReportHandler } from "../../handlers/crisis/postReport";
import { asyncHandler } from "../../utils/asyncHandler";
import { validateBody } from "../middleware/validateBody";

export const crisisRoutes = Router();

crisisRoutes.post("/report", validateBody(postReportBodySchema), asyncHandler(postReportHandler));
crisisRoutes.get("/:crisisId", asyncHandler(getCrisisHandler));
crisisRoutes.get("/:crisisId/timeline", asyncHandler(getTimelineHandler));
crisisRoutes.get("/:crisisId/assignment", asyncHandler(getAssignmentHandler));
