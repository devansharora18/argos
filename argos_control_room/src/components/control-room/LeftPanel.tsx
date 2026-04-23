import {
  incidentLog,
  personnel,
  unitPanels,
} from '../../data/controlRoomData';
import { tagToneClass } from '../../utils/controlRoom';

export function LeftPanel(): JSX.Element {
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
  );
}
