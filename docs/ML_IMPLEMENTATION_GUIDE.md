# HAVEN — ML Implementation Guide
## What Was Built & How to Test It

---

## Table of Contents

1. [What Was Built](#1-what-was-built)
2. [The Full Pipeline — How It Works](#2-the-full-pipeline)
3. [File Map — Every New or Changed File](#3-file-map)
4. [Setup — Before You Test Anything](#4-setup)
5. [Testing Each Step](#5-testing-each-step)
6. [Running the Full Demo](#6-running-the-full-demo)
7. [What to Watch in Firestore](#7-what-to-watch-in-firestore)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. What Was Built

Starting from the existing backend skeleton (Firebase Cloud Functions, Express, Firestore), the following ML and AI capabilities were added on the `ml` branch:

### Step 1 — Config & Keys
Added `GEMINI_API_KEY`, `GCP_PROJECT_ID`, `FCM_ENABLED`, and `DEMO_API_KEY` to the config system. All keys are read from environment variables and never hardcoded.

### Step 2 — Gemini Flash Classification
**File:** `src/integrations/gemini/geminiClient.ts`

Replaced the old regex stub with real Gemini 1.5 Flash classification. When a crisis report arrives, Gemini reads the text and returns structured JSON:
- `crisis_type`: fire / medical / security / stampede / structural / unknown
- `severity`: 1–5
- `confidence`: 0.0–1.0
- `floor` and `zone`: extracted from the text
- `reasoning`: one sentence explaining the decision

Also contains `orchestrateWithGemini()` — the Gemini 1.5 Pro full incident commander call (used in Step 5).

### Step 3 — Voice Reports via Speech-to-Text
**Files:** `src/integrations/speech/speechToText.ts`, `src/handlers/crisis/postReport.ts`, `src/contracts/api/crisis.ts`

The Flutter app can now send a base64-encoded audio clip instead of typed text. The backend transcribes it using Google Speech-to-Text before anything else runs:
- Primary language: Indian English (`en-IN`)
- Fallbacks: Hindi (`hi-IN`), US English (`en-US`)
- Model: `latest_long` with enhanced accuracy
- If transcription fails, the pipeline continues — it doesn't crash

New request fields added: `audio_base64`, `audio_encoding` (WEBM_OPUS default), `audio_sample_rate`.

### Step 4 — Camera Frame Analysis via Cloud Vision
**Files:** `src/integrations/vision/visionClient.ts`, `src/workers/classifyCrisis.ts`

The Flutter app can attach a base64-encoded camera frame to a report. The classify worker sends it to Cloud Vision API in a single batched call that returns:
- **Person count** (from OBJECT_LOCALIZATION) → crowd density score: LOW / MEDIUM / HIGH / CRITICAL
- **Fire/smoke signal** (from LABEL_DETECTION, threshold 0.70)
- **Security signal** (from LABEL_DETECTION + SAFE_SEARCH violence level)
- **Objects and scene labels** for additional context

All of this gets injected into the Gemini Flash prompt alongside the text, giving Gemini eyes as well as words.

### Step 5 — Gemini Pro Full Orchestration
**File:** `src/workers/orchestrateResponse.ts`

Replaced the rule-based single-dispatch logic with a full Gemini 1.5 Pro Incident Commander decision. Gemini receives:
- The classified crisis (type, severity, floor, zone, report text)
- All available personnel with their names, roles, floors, and certifications
- All open evacuation routes
- All equipment station locations
- Current time

Gemini returns:
- **Multiple dispatch decisions** — each with a specific staff member, instruction, equipment list, and route
- **Guest notification message** — tone-appropriate (calm vs urgent), with evacuation route
- **Control room summary** — one-sentence situation report
- **Alternatives considered** — what other options Gemini rejected and why
- **External escalation decision** — whether to call fire dept / ambulance / police and when
- **Decision reasoning** — full explanation stored in Firestore

If Gemini fails for any reason, the worker falls back to the original proximity-based single-dispatch so the pipeline never stops.

### Step 6 — FCM Push to Staff Devices
**Files:** `src/integrations/fcm/fcmClient.ts`, `src/workers/dispatchToStaff.ts`

When a dispatch is created, the worker sends a high-priority FCM data message to the staff member's phone. The Flutter app receives it and shows a full-screen alert with Gemini's exact instruction.

Key design decisions:
- Data-only messages (not notification messages) — Flutter controls the UI, sound, and vibration based on severity
- If a staff member has no FCM token yet, the pipeline marks dispatch as notified anyway and logs a warning — it never stalls

### Step 7 — FCM Broadcast to Guests
**Files:** `src/integrations/fcm/fcmClient.ts`, `src/workers/notifyGuests.ts`, `src/index.ts`

After orchestration, a new worker fires a topic broadcast to all guest devices subscribed to `venue_{venueId}_guests`. The message contains Gemini's guest-facing notification with the evacuation route and affected floors.

Flutter guest app subscribes to this topic on login. One Pub/Sub event → every guest device in the venue gets the alert simultaneously.

### Step 8 — Firestore Demo Seed
**File:** `scripts/seed.ts`

A single command (`npm run seed`) populates Firestore with a complete demo venue:

| What | Details |
|---|---|
| Venue | Grand Meridian Hotel, Bengaluru |
| Personnel | 6 staff: fire marshal (Rajesh Kumar, floor 3), medical officer (Dr. Priya Sharma, floor 2), 2× security (floors 1 & 4), 2× general staff |
| Evacuation routes | 5 routes (4 open, 1 closed as a realistic detail) |
| Equipment | 9 stations: fire extinguishers, AEDs, first-aid kits, hose reels |
| Demo users | 4 user refs: manager, fire marshal, medical officer, guest |

All data is idempotent — safe to re-run.

### Step 9 — Demo Trigger Endpoint
**Files:** `src/handlers/demo/postDemoTrigger.ts`, `src/http/routes/demoRoutes.ts`

`POST /api/v1/demo/trigger` fires any of five pre-scripted scenarios through the real pipeline. No Firebase Auth needed — protected by `x-demo-key` header. Returns a `crisis_id` immediately so you can watch Firestore update in real time.

The five scenarios are production-quality crisis reports written to give Gemini strong signal for each crisis type.

---

## 2. The Full Pipeline

```
Flutter App
    │
    │  POST /api/v1/crises/report
    │  (report_text OR audio_base64 OR frame_base64 OR all three)
    │
    ▼
postReportHandler
    │  1. Transcribe audio_base64 → text (Speech-to-Text)
    │  2. Create CrisisDraft in Firestore (status: detected)
    │  3. Publish → crisis.created
    │
    ▼
classifyCrisis worker
    │  1. Fetch CrisisDraft from Firestore
    │  2. If frame_base64 present → Cloud Vision analysis (person count, fire/smoke, security signal)
    │  3. Gemini Flash: text + visual context → crisis_type, severity, confidence, reasoning
    │  4. Update Firestore (status: classified)
    │  5. Publish → orchestration.requested
    │
    ▼
orchestrateResponse worker
    │  1. Fetch crisis + all available personnel + evacuation routes + equipment (parallel)
    │  2. Gemini Pro: full venue context → multi-dispatch plan + guest notification
    │  3. Persist guest_notification, control_room_summary, alternatives_considered to Firestore
    │  4. For each dispatch decision:
    │     • Create dispatch record in Firestore
    │     • Publish → dispatch.requested
    │  5. Publish → guest.notification.requested
    │  6. If external escalation required → markEscalated in Firestore
    │
    ├─► dispatchToStaff worker (one per dispatch)
    │       1. Fetch dispatch record (Gemini's instruction)
    │       2. Fetch personnel record (FCM token)
    │       3. Send FCM high-priority data message to staff device
    │       4. Mark dispatch as notified in Firestore
    │
    └─► notifyGuests worker
            1. Send FCM topic broadcast to venue_{venueId}_guests
            2. All guest Flutter apps receive Gemini's alert message
```

---

## 3. File Map

### New Files
| File | Purpose |
|---|---|
| `src/integrations/gemini/geminiClient.ts` | Gemini Flash classification + Gemini Pro orchestration |
| `src/integrations/speech/speechToText.ts` | Google Speech-to-Text wrapper |
| `src/integrations/vision/visionClient.ts` | Cloud Vision API wrapper |
| `src/integrations/fcm/fcmClient.ts` | FCM staff dispatch + guest broadcast |
| `src/workers/notifyGuests.ts` | Guest notification worker |
| `src/handlers/demo/postDemoTrigger.ts` | Demo trigger handler |
| `src/http/routes/demoRoutes.ts` | Demo route registration |
| `scripts/seed.ts` | Firestore seed script |

### Modified Files
| File | What Changed |
|---|---|
| `src/bootstrap/config.ts` | Added `geminiApiKey`, `gcpProjectId`, `fcmEnabled`, `demoApiKey` |
| `src/bootstrap/app.ts` | Registered `demoRoutes` |
| `src/contracts/api/crisis.ts` | Added `audio_base64`, `audio_encoding`, `audio_sample_rate`, `frame_base64` to request schema |
| `src/contracts/events/pipelineEvents.ts` | Added `guestNotificationRequestedEventSchema` |
| `src/repositories/crisisRepo.ts` | Added `getDispatchById()`, `applyOrchestration()`, `OrchestrationInput` interface |
| `src/repositories/personnelRepo.ts` | Added `fcm_token`, `name`, `certifications` to `PersonnelRecord` and `ResponderCandidate` |
| `src/services/crisisService.ts` | Passes `frame_base64` to draft |
| `src/handlers/crisis/postReport.ts` | Added Speech-to-Text transcription before draft creation |
| `src/workers/classifyCrisis.ts` | Replaced regex stub with Gemini Flash + Cloud Vision |
| `src/workers/orchestrateResponse.ts` | Replaced rule-based dispatch with Gemini Pro + publishes guest notification event |
| `src/workers/dispatchToStaff.ts` | Added FCM push to staff device |
| `src/index.ts` | Registered `notifyGuests` Cloud Function |
| `example.env` | Added new env var examples |
| `package.json` | Added `tsx` devDep, added `seed` script |

---

## 4. Setup

### Prerequisites
- Node.js 20+
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Firebase project created (get the project ID from Firebase console)
- A Gemini API key from [aistudio.google.com](https://aistudio.google.com)
- Google Application Default Credentials configured:
  ```bash
  gcloud auth application-default login
  ```

### Environment Variables
Copy `example.env` to `.env` and fill in your values:

```bash
cp example.env .env
```

Required values to fill in:
```
GEMINI_API_KEY=your-key-from-aistudio.google.com
GCP_PROJECT_ID=your-firebase-project-id
```

Leave everything else as-is for local testing with emulators.

### Install Dependencies
```bash
cd backend
npm install
```

### Seed the Demo Data
```bash
# Make sure GOOGLE_APPLICATION_CREDENTIALS or ADC is set
npm run seed
```

Expected output:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HAVEN  —  Demo Seed
  Venue : venue_demo_001
  Tenant: tenant_demo_001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 Tenant
  ✓  tenant               tenant_demo_001

📍 Venue
  ✓  venue                venue_demo_001
...
  ✅  Seed complete
```

---

## 5. Testing Each Step

### Test 1 — TypeScript compiles clean
```bash
npm run typecheck
```
Should exit with no output and no errors.

### Test 2 — Gemini Classification
Start the server with `AUTH_DISABLED=true` and `PUBSUB_DISABLED=true` in `.env`, then:

```bash
curl -X POST http://localhost:8080/api/v1/crises/report \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: test-001' \
  -H 'Authorization: Bearer <any-token-when-auth-disabled>' \
  -d '{
    "venue_id": "venue_demo_001",
    "floor": "3",
    "zone": "Kitchen",
    "report_text": "There is heavy smoke coming from the kitchen, I can see flames",
    "trigger_sources": ["manual"]
  }'
```

Check Firestore → `venues/venue_demo_001/crises/{crisis_id}` — after a few seconds it should show `status: "classified"` with `crisis_type`, `severity`, `confidence`, and `gemini_reasoning` populated.

### Test 3 — Speech-to-Text
Send a base64-encoded audio file instead of text:

```bash
# Encode a WAV/WebM file
AUDIO_B64=$(base64 -i your_recording.webm)

curl -X POST http://localhost:8080/api/v1/crises/report \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: test-audio-001' \
  -d "{
    \"venue_id\": \"venue_demo_001\",
    \"floor\": \"2\",
    \"audio_base64\": \"$AUDIO_B64\",
    \"audio_encoding\": \"WEBM_OPUS\",
    \"trigger_sources\": [\"voice_report\"]
  }"
```

Check the server logs — you should see `postReportHandler: transcription succeeded` with the transcript text.

### Test 4 — Demo Trigger (easiest full pipeline test)
This is the fastest way to test everything end-to-end:

```bash
curl -X POST http://localhost:8080/api/v1/demo/trigger \
  -H 'Content-Type: application/json' \
  -H 'x-demo-key: haven-demo-2024' \
  -d '{"scenario": "fire", "venue_id": "venue_demo_001"}'
```

Response:
```json
{
  "crisis_id": "abc-123-...",
  "venue_id": "venue_demo_001",
  "scenario": "fire",
  "floor": "3",
  "zone": "Kitchen / Restaurant",
  "report_text": "Heavy smoke visible coming from the kitchen...",
  "pipeline_started": true,
  "message": "Demo crisis created. Watch Firestore: venues/venue_demo_001/crises/abc-123-..."
}
```

Take the `crisis_id` from the response and watch Firestore update in real time (see Section 7).

### Test 5 — All Five Scenarios
Run each scenario one at a time with a different `Idempotency-Key`:

```bash
for SCENARIO in fire medical security stampede structural; do
  curl -s -X POST http://localhost:8080/api/v1/demo/trigger \
    -H 'Content-Type: application/json' \
    -H 'x-demo-key: haven-demo-2024' \
    -d "{\"scenario\": \"$SCENARIO\", \"venue_id\": \"venue_demo_001\"}" \
    | python3 -m json.tool
  sleep 2
done
```

---

## 6. Running the Full Demo

### Step-by-step for judges

**1. Start the backend with emulators:**
```bash
cd backend
npm start
```
This starts Firebase emulators for Firestore, Pub/Sub, and Functions.

**2. Seed the demo data (first time only):**
```bash
npm run seed
```

**3. Fire a crisis:**
```bash
curl -X POST http://localhost:8080/api/v1/demo/trigger \
  -H 'Content-Type: application/json' \
  -H 'x-demo-key: haven-demo-2024' \
  -d '{"scenario": "stampede", "venue_id": "venue_demo_001"}'
```

**4. Copy the `crisis_id` from the response.**

**5. Watch the pipeline run:**
```bash
# Poll the crisis document every 2 seconds
CRISIS_ID="paste-your-crisis-id-here"
watch -n 2 curl -s "http://localhost:8080/api/v1/crises/$CRISIS_ID?venue_id=venue_demo_001"
```

Or open the Firebase Emulator UI at `http://localhost:4000` and navigate to the crisis document in Firestore.

### What the judges will see

| Time | Firestore update |
|---|---|
| 0s | `status: "detected"` — crisis created |
| ~2s | `status: "classified"` — Gemini Flash result: type, severity, confidence, reasoning |
| ~5s | `status: "dispatched"` — Gemini Pro plan: guest_notification, control_room_summary, alternatives_considered |
| ~5s | Multiple dispatch records appear under `crises/{id}/dispatch/` |
| ~6s | Staff FCM push sent (logged in console) |
| ~6s | Guest FCM topic broadcast sent (logged in console) |

For the **stampede** scenario, Gemini will also set `external_escalation.required: true` and call `markEscalated()` — demonstrating AI-driven 999/emergency service escalation.

---

## 7. What to Watch in Firestore

Navigate to: `venues/venue_demo_001/crises/{crisis_id}`

### After classification
```json
{
  "status": "classified",
  "crisis_type": "fire",
  "severity": 4,
  "confidence": 0.92,
  "gemini_reasoning": "Report describes visible flames and smoke in kitchen area with fire alarm activation — consistent with active fire at severity 4.",
  "classified_at": "2024-..."
}
```

### After orchestration
```json
{
  "status": "dispatched",
  "guest_notification": {
    "message": "Please calmly proceed to the nearest exit using the North Stairwell.",
    "evacuation_route": "North Stairwell",
    "affected_floors": ["3", "2"],
    "tone": "calm"
  },
  "control_room_summary": "Active fire on floor 3 kitchen. Fire marshal and security dispatched. North Stairwell open for evacuation.",
  "gemini_reasoning": "Selected Rajesh Kumar (fire_marshal, floor 3) as primary — closest trained responder...",
  "alternatives_considered": [
    "Sending general staff as primary — rejected, no fire safety certification",
    "Waiting for external fire department — rejected, trained responder on site"
  ]
}
```

### Dispatch sub-collection
Check `crises/{id}/dispatch/` — each document is one staff assignment with `status: "notified"` once FCM is sent.

### Timeline sub-collection
Check `crises/{id}/timeline/` — every pipeline event is logged in order: `crisis_detected → crisis_classified → orchestration_complete → dispatch_assigned → dispatch_notified`.

---

## 8. Troubleshooting

### "Gemini API key not set"
Make sure `GEMINI_API_KEY` is in your `.env` file and the server was restarted after you added it.

### "Firebase project not found"
Set `GCP_PROJECT_ID` in `.env` to match your Firebase project ID exactly (from Firebase console → Project settings).

### Workers not firing after demo trigger
Check that `PUBSUB_DISABLED=false` in `.env`. If using emulators, the Pub/Sub emulator must be running (`npm start` starts it automatically).

### "No FCM token for staff member"
This is expected in local testing — staff FCM tokens are written by the Flutter app on login. The pipeline logs a warning and continues. To test FCM, add a real token to a personnel document in Firestore:
```
venues/venue_demo_001/personnel/staff_fire_01
→ fcm_token: "your-real-fcm-token"
```

### Seed script fails with "Could not load the default credentials"
Run:
```bash
gcloud auth application-default login
```
Then re-run `npm run seed`.

### TypeScript errors
```bash
npm run typecheck
```
All errors should be zero. If something is broken, it's likely a missing env var or a stale `lib/` build. Run `npm run build` to recompile.

---

## Summary

Nine components were built on the `ml` branch, all sitting as uncommitted local changes:

```
Voice (Speech-to-Text)  ──┐
Camera (Cloud Vision)   ──┼──► Gemini Flash ──► Gemini Pro ──► FCM Staff Push
Text report             ──┘    (classify)       (orchestrate)   FCM Guest Broadcast
```

Everything is wired end-to-end. One `curl` to the demo trigger endpoint fires the full AI pipeline from intake to notification.
