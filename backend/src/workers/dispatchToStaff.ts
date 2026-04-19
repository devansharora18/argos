import { logger } from "../bootstrap/logger";
import { decodePubSubData } from "./pubsubUtils";

export async function dispatchToStaffWorker(event: unknown): Promise<void> {
	const payload = decodePubSubData(event);
	logger.info("dispatchToStaffWorker received message", {
		worker: "dispatchToStaff",
		payload,
	});
}
