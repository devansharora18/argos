import type {
  FloorKey,
  FloorSnapshot,
  LiveIncident,
  TelemetrySnapshot,
} from '../../types/controlRoom';

type RightPanelProps = {
  activeFloor: FloorKey;
  activeSnapshot: FloorSnapshot;
  telemetry: TelemetrySnapshot;
  liveIncident?: LiveIncident | null;
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
  liveIncident,
  onCommand,
}: RightPanelProps): JSX.Element {
  // Derive display values — live incident overrides simulator snapshot
  const incidentTitle = liveIncident
    ? liveIncident.crisis_type
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
        .toUpperCase()
    : 'STRUCTURAL FIRE';

  const incidentLocation = liveIncident
    ? `Floor ${liveIncident.floor}, ${liveIncident.zone}`
    : activeSnapshot.location;

  const severityLabel = liveIncident
    ? `SEV ${liveIncident.severity} / ${Math.round(liveIncident.confidence * 100)}% CONF`
    : activeSnapshot.severity.replace(' / ', '/');

  const reasoningItems: string[] = liveIncident
    ? [
        liveIncident.classification_reasoning,
        ...liveIncident.decision_reasoning
          .split(/\.\s+/)
          .filter(Boolean)
          .slice(0, 3)
          .map((s) => (s.endsWith('.') ? s : `${s}.`)),
      ].slice(0, 5)
    : activeSnapshot.reasoning;

  const isLive = liveIncident !== null && liveIncident !== undefined;

  // ── STANDBY state when no live incident ──────────────────────────────────
  if (!isLive) {
    return (
      <aside className="flex min-h-0 flex-col gap-3 overflow-auto border border-[#2a3040] bg-gradient-to-b from-[#121722] to-[#0e121c] p-2.5">
        <section className="flex flex-1 flex-col items-center justify-center gap-4 border border-[#232836] bg-[#0f131d] p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#2a3040]">
            <span className="font-['Orbitron'] text-2xl text-[#3a4055]">◎</span>
          </div>
          <p className="font-['Orbitron'] text-xs tracking-[0.2em] text-[#3a4055]">
            SYSTEM NOMINAL
          </p>
          <p className="font-['Space_Mono'] text-[10px] text-[#2d3345]">
            NO ACTIVE INCIDENT
          </p>
          <p className="font-['Space_Mono'] text-[10px] text-[#252d3d]">
            MONITORING ALL FLOORS
          </p>
        </section>
        <section className="mt-auto grid grid-cols-2 gap-2">
          <CommandButton
            label="REASSIGN"
            className="h-[38px] border border-[#232836] bg-[#0f131d] font-['Space_Mono'] text-[11px] tracking-[0.1em] text-[#3a4055]"
            onClick={() => onCommand('REASSIGN')}
          />
          <CommandButton
            label="ESCALATE"
            className="h-[38px] border border-[#232836] bg-[#0f131d] font-['Space_Mono'] text-[11px] tracking-[0.1em] text-[#3a4055]"
            onClick={() => onCommand('ESCALATE')}
          />
          <CommandButton
            label="FALSE ALARM"
            className="col-span-2 h-[38px] border border-[#232836] bg-[#0f131d] font-['Space_Mono'] text-[11px] tracking-[0.1em] text-[#3a4055]"
            onClick={() => onCommand('FALSE ALARM')}
          />
          <CommandButton
            label="DECLARE ALL CLEAR"
            className="col-span-2 h-[38px] border border-[#232836] bg-[#0f131d] font-['Space_Mono'] text-[11px] tracking-[0.1em] text-[#3a4055]"
            onClick={() => onCommand('DECLARE ALL CLEAR')}
          />
        </section>
      </aside>
    );
  }

  return (
    <aside className="flex min-h-0 flex-col gap-3 overflow-auto border border-[#2a3040] bg-gradient-to-b from-[#121722] to-[#0e121c] p-2.5">
      {/* Live badge */}
      <div className="flex items-center gap-2 border border-[#4a1f28] bg-[#1e0d12] px-2.5 py-1.5">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#ff4060]" />
        <span className="font-['Space_Mono'] text-[10px] tracking-[0.15em] text-[#ff7080]">
          LIVE INCIDENT — GEMINI AI
        </span>
        <span className="ml-auto font-['Space_Mono'] text-[9px] text-[#7a6d72]">
          ORCH {Math.round((liveIncident?.orchestration_confidence ?? 0) * 100)}%
        </span>
      </div>

      <section className="border border-[#3c2d34] bg-[#1b171f] p-2.5">
        <h2 className="m-0 font-['Orbitron'] text-[32px] tracking-[0.06em] text-[#ffcad0] max-[1480px]:text-[26px]">
          {incidentTitle}
        </h2>
        <p className="my-2 text-lg text-[#bcadb4]">{incidentLocation}</p>
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          <span className="border border-[#79303a] bg-[#191d2a] px-[7px] py-[2px] font-['Space_Mono'] text-[10px] tracking-[0.1em] text-[#ff9eaa]">
            {severityLabel}
          </span>
          <span className="border border-[#3d4050] bg-[#191d2a] px-[7px] py-[2px] font-['Space_Mono'] text-[10px] tracking-[0.1em] text-[#b8becc]">
            FLOOR {activeFloor}
          </span>
          {!isLive && (
            <span className="border border-[#3d4050] bg-[#191d2a] px-[7px] py-[2px] font-['Space_Mono'] text-[10px] tracking-[0.1em] text-[#b8becc]">
              EAST WING
            </span>
          )}
          {isLive && liveIncident?.external_escalation.required && (
            <span className="border border-[#79303a] bg-[#191d2a] px-[7px] py-[2px] font-['Space_Mono'] text-[10px] tracking-[0.1em] text-[#ff9eaa]">
              {liveIncident.external_escalation.service.toUpperCase()} NOTIFIED
            </span>
          )}
          <span className="border border-[#6f5a38] bg-[#191d2a] px-[7px] py-[2px] font-['Space_Mono'] text-[10px] tracking-[0.1em] text-[#ffcc79]">
            {isLive
              ? `${liveIncident?.dispatch_decisions.length ?? 0} DISPATCHED`
              : activeSnapshot.riskCount}
          </span>
        </div>
        <div className="flex items-end justify-between border-t border-[#2a3140] pt-2 font-['Space_Mono'] text-xs text-[#9ba0af]">
          <span>{isLive ? 'AUTO-CALL' : 'EST TTO'}</span>
          <strong className="font-['Orbitron'] text-[34px] text-[#f3dbe0]">
            {isLive
              ? `${liveIncident?.external_escalation.auto_call_in_minutes ?? '—'} MIN`
              : activeSnapshot.eta}
          </strong>
        </div>
      </section>

      <section className="border border-[#2b3142] bg-[#121723] p-2.5">
        <h3 className="mb-2 font-['Space_Mono'] text-xs tracking-[0.15em] text-[#cabec6]">
          @ AI REASONING
        </h3>
        <ul className="grid list-disc gap-1.5 pl-4 font-['Space_Mono'] text-xs text-[#92a7cb]">
          {reasoningItems.map((item, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* External escalation reason — only when live and required */}
      {isLive && liveIncident?.external_escalation.required && (
        <section className="border border-[#3c2030] bg-[#140d10] p-2.5">
          <h3 className="mb-1.5 font-['Space_Mono'] text-xs tracking-[0.15em] text-[#e07070]">
            ⚠ EXTERNAL ESCALATION
          </h3>
          <p className="font-['Space_Mono'] text-[11px] leading-relaxed text-[#c07070]">
            {liveIncident.external_escalation.service.toUpperCase()} — {liveIncident.external_escalation.reason}
          </p>
          {liveIncident.guest_notification.affected_floors.length > 0 && (
            <p className="mt-1.5 font-['Space_Mono'] text-[10px] text-[#8a5050]">
              AFFECTED FLOORS: {liveIncident.guest_notification.affected_floors.join(', ')}
            </p>
          )}
        </section>
      )}

      {/* Dispatch list — only shown when live */}
      {isLive && liveIncident && liveIncident.dispatch_decisions.length > 0 && (
        <section className="border border-[#2b3142] bg-[#121723] p-2.5">
          <h3 className="mb-2 font-['Space_Mono'] text-xs tracking-[0.15em] text-[#cabec6]">
            DISPATCHED PERSONNEL
          </h3>
          <ul className="space-y-1.5">
            {liveIncident.dispatch_decisions.map((d) => (
              <li
                key={d.staff_id}
                className="grid grid-cols-[1fr_auto] items-center border border-[#252b39] bg-[#161b28] px-2 py-1"
              >
                <div>
                  <p className="font-['Space_Mono'] text-[11px] text-[#d3d0da]">{d.staff_name}</p>
                  <p className="font-['Space_Mono'] text-[10px] text-[#6e7485]">{d.role}</p>
                </div>
                <span
                  className={`border px-1.5 py-0.5 font-['Space_Mono'] text-[9px] uppercase tracking-[0.1em] ${
                    d.priority === 'primary'
                      ? 'border-[#652530] text-[#ff6472]'
                      : 'border-[#3d4050] text-[#b8becc]'
                  }`}
                >
                  {d.priority}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

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
