import { Request, Response } from 'express';
import { getActorFromRequest } from '../../auth/verifyFirebaseToken';
import { requireRole } from '../../auth/roleGuard';
import { crisisRepo } from '../../repositories/crisisRepo';
import { AppError } from '../../utils/errors';

interface GetCrisisResponse {
  crisis_id: string;
  venue_id: string;
  status: string;
  crisis_type: string;
  severity: number;
  confidence: number;
  floor: string;
  zone?: string;
  detected_at: string;
  trigger_sources: string[];
  report_text?: string;
  audio_uri?: string;
  classified_at?: string;
  dispatched_at?: string;
  resolved_at?: string;
  gemini_reasoning?: string;
}

export async function getCrisisHandler(
  req: Request<{ crisisId: string }>,
  res: Response<GetCrisisResponse>
): Promise<void> {
  const actor = await getActorFromRequest(req);
  requireRole(actor, ['staff', 'manager', 'admin']);

  const crisis = await crisisRepo.findByIdForVenues(req.params.crisisId, actor.venueIds);
  if (!crisis) {
    throw new AppError({
      code: 'RESOURCE_NOT_FOUND',
      message: 'Crisis not found',
      httpStatus: 404,
    });
  }

  res.status(200).json({
    crisis_id: crisis.crisis.crisis_id,
    venue_id: crisis.venueId,
    status: crisis.crisis.status,
    crisis_type: crisis.crisis.crisis_type,
    severity: crisis.crisis.severity,
    confidence: crisis.crisis.confidence,
    floor: crisis.crisis.floor,
    zone: crisis.crisis.zone,
    detected_at: crisis.crisis.detected_at,
    trigger_sources: crisis.crisis.trigger_sources,
    report_text: crisis.crisis.report_text,
    audio_uri: crisis.crisis.audio_uri,
    classified_at: crisis.crisis.classified_at,
    dispatched_at: crisis.crisis.dispatched_at,
    resolved_at: crisis.crisis.resolved_at,
    gemini_reasoning: crisis.crisis.gemini_reasoning,
  });
}
