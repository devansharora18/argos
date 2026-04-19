import { randomUUID } from "crypto";
import { firestore } from "../integrations/firebase/firestoreClient";
import { AppError } from "../utils/errors";

export type CrisisType = "fire" | "medical" | "security" | "stampede" | "structural" | "unknown";

export type CrisisStatus =
	| "detected"
	| "classified"
	| "dispatched"
	| "active"
	| "resolved"
	| "false_alarm";

export interface CrisisDraft {
	crisis_id: string;
	tenant_id: string;
	venue_id: string;
	crisis_type: CrisisType;
	severity: number;
	confidence: number;
	floor: string;
	zone?: string;
	status: CrisisStatus;
	detected_at: string;
	trigger_sources: string[];
	report_text?: string;
	audio_uri?: string;
	created_by: {
		actor_id: string;
		role: string;
	};
	schema_version: string;
}

export interface CrisisRecord extends CrisisDraft {
	classified_at?: string;
	dispatched_at?: string;
	resolved_at?: string;
	gemini_reasoning?: string;
	alternatives_considered?: string[];
	external_escalation?: {
		required: boolean;
		reason?: string;
		escalated_at?: string;
	};
}

export interface CrisisLookupResult {
	venueId: string;
	crisis: CrisisRecord;
}

export interface CrisisTimelineEvent {
	event_id: string;
	event: string;
	type: string;
	timestamp: string;
	actor_id?: string;
	role?: string;
	status?: string;
	note?: string;
}

export interface ClassificationInput {
	venueId: string;
	crisisId: string;
	crisisType: CrisisRecord["crisis_type"];
	severity: number;
	confidence: number;
}

export interface DispatchInput {
	venueId: string;
	crisisId: string;
	staffId: string;
	role: string;
	instruction: string;
	reasoning: string;
}

export interface DispatchRecord {
	dispatch_id: string;
	staff_id: string;
	role: string;
	instruction: string;
	status: string;
	assigned_at: string;
	notified_at?: string;
}

export class CrisisRepository {
	private crisisDocRef(venueId: string, crisisId: string) {
		return firestore.collection("venues").doc(venueId).collection("crises").doc(crisisId);
	}

	public async createDraft(crisis: CrisisDraft): Promise<void> {
		const crisisRef = this.crisisDocRef(crisis.venue_id, crisis.crisis_id);

		const timelineRef = crisisRef.collection("timeline").doc(randomUUID());

		await firestore.runTransaction(async (tx) => {
			tx.create(crisisRef, crisis);
			tx.create(timelineRef, {
				event: "crisis_detected",
				type: "detection",
				timestamp: crisis.detected_at,
				actor_id: crisis.created_by.actor_id,
				role: crisis.created_by.role,
			});
		});
	}

	public async getByIdInVenue(venueId: string, crisisId: string): Promise<CrisisRecord | null> {
		const snapshot = await this.crisisDocRef(venueId, crisisId).get();
		if (!snapshot.exists) {
			return null;
		}

		return snapshot.data() as CrisisRecord;
	}

	public async findByIdForVenues(
		crisisId: string,
		venueIds: string[],
	): Promise<CrisisLookupResult | null> {
		for (const venueId of venueIds) {
			const crisis = await this.getByIdInVenue(venueId, crisisId);
			if (crisis) {
				return {
					venueId,
					crisis,
				};
			}
		}

		return null;
	}

	public async getTimeline(
		venueId: string,
		crisisId: string,
		limit: number,
	): Promise<CrisisTimelineEvent[]> {
		const snapshot = await this.crisisDocRef(venueId, crisisId)
			.collection("timeline")
			.orderBy("timestamp", "desc")
			.limit(Math.max(1, Math.min(limit, 500)))
			.get();

		return snapshot.docs
			.map((doc) => ({
				event_id: doc.id,
				...(doc.data() as Omit<CrisisTimelineEvent, "event_id">),
			}))
			.reverse();
	}

	public async applyClassification(input: ClassificationInput): Promise<void> {
		const crisisRef = this.crisisDocRef(input.venueId, input.crisisId);
		const now = new Date().toISOString();
		const timelineRef = crisisRef.collection("timeline").doc(randomUUID());

		await firestore.runTransaction(async (tx) => {
			const crisisSnapshot = await tx.get(crisisRef);
			if (!crisisSnapshot.exists) {
				throw new AppError({
					code: "RESOURCE_NOT_FOUND",
					message: "Crisis not found for classification",
					httpStatus: 404,
				});
			}

			tx.update(crisisRef, {
				crisis_type: input.crisisType,
				severity: input.severity,
				confidence: input.confidence,
				status: "classified",
				classified_at: now,
			});

			tx.create(timelineRef, {
				event: "crisis_classified",
				type: "classification",
				timestamp: now,
				crisis_type: input.crisisType,
				severity: input.severity,
				confidence: input.confidence,
			});
		});
	}

	public async createDispatchAssignment(input: DispatchInput): Promise<string> {
		const crisisRef = this.crisisDocRef(input.venueId, input.crisisId);
		const dispatchId = randomUUID();
		const dispatchRef = crisisRef.collection("dispatch").doc(dispatchId);
		const timelineRef = crisisRef.collection("timeline").doc(randomUUID());
		const now = new Date().toISOString();

		await firestore.runTransaction(async (tx) => {
			const crisisSnapshot = await tx.get(crisisRef);
			if (!crisisSnapshot.exists) {
				throw new AppError({
					code: "RESOURCE_NOT_FOUND",
					message: "Crisis not found for orchestration",
					httpStatus: 404,
				});
			}

			tx.create(dispatchRef, {
				dispatch_id: dispatchId,
				staff_id: input.staffId,
				role: input.role,
				instruction: input.instruction,
				status: "assigned",
				assigned_at: now,
			});

			tx.update(crisisRef, {
				status: "dispatched",
				dispatched_at: now,
				gemini_reasoning: input.reasoning,
			});

			tx.create(timelineRef, {
				event: "dispatch_assigned",
				type: "dispatch",
				timestamp: now,
				dispatch_id: dispatchId,
				staff_id: input.staffId,
				role: input.role,
			});
		});

		return dispatchId;
	}

	public async markDispatchNotified(
		venueId: string,
		crisisId: string,
		dispatchId: string,
	): Promise<void> {
		const crisisRef = this.crisisDocRef(venueId, crisisId);
		const dispatchRef = crisisRef.collection("dispatch").doc(dispatchId);
		const timelineRef = crisisRef.collection("timeline").doc(randomUUID());
		const now = new Date().toISOString();

		await firestore.runTransaction(async (tx) => {
			const dispatchSnapshot = await tx.get(dispatchRef);
			if (!dispatchSnapshot.exists) {
				throw new AppError({
					code: "RESOURCE_NOT_FOUND",
					message: "Dispatch record not found",
					httpStatus: 404,
				});
			}

			const dispatchRecord = dispatchSnapshot.data() as DispatchRecord;
			const personnelRef = firestore
				.collection("venues")
				.doc(venueId)
				.collection("personnel")
				.doc(dispatchRecord.staff_id);

			tx.update(dispatchRef, {
				status: "notified",
				notified_at: now,
			});

			tx.set(
				personnelRef,
				{
					status: "responding",
					current_assignment: crisisId,
					updated_at: now,
				},
				{ merge: true },
			);

			tx.create(timelineRef, {
				event: "dispatch_notified",
				type: "dispatch",
				timestamp: now,
				dispatch_id: dispatchId,
			});
		});
	}

	public async getAssignmentForStaff(
		venueId: string,
		crisisId: string,
		staffId: string,
	): Promise<DispatchRecord | null> {
		const snapshot = await this.crisisDocRef(venueId, crisisId)
			.collection("dispatch")
			.where("staff_id", "==", staffId)
			.limit(1)
			.get();

		if (snapshot.empty) {
			return null;
		}

		const assignmentDoc = snapshot.docs[0];
		if (!assignmentDoc) {
			return null;
		}

		return assignmentDoc.data() as DispatchRecord;
	}

	public async listEscalationCandidates(limit: number): Promise<CrisisRecord[]> {
		const snapshot = await firestore
			.collectionGroup("crises")
			.where("status", "in", ["dispatched", "active"])
			.limit(Math.max(1, Math.min(limit, 100)))
			.get();

		return snapshot.docs.map((doc) => doc.data() as CrisisRecord);
	}

	public async markEscalated(venueId: string, crisisId: string, reason: string): Promise<void> {
		const crisisRef = this.crisisDocRef(venueId, crisisId);
		const timelineRef = crisisRef.collection("timeline").doc(randomUUID());
		const now = new Date().toISOString();

		await firestore.runTransaction(async (tx) => {
			const crisisSnapshot = await tx.get(crisisRef);
			if (!crisisSnapshot.exists) {
				return;
			}

			tx.update(crisisRef, {
				external_escalation: {
					required: true,
					reason,
					escalated_at: now,
				},
			});

			tx.create(timelineRef, {
				event: "external_escalation_triggered",
				type: "escalation",
				timestamp: now,
				reason,
			});
		});
	}
}

export const crisisRepo = new CrisisRepository();
