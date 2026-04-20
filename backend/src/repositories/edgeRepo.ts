import { firestore } from '../integrations/firebase/firestoreClient';
import { AppError } from '../utils/errors';

interface EdgeDetectionRecord {
  detection_id: string;
  venue_id: string;
  device_id: string;
  detected_at: string;
  source: 'ingest' | 'replay';
  status: 'processing' | 'completed';
  correlation_id: string;
  created_at: string;
  processed_at?: string;
  crisis_id?: string;
}

export interface ReplayHealthSnapshot {
  processing_queue_depth: number;
  last_replay_batch_id: string | null;
  last_replay_at: string | null;
}

interface BeginDetectionInput {
  detectionId: string;
  venueId: string;
  deviceId: string;
  detectedAt: string;
  source: 'ingest' | 'replay';
  correlationId: string;
}

interface CompleteDetectionInput {
  detectionId: string;
  crisisId: string;
}

interface ReplayBatchResultInput {
  batchId: string;
  venueId: string;
  total: number;
  processed: number;
  duplicates: number;
  failed: number;
  outOfOrder: number;
  correlationId: string;
}

interface ReplayBatchRecord {
  batch_id: string;
  venue_id: string;
  total_count: number;
  processed_count: number;
  duplicate_count: number;
  failed_count: number;
  out_of_order_count: number;
  status: 'completed' | 'partial_failed';
  correlation_id: string;
  processed_at: string;
}

export class EdgeRepository {
  private detectionDocRef(detectionId: string) {
    return firestore.collection('edge_detections').doc(detectionId);
  }

  private replayBatchDocRef(batchId: string) {
    return firestore.collection('edge_replay_batches').doc(batchId);
  }

  public async beginDetection(
    input: BeginDetectionInput
  ): Promise<{ duplicate: boolean; crisisId?: string }> {
    const now = new Date().toISOString();
    const docRef = this.detectionDocRef(input.detectionId);

    return firestore.runTransaction(async tx => {
      const snapshot = await tx.get(docRef);
      if (snapshot.exists) {
        const existing = snapshot.data() as EdgeDetectionRecord;
        if (existing.status === 'completed') {
          return {
            duplicate: true,
            crisisId: existing.crisis_id,
          };
        }

        throw new AppError({
          code: 'EDGE_DETECTION_IN_PROGRESS',
          message: 'Edge detection is already being processed',
          httpStatus: 409,
          retryable: true,
        });
      }

      tx.create(docRef, {
        detection_id: input.detectionId,
        venue_id: input.venueId,
        device_id: input.deviceId,
        detected_at: input.detectedAt,
        source: input.source,
        status: 'processing',
        correlation_id: input.correlationId,
        created_at: now,
      } satisfies EdgeDetectionRecord);

      return {
        duplicate: false,
      };
    });
  }

  public async completeDetection(input: CompleteDetectionInput): Promise<void> {
    await this.detectionDocRef(input.detectionId).update({
      status: 'completed',
      crisis_id: input.crisisId,
      processed_at: new Date().toISOString(),
    } satisfies Partial<EdgeDetectionRecord>);
  }

  public async abandonDetection(detectionId: string): Promise<void> {
    await this.detectionDocRef(detectionId).delete();
  }

  public async recordReplayBatchResult(input: ReplayBatchResultInput): Promise<void> {
    const now = new Date().toISOString();
    await this.replayBatchDocRef(input.batchId).set({
      batch_id: input.batchId,
      venue_id: input.venueId,
      total_count: input.total,
      processed_count: input.processed,
      duplicate_count: input.duplicates,
      failed_count: input.failed,
      out_of_order_count: input.outOfOrder,
      status: input.failed > 0 ? 'partial_failed' : 'completed',
      correlation_id: input.correlationId,
      processed_at: now,
    } satisfies ReplayBatchRecord);
  }

  public async getReplayBatchResult(batchId: string): Promise<ReplayBatchRecord | null> {
    const snapshot = await this.replayBatchDocRef(batchId).get();
    if (!snapshot.exists) {
      return null;
    }

    return snapshot.data() as ReplayBatchRecord;
  }

  public async getReplayHealth(): Promise<ReplayHealthSnapshot> {
    const processing = await firestore
      .collection('edge_detections')
      .where('status', '==', 'processing')
      .limit(200)
      .get();

    const replay = await firestore
      .collection('edge_replay_batches')
      .orderBy('processed_at', 'desc')
      .limit(1)
      .get();

    const latest = replay.docs[0]?.data() as ReplayBatchRecord | undefined;

    return {
      processing_queue_depth: processing.size,
      last_replay_batch_id: latest?.batch_id ?? null,
      last_replay_at: latest?.processed_at ?? null,
    };
  }
}

export const edgeRepo = new EdgeRepository();
