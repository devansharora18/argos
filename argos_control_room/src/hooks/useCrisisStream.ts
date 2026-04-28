import { useEffect, useState } from 'react';
import { SIM_STREAM_URL } from '../config';

export type IncomingCrisis = {
  crisis_id: string;
  venue_id: string;
  crisis_type: string;
  severity: number;
  zone: string;
  floor: string | null;
  description: string;
  reported_by: string;
  detected_at: string;
  source: string;
};

export type StreamStatus = 'idle' | 'connecting' | 'open' | 'error';

type Options = {
  onCrisis?: (crisis: IncomingCrisis) => void;
};

export function useCrisisStream({ onCrisis }: Options = {}): {
  status: StreamStatus;
  lastCrisis: IncomingCrisis | null;
} {
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [lastCrisis, setLastCrisis] = useState<IncomingCrisis | null>(null);

  useEffect(() => {
    setStatus('connecting');
    const source = new EventSource(SIM_STREAM_URL);

    const handleReady = () => setStatus('open');
    const handleCrisis = (event: MessageEvent<string>) => {
      try {
        const parsed = JSON.parse(event.data) as IncomingCrisis;
        setLastCrisis(parsed);
        onCrisis?.(parsed);
      } catch {
        // ignore malformed payloads
      }
    };
    const handleError = () => setStatus('error');

    source.addEventListener('ready', handleReady);
    source.addEventListener('crisis.detected', handleCrisis as EventListener);
    source.onerror = handleError;

    return () => {
      source.removeEventListener('ready', handleReady);
      source.removeEventListener('crisis.detected', handleCrisis as EventListener);
      source.close();
    };
  }, [onCrisis]);

  return { status, lastCrisis };
}
