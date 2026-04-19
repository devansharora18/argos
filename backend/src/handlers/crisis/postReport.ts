import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { config } from "../../bootstrap/config";
import { getActorFromRequest } from "../../auth/verifyFirebaseToken";
import { requireRole, requireVenueScope } from "../../auth/roleGuard";
import { PostReportBody, PostReportResponse } from "../../contracts/api/crisis";
import { CrisisCreatedEvent } from "../../contracts/events/crisisEvents";
import { RequestLocals } from "../../http/middleware/context";
import { publishJson } from "../../integrations/pubsub/publisher";
import { crisisRepo } from "../../repositories/crisisRepo";
import { idempotencyRepo } from "../../repositories/idempotencyRepo";
import { createDraftFromReport } from "../../services/crisisService";
import { AppError } from "../../utils/errors";
import { requestHash } from "../../utils/requestHash";

export async function postReportHandler(
	req: Request<Record<string, string>, PostReportResponse, PostReportBody>,
	res: Response<PostReportResponse>,
): Promise<void> {
	const actor = await getActorFromRequest(req);
	requireRole(actor, ["guest", "staff", "manager"]);

	const body = req.body;
	requireVenueScope(actor, body.venue_id);

	const locals = res.locals as RequestLocals;
	const { correlationId, idempotencyKey } = locals.ctx;
	if (!idempotencyKey) {
		throw new AppError({
			code: "MISSING_IDEMPOTENCY_KEY",
			message: "Idempotency-Key header is required",
			httpStatus: 400,
		});
	}

	const result = await idempotencyRepo.executeOnce<PostReportResponse>(
		{
			scope: "crisis.report",
			actorId: actor.uid,
			idempotencyKey,
			requestHash: requestHash({ path: req.path, actor: actor.uid, body }),
			ttlHours: config.idempotencyTtlHours,
		},
		async () => {
			const crisisDraft = createDraftFromReport(body, actor);
			await crisisRepo.createDraft(crisisDraft);

			const crisisCreatedEvent: CrisisCreatedEvent = {
				schema_version: "v1",
				event_id: randomUUID(),
				correlation_id: correlationId,
				idempotency_key: idempotencyKey,
				crisis_id: crisisDraft.crisis_id,
				tenant_id: actor.tenantId,
				venue_id: crisisDraft.venue_id,
				produced_at: new Date().toISOString(),
				event_name: "crisis.created",
				payload: {
					status: "detected",
					floor: crisisDraft.floor,
					zone: crisisDraft.zone,
					trigger_sources: crisisDraft.trigger_sources,
				},
			};

			await publishJson("crisis.created", crisisCreatedEvent);

			return {
				crisis_id: crisisDraft.crisis_id,
				status: "detected",
				correlation_id: correlationId,
			};
		},
	);

	res.status(result.replayed ? 200 : 201).json(result.response);
}
