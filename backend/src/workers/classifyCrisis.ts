import { logger } from "../bootstrap/logger";
import { decodePubSubData } from "./pubsubUtils";

export async function classifyCrisisWorker(event: unknown): Promise<void> {
	const payload = decodePubSubData(event);
	logger.info("classifyCrisisWorker received message", {
		worker: "classifyCrisis",
		payload,
	});
}
