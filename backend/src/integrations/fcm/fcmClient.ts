import '../firebase/admin'; // ensure Firebase Admin is initialized
import { getMessaging } from 'firebase-admin/messaging';
import { logger } from '../../bootstrap/logger';
import { config } from '../../bootstrap/config';

// ---------------------------------------------------------------------------
// Firebase Cloud Messaging client
// Sends push notifications to Flutter app via FCM Data Messages.
// High-priority so the device wakes even in Doze mode (Android) / background (iOS).
//
// Data-only messages are used instead of notification messages so the Flutter
// app can customise the alert UI (sound, vibration, full-screen intent) based
// on crisis severity.
// ---------------------------------------------------------------------------

export interface StaffDispatchPayload {
  crisisId: string;
  venueId: string;
  crisisType: string;
  severity: number;
  floor: string;
  zone?: string;
  instruction: string;
  dispatchId: string;
}

export interface GuestAlertPayload {
  crisisId: string;
  venueId: string;
  message: string;
  evacuationRoute: string;
  affectedFloors: string[];
  tone: 'calm' | 'urgent';
}

/**
 * Sends a high-priority dispatch notification to a single staff member's device.
 * Token is the FCM registration token stored on the personnel Firestore document.
 * Returns true if the message was accepted by FCM, false on any error.
 */
export async function sendStaffDispatch(
  fcmToken: string,
  payload: StaffDispatchPayload
): Promise<boolean> {
  if (!config.fcmEnabled) {
    logger.info('fcmClient: FCM disabled — skipping staff dispatch', {
      crisis_id: payload.crisisId,
      dispatch_id: payload.dispatchId,
    });
    return true; // treat as success so pipeline continues
  }

  try {
    const messageId = await getMessaging().send({
      token: fcmToken,
      android: {
        priority: 'high',
        ttl: 60 * 1000, // 60 s — crisis notifications expire fast
      },
      apns: {
        headers: { 'apns-priority': '10' },
      },
      // Data-only: Flutter handles the in-app alert with full-screen intent
      data: {
        type: 'staff_dispatch',
        crisis_id: payload.crisisId,
        venue_id: payload.venueId,
        crisis_type: payload.crisisType,
        severity: String(payload.severity),
        floor: payload.floor,
        zone: payload.zone ?? '',
        instruction: payload.instruction,
        dispatch_id: payload.dispatchId,
      },
    });

    logger.info('fcmClient: staff dispatch sent', {
      message_id: messageId,
      crisis_id: payload.crisisId,
      dispatch_id: payload.dispatchId,
    });

    return true;
  } catch (err) {
    logger.error('fcmClient: staff dispatch failed', {
      error: err instanceof Error ? err.message : String(err),
      crisis_id: payload.crisisId,
      dispatch_id: payload.dispatchId,
    });
    return false;
  }
}

/**
 * Sends a calm/urgent guest alert to a topic (venue-scoped).
 * All guest devices subscribed to the topic receive the notification.
 * Topic format: `venue_{venueId}_guests`
 */
export async function sendGuestAlert(payload: GuestAlertPayload): Promise<boolean> {
  if (!config.fcmEnabled) {
    logger.info('fcmClient: FCM disabled — skipping guest alert', {
      crisis_id: payload.crisisId,
    });
    return true;
  }

  const topic = `venue_${payload.venueId}_guests`;

  try {
    const messageId = await getMessaging().send({
      topic,
      android: { priority: payload.tone === 'urgent' ? 'high' : 'normal' },
      apns: {
        headers: { 'apns-priority': payload.tone === 'urgent' ? '10' : '5' },
      },
      data: {
        type: 'guest_alert',
        crisis_id: payload.crisisId,
        venue_id: payload.venueId,
        message: payload.message,
        evacuation_route: payload.evacuationRoute,
        affected_floors: payload.affectedFloors.join(','),
        tone: payload.tone,
      },
    });

    logger.info('fcmClient: guest alert sent', {
      topic,
      message_id: messageId,
      crisis_id: payload.crisisId,
      tone: payload.tone,
    });

    return true;
  } catch (err) {
    logger.error('fcmClient: guest alert failed', {
      error: err instanceof Error ? err.message : String(err),
      crisis_id: payload.crisisId,
      topic,
    });
    return false;
  }
}
