# Backend Development (dev)

This document describes how to run the backend locally for development (recommended: Firebase Emulator) and options for using a real Firestore service account.

## Prerequisites

- Node.js >= 20
- pnpm (project uses pnpm)
- Firebase CLI (for emulators and deploys): `npm i -g firebase-tools`
- Docker (optional — for other services)

## Quick start (recommended: Firebase Emulator)

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Start Firebase emulators (from `backend` folder)

   ```bash
   firebase emulators:start --config firebase.json --only firestore,auth,pubsub
   ```

   - The repo's `example.env` sets `FIRESTORE_EMULATOR_HOST=127.0.0.1:8081` and `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`.
   - `firebase-admin` auto-detects the emulator when these env vars are present.

3. In a second terminal: load env vars, build, and run the Express server

   PowerShell:

   ```powershell
    Get-Content example.env | ForEach-Object {
    if ($_ -match '^\s*$|^\s*#') { } else {
        $parts = $_ -split '='
        $envName = $parts[0].Trim()
        $envVal  = $parts[1]
        ${env:$envName} = $envVal
    }
    }
    pnpm build
    pnpm start:server
   ```

   Bash / WSL:

   ```bash
   export $(cat example.env | xargs)
   pnpm build
   pnpm start:server
   ```

   - `pnpm start:server` runs the compiled JS: `node lib/server.js`.

4. Run emulator tests

   ```bash
   pnpm run test:emulator
   ```

## Using a GCP service account (real Firestore)

1. Create a service account in GCP with Firestore access and download a JSON key.
2. Set `GOOGLE_APPLICATION_CREDENTIALS` to point to the JSON file and run the server (PowerShell example):

   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\path\to\service-account.json'
   pnpm build
   pnpm start:server
   ```

   - You can also pass the key inline with `GOOGLE_APPLICATION_CREDENTIALS_JSON`.
   - Backend credential selection logic:
     - If `FIREBASE_USE_EMULATOR=true`, emulator endpoints are always used.
     - If `FIREBASE_USE_EMULATOR=false`, real Firestore/Auth is always used.
     - If `FIREBASE_USE_EMULATOR` is not set, service-account credentials (`GOOGLE_APPLICATION_CREDENTIALS` or `GOOGLE_APPLICATION_CREDENTIALS_JSON`) take precedence over emulator host env vars.

   Or in Bash:

   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
   pnpm build
   pnpm start:server
   ```

## Common env vars

See `example.env` in this folder. Key vars the backend uses:

- `SERVICE_NAME` — service name
- `PORT` — HTTP port
- `GCP_REGION` — region
- `FIRESTORE_EMULATOR_HOST` — emulator host:port
- `FIREBASE_AUTH_EMULATOR_HOST` — auth emulator host:port
- `PUBSUB_EMULATOR_HOST` — pubsub emulator host:port
- `GOOGLE_APPLICATION_CREDENTIALS` — path to service account JSON for real Firestore/Auth
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` — inline service account JSON (alternative to file path)
- `FIREBASE_USE_EMULATOR` — optional explicit mode override (`true` or `false`)
- `AUTH_DISABLED` — disables auth checks
- `PUBSUB_DISABLED` — disables pubsub

## Run emulators + server together (suggestion)

You can add a simple `dev` script to `package.json` that runs the emulator in one terminal and the server in another. Example using `concurrently` (optional):

```json
// dev scripts (example)
// 1) Install dev dep: pnpm add -D concurrently
// 2) Add script:
// "dev": "concurrently \"pnpm start\" \"pnpm --filter ./ start:server\""
```

## Deploy (dev)

Two common options for dev deploys:

- Cloud Run: build a Docker image and deploy; use Workload Identity or Secret Manager for credentials.
- Firebase Functions: only if you want to run as Functions; follow `firebase deploy --only functions` and ensure functions are present and configured.

Minimal Cloud Run example:

```bash
# build and push
docker build -t gcr.io/<PROJECT_ID>/haven-backend:dev .
docker push gcr.io/<PROJECT_ID>/haven-backend:dev

# deploy
gcloud run deploy haven-backend --image gcr.io/<PROJECT_ID>/haven-backend:dev --region us-central1 --platform managed
```

## Troubleshooting

- "Permission denied / Unauthorized": verify `GOOGLE_APPLICATION_CREDENTIALS` and service account roles, or use emulator for local dev.
- `firebase-admin` can't connect to emulator: ensure `FIRESTORE_EMULATOR_HOST` is exported before starting the server.
- Port conflicts: change `PORT` in env.
