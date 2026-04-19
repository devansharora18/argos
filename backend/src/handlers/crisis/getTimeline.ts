import { Request, Response } from "express";
import { getActorFromRequest } from "../../auth/verifyFirebaseToken";
import { requireRole } from "../../auth/roleGuard";
import { crisisRepo } from "../../repositories/crisisRepo";
import { AppError } from "../../utils/errors";

interface TimelineEventResponse {
	event_id: string;
	event: string;
	type: string;
	timestamp: string;
	actor_id?: string;
	role?: string;
	status?: string;
	note?: string;
}

interface TimelineResponse {
	crisis_id: string;
	venue_id: string;
	events: TimelineEventResponse[];
}

export async function getTimelineHandler(
	req: Request<{ crisisId: string }>,
	res: Response<TimelineResponse>,
): Promise<void> {
	const actor = await getActorFromRequest(req);
	requireRole(actor, ["staff", "manager", "admin"]);

	const crisis = await crisisRepo.findByIdForVenues(req.params.crisisId, actor.venueIds);
	if (!crisis) {
		throw new AppError({
			code: "RESOURCE_NOT_FOUND",
			message: "Crisis not found",
			httpStatus: 404,
		});
	}

	const limit = Number(req.query.limit ?? 100);
	const timeline = await crisisRepo.getTimeline(crisis.venueId, req.params.crisisId, limit);

	res.status(200).json({
		crisis_id: req.params.crisisId,
		venue_id: crisis.venueId,
		events: timeline,
	});
}
