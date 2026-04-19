import { Request, Response } from "express";
import { getActorFromRequest } from "../../auth/verifyFirebaseToken";
import { requireRole, requireVenueScope } from "../../auth/roleGuard";
import { PatchMyStatusBody, PatchMyStatusResponse } from "../../contracts/api/personnel";
import { RequestLocals } from "../../http/middleware/context";
import { personnelRepo } from "../../repositories/personnelRepo";

export async function patchMyStatusHandler(
	req: Request<Record<string, string>, PatchMyStatusResponse, PatchMyStatusBody>,
	res: Response<PatchMyStatusResponse>,
): Promise<void> {
	const actor = await getActorFromRequest(req);
	requireRole(actor, ["staff"]);

	const body = req.body;
	requireVenueScope(actor, body.venue_id);

	await personnelRepo.updateMyStatus({
		venueId: body.venue_id,
		staffId: actor.uid,
		status: body.status,
		crisisId: body.crisis_id,
		note: body.note,
	});

	const locals = res.locals as RequestLocals;
	res.status(200).json({
		staff_id: actor.uid,
		venue_id: body.venue_id,
		status: body.status,
		crisis_id: body.crisis_id,
		correlation_id: locals.ctx.correlationId,
	});
}
