import { logger } from '../bootstrap/logger';
import { dispatchRequestedEventSchema } from '../contracts/events/pipelineEvents';
import { sendStaffDispatch } from '../integrations/fcm/fcmClient';
import { crisisRepo } from '../repositories/crisisRepo';
import { personnelRepo } from '../repositories/personnelRepo';
import { withRetry } from '../utils/retry';
import { decodePubSubData } from './pubsubUtils';

// ---------------------------------------------------------------------------
// Staff dispatch worker — Step 3 of the pipeline
//
// Receives dispatch.requested, looks up:
//   • The dispatch record  → instruction written by Gemini
//   • The crisis record    → type, severity, floor, zone for FCM payload
//   • The personnel record → FCM registration token
//
// Sends a high-priority FCM data message to the staff member's device so the
// Flutter app can show a full-screen alert with the exact instruction.
//
// Marks the dispatch as notified in Firestore regardless of FCM outcome
// (pipeline must not stall if a device has an expired token).
// ---------------------------------------------------------------------------

export async function dispatchToStaffWorker(event: unknown): Promise<void> {
  const payload = decodePubSubData(event);
  const parsed = dispatchRequestedEventSchema.safeParse(payload);

  if (!parsed.success) {
    logger.warn('dispatchToStaffWorker: invalid payload', {
      worker: 'dispatchToStaff',
      error: parsed.error.flatten(),
    });
    return;
  }

  const message = parsed.data;
  const { venue_id, crisis_id } = message;
  const { dispatch_id, staff_id } = message.payload;

  // --- Fetch dispatch record, crisis record, and personnel in parallel ---
  const [dispatchRecord, crisis, personnel] = await Promise.all([
    withRetry(
      () => crisisRepo.getDispatchById(venue_id, crisis_id, dispatch_id),
      { maxAttempts: 3 }
    ),
    withRetry(
      () => crisisRepo.getByIdInVenue(venue_id, crisis_id),
      { maxAttempts: 3 }
    ),
    withRetry(
      () => personnelRepo.getById(venue_id, staff_id),
      { maxAttempts: 3 }
    ),
  ]);

  if (!dispatchRecord) {
    logger.warn('dispatchToStaffWorker: dispatch record not found', {
      dispatch_id,
      crisis_id,
    });
    return;
  }

  if (!crisis) {
    logger.warn('dispatchToStaffWorker: crisis record not found', { crisis_id });
    return;
  }

  // --- Send FCM push notification ---
  if (personnel?.fcm_token) {
    await sendStaffDispatch(personnel.fcm_token, {
      crisisId: crisis_id,
      venueId: venue_id,
      crisisType: crisis.crisis_type,
      severity: crisis.severity,
      floor: crisis.floor,
      zone: crisis.zone,
      instruction: dispatchRecord.instruction,
      dispatchId: dispatch_id,
    });
  } else {
    logger.warn('dispatchToStaffWorker: no FCM token for staff member — skipping push', {
      staff_id,
      crisis_id,
      has_personnel_record: Boolean(personnel),
    });
  }

  // --- Mark notified in Firestore (always — even if FCM was skipped) ---
  await withRetry(
    () => crisisRepo.markDispatchNotified(venue_id, crisis_id, dispatch_id),
    { maxAttempts: 3 }
  );

  logger.info('dispatchToStaffWorker: complete', {
    worker: 'dispatchToStaff',
    crisis_id,
    venue_id,
    dispatch_id,
    staff_id,
    fcm_sent: Boolean(personnel?.fcm_token),
  });
}
