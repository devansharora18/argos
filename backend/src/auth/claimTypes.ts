export type Role = "guest" | "staff" | "manager" | "admin" | "service";

export interface ActorClaims {
	uid: string;
	role: Role;
	tenantId: string;
	venueIds: string[];
}

export function isRole(value: unknown): value is Role {
	return (
		value === "guest" ||
		value === "staff" ||
		value === "manager" ||
		value === "admin" ||
		value === "service"
	);
}
