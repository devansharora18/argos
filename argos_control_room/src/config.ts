const fromEnv =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL) || undefined;

export const BACKEND_BASE_URL: string = fromEnv ?? 'http://localhost:8080';
export const SIM_STREAM_URL: string = `${BACKEND_BASE_URL}/api/v1/sim/events/stream`;
