import {
  incidentLog,
  personnel,
  unitPanels,
} from '../../data/controlRoomData';
import type { LiveIncident, PersonnelTone } from '../../types/controlRoom';
import { tagToneClass } from '../../utils/controlRoom';

type LeftPanelProps = {
  liveIncident?: LiveIncident | null;
};

export function LeftPanel({ liveIncident }: LeftPanelProps): JSX.Element {
  const isLive = liveIncident !== null && liveIncident !== undefined;

  // Build merged personnel list — dispatched staff get RESPONDING status
  const dispatchedIds = new Set(
    isLive ? liveIncident!.dispatch_decisions.map((d) => d.staff_id) : [],
  );
  const dispatchedNames = isLive
    ? new Set(liveIncident!.dispatch_decisions.map((d) => d.staff_name.split(' ')[0].toUpperCase()))
    : new Set<string>();

  const mergedPersonnel = [
    // Inject dispatched staff from Gemini who aren't already in the static list
    ...(isLive
      ? liveIncident!.dispatch_decisions
          .filter(
            (d) =>
              !personnel.some((p) =>
                p.name.toUpperCase().includes(d.staff_name.split(' ')[0].toUpperCase()),
              ),
          )
          .map((d) => ({
            name: d.staff_name,
            status: 'RESPONDING',
            tone: 'danger' as PersonnelTone,
          }))
      : []),
    // Existing static personnel, upgraded to RESPONDING if name matches a dispatch
    ...personnel.map((p) => {
      if (
        isLive &&
        [...dispatchedNames].some((dn) => p.name.toUpperCase().includes(dn))
      ) {
        return { ...p, status: 'RESPONDING', tone: 'danger' as PersonnelTone };
      }
      return p;
    }),
  ];

  // Build live incident log entry
  const liveLogEntry = isLive
    ? `[LIVE] ${new Date(liveIncident!.timestamp).toLocaleTimeString()} — ${liveIncident!.crisis_type.toUpperCase()} SEV ${liveIncident!.severity} FL${liveIncident!.floor} ${liveIncident!.zone}`
    : null;

  return (
    <aside className="flex min-h-0 flex-col gap-3 overflow-auto border border-[#2a3040] bg-gradient-to-b from-[#121722] to-[#0e121c] p-2.5">
      <section>
        <h3 className="mb-2 font-['Space_Mono'] text-[11px] tracking-[0.2em] text-[#b8adb4]">
          UNITS
        </h3>
        <ul className="space-y-1.5">
          {unitPanels.map((item, index) => (
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
          {mergedPersonnel.map((person) => (
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
          {/* Live entry pinned to top */}
          {liveLogEntry && (
            <li className="py-1.5 font-['Space_Mono'] text-xs text-[#ff7080]">
              {liveLogEntry}
            </li>
          )}
          {/* Guest notification message */}
          {isLive && liveIncident!.guest_notification.message && (
            <li className="py-1.5 font-['Space_Mono'] text-xs text-[#ffcc79]">
              GUEST NOTIF: {liveIncident!.guest_notification.message.slice(0, 80)}…
            </li>
          )}
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
  );
}

