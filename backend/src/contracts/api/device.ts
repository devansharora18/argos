import { z } from 'zod';
import { crisisTypeSchema } from './crisis';

export const sensorTypeSchema = z.enum([
  'smoke_ppm',
  'temperature_celsius',
  'co2_ppm',
  'humidity_pct',
  'pressure_hpa',
  'vibration_xyz',
]);

export const deviceTypeSchema = z.enum([
  'edge_gateway',
  'smoke_sensor',
  'thermal_sensor',
  'air_quality_sensor',
  'vibration_sensor',
  'multi_sensor',
]);

export const deviceStatusSchema = z.enum(['online', 'offline', 'degraded', 'maintenance']);

export const registerDeviceBodySchema = z.object({
  external_device_id: z.string().min(1).max(128).optional(),
  device_type: deviceTypeSchema,
  model: z.string().min(1).max(128),
  floor: z.string().min(1).max(64),
  zone: z.string().min(1).max(128).optional(),
  sensor_types: z.array(sensorTypeSchema).min(1),
  capabilities: z.record(z.unknown()).optional(),
});

export const listDevicesQuerySchema = z.object({
  status: deviceStatusSchema.optional(),
  floor: z.string().min(1).max(64).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

const vibrationVectorSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

export const telemetryReadingSchema = z
  .object({
    sensor_type: sensorTypeSchema,
    value: z.number().optional(),
    vibration_xyz: vibrationVectorSchema.optional(),
    unit: z.string().min(1).max(32).optional(),
    confidence: z.number().min(0).max(1).default(1),
    captured_at: z.string().datetime(),
  })
  .superRefine((value, ctx) => {
    if (value.sensor_type === 'vibration_xyz') {
      if (!value.vibration_xyz) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['vibration_xyz'],
          message: 'vibration_xyz is required for vibration sensor readings',
        });
      }
      return;
    }

    if (typeof value.value !== 'number') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['value'],
        message: 'value is required for non-vibration readings',
      });
      return;
    }

    const ranges: Record<Exclude<SensorType, 'vibration_xyz'>, { min: number; max: number }> = {
      smoke_ppm: { min: 0, max: 1000 },
      temperature_celsius: { min: -40, max: 120 },
      co2_ppm: { min: 0, max: 10000 },
      humidity_pct: { min: 0, max: 100 },
      pressure_hpa: { min: 300, max: 1200 },
    };

    const range = ranges[value.sensor_type as Exclude<SensorType, 'vibration_xyz'>];
    if (!range) {
      return;
    }

    if (value.value < range.min || value.value > range.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['value'],
        message: `${value.sensor_type} must be between ${range.min} and ${range.max}`,
      });
    }
  });

export const telemetryIngestBodySchema = z.object({
  device_id: z.string().min(1),
  floor: z.string().min(1),
  zone: z.string().min(1).optional(),
  readings: z.array(telemetryReadingSchema).min(1).max(1000),
});

export const telemetrySummaryQuerySchema = z.object({
  floor: z.string().min(1).max(64).optional(),
  sensor_type: sensorTypeSchema.optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export const deviceHeartbeatBodySchema = z.object({
  status: deviceStatusSchema,
  battery_pct: z.number().min(0).max(100).optional(),
  signal_strength: z.number().min(-120).max(0).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const edgeDetectionEnvelopeSchema = z.object({
  detection_id: z.string().min(1).max(128),
  venue_id: z.string().min(1),
  device_id: z.string().min(1),
  floor: z.string().min(1),
  zone: z.string().min(1).optional(),
  detected_at: z.string().datetime(),
  model_name: z.string().min(1).max(128),
  model_version: z.string().min(1).max(64).optional(),
  confidence: z.number().min(0).max(1),
  crisis_hint: crisisTypeSchema.optional(),
  sequence_number: z.number().int().min(0).optional(),
  sensor_readings: z.array(telemetryReadingSchema).default([]),
});

export const edgeReplayBatchBodySchema = z
  .object({
    batch_id: z.string().min(1).max(128),
    venue_id: z.string().min(1),
    replayed_at: z.string().datetime(),
    detections: z.array(edgeDetectionEnvelopeSchema).min(1),
  })
  .superRefine((value, ctx) => {
    value.detections.forEach((detection, index) => {
      if (detection.venue_id !== value.venue_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['detections', index, 'venue_id'],
          message: 'detection venue_id must match batch venue_id',
        });
      }
    });
  });

export type SensorType = z.infer<typeof sensorTypeSchema>;
export type DeviceType = z.infer<typeof deviceTypeSchema>;
export type DeviceStatus = z.infer<typeof deviceStatusSchema>;
export type RegisterDeviceBody = z.infer<typeof registerDeviceBodySchema>;
export type ListDevicesQuery = z.infer<typeof listDevicesQuerySchema>;
export type DeviceHeartbeatBody = z.infer<typeof deviceHeartbeatBodySchema>;
export type TelemetryReading = z.infer<typeof telemetryReadingSchema>;
export type TelemetryIngestBody = z.infer<typeof telemetryIngestBodySchema>;
export type TelemetrySummaryQuery = z.infer<typeof telemetrySummaryQuerySchema>;
export type EdgeDetectionEnvelope = z.infer<typeof edgeDetectionEnvelopeSchema>;
export type EdgeReplayBatchBody = z.infer<typeof edgeReplayBatchBodySchema>;

export interface DeviceResponse {
  device_id: string;
  venue_id: string;
  external_device_id?: string;
  device_type: DeviceType;
  model: string;
  floor: string;
  zone?: string;
  sensor_types: SensorType[];
  capabilities: Record<string, unknown>;
  status: DeviceStatus;
  created_at: string;
  updated_at: string;
  last_seen_at: string;
}

export interface RegisterDeviceResponse {
  device: DeviceResponse;
  correlation_id: string;
}

export interface ListDevicesResponse {
  venue_id: string;
  devices: DeviceResponse[];
}

export interface GetDeviceResponse {
  venue_id: string;
  device: DeviceResponse;
}

export interface DeviceHeartbeatResponse {
  venue_id: string;
  device_id: string;
  status: DeviceStatus;
  last_seen_at: string;
  correlation_id: string;
}

export interface TelemetryIngestResponse {
  accepted: boolean;
  venue_id: string;
  device_id: string;
  ingested_count: number;
  correlation_id: string;
}

export interface TelemetrySummaryItem {
  floor: string;
  sensor_type: SensorType;
  sample_count: number;
  avg_value: number;
  max_value: number;
  last_value: number;
  last_seen_at: string;
}

export interface TelemetrySummaryResponse {
  venue_id: string;
  summaries: TelemetrySummaryItem[];
}

export interface EdgeIngestResponse {
  accepted: boolean;
  detection_id: string;
  correlation_id: string;
}

export interface EdgeReplayResponse {
  accepted: boolean;
  batch_id: string;
  detection_count: number;
  correlation_id: string;
}
