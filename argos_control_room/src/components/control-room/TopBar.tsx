import type { FloorKey } from '../../types/controlRoom';

type TopBarProps = {
  activeFloor: FloorKey;
  severity: string;
  clock: string;
  nodesOnline: number;
  onAcknowledgeAlert: () => void;
};

export function TopBar({
  activeFloor,
  severity,
  clock,
  nodesOnline,
  onAcknowledgeAlert,
}: TopBarProps): JSX.Element {
  return (
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
          {severity}
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
          onClick={onAcknowledgeAlert}
          aria-label="Acknowledge alerts"
        >
          !
        </button>
        <div className="grid h-8 min-w-[38px] place-items-center rounded border border-[#5f606f] bg-[#1d202d] font-['Space_Mono'] text-xs text-[#dedbe4]">
          JD
        </div>
      </div>
    </header>
  );
}
