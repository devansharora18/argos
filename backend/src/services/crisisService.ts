import { randomUUID } from 'crypto';
import { ActorClaims } from '../auth/claimTypes';
import { EdgeDetectionEnvelope } from '../contracts/api/device';
import { PostReportBody } from '../contracts/api/crisis';
import { CrisisDraft } from '../repositories/crisisRepo';
import { buildEdgeTriggerSources } from './telemetryService';

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

export function createDraftFromEdgeDetection(
  detection: EdgeDetectionEnvelope,
  tenantId: string,
  actorId: string
): CrisisDraft {
  const severity = Math.max(1, Math.min(5, Math.round(detection.confidence * 5)));
  const triggerSources = buildEdgeTriggerSources(detection);

  return {
    crisis_id: randomUUID(),
    tenant_id: tenantId,
    venue_id: detection.venue_id,
    crisis_type: detection.crisis_hint ?? 'unknown',
    severity,
    confidence: detection.confidence,
    floor: detection.floor,
    zone: detection.zone,
    status: 'detected',
    detected_at: detection.detected_at,
    trigger_sources: triggerSources,
    report_text: `Edge detection from ${detection.device_id} (${detection.model_name})`,
    created_by: {
      actor_id: actorId,
      role: 'service',
    },
    schema_version: 'v1',
  };
}
