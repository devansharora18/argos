import { firestore } from '../integrations/firebase/firestoreClient';
import { AppError } from '../utils/errors';
import { sha256 } from '../utils/hashing';

interface ExecuteOnceOptions {
  scope: string;
  actorId: string;
  idempotencyKey: string;
  requestHash: string;
  ttlHours: number;
}

interface IdempotencyRecord {
  request_hash: string;
  status: 'processing' | 'completed';
  response?: unknown;
  created_at: string;
  completed_at?: string;
  expires_at: string;
}

interface ExecuteResult<T> {
  replayed: boolean;
  response: T;
}

export class IdempotencyRepository {
  public async executeOnce<T>(
    options: ExecuteOnceOptions,
    operation: () => Promise<T>
  ): Promise<ExecuteResult<T>> {
    const docId = sha256(`${options.scope}:${options.actorId}:${options.idempotencyKey}`);
    const docRef = firestore.collection('idempotency').doc(docId);

    const nowIso = new Date().toISOString();
    const expiresAtIso = new Date(Date.now() + options.ttlHours * 60 * 60 * 1000).toISOString();

    const lockResult = await firestore.runTransaction(async tx => {
      const snapshot = await tx.get(docRef);

      if (snapshot.exists) {
        const existing = snapshot.data() as IdempotencyRecord;
        if (existing.request_hash !== options.requestHash) {
          throw new AppError({
            code: 'IDEMPOTENCY_KEY_REUSE_CONFLICT',
            message: 'Idempotency key cannot be reused with a different payload',
            httpStatus: 409,
          });
        }

        if (existing.status === 'completed') {
          return {
            replayed: true,
            response: existing.response as T,
          };
        }

        throw new AppError({
          code: 'IDEMPOTENCY_IN_PROGRESS',
          message: 'An equivalent request is still processing',
          httpStatus: 409,
          retryable: true,
        });
      }

      tx.create(docRef, {
        request_hash: options.requestHash,
        status: 'processing',
        created_at: nowIso,
        expires_at: expiresAtIso,
      } satisfies IdempotencyRecord);

      return {
        replayed: false,
        response: null as T | null,
      };
    });

    if (lockResult.replayed) {
      return {
        replayed: true,
        response: lockResult.response as T,
      };
    }

    try {
      const response = await operation();
      await docRef.update({
        status: 'completed',
        response,
        completed_at: new Date().toISOString(),
      } satisfies Partial<IdempotencyRecord>);

      return {
        replayed: false,
        response,
      };
    } catch (error) {
      await docRef.delete();
      throw error;
    }
  }
}

export const idempotencyRepo = new IdempotencyRepository();
