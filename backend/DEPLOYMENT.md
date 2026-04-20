# HAVEN Backend Deployment Guide

This backend supports two deployment modes:

1. Firebase Functions Gen2 for API + workers (recommended for current architecture)
2. Cloud Run container for API-only runtime (useful for containerized deployment and custom networking)

## Prerequisites

- Google Cloud project with billing enabled
- Firebase project linked to the same GCP project
- Enabled APIs:
  - Cloud Functions
  - Cloud Run
  - Firestore
  - Pub/Sub
  - Cloud Build
  - Artifact Registry
  - Cloud Scheduler
- Installed CLIs:
  - gcloud
  - firebase-tools
  - pnpm
  - docker (for container flow)

## Environment setup

1. Copy `.env.example` to `.env`.
2. For production, keep:
   - `AUTH_DISABLED=false`
   - `PUBSUB_DISABLED=false`
3. Set region via `GCP_REGION` (for example `us-central1`).

## Option A: Deploy as Firebase Functions Gen2 (API + workers)

### 1) Install and build

```bash
pnpm install
pnpm run typecheck
pnpm run build
```

### 2) Configure Firebase project

```bash
firebase login
firebase use <your-firebase-project-id>
```

### 3) Deploy backend functions

Run from `backend/`:

```bash
firebase deploy --config firebase.json --only functions
```

### 4) Deploy Firestore rules and indexes

```bash
firebase deploy --config firebase.json --only firestore:rules,firestore:indexes
```

### 5) Create Pub/Sub topics and scheduler job

```bash
gcloud pubsub topics create crisis.created --project <project-id>
gcloud pubsub topics create orchestration.requested --project <project-id>
gcloud pubsub topics create dispatch.requested --project <project-id>

gcloud scheduler jobs create pubsub monitor-escalation \
  --schedule="* * * * *" \
  --topic=monitor-escalation-tick \
  --message-body='{"tick":true}' \
  --location=<region> \
  --project=<project-id>
```

## Option B: Deploy API as Cloud Run container

This option runs `src/server.ts` output (`lib/server.js`) as a containerized HTTP service.

### 1) Build and push image with Cloud Build

Run from `backend/`:

```bash
gcloud builds submit --tag <region>-docker.pkg.dev/<project-id>/<repo>/haven-backend:latest
```

### 2) Deploy to Cloud Run

```bash
gcloud run deploy haven-backend-api \
  --image <region>-docker.pkg.dev/<project-id>/<repo>/haven-backend:latest \
  --region <region> \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars SERVICE_NAME=haven-backend,AUTH_DISABLED=false,PUBSUB_DISABLED=false
```

### 3) Configure service account permissions

Grant runtime identity access to Firestore and Pub/Sub publishing.

```bash
gcloud projects add-iam-policy-binding <project-id> \
  --member="serviceAccount:<service-account-email>" \
  --role="roles/datastore.user"

gcloud projects add-iam-policy-binding <project-id> \
  --member="serviceAccount:<service-account-email>" \
  --role="roles/pubsub.publisher"
```

## Local Docker workflow

Run from `backend/`:

```bash
cp .env.example .env
docker compose up --build
```

- API will be available on `http://localhost:8080`
- Firestore emulator will be available on `localhost:8081`

## Recommended production rollout

1. Deploy to staging project first.
2. Run:
   - `pnpm run typecheck`
   - `pnpm run test:contract`
   - `pnpm run openapi:check`
3. Verify health endpoint and report->dispatch flow.
4. Roll out to production using gradual traffic split (for Cloud Run) or staged function deploys.

## Notes

- Keep API contract changes in sync with `openapi/openapi.v1.yaml`.
- Keep `AUTH_DISABLED` off in non-local environments.
- For multi-property operation, ensure Firebase custom claims include `tenant_id` and `venue_ids`.
