import { DemoAnalyzeResponse } from '../handlers/demo/postDemoAnalyze';

// ---------------------------------------------------------------------------
// In-memory store for the latest demo analysis result.
// All three frontends (argos_app, argos_staff, argos_control_room) poll
// GET /api/v1/demo/latest to pick this up in real-time.
// ---------------------------------------------------------------------------

export type StoredResult = DemoAnalyzeResponse & { timestamp: string };

let _latest: StoredResult | null = null;

export function storeResult(result: DemoAnalyzeResponse): void {
  _latest = { ...result, timestamp: new Date().toISOString() };
}

export function getLatestResult(): StoredResult | null {
  return _latest;
}
