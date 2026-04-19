import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { RequestLocals } from "./context";

function firstHeaderValue(
	value: string | string[] | undefined,
): string | undefined {
	if (!value) {
		return undefined;
	}

	return Array.isArray(value) ? value[0] : value;
}

export function requestContextMiddleware(
	req: Request,
	res: Response<unknown, RequestLocals>,
	next: NextFunction,
): void {
	const requestId = randomUUID();
	const correlationId =
		firstHeaderValue(req.headers["x-correlation-id"]) ?? randomUUID();
	const idempotencyKey = firstHeaderValue(req.headers["idempotency-key"]);

	res.locals.ctx = {
		requestId,
		correlationId,
		idempotencyKey,
	};

	next();
}
