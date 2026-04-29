import { Request, Response } from 'express';
import { getLatestResult } from '../../demo/resultStore';

// ---------------------------------------------------------------------------
// GET /api/v1/demo/latest
// Returns the most recent Gemini analysis result stored in memory.
// Polled every 3 s by argos_staff (Flutter) and argos_control_room (React).
// Returns 204 when no analysis has been run yet.
// ---------------------------------------------------------------------------

export function getLatestResultHandler(req: Request, res: Response): void {
  const result = getLatestResult();

  if (!result) {
    res.status(204).end();
    return;
  }

  res.status(200).json(result);
}
