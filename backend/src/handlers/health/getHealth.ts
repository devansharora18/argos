import { Request, Response } from 'express';
import { config } from '../../bootstrap/config';
import { logger } from '../../bootstrap/logger';
import { edgeRepo } from '../../repositories/edgeRepo';

interface HealthResponse {
  status: 'ok';
  service: string;
  timestamp: string;
  edge: {
    processing_queue_depth: number;
    last_replay_batch_id: string | null;
    last_replay_at: string | null;
  };
}

export async function getHealthHandler(
  _req: Request,
  res: Response<HealthResponse>
): Promise<void> {
  let edge: HealthResponse['edge'] = {
    processing_queue_depth: 0,
    last_replay_batch_id: null,
    last_replay_at: null,
  };

  try {
    edge = await edgeRepo.getReplayHealth();
  } catch (error) {
    logger.warn('Health edge metrics unavailable', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  res.status(200).json({
    status: 'ok',
    service: config.serviceName,
    timestamp: new Date().toISOString(),
    edge,
  });
}
