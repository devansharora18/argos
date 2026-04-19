import { logger } from "../bootstrap/logger";
import { crisisRepo } from "../repositories/crisisRepo";
import { withRetry } from "../utils/retry";

const escalationThresholdMinutes: Record<string, number> = {
	fire: 5,
	medical: 3,
	security: 4,
	stampede: 2,
	structural: 2,
	unknown: 5,
};

function shouldEscalate(dispatchedAt?: string, thresholdMinutes?: number): boolean {
	if (!dispatchedAt || !thresholdMinutes) {
		return false;
	}

	const dispatchedAtMs = Date.parse(dispatchedAt);
	if (Number.isNaN(dispatchedAtMs)) {
		return false;
	}

	const elapsedMinutes = (Date.now() - dispatchedAtMs) / (1000 * 60);
	return elapsedMinutes >= thresholdMinutes;
}

export async function monitorEscalationWorker(_event: unknown): Promise<void> {
	const candidates = await withRetry(() => crisisRepo.listEscalationCandidates(50), {
		maxAttempts: 3,
	});

	let escalatedCount = 0;
	for (const crisis of candidates) {
		const threshold = escalationThresholdMinutes[crisis.crisis_type] ?? 5;
		if (!shouldEscalate(crisis.dispatched_at, threshold)) {
			continue;
		}

		await withRetry(
			() =>
				crisisRepo.markEscalated(
					crisis.venue_id,
					crisis.crisis_id,
					`Auto escalation triggered after ${threshold} minutes without resolution`,
				),
			{ maxAttempts: 3 },
		);
		escalatedCount += 1;
	}

	logger.info("monitorEscalationWorker completed tick", {
		worker: "monitorEscalation",
		timestamp: new Date().toISOString(),
		checked: candidates.length,
		escalated: escalatedCount,
	});
}
