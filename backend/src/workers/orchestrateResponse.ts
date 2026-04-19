import { randomUUID } from "crypto";
import { logger } from "../bootstrap/logger";
import { orchestrationRequestedEventSchema } from "../contracts/events/pipelineEvents";
import { publishJson } from "../integrations/pubsub/publisher";
import { personnelRepo, ResponderCandidate } from "../repositories/personnelRepo";
import { crisisRepo } from "../repositories/crisisRepo";
import { withRetry } from "../utils/retry";
import { decodePubSubData } from "./pubsubUtils";

function preferredRolesForCrisisType(crisisType: string): string[] {
	switch (crisisType) {
		case "fire":
			return ["fire_marshal", "security", "general_staff"];
		case "medical":
			return ["medical_officer", "general_staff"];
		case "security":
			return ["security", "general_staff"];
		case "stampede":
			return ["security", "medical_officer", "general_staff"];
		case "structural":
			return ["security", "general_staff"];
		default:
			return ["general_staff", "security"];
	}
}

function parseFloorAsNumber(value?: string): number | null {
	if (!value) {
		return null;
	}

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

function selectBestResponder(
	candidates: ResponderCandidate[],
	crisisFloor?: string,
): ResponderCandidate | null {
	if (candidates.length === 0) {
		return null;
	}

	const crisisFloorNumber = parseFloorAsNumber(crisisFloor);
	if (crisisFloorNumber === null) {
		return candidates[0] ?? null;
	}

	const sorted = [...candidates].sort((left, right) => {
		const leftDiff = Math.abs((parseFloorAsNumber(left.floor) ?? 999) - crisisFloorNumber);
		const rightDiff = Math.abs((parseFloorAsNumber(right.floor) ?? 999) - crisisFloorNumber);
		return leftDiff - rightDiff;
	});

	return sorted[0] ?? null;
}

export async function orchestrateResponseWorker(event: unknown): Promise<void> {
	const payload = decodePubSubData(event);
	const parsed = orchestrationRequestedEventSchema.safeParse(payload);
	if (!parsed.success) {
		logger.warn("orchestrateResponseWorker received invalid payload", {
			worker: "orchestrateResponse",
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
		logger.warn("orchestrateResponseWorker could not find crisis", {
			worker: "orchestrateResponse",
			crisis_id: message.crisis_id,
			venue_id: message.venue_id,
		});
		return;
	}

	const candidateRoles = preferredRolesForCrisisType(message.payload.crisis_type);
	const candidates = await withRetry(
		() => personnelRepo.listAvailableResponders(message.venue_id, candidateRoles),
		{ maxAttempts: 3 },
	);

	const selected = selectBestResponder(candidates, crisis.floor);
	if (!selected) {
		await withRetry(
			() =>
				crisisRepo.markEscalated(
					message.venue_id,
					message.crisis_id,
					"No available responder for crisis type",
				),
			{ maxAttempts: 3 },
		);

		logger.warn("orchestrateResponseWorker escalated due to no responder", {
			worker: "orchestrateResponse",
			crisis_id: message.crisis_id,
			venue_id: message.venue_id,
		});
		return;
	}

	const instruction = `Proceed to floor ${crisis.floor}${crisis.zone ? ` (${crisis.zone})` : ""} and handle ${message.payload.crisis_type} incident.`;
	const reasoning = `Selected responder ${selected.staff_id} (${selected.role}) as nearest available on-shift responder for ${message.payload.crisis_type}.`;

	const dispatchId = await withRetry(
		() =>
			crisisRepo.createDispatchAssignment({
				venueId: message.venue_id,
				crisisId: message.crisis_id,
				staffId: selected.staff_id,
				role: selected.role,
				instruction,
				reasoning,
			}),
		{ maxAttempts: 3 },
	);

	await withRetry(
		() =>
			publishJson("dispatch.requested", {
				schema_version: "v1",
				event_id: randomUUID(),
				correlation_id: message.correlation_id,
				idempotency_key: message.idempotency_key,
				crisis_id: message.crisis_id,
				tenant_id: message.tenant_id,
				venue_id: message.venue_id,
				produced_at: new Date().toISOString(),
				event_name: "dispatch.requested",
				payload: {
					dispatch_id: dispatchId,
					staff_id: selected.staff_id,
				},
			}),
		{ maxAttempts: 3 },
	);

	logger.info("orchestrateResponseWorker created dispatch", {
		worker: "orchestrateResponse",
		crisis_id: message.crisis_id,
		venue_id: message.venue_id,
		dispatch_id: dispatchId,
		staff_id: selected.staff_id,
	});
}
