import { randomUUID } from 'crypto';
import { ActorClaims } from '../auth/claimTypes';
import { PostReportBody } from '../contracts/api/crisis';
import { CrisisDraft } from '../repositories/crisisRepo';

export function createDraftFromReport(body: PostReportBody, actor: ActorClaims): CrisisDraft {
  return {
    crisis_id: randomUUID(),
    tenant_id: actor.tenantId,
    venue_id: body.venue_id,
    crisis_type: 'unknown',
    severity: 1,
    confidence: 0,
    floor: body.floor,
    zone: body.zone,
    status: 'detected',
    detected_at: new Date().toISOString(),
    trigger_sources: body.trigger_sources,
    report_text: body.report_text,
    audio_uri: body.audio_uri,
    frame_base64: body.frame_base64,
    created_by: {
      actor_id: actor.uid,
      role: actor.role,
    },
    schema_version: 'v1',
  };
}
