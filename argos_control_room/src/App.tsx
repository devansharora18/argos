import { useCallback, useEffect, useState } from 'react';

const floorOrder = ['B1', '1', '2', '3', '4', '5'] as const;

type FloorKey = (typeof floorOrder)[number];

type TelemetrySnapshot = {
  smoke: number;
  temp: number;
  co2: string;
  audio: string;
};

type FloorSnapshot = {
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

type Toast = {
  id: number;
  message: string;
};

const floorState: Record<FloorKey, FloorSnapshot> = {
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

const personnel = [
  { name: 'John D.', status: 'RESPONDING', tone: 'danger' },
  { name: 'Sarah M.', status: 'AVAILABLE', tone: 'ok' },
  { name: 'Rajan K.', status: 'EN ROUTE', tone: 'route' },
  { name: 'Mike T.', status: 'OFF DUTY', tone: 'idle' },
] as const;

const incidentLog = [
  '[14:41] Thermal anomaly detected in Sector E-3.',
  '[14:40] Smoke detectors activated Floor 3 East.',
  '[14:38] System heartbeat nominal.',
  '[14:15] Routine shift change completed.',
];

const formatClock = (date: Date): string => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

const mutateValue = (value: number, range: number, minimum: number): number => {
  const delta = Math.floor(Math.random() * ((range * 2) + 1)) - range;
  return Math.max(minimum, value + delta);
};

const tagToneClass = (tone: (typeof personnel)[number]['tone']): string => {
  if (tone === 'danger') {
    return 'border-[#6e2e37] text-[#ff9ca8]';
  }
  if (tone === 'ok') {
    return 'border-[#2a6242] text-[#77eda6]';
  }
  if (tone === 'route') {
    return 'border-[#35507a] text-[#93c3ff]';
  }
  return 'border-[#3a3f4f] text-[#a3a8b5]';
};

export default function App(): JSX.Element {
  const [activeFloor, setActiveFloor] = useState<FloorKey>('3');
  const [clock, setClock] = useState<string>(() => formatClock(new Date()));
  const [nodesOnline, setNodesOnline] = useState<number>(247);
  const [zoom, setZoom] = useState<number>(1);
  const [telemetry, setTelemetry] = useState<TelemetrySnapshot>(
    () => ({ ...floorState['3'].telemetry }),
  );
  const [toasts, setToasts] = useState<Toast[]>([]);

  const activeSnapshot = floorState[activeFloor];

  const pushToast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2600);
  }, []);

  useEffect(() => {
    setTelemetry({ ...floorState[activeFloor].telemetry });
  }, [activeFloor]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(formatClock(new Date()));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const base = floorState[activeFloor].telemetry;
      setTelemetry({
        smoke: mutateValue(base.smoke, 4, 120),
        temp: mutateValue(base.temp, 2, 60),
        co2: base.co2,
        audio: base.audio,
      });
      setNodesOnline(240 + Math.floor(Math.random() * 13));
    }, 1400);

    return () => window.clearInterval(timer);
  }, [activeFloor]);

  useEffect(() => {
    if (window.argosMeta?.electron) {
      pushToast(
        `Electron ${window.argosMeta.electron} ready on ${window.argosMeta.platform}`,
      );
    }
  }, [pushToast]);

  return (
    <div className="h-full overflow-hidden text-[#ddd7dd]">
      <div className="flex h-full flex-col">
        <header className="grid h-[76px] grid-cols-[280px_1fr_350px] items-center gap-2.5 border-b border-[#2d3242] bg-gradient-to-r from-[#131723] via-[#0f131f] to-[#121623] px-3.5 py-2.5 max-[1220px]:h-auto max-[1220px]:grid-cols-1 max-[1220px]:gap-2 max-[1220px]:p-2.5 max-[1480px]:grid-cols-[240px_1fr_320px]">
          <div className="flex items-center gap-2.5">
            <div className="grid size-[34px] place-items-center rounded-lg border border-[#7b3138] font-['Orbitron'] text-lg font-extrabold text-[#ff4859]">
              A
            </div>
            <div className="leading-none">
              <div className="font-['Orbitron'] text-xl tracking-[0.2em] text-[#ff4456]">
                ARGOS
              </div>
              <div className="mt-1 font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#9c6870]">
                CONTROL ROOM
              </div>
            </div>
          </div>

          <div className="grid h-12 grid-cols-[auto_1fr_auto] items-center gap-2.5 border border-[#472631] bg-gradient-to-r from-[#1b1117] to-[#1a0f14] px-2.5">
            <div className="grid h-[30px] place-items-center border border-[#6a2430] bg-[#3f141b] px-3 font-['Space_Mono'] text-[11px] uppercase tracking-[0.1em] text-[#ffc8cf]">
              ACTIVE INCIDENT
            </div>
            <div className="font-['Space_Mono'] text-xs uppercase tracking-[0.08em] text-[#e2b8bf]">
              FIRE - FLOOR {activeFloor}, EAST WING
            </div>
            <div className="grid h-[30px] place-items-center border border-[#6a2430] px-3 font-['Space_Mono'] text-[11px] uppercase tracking-[0.1em] text-[#ff9da8]">
              {activeSnapshot.severity}
            </div>
          </div>

          <div className="grid grid-cols-[auto_auto_auto_auto] items-center justify-end gap-2.5">
            <div className="font-['Space_Mono'] text-sm tracking-[0.08em] text-[#c6c8d2]">
              {clock}
            </div>
            <div className="font-['Space_Mono'] text-xs tracking-[0.08em] text-[#44e884]">
              {nodesOnline} NODES ONLINE
            </div>
            <button
              type="button"
              className="grid size-8 place-items-center rounded-full border border-[#6b2a33] bg-[#24131a] text-lg font-extrabold text-[#ff5b6a]"
              onClick={() => pushToast('Alert channel acknowledged by operator JD')}
              aria-label="Acknowledge alerts"
            >
              !
            </button>
            <div className="grid h-8 min-w-[38px] place-items-center rounded border border-[#5f606f] bg-[#1d202d] font-['Space_Mono'] text-xs text-[#dedbe4]">
              JD
            </div>
          </div>
        </header>

        <main className="grid min-h-0 flex-1 grid-cols-[280px_minmax(480px,1fr)_320px] gap-3 overflow-hidden p-3 max-[1220px]:grid-cols-1 max-[1220px]:overflow-auto max-[1480px]:grid-cols-[240px_minmax(480px,1fr)_300px]">
          <aside className="flex min-h-0 flex-col gap-3 overflow-auto border border-[#2a3040] bg-gradient-to-b from-[#121722] to-[#0e121c] p-2.5">
            <section>
              <h3 className="mb-2 font-['Space_Mono'] text-[11px] tracking-[0.2em] text-[#b8adb4]">
                UNITS
              </h3>
              <ul className="space-y-1.5">
                {['INCIDENT LOG', 'COMMS', 'DEPLOYMENT'].map((item, index) => (
                  <li
                    key={item}
                    className={`flex h-[34px] items-center border px-2.5 font-['Space_Mono'] text-[11px] uppercase tracking-[0.1em] ${
                      index === 0
                        ? 'border-[#652530] bg-[#1f1017] text-[#ff6472]'
                        : 'border-[#232836] text-[#7f8495]'
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="mb-2 font-['Space_Mono'] text-[11px] tracking-[0.2em] text-[#b8adb4]">
                PERSONNEL ON SHIFT
              </h3>
              <ul className="space-y-1.5">
                {personnel.map((person) => (
                  <li
                    key={person.name}
                    className={`grid h-9 grid-cols-[1fr_auto] items-center border border-[#252b39] bg-[#161b28] px-2 ${
                      person.tone === 'idle' ? 'opacity-55' : ''
                    }`}
                  >
                    <span className="text-[16px] text-[#d3d0da]">{person.name}</span>
                    <span
                      className={`border px-1.5 py-0.5 font-['Space_Mono'] text-[10px] ${tagToneClass(person.tone)}`}
                    >
                      {person.status}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="mb-2 font-['Space_Mono'] text-[11px] tracking-[0.2em] text-[#b8adb4]">
                INCIDENT LOG
              </h3>
              <ul className="divide-y divide-[#1f2534]">
                {incidentLog.map((entry) => (
                  <li
                    key={entry}
                    className="py-1.5 font-['Space_Mono'] text-xs text-[#9ba1b3]"
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            </section>
          </aside>

          <section className="flex min-h-0 flex-col gap-2.5 border border-[#2a3040] bg-gradient-to-b from-[#121722] to-[#0e121c] p-2.5">
            <div className="flex gap-1" role="tablist" aria-label="Floor tabs">
              {floorOrder.map((floor) => (
                <button
                  key={floor}
                  type="button"
                  className={`h-[30px] w-9 border font-['Space_Mono'] text-xs ${
                    activeFloor === floor
                      ? 'border-[#8c5059] bg-[#311b22] text-[#ffc3cb]'
                      : 'border-[#353b4e] bg-[#1b2030] text-[#a6abb9]'
                  }`}
                  onClick={() => {
                    setActiveFloor(floor);
                    pushToast(`Floor ${floor} context loaded`);
                  }}
                >
                  {floor}
                </button>
              ))}
            </div>

            <div className="relative min-h-[360px] flex-1 overflow-hidden border border-[#2a3042] bg-[radial-gradient(circle_at_50%_20%,#1b1f2d,#111520_60%)]">
              <svg
                className="size-full"
                viewBox="0 0 780 620"
                preserveAspectRatio="xMidYMid meet"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                aria-label="Live floor map"
              >
                <rect x="18" y="18" width="744" height="584" fill="#171c28" stroke="#30374a" strokeWidth="2" />
                <rect x="64" y="66" width="652" height="488" fill="#141826" stroke="#272d3c" strokeWidth="1.5" />
                <line x1="64" y1="310" x2="716" y2="310" stroke="#1d2433" strokeWidth="1" />
                <line x1="390" y1="66" x2="390" y2="554" stroke="#1d2433" strokeWidth="1" />
                <rect x="110" y="115" width="95" height="78" fill="#131827" stroke="#202737" />
                <rect x="578" y="358" width="92" height="76" fill="#131827" stroke="#202737" />

                <path
                  d={activeSnapshot.path}
                  fill="none"
                  stroke="#42e37f"
                  strokeWidth="4"
                  strokeDasharray="9 8"
                  strokeLinecap="round"
                />

                <circle cx="170" cy="460" r="8" fill="#43dc7a" />
                <circle cx="540" cy="260" r="10" fill="#f74b57" />
                <text x="228" y="476" fill="#4be183" className="font-['Space_Mono'] text-[13px]">
                  {activeSnapshot.stairLabel}
                </text>
                <text x="518" y="228" fill="#ffb5bf" className="font-['Space_Mono'] text-[13px]">
                  {activeSnapshot.roomLabel}
                </text>
                <text x="434" y="284" fill="#8ca6d7" className="font-['Space_Mono'] text-[13px]">
                  {activeSnapshot.unitLabel}
                </text>
              </svg>

              <div className="absolute bottom-3 left-3 flex gap-1.5">
                <button
                  type="button"
                  className="grid size-7 place-items-center border border-[#40485b] bg-[#1d2231] text-lg leading-none text-[#d6d8e2]"
                  onClick={() => setZoom((prev) => Math.min(1.35, Number((prev + 0.08).toFixed(2))))}
                  aria-label="Zoom in"
                >
                  +
                </button>
                <button
                  type="button"
                  className="grid size-7 place-items-center border border-[#40485b] bg-[#1d2231] text-lg leading-none text-[#d6d8e2]"
                  onClick={() => setZoom((prev) => Math.max(0.85, Number((prev - 0.08).toFixed(2))))}
                  aria-label="Zoom out"
                >
                  -
                </button>
              </div>

              <div className="absolute bottom-3 right-3 border border-[#4e5062] bg-[#2a2f3f] px-2 py-1.5 font-['Space_Mono'] text-[11px] text-[#bfc3cf]">
                {activeSnapshot.coord}
              </div>
            </div>

            <section className="border border-[#273245] bg-[#101a2a] p-2.5">
              <h3 className="mb-2.5 font-['Space_Mono'] text-sm tracking-[0.08em] text-[#c2cad9]">
                THREE-LAYER EXPERIENCE DESIGN
              </h3>
              <div className="grid grid-cols-3 gap-2 max-[1220px]:grid-cols-1">
                {[
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
                ].map((layer) => (
                  <article key={layer.title} className="border border-[#3a4458] bg-[#141f33] p-2">
                    <h4 className="mb-1.5 font-['Space_Mono'] text-[11px] tracking-[0.1em] text-[#e7d4d8]">
                      {layer.title}
                    </h4>
                    <p className="m-0 text-[13px] leading-[1.35] text-[#b6bfcd]">{layer.body}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <aside className="flex min-h-0 flex-col gap-3 overflow-auto border border-[#2a3040] bg-gradient-to-b from-[#121722] to-[#0e121c] p-2.5">
            <section className="border border-[#3c2d34] bg-[#1b171f] p-2.5">
              <h2 className="m-0 font-['Orbitron'] text-[32px] tracking-[0.06em] text-[#ffcad0] max-[1480px]:text-[26px]">
                STRUCTURAL FIRE
              </h2>
              <p className="my-2 text-lg text-[#bcadb4]">{activeSnapshot.location}</p>
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                <span className="border border-[#79303a] bg-[#191d2a] px-[7px] py-[2px] font-['Space_Mono'] text-[10px] tracking-[0.1em] text-[#ff9eaa]">
                  {activeSnapshot.severity.replace(' / ', '/')}
                </span>
                <span className="border border-[#3d4050] bg-[#191d2a] px-[7px] py-[2px] font-['Space_Mono'] text-[10px] tracking-[0.1em] text-[#b8becc]">
                  FLOOR {activeFloor}
                </span>
                <span className="border border-[#3d4050] bg-[#191d2a] px-[7px] py-[2px] font-['Space_Mono'] text-[10px] tracking-[0.1em] text-[#b8becc]">
                  EAST WING
                </span>
                <span className="border border-[#6f5a38] bg-[#191d2a] px-[7px] py-[2px] font-['Space_Mono'] text-[10px] tracking-[0.1em] text-[#ffcc79]">
                  {activeSnapshot.riskCount}
                </span>
              </div>
              <div className="flex items-end justify-between border-t border-[#2a3140] pt-2 font-['Space_Mono'] text-xs text-[#9ba0af]">
                <span>EST TTO</span>
                <strong className="font-['Orbitron'] text-[34px] text-[#f3dbe0]">{activeSnapshot.eta}</strong>
              </div>
            </section>

            <section className="border border-[#2b3142] bg-[#121723] p-2.5">
              <h3 className="mb-2 font-['Space_Mono'] text-xs tracking-[0.15em] text-[#cabec6]">
                @ AI REASONING
              </h3>
              <ul className="grid list-disc gap-1.5 pl-4 font-['Space_Mono'] text-xs text-[#92a7cb]">
                {activeSnapshot.reasoning.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="border border-[#2b3142] bg-[#121723] p-2.5">
              <h3 className="mb-2 font-['Space_Mono'] text-xs tracking-[0.15em] text-[#cabec6]">
                LIVE TELEMETRY
              </h3>
              <dl className="grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-1">
                <dt className="font-['Space_Mono'] text-[11px] text-[#959aac]">SMOKE PPM</dt>
                <dd className="m-0 text-right font-['Space_Mono'] text-[13px] font-bold text-[#efc5cb]">
                  {telemetry.smoke}
                </dd>
                <dt className="font-['Space_Mono'] text-[11px] text-[#959aac]">TEMP</dt>
                <dd className="m-0 text-right font-['Space_Mono'] text-[13px] font-bold text-[#efc5cb]">
                  {telemetry.temp}C
                </dd>
                <dt className="font-['Space_Mono'] text-[11px] text-[#959aac]">CO2</dt>
                <dd className="m-0 text-right font-['Space_Mono'] text-[13px] font-bold text-[#efc5cb]">
                  {telemetry.co2}
                </dd>
                <dt className="font-['Space_Mono'] text-[11px] text-[#959aac]">AUDIO</dt>
                <dd className="m-0 text-right font-['Space_Mono'] text-[13px] font-bold text-[#efc5cb]">
                  {telemetry.audio}
                </dd>
              </dl>
            </section>

            <section className="mt-auto grid grid-cols-2 gap-2">
              <button
                type="button"
                className="h-[38px] border border-[#594050] bg-[#181c29] font-['Space_Mono'] text-[11px] tracking-[0.1em] text-[#d9ced7]"
                onClick={() => pushToast('Command issued: REASSIGN')}
              >
                REASSIGN
              </button>
              <button
                type="button"
                className="h-[38px] border border-[#594050] bg-[#181c29] font-['Space_Mono'] text-[11px] tracking-[0.1em] text-[#d9ced7]"
                onClick={() => pushToast('Command issued: ESCALATE')}
              >
                ESCALATE
              </button>
              <button
                type="button"
                className="col-span-2 h-[38px] border border-[#594050] bg-[#181c29] font-['Space_Mono'] text-[11px] tracking-[0.1em] text-[#d9ced7]"
                onClick={() => pushToast('Command issued: FALSE ALARM')}
              >
                FALSE ALARM
              </button>
              <button
                type="button"
                className="col-span-2 h-[38px] border border-[#962837] bg-[#970917] font-['Space_Mono'] text-[11px] tracking-[0.1em] text-[#ffd1d7]"
                onClick={() => pushToast('Command issued: DECLARE ALL CLEAR')}
              >
                DECLARE ALL CLEAR
              </button>
            </section>
          </aside>
        </main>
      </div>

      <div className="fixed bottom-4 right-4 z-20 grid gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="min-w-[260px] border border-[#3a4258] bg-[#1a202d] p-2.5 font-['Space_Mono'] text-xs tracking-[0.05em] text-[#dbddea]"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
