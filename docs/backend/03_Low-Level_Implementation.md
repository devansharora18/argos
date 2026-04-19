# HAVEN Backend Code Implementation Plan - Low Level

## 1. Purpose

This document defines concrete code implementation details for the HAVEN backend. It is intended for direct engineering execution and code review.

Use this document together with:

- 01_Master_Plan.md
- 02_High-Level_Implementation.md

## 2. Runtime and Language Baseline

1. Node.js: 20.x
2. TypeScript: 5.x
3. Package manager: npm
4. Deploy target: Firebase Cloud Functions Gen2
5. Data store: Firestore
6. Event bus: Pub/Sub
7. Scheduler: Cloud Scheduler
8. Notifications: Firebase Cloud Messaging
9. AI clients: Gemini API and Vertex AI client SDK

## 3. Proposed Backend Folder Layout

```text
backend/
  package.json
  tsconfig.json
  .eslintrc.cjs
  .prettierrc
  src/
    index.ts
    bootstrap/
      app.ts
      config.ts
      logger.ts
      telemetry.ts
    contracts/
      api/
        crisis.ts
        personnel.ts
        manager.ts
        venue.ts
        analytics.ts
        common.ts
      events/
        crisisEvents.ts
        dispatchEvents.ts
        escalationEvents.ts
        edgeEvents.ts
      schemas/
        zod/
          apiSchemas.ts
          eventSchemas.ts
    auth/
      verifyFirebaseToken.ts
      roleGuard.ts
      claimTypes.ts
    http/
      middleware/
        requestId.ts
        errorHandler.ts
        validateBody.ts
        validateQuery.ts
      routes/
        crisisRoutes.ts
        personnelRoutes.ts
        managerRoutes.ts
        venueRoutes.ts
        analyticsRoutes.ts
    handlers/
      crisis/
        postReport.ts
        getCrisis.ts
        listCrises.ts
        getTimeline.ts
      personnel/
        getMe.ts
        patchMyStatus.ts
        getAssignment.ts
      manager/
        putOverride.ts
        postForceEscalation.ts
      venue/
        getFloorPlan.ts
        getOccupancy.ts
        listPersonnel.ts
      analytics/
        listIncidents.ts
      health/
        getHealth.ts
    workers/
      extractVisualFeatures.ts
      classifyCrisis.ts
      orchestrateResponse.ts
      dispatchToStaff.ts
      broadcastGuestNotification.ts
      monitorEscalation.ts
      generateDebrief.ts
      ingestEdgeDetection.ts
      replayEdgeBatch.ts
    services/
      crisisService.ts
      personnelService.ts
      escalationService.ts
      orchestrationService.ts
      routeEngineService.ts
      debriefService.ts
      edgeReplayService.ts
      notificationService.ts
    repositories/
      crisisRepo.ts
      personnelRepo.ts
      venueRepo.ts
      incidentRepo.ts
      idempotencyRepo.ts
    integrations/
      firebase/
        firestoreClient.ts
        fcmClient.ts
      pubsub/
        publisher.ts
        subscriber.ts
      ai/
        geminiClient.ts
        vertexClient.ts
      vision/
        cloudVisionClient.ts
      speech/
        speechToTextClient.ts
    jobs/
      schedulerEntrypoints.ts
    utils/
      time.ts
      retry.ts
      result.ts
      enum.ts
      hashing.ts
      correlation.ts
    tests/
      unit/
      integration/
      contract/
      emulator/
```

## 4. Core Schema Standards

### 4.1 Shared Field Rules

1. IDs: lower_snake_case UUID or ULID strings.
2. Timestamps: RFC3339 UTC string in API layer, Firestore Timestamp at repository layer.
3. Severity: integer 1..5.
4. Confidence: number 0.0..1.0.
5. Enum values are lowercase snake_case.
6. Every event and mutable command includes:
   - correlation_id
   - idempotency_key
   - schema_version

### 4.2 Error Envelope

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "severity must be between 1 and 5",
    "retryable": false,
    "correlation_id": "cor_01h...",
    "details": [
      {
        "field": "severity",
        "issue": "out_of_range"
      }
    ]
  }
}
```

## 5. API Endpoint to Handler Mapping

| Method | Path | Handler File | Roles |
|---|---|---|---|
| POST | /api/v1/crises/report | handlers/crisis/postReport.ts | guest, staff, manager |
| GET | /api/v1/crises/{crisisId} | handlers/crisis/getCrisis.ts | staff, manager |
| GET | /api/v1/crises | handlers/crisis/listCrises.ts | manager |
| GET | /api/v1/crises/{crisisId}/timeline | handlers/crisis/getTimeline.ts | staff, manager |
| GET | /api/v1/personnel/me | handlers/personnel/getMe.ts | staff, manager |
| PATCH | /api/v1/personnel/me/status | handlers/personnel/patchMyStatus.ts | staff |
| GET | /api/v1/crises/{crisisId}/assignment | handlers/personnel/getAssignment.ts | staff |
| PUT | /api/v1/orchestration/{crisisId}/override | handlers/manager/putOverride.ts | manager |
| POST | /api/v1/escalation/{crisisId}/force | handlers/manager/postForceEscalation.ts | manager |
| GET | /api/v1/venues/{venueId}/floor-plan | handlers/venue/getFloorPlan.ts | staff, manager |
| GET | /api/v1/venues/{venueId}/occupancy | handlers/venue/getOccupancy.ts | manager |
| GET | /api/v1/venues/{venueId}/personnel | handlers/venue/listPersonnel.ts | manager |
| GET | /api/v1/analytics/incidents | handlers/analytics/listIncidents.ts | manager |
| GET | /api/v1/health | handlers/health/getHealth.ts | admin, service |

## 6. Worker Trigger to Module Mapping

| Worker | Trigger | Input Contract | Output |
|---|---|---|---|
| extractVisualFeatures | Pub/Sub: crisis.frames.requested | eventSchemas.VisualFeatureRequest | visual features write and classification.requested |
| classifyCrisis | Firestore onCreate crises or Pub/Sub classify.requested | eventSchemas.ClassificationRequest | crisis type, severity, confidence |
| orchestrateResponse | Firestore onUpdate where status=classified | eventSchemas.OrchestrationRequest | dispatch decisions and guest instruction |
| dispatchToStaff | Pub/Sub dispatch.requested | eventSchemas.DispatchRequested | FCM send result and timeline update |
| broadcastGuestNotification | Pub/Sub guest.notify.requested | eventSchemas.GuestNotifyRequested | multicast result and status write |
| monitorEscalation | Scheduler every 60s | eventSchemas.EscalationTick | backup assignment or external escalation |
| generateDebrief | Firestore onUpdate where status in resolved,false_alarm | eventSchemas.DebriefRequested | incident report write |
| ingestEdgeDetection | HTTP or Pub/Sub edge.detected | eventSchemas.EdgeDetectionEnvelope | crisis draft or enrich existing crisis |
| replayEdgeBatch | HTTP /internal/edge/replay | eventSchemas.EdgeReplayBatch | replay audit and writes |

## 7. Function-Level Implementation Notes

### 7.1 postReport.ts

Responsibilities:

1. Validate body using zod schema.
2. Validate role and venue scope.
3. Build crisis draft document.
4. Write crisis with idempotency guard.
5. Publish crisis.created event.

Pseudocode:

```ts
export async function postReport(req: Request, res: Response) {
  const actor = await verifyFirebaseToken(req);
  roleGuard(actor, ["guest", "staff", "manager"]);

  const body = PostReportSchema.parse(req.body);
  const ctx = buildRequestContext(req, actor);

  await idempotencyRepo.executeOnce(ctx.idempotencyKey, async () => {
    const crisis = crisisService.createDraftFromReport(body, ctx);
    await crisisRepo.create(crisis);
    await publisher.publish("crisis.created", mapToCrisisCreatedEvent(crisis, ctx));
  });

  return res.status(201).json({
    crisis_id: body.crisis_id,
    status: "detected",
    correlation_id: ctx.correlationId
  });
}
```

### 7.2 classifyCrisis.ts

Responsibilities:

1. Aggregate audio, visual, sensor, and context features.
2. Invoke classifier endpoint.
3. Apply threshold and fallback rules.
4. Write classification and status.
5. Emit classification.completed.

Key fallback rule:

- if classifier confidence below minimum, classify as unknown and elevate manager visibility.

### 7.3 orchestrateResponse.ts

Responsibilities:

1. Load crisis context, occupancy, route state, and available personnel.
2. Build deterministic prompt payload.
3. Invoke Gemini with low temperature and JSON response mode.
4. Validate AI output with strict schema before write.
5. Store reasoning and alternatives.
6. Emit dispatch and guest notify events.

Guardrails:

1. Reject invalid responder-role pairings.
2. Enforce blocked-route exclusions.
3. Ensure escalation window exists for known crisis type.

### 7.4 dispatchToStaff.ts

Responsibilities:

1. Resolve FCM tokens for target staff.
2. Send high-priority messages.
3. Update personnel assignment and timeline events.
4. Retry transient send failures.
5. Escalate irrecoverable failures to DLQ and alert.

### 7.5 monitorEscalation.ts

Responsibilities:

1. Query active crises in dispatched or active status.
2. Check non-response timeout and status stagnation windows.
3. Assign backup or external escalation action.
4. Record escalation decision in timeline and escalation collection.

## 8. Firestore Data Model (Collections)

```text
venues/{venue_id}
venues/{venue_id}/crises/{crisis_id}
venues/{venue_id}/crises/{crisis_id}/timeline/{event_id}
venues/{venue_id}/crises/{crisis_id}/dispatch/{dispatch_id}
venues/{venue_id}/personnel/{staff_id}
venues/{venue_id}/guests/{guest_id}
venues/{venue_id}/floor_plan/current
venues/{venue_id}/config/runtime
incident_reports/{crisis_id}
idempotency/{idempotency_key}
audit_log/{audit_id}
```

### 8.1 Required Indexes

1. crises by venue_id + status + detected_at desc.
2. crises by venue_id + severity + status.
3. personnel by venue_id + on_shift + role.
4. timeline by crisis_id + timestamp asc.
5. incident_reports by venue_id + resolved_at desc.

## 9. Idempotency and Concurrency

### 9.1 Idempotency Pattern

1. Client passes Idempotency-Key header for POST and PATCH mutating endpoints.
2. idempotencyRepo stores request hash and response snapshot.
3. Duplicate request with same hash returns original response.
4. Duplicate with mismatched hash returns 409 conflict.

### 9.2 Concurrency Pattern

1. Use Firestore transactions for:
   - assignment changes
   - status transitions
   - escalation writes tied to timeline updates
2. Use update preconditions where version field is enforced.
3. Reject invalid transition attempts with 409 state conflict.

## 10. Retry, DLQ, and Backoff Policy

1. External API retries: 3 attempts, exponential backoff with jitter.
2. Pub/Sub ack deadline tuned per worker runtime budget.
3. Dead-letter topics per domain:
   - dlq.dispatch
   - dlq.orchestration
   - dlq.edge_replay
4. DLQ consumer writes incident entries and notifies on-call channels.

## 11. Observability Contract

### 11.1 Structured Log Fields

1. timestamp
2. level
3. service
4. handler
5. correlation_id
6. crisis_id
7. venue_id
8. actor_id
9. event_id
10. latency_ms
11. outcome
12. error_code

### 11.2 Metrics

1. report_to_dispatch_ms
2. orchestration_ms
3. fcm_send_success_rate
4. escalation_trigger_count
5. idempotency_dedup_hits
6. edge_replay_queue_depth
7. worker_dlq_rate

### 11.3 Tracing

1. propagate correlation_id from HTTP request to all events.
2. include span_id in logs for worker steps.

## 12. Testing Strategy

### 12.1 Unit Tests

1. schema validators
2. transition guards
3. role guard and permission checks
4. idempotency logic
5. retry policy behavior

### 12.2 Integration Tests

1. API handler to Firestore write path.
2. orchestration worker with mocked AI client.
3. dispatch worker with mocked FCM client.
4. escalation scheduler checks with synthetic timelines.

### 12.3 Contract Tests

1. OpenAPI response conformance.
2. event schema conformance for all published topics.
3. backward compatibility tests for schema_version increments.

### 12.4 Emulator End-to-End Tests

1. report -> classify -> orchestrate -> dispatch.
2. staff no response -> backup dispatch.
3. resolved -> debrief generation.
4. edge replay duplicate suppression.

## 13. Build, Run, and Deploy Commands

```bash
# install
npm ci

# lint and typecheck
npm run lint
npm run typecheck

# unit tests
npm test

# local emulator
npm run emu

# deploy staging
npm run deploy:staging

# deploy production
npm run deploy:prod
```

## 14. CI Pipeline Requirements

1. lint, typecheck, unit tests must pass on every PR.
2. OpenAPI diff check on API contract changes.
3. event schema compatibility check on event contract changes.
4. security checks for dependency vulnerabilities.
5. merge gate requires at least one backend approver.

## 15. Security Implementation Checklist

1. verify Firebase token on every protected route.
2. enforce role guard at route entry.
3. validate venue scope against token claims.
4. never trust client-supplied status transitions without server-side validation.
5. redact sensitive payload data in logs.
6. sign and verify internal edge replay requests.

## 16. Definition of Done (Low-Level)

1. All handlers implemented with schema validation and role guards.
2. All workers implemented with retries, idempotency, and DLQ hooks.
3. Firestore indexes deployed and verified.
4. OpenAPI spec generated and passing contract tests.
5. Event schemas versioned and documented.
6. End-to-end emulator tests passing for critical crisis paths.
7. Operational dashboards and alerts configured for production readiness.

## 17. Immediate Implementation Sequence

1. Scaffold backend repo with shared contracts and middleware.
2. Implement crisis report API and crisis repository.
3. Implement classification and orchestration workers.
4. Implement dispatch worker and personnel status APIs.
5. Implement escalation monitor and manager overrides.
6. Implement debrief worker and analytics reads.
7. Implement edge ingest and replay.
8. Complete hardening, observability, and CI gates.
