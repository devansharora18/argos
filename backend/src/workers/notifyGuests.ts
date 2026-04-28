import { logger } from '../bootstrap/logger';
import { guestNotificationRequestedEventSchema } from '../contracts/events/pipelineEvents';
import { sendGuestAlert } from '../integrations/fcm/fcmClient';
import { decodePubSubData } from './pubsubUtils';

// ---------------------------------------------------------------------------
// Guest notification worker — triggered by guest.notification.requested
//
// Broadcasts an FCM topic message to all guest devices subscribed to the
// venue's guest topic: `venue_{venueId}_guests`
//
// The Flutter guest app subscribes to this topic on login.
// A data-only message is used so the app can render the alert with the
// correct tone (calm vs urgent), route info, and affected floors.
//
// No Firestore writes — the guest_notification object is already persisted
// on the crisis document by orchestrateResponse before this event fires.
// ---------------------------------------------------------------------------

export async function notifyGuestsWorker(event: unknown): Promise<void> {
  const payload = decodePubSubData(event);
  const parsed = guestNotificationRequestedEventSchema.safeParse(payload);

  if (!parsed.success) {
    logger.warn('notifyGuestsWorker: invalid payload', {
      worker: 'notifyGuests',
      error: parsed.error.flatten(),
    });
    return;
  }

  const message = parsed.data;
  const { venue_id, crisis_id } = message;
  const { message: alertMessage, evacuation_route, affected_floors, tone } = message.payload;

  logger.info('notifyGuestsWorker: sending guest alert', {
    crisis_id,
    venue_id,
    tone,
    affected_floors,
  });

  const sent = await sendGuestAlert({
    crisisId: crisis_id,
    venueId: venue_id,
    message: alertMessage,
    evacuationRoute: evacuation_route,
    affectedFloors: affected_floors,
    tone,
  });

  logger.info('notifyGuestsWorker: complete', {
    worker: 'notifyGuests',
    crisis_id,
    venue_id,
    fcm_sent: sent,
    tone,
    affected_floors_count: affected_floors.length,
  });
}
