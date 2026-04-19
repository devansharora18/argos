import { logger } from "../bootstrap/logger";
import { decodePubSubData } from "./pubsubUtils";

export async function orchestrateResponseWorker(event: unknown): Promise<void> {
	const payload = decodePubSubData(event);
	logger.info("orchestrateResponseWorker received message", {
		worker: "orchestrateResponse",
		payload,
	});
}
