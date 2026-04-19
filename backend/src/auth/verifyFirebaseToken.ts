import { Request } from "express";
import "../integrations/firebase/admin";
import { getAuth } from "firebase-admin/auth";
import { AppError } from "../utils/errors";
import { ActorClaims, isRole } from "./claimTypes";

function extractBearerToken(req: Request): string {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new AppError({
			code: "UNAUTHENTICATED",
			message: "Missing or invalid Authorization header",
			httpStatus: 401,
		});
	}

	return authHeader.slice("Bearer ".length).trim();
}

export async function getActorFromRequest(req: Request): Promise<ActorClaims> {
	const token = extractBearerToken(req);
	const decoded = await getAuth().verifyIdToken(token);

	const role = decoded.role;
	const tenantId = decoded.tenant_id;
	const venueIdsRaw = decoded.venue_ids;

	if (!isRole(role)) {
		throw new AppError({
			code: "FORBIDDEN",
			message: "Missing or invalid role claim",
			httpStatus: 403,
		});
	}

	if (typeof tenantId !== "string" || tenantId.length === 0) {
		throw new AppError({
			code: "FORBIDDEN",
			message: "Missing tenant_id claim",
			httpStatus: 403,
		});
	}

	const venueIds =
		Array.isArray(venueIdsRaw) ?
			venueIdsRaw.filter((value): value is string => typeof value === "string")
		:	[];

	return {
		uid: decoded.uid,
		role,
		tenantId,
		venueIds,
	};
}
