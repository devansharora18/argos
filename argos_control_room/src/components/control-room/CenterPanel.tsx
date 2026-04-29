import { floorOrder, type FloorKey, type FloorSnapshot, type LiveIncident } from '../../types/controlRoom';
import { layerViews } from '../../data/controlRoomData';

type CenterPanelProps = {
  activeFloor: FloorKey;
  activeSnapshot: FloorSnapshot;
  zoom: number;
  liveIncident?: LiveIncident | null;
  switchingToFloor?: FloorKey | null;
  onFloorSelect: (floor: FloorKey) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

/** Extract the first L-command coordinate from a SVG path string — used for the equipment pickup dot */
function firstCorner(path: string): { x: number; y: number } | null {
  const m = path.match(/M\s*[\d.]+\s+[\d.]+\s+L\s*([\d.]+)\s+([\d.]+)/);
  return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : null;
}

export function CenterPanel({
  activeFloor,
  activeSnapshot,
  zoom,
  liveIncident,
  switchingToFloor,
  onFloorSelect,
  onZoomIn,
  onZoomOut,
}: CenterPanelProps): JSX.Element {
  const isLive = Boolean(liveIncident);

  // Derive floor journey: staff starts at Floor 1, travels to incident floor
  const staffStartFloor: FloorKey = '1';
  const incidentFloor = (liveIncident?.floor ?? null) as FloorKey | null;
  const startIdx = floorOrder.indexOf(staffStartFloor);
  const endIdx   = incidentFloor ? floorOrder.indexOf(incidentFloor) : -1;
  const journeyFloors: FloorKey[] =
    isLive && endIdx >= 0
      ? (startIdx <= endIdx
          ? (floorOrder.slice(startIdx, endIdx + 1) as FloorKey[])
          : (floorOrder.slice(endIdx, startIdx + 1).reverse() as FloorKey[]))
      : [];

  // Equipment to pick up (from primary dispatch decision)
  const equipment: string[] =
    liveIncident?.dispatch_decisions[0]?.equipment_to_bring ?? [];

  // First-corner coordinate on the route path → equipment pickup marker
  const pickupDot = isLive ? firstCorner(activeSnapshot.path) : null;

  // Route animation key — changes every time a new incident arrives so animation re-runs
  const routeAnimKey = liveIncident?.timestamp ?? 'static';

  return (
    <section className="flex min-h-0 flex-col gap-2.5 border border-[#2a3040] bg-gradient-to-b from-[#121722] to-[#0e121c] p-2.5">
      <div className="flex gap-1" role="tablist" aria-label="Floor tabs">
        {floorOrder.map((floor) => (
          <button
            key={floor}
            type="button"
            className={`h-[30px] w-9 border font-['Space_Mono'] text-xs transition-all duration-300 ${
              activeFloor === floor
                ? isLive && floor === incidentFloor
                  ? 'border-[#ff3a50] bg-[#2a0d14] text-[#ff7080] shadow-[0_0_8px_#ff3a5066]'
                  : 'border-[#8c5059] bg-[#311b22] text-[#ffc3cb]'
                : isLive && journeyFloors.includes(floor)
                  ? 'border-[#2a5088] bg-[#111a2c] text-[#6090d0]'
                  : 'border-[#353b4e] bg-[#1b2030] text-[#a6abb9]'
            }`}
            onClick={() => onFloorSelect(floor)}
          >
            {floor}
          </button>
        ))}
      </div>

      {/* Floor journey strip — only when live */}
      {isLive && journeyFloors.length > 0 && (
        <div className="flex items-center gap-0 overflow-x-auto border border-[#1e2840] bg-[#0b1020] px-3 py-2">
          <span className="shrink-0 font-['Space_Mono'] text-[9px] tracking-[0.15em] text-[#3a4870] mr-2">
            RESCUE ROUTE
          </span>
          {/* Staff start */}
          <div className="flex shrink-0 items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[#38e785]" />
            <span className="font-['Space_Mono'] text-[10px] text-[#38e785]">
              FL{staffStartFloor} YOU
            </span>
          </div>
          {journeyFloors.slice(1).map((floor, i) => (
            <div key={floor} className="flex shrink-0 items-center">
              {/* Arrow */}
              <span className="mx-1.5 font-['Space_Mono'] text-[10px] text-[#2a3448]">──→</span>
              {/* Stairwell label between non-adjacent floors */}
              {i === 0 && (
                <span className="mr-1.5 font-['Space_Mono'] text-[9px] text-[#4a6080]">
                  {activeSnapshot.stairLabel}
                </span>
              )}
              {floor === incidentFloor ? (
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 animate-ping rounded-full bg-[#ff3a50]" />
                  <span className="font-['Space_Mono'] text-[10px] font-bold text-[#ff4a60]">
                    FL{floor} INCIDENT
                  </span>
                </div>
              ) : (
                <span className="font-['Space_Mono'] text-[10px] text-[#4a6090]">
                  FL{floor}
                </span>
              )}
            </div>
          ))}
          {/* Equipment pickup badge */}
          {equipment.length > 0 && (
            <>
              <span className="mx-2 font-['Space_Mono'] text-[9px] text-[#2a3448]">·</span>
              <span className="shrink-0 border border-[#7a6020] bg-[#1a1408] px-2 py-0.5 font-['Space_Mono'] text-[9px] text-[#e0a020]">
                ⬡ COLLECT: {equipment[0].toUpperCase()}
              </span>
            </>
          )}
        </div>
      )}

      <div className="relative min-h-[360px] flex-1 overflow-hidden border border-[#2a3042] bg-[radial-gradient(circle_at_50%_20%,#1b1f2d,#111520_60%)]">
        {/* Floor-switching overlay — shows while stepping through floors */}
        {switchingToFloor && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-3 border border-[#3a4870] bg-[#080c18ee] px-10 py-6">
              <span className="font-['Space_Mono'] text-[10px] tracking-[0.25em] text-[#3a4870]">
                SWITCHING TO
              </span>
              <span className="font-['Orbitron'] text-[52px] font-extrabold leading-none tracking-[0.1em] text-[#5090ff]">
                FL {switchingToFloor}
              </span>
              <div className="flex gap-1">
                {floorOrder.map((f) => (
                  <span
                    key={f}
                    className={`inline-block h-1.5 w-6 rounded-full transition-all duration-300 ${
                      f === switchingToFloor ? 'bg-[#5090ff]' : 'bg-[#1e2840]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Live incident floor badge */}
        {isLive && !switchingToFloor && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-2 border border-[#6a1e28] bg-[#1a0b10] px-2.5 py-1.5">
            <span className="inline-block h-2 w-2 animate-ping rounded-full bg-[#ff3a50]" />
            <span className="font-['Space_Mono'] text-[10px] tracking-[0.15em] text-[#ff6070]">
              LIVE — FLOOR {liveIncident?.floor} · {liveIncident?.zone?.toUpperCase()}
            </span>
          </div>
        )}

        <svg
          className="size-full"
          viewBox="0 0 780 620"
          preserveAspectRatio="xMidYMid meet"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          aria-label="Live floor map"
        >
          <defs>
            <style>{`
              @keyframes argos-pulse {
                0%   { r: 14; opacity: 0.9; }
                70%  { r: 38; opacity: 0; }
                100% { r: 38; opacity: 0; }
              }
              @keyframes argos-pulse2 {
                0%   { r: 14; opacity: 0.6; }
                70%  { r: 52; opacity: 0; }
                100% { r: 52; opacity: 0; }
              }
              @keyframes draw-route {
                from { stroke-dashoffset: 1200; }
                to   { stroke-dashoffset: 0; }
              }
              @keyframes pickup-pop {
                0%   { transform: scale(0); opacity: 0; }
                60%  { transform: scale(1.3); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
              }
              .argos-ring1 { animation: argos-pulse  1.6s ease-out infinite; fill: none; stroke: #ff3a50; stroke-width: 2; }
              .argos-ring2 { animation: argos-pulse2 1.6s ease-out 0.4s infinite; fill: none; stroke: #ff3a50; stroke-width: 1.5; }
              .live-route  { stroke-dasharray: 1200; animation: draw-route 2.2s ease-in-out forwards; }
              .pickup-dot  { transform-origin: center; animation: pickup-pop 0.5s ease-out 1.8s both; }
            `}</style>
          </defs>

          <rect x="18" y="18" width="744" height="584" fill="#171c28" stroke="#30374a" strokeWidth="2" />
          <rect x="64" y="66" width="652" height="488" fill="#141826" stroke="#272d3c" strokeWidth="1.5" />
          <line x1="64" y1="310" x2="716" y2="310" stroke="#1d2433" strokeWidth="1" />
          <line x1="390" y1="66" x2="390" y2="554" stroke="#1d2433" strokeWidth="1" />
          <rect x="110" y="115" width="95" height="78" fill="#131827" stroke="#202737" />
          <rect x="578" y="358" width="92" height="76" fill="#131827" stroke="#202737" />

          {/* Route path — animated draw when live, static dashed when standby */}
          <path
            key={routeAnimKey}
            d={activeSnapshot.path}
            fill="none"
            stroke={isLive ? '#50ff90' : '#42e37f'}
            strokeWidth={isLive ? 5 : 4}
            strokeLinecap="round"
            className={isLive ? 'live-route' : undefined}
            strokeDasharray={isLive ? undefined : '9 8'}
            opacity={isLive ? 1 : 0.55}
          />

          {/* Equipment pickup dot — pops in after route draws */}
          {isLive && pickupDot && (
            <g className="pickup-dot">
              <circle cx={pickupDot.x} cy={pickupDot.y} r="14" fill="#1a1200" stroke="#e0a020" strokeWidth="2" />
              <text
                x={pickupDot.x}
                y={pickupDot.y + 4}
                textAnchor="middle"
                style={{ fontFamily: 'Space Mono', fontSize: '10px', fill: '#e0c030', fontWeight: 'bold' }}
              >
                KIT
              </text>
              <text
                x={pickupDot.x}
                y={pickupDot.y + 22}
                textAnchor="middle"
                style={{ fontFamily: 'Space Mono', fontSize: '9px', fill: '#b08010' }}
              >
                COLLECT
              </text>
            </g>
          )}

          {/* Start marker */}
          <circle cx="170" cy="460" r="9" fill="#43dc7a" />
          <text x="182" y="480" fill="#38e785" style={{ fontFamily: 'Space Mono', fontSize: '9px' }}>YOU</text>

          {/* Incident marker — pulses when live */}
          {isLive ? (
            <>
              <circle className="argos-ring1" cx="540" cy="260" r="14" />
              <circle className="argos-ring2" cx="540" cy="260" r="14" />
              <circle cx="540" cy="260" r="11" fill="#ff2a42" />
            </>
          ) : (
            <circle cx="540" cy="260" r="10" fill="#f74b57" />
          )}

          <text x="228" y="476" fill="#4be183" style={{ fontFamily: 'Space Mono', fontSize: '13px' }}>
            {activeSnapshot.stairLabel}
          </text>
          <text x="518" y="228" fill={isLive ? '#ff7080' : '#ffb5bf'} style={{ fontFamily: 'Space Mono', fontSize: '13px' }}>
            {isLive ? (liveIncident?.zone?.toUpperCase() ?? activeSnapshot.roomLabel) : activeSnapshot.roomLabel}
          </text>
          <text x="434" y="284" fill="#8ca6d7" style={{ fontFamily: 'Space Mono', fontSize: '13px' }}>
            {activeSnapshot.unitLabel}
          </text>
        </svg>

        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <button
            type="button"
            className="grid size-7 place-items-center border border-[#40485b] bg-[#1d2231] text-lg leading-none text-[#d6d8e2]"
            onClick={onZoomIn}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            className="grid size-7 place-items-center border border-[#40485b] bg-[#1d2231] text-lg leading-none text-[#d6d8e2]"
            onClick={onZoomOut}
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
          {layerViews.map((layer) => (
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
  );
}
