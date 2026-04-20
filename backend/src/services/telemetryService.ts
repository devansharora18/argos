import {
  EdgeDetectionEnvelope,
  SensorType,
  TelemetryIngestBody,
  TelemetryReading,
} from '../contracts/api/device';

const defaultUnits: Record<SensorType, string> = {
  smoke_ppm: 'ppm',
  temperature_celsius: 'celsius',
  co2_ppm: 'ppm',
  humidity_pct: 'percent',
  pressure_hpa: 'hpa',
  vibration_xyz: 'magnitude',
};

const alertThresholds: Record<SensorType, number> = {
  smoke_ppm: 120,
  temperature_celsius: 58,
  co2_ppm: 1200,
  humidity_pct: 90,
  pressure_hpa: 1070,
  vibration_xyz: 2.8,
};

export interface NormalizedTelemetryReading {
  device_id: string;
  floor: string;
  zone?: string;
  sensor_type: SensorType;
  numeric_value: number;
  unit: string;
  confidence: number;
  captured_at: string;
}

function vibrationMagnitude(reading: TelemetryReading): number {
  const vector = reading.vibration_xyz;
  if (!vector) {
    return 0;
  }

  return Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
}

function toNumericValue(reading: TelemetryReading): number {
  if (reading.sensor_type === 'vibration_xyz') {
    return vibrationMagnitude(reading);
  }

  return reading.value ?? 0;
}

function isAlertReading(sensorType: SensorType, numericValue: number): boolean {
  const threshold = alertThresholds[sensorType];
  return numericValue >= threshold;
}

export function normalizeTelemetryBatch(
  payload: TelemetryIngestBody
): NormalizedTelemetryReading[] {
  return payload.readings.map(reading => ({
    device_id: payload.device_id,
    floor: payload.floor,
    zone: payload.zone,
    sensor_type: reading.sensor_type,
    numeric_value: toNumericValue(reading),
    unit: reading.unit ?? defaultUnits[reading.sensor_type],
    confidence: reading.confidence,
    captured_at: reading.captured_at,
  }));
}

export function buildEdgeTriggerSources(detection: EdgeDetectionEnvelope): string[] {
  const triggerSources = new Set<string>();
  triggerSources.add(`edge:${detection.device_id}:${detection.model_name}`);

  detection.sensor_readings.forEach(reading => {
    const numericValue = toNumericValue(reading);
    if (isAlertReading(reading.sensor_type, numericValue)) {
      triggerSources.add(`sensor:${reading.sensor_type}:${detection.device_id}`);
    }
  });

  return [...triggerSources];
}
