import { Request, Response } from 'express';
import { config } from '../../bootstrap/config';

interface HealthResponse {
  status: 'ok';
  service: string;
  timestamp: string;
}

export function getHealthHandler(_req: Request, res: Response<HealthResponse>): void {
  res.status(200).json({
    status: 'ok',
    service: config.serviceName,
    timestamp: new Date().toISOString(),
  });
}
