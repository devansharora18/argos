import { z } from "zod";

export const personnelStatusSchema = z.enum([
	"available",
	"responding",
	"on_scene",
	"need_help",
	"resolved",
	"unavailable",
	"off_shift",
]);

export const getMeQuerySchema = z.object({
	venue_id: z.string().min(1),
});

export const patchMyStatusBodySchema = z.object({
	venue_id: z.string().min(1),
	status: personnelStatusSchema,
	crisis_id: z.string().min(1).optional(),
	note: z.string().min(1).max(500).optional(),
});

export type GetMeQuery = z.infer<typeof getMeQuerySchema>;
export type PatchMyStatusBody = z.infer<typeof patchMyStatusBodySchema>;

export interface PersonnelProfileResponse {
	staff_id: string;
	venue_id: string;
	name?: string;
	role: string;
	floor?: string;
	on_shift: boolean;
	status: z.infer<typeof personnelStatusSchema>;
	current_assignment: string | null;
}

export interface PatchMyStatusResponse {
	staff_id: string;
	venue_id: string;
	status: z.infer<typeof personnelStatusSchema>;
	crisis_id?: string;
	correlation_id: string;
}
