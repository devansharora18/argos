import { Request } from "express";
import "../integrations/firebase/admin";
import { getAuth } from "firebase-admin/auth";
import { AppError } from "../utils/errors";
import { ActorClaims, isRole } from "./claimTypes";
import { config } from "../bootstrap/config";

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

function parseDevClaims(req: Request): ActorClaims {
	const roleRaw = req.header("x-dev-role") ?? "manager";
	const tenantId = req.header("x-dev-tenant-id") ?? "tenant-dev";
	const venueHeader =
		req.header("x-dev-venue-ids") ??
		req.header("x-dev-venue-id") ??
		"venue-dev";
	const venueIds = venueHeader
		.split(",")
		.map((value) => value.trim())
		.filter((value) => value.length > 0);

	if (!isRole(roleRaw)) {
		throw new AppError({
			code: "FORBIDDEN",
			message: "Invalid x-dev-role header value",
			httpStatus: 403,
		});
	}

	return {
		uid: req.header("x-dev-uid") ?? "dev-user",
		role: roleRaw,
		tenantId,
		venueIds,
	};
}

export async function getActorFromRequest(req: Request): Promise<ActorClaims> {
	if (config.authDisabled) {
		return parseDevClaims(req);
	}

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
