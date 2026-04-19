# HAVEN Backend

Production-first backend scaffold for HAVEN using Firebase Functions Gen2 + Firestore + Pub/Sub.

## Quick start

1. `npm ci`
2. `npm run typecheck`
3. `npm run build`

## Notes

- This folder is intentionally contract-first and stateless.
- External API is exposed under `/api/v1`.
- Internal orchestration is event-driven via Pub/Sub.
