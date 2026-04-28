import { Response } from 'express';
import { logger } from '../bootstrap/logger';

export interface BroadcastEnvelope {
  event: string;
  data: Record<string, unknown>;
}

const subscribers = new Set<Response>();

export function registerSubscriber(res: Response): () => void {
  subscribers.add(res);
  logger.info('crisisBroadcast subscriber registered', {
    service: 'crisisBroadcast',
    subscribers: subscribers.size,
  });

  return () => {
    subscribers.delete(res);
    logger.info('crisisBroadcast subscriber removed', {
      service: 'crisisBroadcast',
      subscribers: subscribers.size,
    });
  };
}

export function broadcast(envelope: BroadcastEnvelope): number {
  const payload = `event: ${envelope.event}\ndata: ${JSON.stringify(envelope.data)}\n\n`;
  let delivered = 0;

  for (const res of subscribers) {
    try {
      res.write(payload);
      delivered += 1;
    } catch (error) {
      logger.warn('crisisBroadcast failed to write to subscriber', {
        service: 'crisisBroadcast',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      subscribers.delete(res);
    }
  }

  return delivered;
}

export function getSubscriberCount(): number {
  return subscribers.size;
}
