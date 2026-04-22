# HAVEN Backend

Production-first backend scaffold for HAVEN using Firebase Functions Gen2 + Firestore + Pub/Sub.

## Quick start

1. `pnpm install`
2. `pnpm run typecheck`
3. `pnpm run build`

## Local run

1. Copy `example.env` to `.env` and adjust values.
2. Start API + Firestore emulator with Docker Compose:
   `docker compose up --build`
3. Or run Firebase emulators directly:
   `pnpm run start`
4. For real Firestore instead of emulator, set `GOOGLE_APPLICATION_CREDENTIALS` (or `GOOGLE_APPLICATION_CREDENTIALS_JSON`) before starting the server; see `DEVELOPMENT.md`.

## Quality checks

1. `pnpm run format:check`
2. `pnpm run typecheck`
3. `pnpm run test:contract`

## Deployment

- Cloud Run container deploy and Firebase Functions deploy instructions are documented in `DEPLOYMENT.md`.

## Notes

- This folder is intentionally contract-first and stateless.
- External API is exposed under `/api/v1`.
- Internal orchestration is event-driven via Pub/Sub.
