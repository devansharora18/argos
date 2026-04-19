export interface ErrorDetail {
	field?: string;
	issue: string;
}

export class AppError extends Error {
	public readonly code: string;
	public readonly httpStatus: number;
	public readonly retryable: boolean;
	public readonly details: ErrorDetail[];

	constructor(params: {
		code: string;
		message: string;
		httpStatus: number;
		retryable?: boolean;
		details?: ErrorDetail[];
	}) {
		super(params.message);
		this.code = params.code;
		this.httpStatus = params.httpStatus;
		this.retryable = params.retryable ?? false;
		this.details = params.details ?? [];
	}
}

export function isAppError(error: unknown): error is AppError {
	return error instanceof AppError;
}
