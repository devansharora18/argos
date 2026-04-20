import { randomUUID } from 'crypto';
import { SensorType } from '../contracts/api/device';
import { firestore } from '../integrations/firebase/firestoreClient';
import { NormalizedTelemetryReading } from '../services/telemetryService';

interface SensorAggregate {
  floor: string;
  sensor_type: SensorType;
  sample_count: number;
  total_value: number;
  max_value: number;
  last_value: number;
  last_seen_at: string;
}

export interface TelemetrySummaryRecord {
  summary_id: string;
  venue_id: string;
  floor: string;
  sensor_type: SensorType;
  sample_count: number;
  total_value: number;
  max_value: number;
  last_value: number;
  last_seen_at: string;
  updated_at: string;
}

interface ListSummariesInput {
  floor?: string;
  sensorType?: SensorType;
  limit: number;
}

export class TelemetryRepository {
  private rawCollection(venueId: string) {
    return firestore.collection('venues').doc(venueId).collection('telemetry');
  }

  private summaryCollection(venueId: string) {
    return firestore.collection('venues').doc(venueId).collection('telemetry_summary');
  }

  public async writeReadings(
    venueId: string,
    readings: NormalizedTelemetryReading[]
  ): Promise<void> {
    const now = new Date().toISOString();
    const batch = firestore.batch();

    readings.forEach(reading => {
      const readingRef = this.rawCollection(venueId).doc(randomUUID());
      batch.set(readingRef, {
        reading_id: readingRef.id,
        venue_id: venueId,
        device_id: reading.device_id,
        floor: reading.floor,
        zone: reading.zone,
        sensor_type: reading.sensor_type,
        numeric_value: reading.numeric_value,
        unit: reading.unit,
        confidence: reading.confidence,
        captured_at: reading.captured_at,
        ingested_at: now,
      });
    });

    await batch.commit();

    const aggregates = new Map<string, SensorAggregate>();
    readings.forEach(reading => {
      const key = `${reading.floor}__${reading.sensor_type}`;
      const existing = aggregates.get(key);
      if (!existing) {
        aggregates.set(key, {
          floor: reading.floor,
          sensor_type: reading.sensor_type,
          sample_count: 1,
          total_value: reading.numeric_value,
          max_value: reading.numeric_value,
          last_value: reading.numeric_value,
          last_seen_at: reading.captured_at,
        });
        return;
      }

      existing.sample_count += 1;
      existing.total_value += reading.numeric_value;
      existing.max_value = Math.max(existing.max_value, reading.numeric_value);
      if (reading.captured_at >= existing.last_seen_at) {
        existing.last_value = reading.numeric_value;
        existing.last_seen_at = reading.captured_at;
      }
    });

    await firestore.runTransaction(async tx => {
      for (const [key, aggregate] of aggregates.entries()) {
        const summaryRef = this.summaryCollection(venueId).doc(key);
        const snapshot = await tx.get(summaryRef);
        const data = snapshot.exists ? (snapshot.data() as Partial<TelemetrySummaryRecord>) : null;

        const existingSampleCount = typeof data?.sample_count === 'number' ? data.sample_count : 0;
        const existingTotalValue = typeof data?.total_value === 'number' ? data.total_value : 0;
        const existingMaxValue =
          typeof data?.max_value === 'number' ? data.max_value : aggregate.max_value;
        const existingLastSeenAt = typeof data?.last_seen_at === 'string' ? data.last_seen_at : '';
        const existingLastValue =
          typeof data?.last_value === 'number' ? data.last_value : aggregate.last_value;

        const isNewer = aggregate.last_seen_at >= existingLastSeenAt;
        const merged: TelemetrySummaryRecord = {
          summary_id: key,
          venue_id: venueId,
          floor: aggregate.floor,
          sensor_type: aggregate.sensor_type,
          sample_count: existingSampleCount + aggregate.sample_count,
          total_value: existingTotalValue + aggregate.total_value,
          max_value: Math.max(existingMaxValue, aggregate.max_value),
          last_value: isNewer ? aggregate.last_value : existingLastValue,
          last_seen_at: isNewer ? aggregate.last_seen_at : existingLastSeenAt,
          updated_at: now,
        };

        tx.set(summaryRef, merged);
      }
    });
  }

  public async listSummaries(
    venueId: string,
    input: ListSummariesInput
  ): Promise<TelemetrySummaryRecord[]> {
    const snapshot = await this.summaryCollection(venueId).limit(500).get();
    const rows = snapshot.docs
      .map(doc => doc.data() as TelemetrySummaryRecord)
      .filter(summary => (input.floor ? summary.floor === input.floor : true))
      .filter(summary => (input.sensorType ? summary.sensor_type === input.sensorType : true))
      .sort((left, right) => right.updated_at.localeCompare(left.updated_at));

    return rows.slice(0, input.limit);
  }
}

export const telemetryRepo = new TelemetryRepository();
