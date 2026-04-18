# HAVEN Backend Code Implementation Plan - High Level

## 1. Purpose

This document translates the existing backend planning artifacts into an implementation-oriented high-level code plan. It defines what to build, where each concern lives, and how services collaborate to deliver the HAVEN crisis workflow.

This is intentionally architecture-first and team-facing. Code-level details, interfaces, and pseudocode are in the low-level companion document.

## 2. Implementation Goals

1. Build an event-driven backend that can process a crisis report and dispatch staff in under 10 seconds.
2. Preserve role-based realities for guest, staff, and manager.
3. Keep client-facing APIs stable under /api/v1 while allowing internal event contract evolution.
4. Support offline edge replay from Jetson without duplicating crises or corrupting timelines.
5. Ensure explainable orchestration by storing decision reasoning and alternatives.

## 3. Guiding Technical Decisions

1. Runtime: Firebase Cloud Functions Gen2, Node.js 20, TypeScript.
2. Core persistence: Firestore as operational source of truth.
3. Event transport: Pub/Sub for decoupled async stages.
4. AI orchestration: Gemini 1.5 Pro for routing decisions, Gemini Flash for fast visual context.
5. Delivery path: FCM for staff and guest notifications.
6. Contract approach: OpenAPI 3.1 for external REST, markdown event specs for internal pipelines.

## 4. Backend Domains and Ownership

| Domain | Owns | Writes By | Reads By |
|---|---|---|---|
| Crisis Intake | report ingestion and draft crisis creation | REST intake function | classification, orchestration, control room |
| Classification | multi-modal signal interpretation | classifier worker | orchestration, escalation |
| Orchestration | dispatch decisions and reasoning | orchestration worker | staff, manager, dispatch workers |
| Dispatch and Personnel | assignment state and staff lifecycle | dispatch workers and staff status API | control room, escalation |
| Guest Communication | calm floor-level instructions | guest notification worker | guest clients |
| Escalation | timeout checks and external trigger decisions | scheduler worker | manager, debrief |
| Debrief and Analytics | post-incident reports and metrics | debrief worker | manager analytics UI |
| Venue and Floor Context | route graph, equipment, occupancy context | admin APIs and sync jobs | classification, orchestration |
| Edge Sync | offline detection replay and dedup | edge ingest and replay workers | intake and lifecycle services |

## 5. High-Level Component Map

1. API Gateway Layer (Function HTTP endpoints)
   - validates tokens and payloads
   - enforces role authorization
   - writes only allowed fields
2. Application Services Layer
   - crisis intake service
   - personnel assignment service
   - escalation policy service
   - route resolution service
3. Event Workers Layer
   - extraction worker
   - classification worker
   - orchestration worker
   - dispatch worker
   - guest notification worker
   - escalation monitor
   - debrief generator
4. Shared Platform Layer
   - firestore repository adapters
   - pubsub publisher and consumer wrappers
   - idempotency guards
   - observability utilities
   - retry and DLQ handling

## 6. End-to-End Flow Responsibilities

### 6.1 Report to Dispatch Flow

1. Guest or staff calls report endpoint.
2. Intake service validates and creates crisis with status detected.
3. Worker pipeline enriches features and classifies crisis.
4. Orchestration worker computes dispatch, backups, guest instructions.
5. Dispatch worker sends staff FCM and updates timeline.
6. Guest worker sends floor-targeted calm message.
7. Control room clients observe real-time updates through Firestore streams.

### 6.2 Staff Lifecycle Flow

1. Staff receives assignment.
2. Staff updates status: responding, on_scene, need_help, resolved.
3. Status API writes personnel and timeline events atomically.
4. Escalation monitor checks for non-response and stagnation.
5. Backups are assigned automatically if primary is unresponsive.

### 6.3 Resolution and Debrief Flow

1. Crisis reaches resolved or false_alarm status.
2. Debrief worker synthesizes timeline quality metrics and AI assessment.
3. Debrief stored in incident_reports and summarized to analytics store.
4. Manager dashboard reads final report and recommendations.

## 7. External API Surface (High-Level)

### 7.1 Crisis

1. POST /api/v1/crises/report
2. GET /api/v1/crises/{crisisId}
3. GET /api/v1/crises?venueId=&status=
4. GET /api/v1/crises/{crisisId}/timeline

### 7.2 Personnel and Dispatch

1. GET /api/v1/personnel/me
2. PATCH /api/v1/personnel/me/status
3. GET /api/v1/crises/{crisisId}/assignment

### 7.3 Manager Operations

1. PUT /api/v1/orchestration/{crisisId}/override
2. POST /api/v1/escalation/{crisisId}/force
3. GET /api/v1/incidents/{crisisId}/debrief

### 7.4 Venue Context

1. GET /api/v1/venues/{venueId}/floor-plan
2. GET /api/v1/venues/{venueId}/occupancy
3. GET /api/v1/venues/{venueId}/personnel

### 7.5 Analytics and Health

1. GET /api/v1/analytics/incidents
2. GET /api/v1/health

## 8. Internal Event Pipeline (High-Level)

1. crisis.created -> extraction.requested
2. extraction.completed -> classification.requested
3. classification.completed -> orchestration.requested
4. orchestration.completed -> dispatch.requested and guest.notify.requested
5. dispatch.completed -> timeline.updated
6. scheduler.tick -> escalation.check.requested
7. crisis.resolved -> debrief.requested

Each event must include:

- schemaVersion
- eventId
- correlationId
- crisisId
- producedAt

## 9. Security and Access Model

1. Identity provider: Firebase Auth.
2. Roles via custom claims: guest, staff, manager, admin, service.
3. Route authorization:
   - guest: report and own crisis instruction views
   - staff: own assignment and status updates
   - manager: full operational controls including override
   - admin: configuration and privileged maintenance
4. Data authorization:
   - Firestore access restrictions enforced both in security rules and server-side guards.
5. Audit requirements:
   - all overrides, force escalations, and privileged writes must produce immutable audit events.

## 10. Reliability and SLO Strategy

1. SLO: report-to-dispatch p95 under 10 seconds.
2. SLO: orchestration stage p95 under 5 seconds.
3. SLO: dispatch notification p95 under 1 second after orchestration complete.
4. Retry policies:
   - transient external calls retried with exponential backoff
   - poison messages moved to DLQ with alerting
5. Idempotency:
   - all write-affecting endpoints and workers require dedup keys.
6. Degraded operation:
   - edge detections buffered and replayed when cloud connectivity returns.

## 11. Deployment and Environment Strategy

1. Environments: dev, staging, prod.
2. Separate Firebase projects per environment.
3. Schema migrations and indexes applied through versioned infrastructure scripts.
4. Secrets from Secret Manager, never hard-coded in source.
5. Staging load tests required before production rollout of major pipeline changes.

## 12. Delivery Milestones

1. Milestone A: Foundation
   - repo scaffold for backend
   - shared contracts and validation utilities
   - auth and role middleware
2. Milestone B: Core Crisis Path
   - report intake endpoint
   - classification and orchestration workers
   - dispatch and guest notifications
3. Milestone C: Escalation and Control
   - scheduler monitor
   - manager override and force escalation APIs
4. Milestone D: Debrief and Analytics
   - debrief worker
   - analytics read APIs
5. Milestone E: Edge Replay
   - edge ingest endpoints
   - replay dedup and reconciliation
6. Milestone F: Hardening
   - security review
   - reliability tuning
   - runbook validation

## 13. Definition of Done (High-Level)

1. All external APIs documented in OpenAPI 3.1 and validated.
2. All internal event contracts documented and versioned.
3. Full report-to-dispatch workflow functionally complete in staging.
4. RBAC policies enforced and tested for allow and deny cases.
5. Observability dashboards and alerts active for critical pipeline stages.
6. Edge replay paths tested for duplicates and out-of-order events.

## 14. Out of Scope for This Phase

1. Full multi-property tenancy controls beyond the current venue scope.
2. Live external emergency service integrations (simulation allowed for hackathon mode).
3. Long-term BI warehouse optimization beyond incident-level analytics outputs.

## 15. Companion Document

For implementation-level details including folder structure, handler signatures, worker pseudocode, indexes, error envelope schemas, and test matrix, see:

- 03_Low-Level_Implementation.md
