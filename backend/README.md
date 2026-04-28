# HAVEN Backend

Production-first backend for HAVEN, an AI-powered episode response system using Firebase Functions Gen2 + Firestore + Pub/Sub.

## 🤖 AI/ML Intelligence Layer

The backend integrates multi-modal AI reasoning for real-time crisis response:

### Classification Pipeline (Gemini 2.5 Flash)
- **Input:** Text reports + optional voice transcripts + optional camera frames
- **Processing:** 
  - Speech-to-Text transcription (Indian English primary, Hindi/US English fallbacks)
  - Cloud Vision API visual feature extraction (person count, fire/smoke signals, security threats)
  - Gemini Flash analysis with multi-modal context
- **Output:** Crisis type (fire/medical/security/stampede/structural), severity (1–5), floor/zone, confidence, reasoning

### Orchestration Pipeline (Gemini 2.5 Pro)
- **Input:** Crisis details + full venue context (personnel roster, evacuation routes, equipment stations)
- **Processing:** 
  - Gemini Pro incident commander reasoning
  - Multi-dispatch planning with role-suitability matching
  - Guest notification generation (tone-aware, location-specific)
  - Control room summary with decision alternatives
- **Output:** Dispatch instructions, guest messages, escalation recommendations, confidence score

### Resilience Strategy
- **Fallback:** If Gemini is unavailable, falls back to proximity-based single-responder selection
- **Async Processing:** Crisis reports return immediately; Gemini analysis runs in background workers
- **Event Pub/Sub:** Decouples classification and orchestration for independent scaling

## Quick start

1. `pnpm install`
2. `pnpm run typecheck`
3. `pnpm run build`

## Local run

1. Copy `example.env` to `.env` and adjust values.
   - Set `GEMINI_API_KEY` to your API key from [aistudio.google.com](https://aistudio.google.com)
   - Set `GCP_PROJECT_ID` to your Firebase project ID
2. Start API + Firestore emulator with Docker Compose:
   `docker compose up --build`
3. Or run Firebase emulators directly:
   `pnpm run start`
4. For real Firestore instead of emulator, set `GOOGLE_APPLICATION_CREDENTIALS` before starting the server; see `DEVELOPMENT.md`.

## Quality checks

1. `pnpm run format:check`
2. `pnpm run typecheck`
3. `pnpm run test:contract`
4. `npm run test:ml` (test Gemini classification and orchestration with real API key)

## Deployment

- Cloud Run container deploy and Firebase Functions deploy instructions are documented in `DEPLOYMENT.md`.

## Architecture Notes

- This backend is intentionally contract-first and stateless.
- External API is exposed under `/api/v1` with OpenAPI 3.1 spec.
- Internal orchestration is event-driven via Google Cloud Pub/Sub.
- All AI integrations have graceful fallbacks to ensure pipeline resilience.
- Firestore is the operational source of truth; Pub/Sub provides event ordering.
