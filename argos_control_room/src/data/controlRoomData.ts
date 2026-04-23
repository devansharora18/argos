import type { FloorKey, FloorSnapshot, PersonnelMember } from '../types/controlRoom';

export const floorState: Record<FloorKey, FloorSnapshot> = {
  B1: {
    path: 'M 170 460 L 360 460 L 360 350 L 470 350',
    roomLabel: 'RM 108',
    unitLabel: 'SM',
    stairLabel: 'STAIRWELL A',
    severity: 'SEV 2 / 5',
    riskCount: '12 AT RISK',
    eta: '05:28',
    location: 'Basement 1 · Storage Sector',
    coord: 'COORD: 34.0502 N, 118.2430 W | ELEV: 24M | GRID: BL-01',
    telemetry: {
      smoke: 210,
      temp: 92,
      co2: 'NORMAL',
      audio: 'MUTED',
    },
    reasoning: [
      'Analyzing telemetry for basement channels...',
      'No secondary flare signatures confirmed.',
      'Ventilation remains stable. Continue suppression sweep.',
    ],
  },
  1: {
    path: 'M 180 420 L 300 420 L 300 290 L 430 290',
    roomLabel: 'RM 145',
    unitLabel: 'RK',
    stairLabel: 'STAIRWELL B',
    severity: 'SEV 3 / 5',
    riskCount: '26 AT RISK',
    eta: '04:12',
    location: 'Floor 1 · West Annex',
    coord: 'COORD: 34.0515 N, 118.2433 W | ELEV: 31M | GRID: WR-14',
    telemetry: {
      smoke: 330,
      temp: 144,
      co2: 'RISING',
      audio: 'DISTORTED',
    },
    reasoning: [
      'Smoke density rising near corridor west node.',
      'Predictive model suggests evacuation lane split.',
      'Routing nearest unit to RM 145 for confirmation.',
    ],
  },
  2: {
    path: 'M 170 460 L 320 460 L 320 240 L 510 240',
    roomLabel: 'RM 244',
    unitLabel: 'MT',
    stairLabel: 'STAIRWELL C',
    severity: 'SEV 3 / 5',
    riskCount: '31 AT RISK',
    eta: '03:59',
    location: 'Floor 2 · Core Hall',
    coord: 'COORD: 34.0520 N, 118.2436 W | ELEV: 38M | GRID: CH-27',
    telemetry: {
      smoke: 388,
      temp: 162,
      co2: 'RISING',
      audio: 'ANOMALY',
    },
    reasoning: [
      'Heat spread vector is moving north-east.',
      'Cross-floor plume risk moderate.',
      'Preparing corridor lock for emergency team transit.',
    ],
  },
  3: {
    path: 'M 170 460 L 440 460 L 440 260 L 540 260',
    roomLabel: 'RM 312',
    unitLabel: 'JD',
    stairLabel: 'STAIRWELL C',
    severity: 'SEV 4 / 5',
    riskCount: '47 AT RISK',
    eta: '03:42',
    location: 'Room 312 · Floor 3 · East Wing',
    coord: 'COORD: 34.0522 N, 118.2437 W | ELEV: 45M | GRID: AZ-99',
    telemetry: {
      smoke: 450,
      temp: 185,
      co2: 'NORMAL',
      audio: 'ANOMALY DETECTED',
    },
    reasoning: [
      'Analyzing telemetry...',
      'Stairwell A shows abnormal heat signature.',
      'Path block detected. Rerouting egress to Stairwell C.',
    ],
  },
  4: {
    path: 'M 170 460 L 320 460 L 320 210 L 570 210',
    roomLabel: 'RM 411',
    unitLabel: 'SM',
    stairLabel: 'STAIRWELL D',
    severity: 'SEV 5 / 5',
    riskCount: '83 AT RISK',
    eta: '02:28',
    location: 'Floor 4 · Main Atrium',
    coord: 'COORD: 34.0528 N, 118.2440 W | ELEV: 53M | GRID: MA-42',
    telemetry: {
      smoke: 625,
      temp: 240,
      co2: 'CRITICAL',
      audio: 'DISTRESS SIGNALS',
    },
    reasoning: [
      'Thermal field unstable over Atrium grid.',
      'Immediate reinforcement required.',
      'Escalating to severe incident protocol.',
    ],
  },
  5: {
    path: 'M 170 460 L 300 460 L 300 170 L 610 170',
    roomLabel: 'RM 506',
    unitLabel: 'RK',
    stairLabel: 'STAIRWELL E',
    severity: 'SEV 5 / 5',
    riskCount: '109 AT RISK',
    eta: '01:54',
    location: 'Floor 5 · Sky Lobby',
    coord: 'COORD: 34.0530 N, 118.2443 W | ELEV: 62M | GRID: SL-50',
    telemetry: {
      smoke: 712,
      temp: 286,
      co2: 'CRITICAL',
      audio: 'PANIC CLUSTER',
    },
    reasoning: [
      'Ceiling thermal inversion is accelerating fire spread.',
      'Upper deck egress now restricted.',
      'Override request queued for manual command approval.',
    ],
  },
};

export const personnel: PersonnelMember[] = [
  { name: 'John D.', status: 'RESPONDING', tone: 'danger' },
  { name: 'Sarah M.', status: 'AVAILABLE', tone: 'ok' },
  { name: 'Rajan K.', status: 'EN ROUTE', tone: 'route' },
  { name: 'Mike T.', status: 'OFF DUTY', tone: 'idle' },
];

export const incidentLog: string[] = [
  '[14:41] Thermal anomaly detected in Sector E-3.',
  '[14:40] Smoke detectors activated Floor 3 East.',
  '[14:38] System heartbeat nominal.',
  '[14:15] Routine shift change completed.',
];

export const unitPanels: string[] = ['INCIDENT LOG', 'COMMS', 'DEPLOYMENT'];

export const layerViews: Array<{ title: string; body: string }> = [
  {
    title: 'GUEST VIEW',
    body: 'Please use Stairwell C. Stay calm.',
  },
  {
    title: 'STAFF VIEW',
    body: 'Room 312 fire. Take ext. stair B. Medical standby.',
  },
  {
    title: 'CONTROL ROOM VIEW',
    body: 'Full map, all staff threads, AI reasoning, one-tap override.',
  },
];
