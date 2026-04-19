import { randomUUID } from "crypto";
import { logger } from "../bootstrap/logger";
import { crisisCreatedEventSchema } from "../contracts/events/crisisEvents";
import { publishJson } from "../integrations/pubsub/publisher";
import { crisisRepo, CrisisRecord } from "../repositories/crisisRepo";
import { withRetry } from "../utils/retry";
import { decodePubSubData } from "./pubsubUtils";

function classifyFromText(
	crisis: CrisisRecord,
): Pick<CrisisRecord, "crisis_type" | "severity" | "confidence"> {
	const signalText = [crisis.report_text, ...(crisis.trigger_sources ?? []), crisis.zone]
		.filter((value): value is string => typeof value === "string")
		.join(" ")
		.toLowerCase();

	if (/(fire|smoke|flame|burn)/.test(signalText)) {
		return { crisis_type: "fire", severity: 4, confidence: 0.88 };
	}

	if (/(heart|unconscious|bleed|medical|collapse)/.test(signalText)) {
		return { crisis_type: "medical", severity: 4, confidence: 0.84 };
	}

	if (/(gun|knife|threat|robbery|attack|security)/.test(signalText)) {
		return { crisis_type: "security", severity: 5, confidence: 0.85 };
	}

	if (/(stampede|crowd|crush|trapped|pushing)/.test(signalText)) {
		return { crisis_type: "stampede", severity: 5, confidence: 0.82 };
	}

	if (/(collapse|structural|ceiling|crack)/.test(signalText)) {
		return { crisis_type: "structural", severity: 4, confidence: 0.79 };
	}

	return { crisis_type: "unknown", severity: 2, confidence: 0.45 };
}

export async function classifyCrisisWorker(event: unknown): Promise<void> {
	const payload = decodePubSubData(event);
	const parsed = crisisCreatedEventSchema.safeParse(payload);
	if (!parsed.success) {
		logger.warn("classifyCrisisWorker received invalid payload", {
			worker: "classifyCrisis",
			error: parsed.error.flatten(),
		});
		return;
	}

	const message = parsed.data;
	const crisis = await withRetry(
		() => crisisRepo.getByIdInVenue(message.venue_id, message.crisis_id),
		{ maxAttempts: 3 },
	);

	if (!crisis) {
		logger.warn("classifyCrisisWorker could not find crisis", {
			worker: "classifyCrisis",
			crisis_id: message.crisis_id,
			venue_id: message.venue_id,
		});
		return;
	}

	const classification = classifyFromText(crisis);

	await withRetry(
		() =>
			crisisRepo.applyClassification({
				venueId: message.venue_id,
				crisisId: message.crisis_id,
				crisisType: classification.crisis_type,
				severity: classification.severity,
				confidence: classification.confidence,
			}),
		{ maxAttempts: 3 },
	);

	await withRetry(
		() =>
			publishJson("orchestration.requested", {
				schema_version: "v1",
				event_id: randomUUID(),
				correlation_id: message.correlation_id,
				idempotency_key: message.idempotency_key,
				crisis_id: message.crisis_id,
				tenant_id: message.tenant_id,
				venue_id: message.venue_id,
				produced_at: new Date().toISOString(),
				event_name: "orchestration.requested",
				payload: {
					crisis_type: classification.crisis_type,
					severity: classification.severity,
					confidence: classification.confidence,
				},
			}),
		{ maxAttempts: 3 },
	);

	logger.info("classifyCrisisWorker classified crisis", {
		worker: "classifyCrisis",
		crisis_id: message.crisis_id,
		venue_id: message.venue_id,
		classification,
	});
}
