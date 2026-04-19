type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

function log(level: LogLevel, message: string, fields?: Record<string, unknown>): void {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...fields,
  };

  if (level === 'ERROR') {
    console.error(JSON.stringify(payload));
    return;
  }

  if (level === 'WARN') {
    console.warn(JSON.stringify(payload));
    return;
  }

  console.log(JSON.stringify(payload));
}

export const logger = {
  debug: (message: string, fields?: Record<string, unknown>) => log('DEBUG', message, fields),
  info: (message: string, fields?: Record<string, unknown>) => log('INFO', message, fields),
  warn: (message: string, fields?: Record<string, unknown>) => log('WARN', message, fields),
  error: (message: string, fields?: Record<string, unknown>) => log('ERROR', message, fields),
};
