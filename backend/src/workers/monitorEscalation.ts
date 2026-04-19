import { logger } from "../bootstrap/logger";

export async function monitorEscalationWorker(_event: unknown): Promise<void> {
	logger.info("monitorEscalationWorker tick", {
		worker: "monitorEscalation",
		timestamp: new Date().toISOString(),
	});
}
