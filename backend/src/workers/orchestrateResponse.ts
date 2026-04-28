import { randomUUID } from 'crypto';
import { logger } from '../bootstrap/logger';
import { orchestrationRequestedEventSchema } from '../contracts/events/pipelineEvents';
import { orchestrateWithGemini } from '../integrations/gemini/geminiClient';
import { firestore } from '../integrations/firebase/firestoreClient';
import { publishJson } from '../integrations/pubsub/publisher';
import { personnelRepo, ResponderCandidate } from '../repositories/personnelRepo';
import { crisisRepo, CrisisRecord } from '../repositories/crisisRepo';
import { withRetry } from '../utils/retry';
import { decodePubSubData } from './pubsubUtils';
import type { OrchestrationRequestedEvent } from '../contracts/events/pipelineEvents';

// ---------------------------------------------------------------------------
// Gemini Pro orchestration worker
// Replaces the previous rule-based single-dispatch logic with a full
// AI Incident Commander decision:  multi-dispatch, guest notification,
// control-room summary, and external escalation — all from one Gemini call.
//
// Fallback: if Gemini is unavailable, reverts to the original proximity-based
// single-responder selection so the pipeline never goes dark.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Venue context helpers — best-effort Firestore reads
// ---------------------------------------------------------------------------

interface EvacRoute { route_id: string; status: string; label: string }
interface EquipStation { station_id: string; type: string; floor: string }

async function getEvacuationRoutes(venueId: string): Promise<EvacRoute[]> {
  try {
    const snapshot = await firestore
      .collection('venues').doc(venueId)
      .collection('evacuation_routes')
      .limit(10)
      .get();
    return snapshot.docs.map(doc => ({
      route_id: doc.id,
      status: (doc.data().status as string) ?? 'open',
      label: (doc.data().label as string) ?? doc.id,
    }));
  } catch {
    return [];
  }
}

async function getEquipmentStations(venueId: string): Promise<EquipStation[]> {
  try {
    const snapshot = await firestore
      .collection('venues').doc(venueId)
      .collection('equipment_stations')
      .limit(20)
      .get();
    return snapshot.docs.map(doc => ({
      station_id: doc.id,
      type: (doc.data().type as string) ?? 'general',
      floor: (doc.data().floor as string) ?? 'unknown',
    }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Fallback: original proximity-based single-dispatch (kept for resilience)
// ---------------------------------------------------------------------------

function parseFloorAsNumber(value?: string): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function selectBestResponder(
  candidates: ResponderCandidate[],
  crisisFloor?: string
): ResponderCandidate | null {
  if (candidates.length === 0) return null;
  const floorNum = parseFloorAsNumber(crisisFloor);
  if (floorNum === null) return candidates[0] ?? null;
  const sorted = [...candidates].sort((a, b) => {
    const da = Math.abs((parseFloorAsNumber(a.floor) ?? 999) - floorNum);
    const db = Math.abs((parseFloorAsNumber(b.floor) ?? 999) - floorNum);
    return da - db;
  });
  return sorted[0] ?? null;
}

function preferredRolesForCrisisType(crisisType: string): string[] {
  switch (crisisType) {
    case 'fire':       return ['fire_marshal', 'security', 'general_staff'];
    case 'medical':    return ['medical_officer', 'general_staff'];
    case 'security':   return ['security', 'general_staff'];
    case 'stampede':   return ['security', 'medical_officer', 'general_staff'];
    case 'structural': return ['security', 'general_staff'];
    default:           return ['general_staff', 'security'];
  }
}

async function fallbackDispatch(
  message: OrchestrationRequestedEvent,
  crisis: CrisisRecord,
  candidates: ResponderCandidate[]
): Promise<void> {
  const roleCandidates = candidates.filter(c =>
    preferredRolesForCrisisType(message.payload.crisis_type).includes(c.role)
  );
  const selected = selectBestResponder(
    roleCandidates.length > 0 ? roleCandidates : candidates,
    crisis.floor
  );

  if (!selected) {
    await withRetry(
      () => crisisRepo.markEscalated(
        message.venue_id,
        message.crisis_id,
        'No available responder — Gemini unavailable and fallback found no candidates'
      ),
      { maxAttempts: 3 }
    );
    logger.warn('orchestrateResponseWorker: fallback escalated — no responders', {
      crisis_id: message.crisis_id,
    });
    return;
  }

  const instruction = `Proceed to floor ${crisis.floor}${crisis.zone ? ` (${crisis.zone})` : ''} and handle ${message.payload.crisis_type} incident.`;
  const reasoning = `Fallback: selected ${selected.staff_id} (${selected.role}) as nearest available responder.`;

  const dispatchId = await withRetry(
    () => crisisRepo.createDispatchAssignment({
      venueId: message.venue_id,
      crisisId: message.crisis_id,
      staffId: selected.staff_id,
      role: selected.role,
      instruction,
      reasoning,
    }),
    { maxAttempts: 3 }
  );

  await withRetry(
    () => publishJson('dispatch.requested', {
      schema_version: 'v1',
      event_id: randomUUID(),
      correlation_id: message.correlation_id,
      idempotency_key: message.idempotency_key,
      crisis_id: message.crisis_id,
      tenant_id: message.tenant_id,
      venue_id: message.venue_id,
      produced_at: new Date().toISOString(),
      event_name: 'dispatch.requested',
      payload: { dispatch_id: dispatchId, staff_id: selected.staff_id },
    }),
    { maxAttempts: 3 }
  );

  logger.info('orchestrateResponseWorker: fallback dispatch created', {
    crisis_id: message.crisis_id,
    staff_id: selected.staff_id,
    dispatch_id: dispatchId,
  });
}

// ---------------------------------------------------------------------------
// Main worker
// ---------------------------------------------------------------------------

export async function orchestrateResponseWorker(event: unknown): Promise<void> {
  const payload = decodePubSubData(event);
  const parsed = orchestrationRequestedEventSchema.safeParse(payload);
  if (!parsed.success) {
    logger.warn('orchestrateResponseWorker: invalid payload', {
      worker: 'orchestrateResponse',
      error: parsed.error.flatten(),
    });
    return;
  }

  const message = parsed.data;

  // --- Fetch all venue context in parallel ---
  const [crisis, allPersonnel, evacuationRoutes, equipmentStations] = await Promise.all([
    withRetry(
      () => crisisRepo.getByIdInVenue(message.venue_id, message.crisis_id),
      { maxAttempts: 3 }
    ),
    withRetry(
      // Fetch all roles — Gemini will make the role decision, not us
      () => personnelRepo.listAvailableResponders(message.venue_id, []),
      { maxAttempts: 3 }
    ),
    getEvacuationRoutes(message.venue_id),
    getEquipmentStations(message.venue_id),
  ]);

  if (!crisis) {
    logger.warn('orchestrateResponseWorker: crisis not found', {
      worker: 'orchestrateResponse',
      crisis_id: message.crisis_id,
      venue_id: message.venue_id,
    });
    return;
  }

  logger.info('orchestrateResponseWorker: context assembled', {
    crisis_id: message.crisis_id,
    personnel_available: allPersonnel.length,
    evacuation_routes: evacuationRoutes.length,
    equipment_stations: equipmentStations.length,
  });

  // --- Gemini Pro full orchestration ---
  let orchestration;
  try {
    orchestration = await orchestrateWithGemini(
      {
        crisis_type: message.payload.crisis_type,
        severity: message.payload.severity,
        floor: crisis.floor,
        zone: crisis.zone,
        report_text: crisis.report_text,
      },
      {
        current_time: new Date().toISOString(),
        available_personnel: allPersonnel.map(p => ({
          staff_id: p.staff_id,
          name: p.name ?? p.staff_id,
          role: p.role,
          floor: p.floor ?? 'unknown',
          certifications: p.certifications,
        })),
        evacuation_routes: evacuationRoutes,
        equipment_stations: equipmentStations,
      }
    );
  } catch (err) {
    logger.error('orchestrateResponseWorker: Gemini failed — running rule-based fallback', {
      error: err instanceof Error ? err.message : String(err),
      crisis_id: message.crisis_id,
    });
    await fallbackDispatch(message, crisis, allPersonnel);
    return;
  }

  logger.info('orchestrateResponseWorker: Gemini orchestration result', {
    crisis_id: message.crisis_id,
    dispatch_decisions: orchestration.dispatch_decisions.length,
    external_escalation: orchestration.external_escalation.required,
    confidence: orchestration.confidence,
    reasoning: orchestration.decision_reasoning,
  });

  // --- Persist Gemini outputs on the crisis document ---
  await withRetry(
    () => crisisRepo.applyOrchestration({
      venueId: message.venue_id,
      crisisId: message.crisis_id,
      guestNotification: orchestration.guest_notification,
      controlRoomSummary: orchestration.control_room_summary,
      alternativesConsidered: orchestration.alternatives_considered,
      decisionReasoning: orchestration.decision_reasoning,
    }),
    { maxAttempts: 3 }
  );

  // --- Create a dispatch assignment + publish event for each decision ---
  for (const decision of orchestration.dispatch_decisions) {
    const dispatchId = await withRetry(
      () => crisisRepo.createDispatchAssignment({
        venueId: message.venue_id,
        crisisId: message.crisis_id,
        staffId: decision.staff_id,
        role: decision.role,
        instruction: `[${decision.priority.toUpperCase()}] ${decision.instruction}${decision.equipment_to_bring.length ? ` — Bring: ${decision.equipment_to_bring.join(', ')}.` : ''} Route: ${decision.route}`,
        reasoning: orchestration.decision_reasoning,
      }),
      { maxAttempts: 3 }
    );

    await withRetry(
      () => publishJson('dispatch.requested', {
        schema_version: 'v1',
        event_id: randomUUID(),
        correlation_id: message.correlation_id,
        idempotency_key: message.idempotency_key,
        crisis_id: message.crisis_id,
        tenant_id: message.tenant_id,
        venue_id: message.venue_id,
        produced_at: new Date().toISOString(),
        event_name: 'dispatch.requested',
        payload: { dispatch_id: dispatchId, staff_id: decision.staff_id },
      }),
      { maxAttempts: 3 }
    );

    logger.info('orchestrateResponseWorker: dispatch created', {
      staff_id: decision.staff_id,
      role: decision.role,
      priority: decision.priority,
      dispatch_id: dispatchId,
    });
  }

  // --- Publish guest notification event ---
  await withRetry(
    () => publishJson('guest.notification.requested', {
      schema_version: 'v1',
      event_id: randomUUID(),
      correlation_id: message.correlation_id,
      idempotency_key: message.idempotency_key,
      crisis_id: message.crisis_id,
      tenant_id: message.tenant_id,
      venue_id: message.venue_id,
      produced_at: new Date().toISOString(),
      event_name: 'guest.notification.requested',
      payload: {
        message: orchestration.guest_notification.message,
        evacuation_route: orchestration.guest_notification.evacuation_route,
        affected_floors: orchestration.guest_notification.affected_floors,
        tone: orchestration.guest_notification.tone,
      },
    }),
    { maxAttempts: 3 }
  );

  // --- Backup assignments: log only (no FCM for backups — they're on standby) ---
  if (orchestration.backup_assignments.length > 0) {
    logger.info('orchestrateResponseWorker: backup assignments noted', {
      crisis_id: message.crisis_id,
      backups: orchestration.backup_assignments.map(b => b.staff_id),
    });
  }

  // --- External escalation ---
  if (orchestration.external_escalation.required) {
    await withRetry(
      () => crisisRepo.markEscalated(
        message.venue_id,
        message.crisis_id,
        `${orchestration.external_escalation.service}: ${orchestration.external_escalation.reason}`
      ),
      { maxAttempts: 3 }
    );
    logger.info('orchestrateResponseWorker: external escalation marked', {
      service: orchestration.external_escalation.service,
      auto_call_in_minutes: orchestration.external_escalation.auto_call_in_minutes,
    });
  }

  logger.info('orchestrateResponseWorker: complete', {
    worker: 'orchestrateResponse',
    crisis_id: message.crisis_id,
    venue_id: message.venue_id,
    dispatches_created: orchestration.dispatch_decisions.length,
  });
}
