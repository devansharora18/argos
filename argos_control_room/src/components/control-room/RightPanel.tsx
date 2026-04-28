import type {
  FloorKey,
  FloorSnapshot,
  TelemetrySnapshot,
} from '../../types/controlRoom';

type RightPanelProps = {
  activeFloor: FloorKey;
  activeSnapshot: FloorSnapshot;
  telemetry: TelemetrySnapshot;
  onCommand: (command: string) => void;
};

type CommandButtonProps = {
  label: string;
  className: string;
  onClick: () => void;
};

function CommandButton({ label, className, onClick }: CommandButtonProps): JSX.Element {
  return (
    <button type="button" className={className} onClick={onClick}>
      {label}
    </button>
  );
}

export function RightPanel({
  activeFloor,
  activeSnapshot,
  telemetry,
  onCommand,
}: RightPanelProps): JSX.Element {
  return (
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
        <CommandButton
          label="REASSIGN"
          className="h-[38px] border border-[#594050] bg-[#181c29] font-['Space_Mono'] text-[11px] tracking-[0.1em] text-[#d9ced7]"
          onClick={() => onCommand('REASSIGN')}
        />
        <CommandButton
          label="ESCALATE"
          className="h-[38px] border border-[#594050] bg-[#181c29] font-['Space_Mono'] text-[11px] tracking-[0.1em] text-[#d9ced7]"
          onClick={() => onCommand('ESCALATE')}
        />
        <CommandButton
          label="FALSE ALARM"
          className="col-span-2 h-[38px] border border-[#594050] bg-[#181c29] font-['Space_Mono'] text-[11px] tracking-[0.1em] text-[#d9ced7]"
          onClick={() => onCommand('FALSE ALARM')}
        />
        <CommandButton
          label="DECLARE ALL CLEAR"
          className="col-span-2 h-[38px] border border-[#962837] bg-[#970917] font-['Space_Mono'] text-[11px] tracking-[0.1em] text-[#ffd1d7]"
          onClick={() => onCommand('DECLARE ALL CLEAR')}
        />
      </section>
    </aside>
  );
}
