import { randomUUID } from 'crypto';
import {
  DeviceHeartbeatBody,
  DeviceResponse,
  ListDevicesQuery,
  RegisterDeviceBody,
} from '../contracts/api/device';
import { firestore } from '../integrations/firebase/firestoreClient';
import { AppError } from '../utils/errors';

interface RegisterDeviceInput {
  venueId: string;
  body: RegisterDeviceBody;
  actorId: string;
}

interface UpdateHeartbeatInput {
  venueId: string;
  deviceId: string;
  heartbeat: DeviceHeartbeatBody;
}

export class DeviceRepository {
  private deviceCollection(venueId: string) {
    return firestore.collection('venues').doc(venueId).collection('devices');
  }

  private deviceDocRef(venueId: string, deviceId: string) {
    return this.deviceCollection(venueId).doc(deviceId);
  }

  public async registerDevice(input: RegisterDeviceInput): Promise<DeviceResponse> {
    const now = new Date().toISOString();
    const deviceId = randomUUID();
    const device: DeviceResponse & { created_by: string } = {
      device_id: deviceId,
      venue_id: input.venueId,
      external_device_id: input.body.external_device_id,
      device_type: input.body.device_type,
      model: input.body.model,
      floor: input.body.floor,
      zone: input.body.zone,
      sensor_types: input.body.sensor_types,
      capabilities: input.body.capabilities ?? {},
      status: 'online',
      created_at: now,
      updated_at: now,
      last_seen_at: now,
      created_by: input.actorId,
    };

    await this.deviceDocRef(input.venueId, deviceId).create(device);

    return device;
  }

  public async listDevices(venueId: string, query: ListDevicesQuery): Promise<DeviceResponse[]> {
    const snapshot = await this.deviceCollection(venueId)
      .orderBy('updated_at', 'desc')
      .limit(500)
      .get();

    const filtered = snapshot.docs
      .map(doc => doc.data() as DeviceResponse)
      .filter(device => (query.status ? device.status === query.status : true))
      .filter(device => (query.floor ? device.floor === query.floor : true));

    return filtered.slice(0, query.limit);
  }

  public async getById(venueId: string, deviceId: string): Promise<DeviceResponse | null> {
    const snapshot = await this.deviceDocRef(venueId, deviceId).get();
    if (!snapshot.exists) {
      return null;
    }

    return snapshot.data() as DeviceResponse;
  }

  public async updateHeartbeat(input: UpdateHeartbeatInput): Promise<DeviceResponse> {
    const now = new Date().toISOString();
    const docRef = this.deviceDocRef(input.venueId, input.deviceId);

    await firestore.runTransaction(async tx => {
      const snapshot = await tx.get(docRef);
      if (!snapshot.exists) {
        throw new AppError({
          code: 'RESOURCE_NOT_FOUND',
          message: 'Device not found',
          httpStatus: 404,
        });
      }

      tx.update(docRef, {
        status: input.heartbeat.status,
        last_seen_at: now,
        updated_at: now,
        heartbeat: {
          battery_pct: input.heartbeat.battery_pct,
          signal_strength: input.heartbeat.signal_strength,
          metadata: input.heartbeat.metadata ?? {},
          received_at: now,
        },
      });
    });

    const updated = await this.getById(input.venueId, input.deviceId);
    if (!updated) {
      throw new AppError({
        code: 'RESOURCE_NOT_FOUND',
        message: 'Device not found after heartbeat update',
        httpStatus: 404,
      });
    }

    return updated;
  }
}

export const deviceRepo = new DeviceRepository();
