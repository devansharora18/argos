export interface RequestContext {
  requestId: string;
  correlationId: string;
  idempotencyKey?: string;
  tenantId?: string;
  venueId?: string;
}

export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    retryable: boolean;
    correlation_id: string;
    details: Array<{ field?: string; issue: string }>;
  };
}
