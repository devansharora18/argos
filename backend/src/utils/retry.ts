export interface RetryOptions {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  factor: number;
}

const defaultRetryOptions: RetryOptions = {
  maxAttempts: 3,
  initialDelayMs: 200,
  maxDelayMs: 2000,
  factor: 2,
};

function wait(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options?: Partial<RetryOptions>
): Promise<T> {
  const resolved = { ...defaultRetryOptions, ...(options ?? {}) };

  let attempt = 0;
  let delay = resolved.initialDelayMs;
  let lastError: unknown;

  while (attempt < resolved.maxAttempts) {
    attempt += 1;
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt >= resolved.maxAttempts) {
        break;
      }

      await wait(delay);
      delay = Math.min(Math.floor(delay * resolved.factor), resolved.maxDelayMs);
    }
  }

  throw lastError;
}
