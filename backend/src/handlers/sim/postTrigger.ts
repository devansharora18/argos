import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { logger } from '../../bootstrap/logger';
import { SimTriggerBody } from '../../contracts/api/sim';
import { broadcast } from '../../services/crisisBroadcast';

export async function postSimTriggerHandler(
  req: Request<unknown, unknown, SimTriggerBody>,
  res: Response
): Promise<void> {
  const body = req.body;
  const crisisId = `crisis_sim_${randomUUID().slice(0, 8)}`;
  const detectedAt = new Date().toISOString();

  const envelope = {
    crisis_id: crisisId,
    venue_id: body.venue_id,
    crisis_type: body.crisis_type,
    severity: body.severity,
    zone: body.zone,
    floor: body.floor ?? null,
    description: body.description,
    reported_by: body.reported_by ?? 'simulator',
    detected_at: detectedAt,
    source: 'simulator',
  };

  const delivered = broadcast({ event: 'crisis.detected', data: envelope });

  logger.info('postSimTriggerHandler broadcast crisis', {
    handler: 'postSimTrigger',
    crisis_id: crisisId,
    crisis_type: body.crisis_type,
    delivered,
  });

  res.status(202).json({ accepted: true, crisis_id: crisisId, subscribers: delivered });
}
