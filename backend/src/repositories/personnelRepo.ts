import { randomUUID } from 'crypto';
import { firestore } from '../integrations/firebase/firestoreClient';
import { AppError } from '../utils/errors';

export interface PersonnelRecord {
  staff_id: string;
  venue_id: string;
  name?: string;
  role: string;
  floor?: string;
  on_shift: boolean;
  status:
    | 'available'
    | 'responding'
    | 'on_scene'
    | 'need_help'
    | 'resolved'
    | 'unavailable'
    | 'off_shift';
  current_assignment?: string | null;
  // FCM registration token — set by the Flutter app on login / token refresh
  fcm_token?: string;
}

export interface StatusUpdateInput {
  venueId: string;
  staffId: string;
  status: PersonnelRecord['status'];
  crisisId?: string;
  note?: string;
}

export interface ResponderCandidate {
  staff_id: string;
  name?: string;
  role: string;
  floor?: string;
  certifications?: string[];
}

export class PersonnelRepository {
  public async getById(venueId: string, staffId: string): Promise<PersonnelRecord | null> {
    const snapshot = await firestore
      .collection('venues')
      .doc(venueId)
      .collection('personnel')
      .doc(staffId)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    return snapshot.data() as PersonnelRecord;
  }

  public async updateMyStatus(input: StatusUpdateInput): Promise<void> {
    const personnelRef = firestore
      .collection('venues')
      .doc(input.venueId)
      .collection('personnel')
      .doc(input.staffId);

    const crisisRef = input.crisisId
      ? firestore.collection('venues').doc(input.venueId).collection('crises').doc(input.crisisId)
      : null;

    await firestore.runTransaction(async tx => {
      const personnelSnapshot = await tx.get(personnelRef);
      if (!personnelSnapshot.exists) {
        throw new AppError({
          code: 'RESOURCE_NOT_FOUND',
          message: 'Personnel record not found',
          httpStatus: 404,
        });
      }

      tx.update(personnelRef, {
        status: input.status,
        current_assignment: input.crisisId ?? null,
        updated_at: new Date().toISOString(),
      });

      if (crisisRef) {
        const crisisSnapshot = await tx.get(crisisRef);
        if (!crisisSnapshot.exists) {
          throw new AppError({
            code: 'RESOURCE_NOT_FOUND',
            message: 'Crisis not found for status update',
            httpStatus: 404,
          });
        }

        const timelineRef = crisisRef.collection('timeline').doc(randomUUID());
        tx.create(timelineRef, {
          event: 'staff_status_updated',
          type: 'update',
          timestamp: new Date().toISOString(),
          actor_id: input.staffId,
          status: input.status,
          note: input.note,
        });

        if (input.status === 'resolved') {
          tx.update(crisisRef, {
            status: 'resolved',
            resolved_at: new Date().toISOString(),
          });
        } else if (input.status === 'responding' || input.status === 'on_scene') {
          tx.update(crisisRef, {
            status: 'active',
          });
        }
      }
    });
  }

  public async listAvailableResponders(
    venueId: string,
    roles: string[]
  ): Promise<ResponderCandidate[]> {
    const baseRef = firestore
      .collection('venues')
      .doc(venueId)
      .collection('personnel')
      .where('on_shift', '==', true)
      .where('status', '==', 'available');

    const query = roles.length > 0 ? baseRef.where('role', 'in', roles) : baseRef;
    const snapshot = await query.limit(20).get();
    return snapshot.docs.map(doc => {
      const data = doc.data() as PersonnelRecord & { certifications?: string[] };
      return {
        staff_id: data.staff_id ?? doc.id,
        name: data.name,
        role: data.role,
        floor: data.floor,
        certifications: data.certifications,
      };
    });
  }
}

export const personnelRepo = new PersonnelRepository();
