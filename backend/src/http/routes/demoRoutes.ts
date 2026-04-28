import { Router } from 'express';
import { postDemoTriggerHandler } from '../../handlers/demo/postDemoTrigger';
import { postDemoAnalyzeHandler } from '../../handlers/demo/postDemoAnalyze';
import { asyncHandler } from '../../utils/asyncHandler';

export const demoRoutes = Router();

// POST /api/v1/demo/trigger
// Fires a pre-scripted crisis scenario through the full pipeline.
// Protected by x-demo-key header. No Firebase Auth required.
demoRoutes.post('/trigger', asyncHandler(postDemoTriggerHandler));

// POST /api/v1/demo/analyze
// Synchronous Gemini analysis — classify + orchestrate in one HTTP call.
// Returns the full AI response directly to the caller (no Pub/Sub, no polling).
// Used by the Flutter demo app to show live AI results in real-time.
demoRoutes.post('/analyze', asyncHandler(postDemoAnalyzeHandler));
