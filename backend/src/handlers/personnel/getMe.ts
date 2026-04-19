import { Request, Response } from "express";
import { getActorFromRequest } from "../../auth/verifyFirebaseToken";
import { requireRole, requireVenueScope } from "../../auth/roleGuard";
import { GetMeQuery, PersonnelProfileResponse } from "../../contracts/api/personnel";
import { personnelRepo } from "../../repositories/personnelRepo";
import { AppError } from "../../utils/errors";

export async function getMeHandler(
	req: Request<Record<string, string>, PersonnelProfileResponse, unknown, GetMeQuery>,
	res: Response<PersonnelProfileResponse>,
): Promise<void> {
	const actor = await getActorFromRequest(req);
	requireRole(actor, ["staff", "manager", "admin"]);

	const venueId = req.query.venue_id;
	requireVenueScope(actor, venueId);

	const personnel = await personnelRepo.getById(venueId, actor.uid);
	if (!personnel) {
		throw new AppError({
			code: "RESOURCE_NOT_FOUND",
			message: "Personnel profile not found",
			httpStatus: 404,
		});
	}

	res.status(200).json({
		staff_id: personnel.staff_id,
		venue_id: personnel.venue_id,
		name: personnel.name,
		role: personnel.role,
		floor: personnel.floor,
		on_shift: personnel.on_shift,
		status: personnel.status,
		current_assignment: personnel.current_assignment ?? null,
	});
}
