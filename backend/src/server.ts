import { createApp } from "./bootstrap/app";
import { config } from "./bootstrap/config";
import { logger } from "./bootstrap/logger";

const app = createApp();

app.listen(config.port, () => {
	logger.info("HTTP server started", {
		service: config.serviceName,
		port: config.port,
	});
});
