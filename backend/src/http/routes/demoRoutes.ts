import { Router } from 'express';
import { postDemoTriggerHandler } from '../../handlers/demo/postDemoTrigger';
import { asyncHandler } from '../../utils/asyncHandler';

export const demoRoutes = Router();

// POST /api/v1/demo/trigger
// Fires a pre-scripted crisis scenario through the full pipeline.
// Protected by x-demo-key header. No Firebase Auth required.
demoRoutes.post('/trigger', asyncHandler(postDemoTriggerHandler));
