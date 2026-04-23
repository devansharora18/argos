export const floorOrder = ['B1', '1', '2', '3', '4', '5'] as const;

export type FloorKey = (typeof floorOrder)[number];

export type TelemetrySnapshot = {
  smoke: number;
  temp: number;
  co2: string;
  audio: string;
};

export type FloorSnapshot = {
  path: string;
  roomLabel: string;
  unitLabel: string;
  stairLabel: string;
  severity: string;
  riskCount: string;
  eta: string;
  location: string;
  coord: string;
  telemetry: TelemetrySnapshot;
  reasoning: string[];
};

export type Toast = {
  id: number;
  message: string;
};

export type PersonnelTone = 'danger' | 'ok' | 'route' | 'idle';

export type PersonnelMember = {
  name: string;
  status: string;
  tone: PersonnelTone;
};
