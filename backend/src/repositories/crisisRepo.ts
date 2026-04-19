import { randomUUID } from "crypto";
import { firestore } from "../integrations/firebase/firestoreClient";

export interface CrisisDraft {
	crisis_id: string;
	tenant_id: string;
	venue_id: string;
	crisis_type: "unknown";
	severity: 1;
	confidence: 0;
	floor: string;
	zone?: string;
	status: "detected";
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

export class CrisisRepository {
	public async createDraft(crisis: CrisisDraft): Promise<void> {
		const crisisRef = firestore
			.collection("venues")
			.doc(crisis.venue_id)
			.collection("crises")
			.doc(crisis.crisis_id);

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
}

export const crisisRepo = new CrisisRepository();
