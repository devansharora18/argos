import { ActorClaims, Role } from "./claimTypes";
import { AppError } from "../utils/errors";

export function requireRole(actor: ActorClaims, allowedRoles: Role[]): void {
	if (!allowedRoles.includes(actor.role)) {
		throw new AppError({
			code: "FORBIDDEN",
			message: "Insufficient permissions",
			httpStatus: 403,
		});
	}
}

export function requireVenueScope(actor: ActorClaims, venueId: string): void {
	if (actor.role === "admin" || actor.role === "service") {
		return;
	}

	if (!actor.venueIds.includes(venueId)) {
		throw new AppError({
			code: "FORBIDDEN",
			message: "Venue access denied",
			httpStatus: 403,
		});
	}
}
