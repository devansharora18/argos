import { PubSub } from "@google-cloud/pubsub";
import { config } from "../../bootstrap/config";
import { logger } from "../../bootstrap/logger";

const pubsub = new PubSub();

export async function publishJson(
	topicName: string,
	payload: object,
): Promise<void> {
	if (config.pubsubDisabled) {
		logger.warn("Pub/Sub publish skipped because PUBSUB_DISABLED=true", {
			topic: topicName,
		});
		return;
	}

	const dataBuffer = Buffer.from(JSON.stringify(payload), "utf8");
	await pubsub.topic(topicName).publishMessage({ data: dataBuffer });
}
