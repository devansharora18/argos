## Plan: HAVEN Backend API and Documentation Master Plan

Create a comprehensive contract-first backend API plan for HAVEN that is immediately executable by an implementation agent. The plan should produce a complete documentation package centered on OpenAPI 3.1 and supporting architecture markdown, with a clear split between MVP delivery and production hardening. The design must align with existing HAVEN architecture decisions, preserve the event-driven orchestration model, and include edge sync contracts for Jetson offline resilience.

**Steps**

1. Phase 1: Baseline and scope lock
   Dependency: none.
   Goal: lock the planning baseline from existing architecture docs and define exact in-scope backend behavior.
   Actions:
   - Extract canonical business outcomes from the current architecture: crisis intake, role-specific actions, orchestration, dispatch, escalation, debrief.
   - Lock the hybrid style decision: REST for explicit user actions, event-driven triggers for machine orchestration.
   - Declare doc deliverables and boundaries: what the API docs must include and what remains out of scope for this planning pass.
   - Define naming and versioning policy for all contracts before detailing endpoints.

2. Phase 2: Domain decomposition and ownership model
   Dependency: depends on 1.
   Goal: divide backend responsibilities into stable domains with minimal overlap.
   Actions:
   - Define domain boundaries and ownership:
     - Crisis Intake Domain
     - Crisis Lifecycle Domain
     - Dispatch and Personnel Domain
     - Guest Communication Domain
     - Escalation Domain
     - Debrief and Analytics Domain
     - Venue and Floor Context Domain
     - Edge Sync Domain
     - Admin and Config Domain
   - For each domain, define:
     - authoritative datastore objects
     - write ownership (client, cloud function, scheduler, edge replay)
     - allowed state transitions
     - external contracts (REST)
     - internal contracts (events/triggers)

3. Phase 3: Canonical data contracts and lifecycle states
   Dependency: depends on 2.
   Goal: define strict schemas to prevent drift between client, backend, and AI orchestration outputs.
   Actions:
   - Finalize canonical schema entities:
     - CrisisEvent
     - DispatchDecision
     - BackupAssignment
     - GuestNotification
     - Personnel
     - FloorPlanGraph
     - CrisisTimelineEvent
     - EscalationRecord
     - IncidentDebrief
     - EdgeDetectionEnvelope
     - EdgeReplayBatch
   - Define shared primitives and standards:
     - identifiers, timestamp format, enums, confidence range, severity bounds
     - nullable strategy and defaulting rules
     - idempotency key format
     - correlation and trace identifiers across requests/events
   - Define legal lifecycle transitions for CrisisEvent with explicit guards and invalid transition errors.
   - Define schema versioning fields for forward compatibility.

4. Phase 4: REST API surface design (client-facing)
   Dependency: depends on 3.
   Goal: design complete external API required by guest, staff, and manager experiences.
   Actions:
   - Define endpoint groups and behaviors:
     - Crisis reporting and retrieval
     - Staff assignment and status updates
     - Manager override and forced escalation
     - Venue occupancy and floor plan reads
     - Incident timeline and debrief reads
     - Analytics summary reads
     - Health and readiness reads
   - For each endpoint specify:
     - path, method, operation id
     - auth role requirements
     - request schema and validation rules
     - response schema with examples
     - error codes and retryability classification
     - idempotency and optimistic concurrency behavior
   - Define query patterns for filtering, sorting, and pagination where needed.
   - Define consistency expectations for read-your-write and eventual consistency cases.

5. Phase 5: Internal async event contracts
   Dependency: depends on 3 and parallel with 4.
   Goal: fully document the orchestration backbone not exposed to clients.
   Actions:
   - Define trigger contracts for:
     - Firestore onCreate and onUpdate hooks
     - Pub/Sub topics and message shapes
     - Cloud Scheduler invocation payloads
   - For each async workflow stage document:
     - trigger condition
     - input schema
     - output writes/events
     - timeout budget
     - retry policy and max attempts
     - dead-letter policy
     - observability fields required in logs
   - Define idempotency and deduplication strategy for each stage.
   - Define compensation paths for partial failures (for example FCM failure after dispatch write).

6. Phase 6: Edge ingestion and offline replay contracts
   Dependency: depends on 3 and 5.
   Goal: document Jetson integration contracts including disconnected operation.
   Actions:
   - Define edge-to-cloud ingestion envelope for local detections with confidence and source model metadata.
   - Define offline queue replay format and ordering semantics.
   - Define duplicate suppression and replay conflict resolution policy.
   - Define degraded-mode behavior when cloud services are unavailable:
     - local detection continues
     - local alert path behavior
     - cloud backfill behavior when connectivity returns
   - Define acceptance criteria for eventual consistency after replay.

7. Phase 7: Security, authorization, and compliance controls
   Dependency: depends on 4 and 5.
   Goal: produce a complete authz model aligned with Firebase auth claims and Firestore data access.
   Actions:
   - Define role model and claim taxonomy: guest, staff, manager, admin, service.
   - Produce operation-level RBAC matrix for REST operations.
   - Produce collection-level data access matrix for event-driven workers.
   - Define manager override audit requirements:
     - who overrode
     - why
     - before and after snapshots
     - timestamp and correlation id
   - Define sensitive-field handling, token validation expectations, and abuse controls.
   - Define threat scenarios and defensive controls for spoofed reports, replay abuse, and privilege escalation attempts.

8. Phase 8: Reliability, SLOs, and operational standards
   Dependency: depends on 4, 5, and 6.
   Goal: define measurable quality targets and operations requirements before implementation.
   Actions:
   - Define SLOs and budgets:
     - report to dispatch total latency target
     - orchestration latency target
     - notification delivery target
     - escalation trigger windows
   - Define error budget policy and priority responses.
   - Define observability contract:
     - structured log schema
     - metrics catalog
     - trace propagation requirements
   - Define runbooks for major failure modes:
     - Gemini timeout
     - Cloud Vision degradation
     - Firestore partial outage
     - FCM delivery delays
     - replay queue growth on prolonged outage
   - Define capacity assumptions and quota safeguards.

9. Phase 9: Documentation package assembly
   Dependency: depends on 4, 5, 6, 7, 8.
   Goal: produce the final documentation set in a maintainable structure.
   Actions:
   - Assemble OpenAPI 3.1 master spec for external routes.
   - Assemble architecture markdown set for internal events and ops.
   - Include sequence diagrams in markdown narrative form for key flows:
     - guest report to staff dispatch
     - staff non-response to backup assignment
     - crisis resolution to debrief publication
     - edge offline detection to cloud replay
   - Include examples catalog with golden request and response payloads.
   - Include glossary and decision log to avoid interpretation drift.

10. Phase 10: MVP and production split planning
    Dependency: depends on 9.
    Goal: provide pragmatic delivery order without losing long-term quality.
    Actions:
    - For each endpoint and event mark one of:
      - MVP build now
      - simulate in demo mode
      - production hardening later
    - Define MVP acceptance gates for demo readiness.
    - Define production upgrade backlog with dependency order and risk scoring.
    - Define clear no-go list for MVP to protect delivery focus.

11. Phase 11: Verification and handoff checklist
    Dependency: depends on 10.
    Goal: ensure downstream implementation agents can execute without ambiguity.
    Actions:
    - Define contract validation checklist:
      - schema validation
      - enum and bounds validation
      - negative-path behavior
      - RBAC denial tests
      - idempotency behavior tests
    - Define async pipeline validation checklist:
      - duplicate event handling
      - retry and dead-letter path
      - scheduler edge cases
    - Define review checklist for consistency between OpenAPI and architecture docs.
    - Define sign-off criteria and ownership for future updates.

**Relevant files**

- d:/devansharora18/argos/docs/HAVEN_Master_Plan.md - primary architecture source for crisis lifecycle, roles, data models, and escalation logic.
- d:/devansharora18/argos/README.md - repository baseline context.
- d:/devansharora18/argos/argos_app/README.md - current application baseline indicating implementation gap and need for contract-first docs.

**Verification**

1. Coverage verification:
   - Every role journey has explicit endpoint and event support.
   - Every architecture stage in current docs maps to concrete contracts.
2. Contract integrity verification:
   - All schemas specify required fields, ranges, enums, and error outcomes.
   - Crisis lifecycle transitions are complete and non-contradictory.
3. Security verification:
   - Every operation has explicit role policy.
   - Every privileged action is auditable.
4. Reliability verification:
   - Each async component has timeout, retry, and dead-letter strategy.
   - SLO targets map to measurable telemetry.
5. Edge verification:
   - Replay duplicates are safely deduped.
   - Out-of-order batches are resolved by deterministic policy.
6. Documentation quality verification:
   - OpenAPI and markdown references are internally consistent.
   - Example payloads conform to schemas.
7. Handoff verification:
   - Implementation backlog is sequenced with dependencies.
   - MVP versus production split is explicit and testable.

**Decisions**

- Delivery format: OpenAPI 3.1 plus architecture markdown.
- API style: hybrid, with user-visible REST and event-driven orchestration internals.
- Scope mode: both MVP execution plan and production expansion plan.
- Edge scope: include edge ingestion and offline replay contracts now.
- Included scope:
  - contract-first API planning
  - security and RBAC planning
  - async event contract planning
  - reliability and ops planning
  - verification and handoff planning
- Excluded scope in this planning turn:
  - implementation code
  - deployment scripts
  - live cloud resource provisioning

**Further Considerations**

1. Governance recommendation:
   - enforce schema-change reviews with compatibility checks before merges.
2. Evolution recommendation:
   - maintain stable v1 external API while allowing internal event schema revisions via schema_version.
3. Delivery recommendation:
   - sequence implementation by crisis intake and dispatch path first, then escalation automation, then analytics enrichment.
