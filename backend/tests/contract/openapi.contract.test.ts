import { readFileSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';
import { describe, expect, it } from 'vitest';

describe('OpenAPI contract', () => {
  it('contains required v1 routes', () => {
    const content = readFileSync(join(process.cwd(), 'openapi', 'openapi.v1.yaml'), 'utf8');
    const spec = YAML.parse(content) as { paths?: Record<string, Record<string, unknown>> };

    expect(spec.paths).toBeDefined();
    expect(spec.paths?.['/api/v1/health']?.get).toBeDefined();
    expect(spec.paths?.['/api/v1/crises/report']?.post).toBeDefined();
    expect(spec.paths?.['/api/v1/crises/{crisisId}']?.get).toBeDefined();
    expect(spec.paths?.['/api/v1/crises/{crisisId}/timeline']?.get).toBeDefined();
    expect(spec.paths?.['/api/v1/crises/{crisisId}/assignment']?.get).toBeDefined();
    expect(spec.paths?.['/api/v1/personnel/me']?.get).toBeDefined();
    expect(spec.paths?.['/api/v1/personnel/me/status']?.patch).toBeDefined();
  });
});
