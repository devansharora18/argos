import { Request, Response } from "express";
import { getActorFromRequest } from "../../auth/verifyFirebaseToken";
import { requireRole } from "../../auth/roleGuard";
import { crisisRepo } from "../../repositories/crisisRepo";
import { AppError } from "../../utils/errors";

interface AssignmentResponse {
	crisis_id: string;
	venue_id: string;
	dispatch_id: string;
	staff_id: string;
	instruction: string;
	status: string;
	assigned_at: string;
}

export async function getAssignmentHandler(
	req: Request<{ crisisId: string }>,
	res: Response<AssignmentResponse>,
): Promise<void> {
	const actor = await getActorFromRequest(req);
	requireRole(actor, ["staff", "manager", "admin"]);

	const crisisId = req.params.crisisId;
	const crisis = await crisisRepo.findByIdForVenues(crisisId, actor.venueIds);
	if (!crisis) {
		throw new AppError({
			code: "RESOURCE_NOT_FOUND",
			message: "Crisis not found",
			httpStatus: 404,
		});
	}

	const staffId = actor.role === "staff" ? actor.uid : (req.query.staff_id as string | undefined);
	if (!staffId) {
		throw new AppError({
			code: "VALIDATION_ERROR",
			message: "staff_id query param is required for manager/admin",
			httpStatus: 400,
		});
	}

	const assignment = await crisisRepo.getAssignmentForStaff(crisis.venueId, crisisId, staffId);
	if (!assignment) {
		throw new AppError({
			code: "RESOURCE_NOT_FOUND",
			message: "No assignment found",
			httpStatus: 404,
		});
	}

	res.status(200).json({
		crisis_id: crisisId,
		venue_id: crisis.venueId,
		dispatch_id: assignment.dispatch_id,
		staff_id: assignment.staff_id,
		instruction: assignment.instruction,
		status: assignment.status,
		assigned_at: assignment.assigned_at,
	});
}
