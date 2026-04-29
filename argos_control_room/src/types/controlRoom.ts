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

// Live incident from HAVEN backend (GET /api/v1/demo/latest)
export type LiveDispatch = {
  staff_id: string;
  staff_name: string;
  role: string;
  instruction: string;
  priority: string;
  equipment_to_bring: string[];
  route: string;
};

export type LiveIncident = {
  crisis_type: string;
  severity: number;
  confidence: number;
  floor: string;
  zone: string;
  classification_reasoning: string;
  dispatch_decisions: LiveDispatch[];
  guest_notification: {
    affected_floors: string[];
    message: string;
    evacuation_route: string;
    tone: string;
  };
  control_room_summary: string;
  external_escalation: {
    required: boolean;
    service: string;
    reason: string;
    auto_call_in_minutes: number;
  };
  decision_reasoning: string;
  orchestration_confidence: number;
  timestamp: string;
};
