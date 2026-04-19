import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../../bootstrap/logger";
import { ErrorEnvelope } from "../../contracts/api/common";
import { RequestLocals } from "./context";
import { AppError, isAppError } from "../../utils/errors";

function toEnvelope(error: AppError, correlationId: string): ErrorEnvelope {
	return {
		error: {
			code: error.code,
			message: error.message,
			retryable: error.retryable,
			correlation_id: correlationId,
			details: error.details,
		},
	};
}

export function notFoundHandler(
	_req: Request,
	_res: Response,
	next: NextFunction,
): void {
	next(
		new AppError({
			code: "NOT_FOUND",
			message: "Route not found",
			httpStatus: 404,
		}),
	);
}

export function errorHandler(
	error: unknown,
	_req: Request,
	res: Response<ErrorEnvelope, RequestLocals>,
	_next: NextFunction,
): void {
	const correlationId = res.locals.ctx?.correlationId ?? "unknown";

	if (error instanceof ZodError) {
		const appError = new AppError({
			code: "VALIDATION_ERROR",
			message: "Validation failed",
			httpStatus: 400,
			details: error.issues.map((issue) => ({
				field: issue.path.join("."),
				issue: issue.message,
			})),
		});

		res.status(appError.httpStatus).json(toEnvelope(appError, correlationId));
		return;
	}

	if (isAppError(error)) {
		if (error.httpStatus >= 500) {
			logger.error("Request failed", {
				correlation_id: correlationId,
				error_code: error.code,
				message: error.message,
			});
		}

		res.status(error.httpStatus).json(toEnvelope(error, correlationId));
		return;
	}

	logger.error("Unhandled error", {
		correlation_id: correlationId,
		error: error instanceof Error ? error.message : "Unknown error",
	});

	const internalError = new AppError({
		code: "INTERNAL_ERROR",
		message: "Unexpected server error",
		httpStatus: 500,
		retryable: true,
	});

	res.status(500).json(toEnvelope(internalError, correlationId));
}
