import { logger } from "../bootstrap/logger";
import { dispatchRequestedEventSchema } from "../contracts/events/pipelineEvents";
import { crisisRepo } from "../repositories/crisisRepo";
import { withRetry } from "../utils/retry";
import { decodePubSubData } from "./pubsubUtils";

export async function dispatchToStaffWorker(event: unknown): Promise<void> {
	const payload = decodePubSubData(event);
	const parsed = dispatchRequestedEventSchema.safeParse(payload);
	if (!parsed.success) {
		logger.warn("dispatchToStaffWorker received invalid payload", {
			worker: "dispatchToStaff",
			error: parsed.error.flatten(),
		});
		return;
	}

	const message = parsed.data;

	await withRetry(
		() =>
			crisisRepo.markDispatchNotified(
				message.venue_id,
				message.crisis_id,
				message.payload.dispatch_id,
			),
		{ maxAttempts: 3 },
	);

	logger.info("dispatchToStaffWorker marked dispatch notified", {
		worker: "dispatchToStaff",
		crisis_id: message.crisis_id,
		venue_id: message.venue_id,
		dispatch_id: message.payload.dispatch_id,
		staff_id: message.payload.staff_id,
	});
}
