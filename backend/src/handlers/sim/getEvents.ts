import { Request, Response } from 'express';
import { registerSubscriber } from '../../services/crisisBroadcast';

export function getEventsStreamHandler(req: Request, res: Response): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  res.write(`event: ready\ndata: {"status":"connected"}\n\n`);

  const heartbeat = setInterval(() => {
    res.write(`: heartbeat ${Date.now()}\n\n`);
  }, 25_000);

  const unregister = registerSubscriber(res);

  req.on('close', () => {
    clearInterval(heartbeat);
    unregister();
    res.end();
  });
}
