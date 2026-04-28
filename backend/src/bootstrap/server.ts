import 'dotenv/config';
import { createApp } from './app';
import { config } from './config';
import { logger } from './logger';

// Standalone HTTP server — for local testing without Firebase emulators.
// Workers (classifyCrisis, orchestrateResponse etc.) are NOT triggered here
// since there's no Pub/Sub. Use PUBSUB_DISABLED=true to skip publishing.

const app = createApp();

app.listen(config.port, () => {
  logger.info(`HAVEN server running`, {
    port: config.port,
    auth_disabled: config.authDisabled,
    pubsub_disabled: config.pubsubDisabled,
  });
  console.log(`\n  Server: http://localhost:${config.port}`);
  console.log(`  Health: http://localhost:${config.port}/api/v1/health`);
  console.log(`  Demo:   POST http://localhost:${config.port}/api/v1/demo/trigger\n`);
});
