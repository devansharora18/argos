import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type ServiceAccount,
} from 'firebase-admin/app';
import { logger } from '../../bootstrap/logger';

function readBooleanEnv(name: string): boolean | undefined {
  const raw = process.env[name];
  if (!raw) {
    return undefined;
  }

  const normalized = raw.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
    return true;
  }

  if (normalized === 'false' || normalized === '0' || normalized === 'no') {
    return false;
  }

  return undefined;
}

function hasServiceAccountHints(): boolean {
  return Boolean(
    process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  );
}

function parseInlineServiceAccount(): ServiceAccount | undefined {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as ServiceAccount;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid GOOGLE_APPLICATION_CREDENTIALS_JSON: ${reason}`);
  }
}

function getProjectIdFromInlineServiceAccount(account: ServiceAccount): string | undefined {
  const projectIdCandidate =
    (account as { project_id?: unknown; projectId?: unknown }).project_id ??
    (account as { project_id?: unknown; projectId?: unknown }).projectId;

  return typeof projectIdCandidate === 'string' && projectIdCandidate.length > 0
    ? projectIdCandidate
    : undefined;
}

function shouldUseFirebaseEmulator(): boolean {
  const explicitMode = readBooleanEnv('FIREBASE_USE_EMULATOR');
  if (explicitMode !== undefined) {
    return explicitMode;
  }

  if (hasServiceAccountHints()) {
    return false;
  }

  return Boolean(
    process.env.FIRESTORE_EMULATOR_HOST ||
    process.env.FIREBASE_AUTH_EMULATOR_HOST ||
    process.env.PUBSUB_EMULATOR_HOST
  );
}

function clearEmulatorHosts(): void {
  delete process.env.FIRESTORE_EMULATOR_HOST;
  delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
  delete process.env.PUBSUB_EMULATOR_HOST;
}

if (getApps().length === 0) {
  if (shouldUseFirebaseEmulator()) {
    initializeApp();
    logger.info('Firebase Admin initialized in emulator mode', {
      firestoreEmulatorHost: process.env.FIRESTORE_EMULATOR_HOST ?? null,
      authEmulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST ?? null,
    });
  } else {
    clearEmulatorHosts();

    const projectId = process.env.GOOGLE_CLOUD_PROJECT ?? process.env.GCLOUD_PROJECT;
    const inlineServiceAccount = parseInlineServiceAccount();

    if (inlineServiceAccount) {
      initializeApp({
        credential: cert(inlineServiceAccount),
        projectId: projectId ?? getProjectIdFromInlineServiceAccount(inlineServiceAccount),
      });
      logger.info('Firebase Admin initialized using GOOGLE_APPLICATION_CREDENTIALS_JSON');
    } else {
      initializeApp({
        credential: applicationDefault(),
        projectId,
      });
      logger.info('Firebase Admin initialized using application default credentials', {
        credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS ?? null,
      });
    }
  }
}
