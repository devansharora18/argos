import type { IncomingCrisis } from '../../hooks/useCrisisStream';

type ActiveCrisisBannerProps = {
  crisis: IncomingCrisis;
  onDismiss: () => void;
};

export function ActiveCrisisBanner({ crisis, onDismiss }: ActiveCrisisBannerProps): JSX.Element {
  return (
    <div className="fixed left-1/2 top-4 z-30 w-[min(720px,calc(100vw-32px))] -translate-x-1/2 border border-[#a1161a] bg-[#1a0608] shadow-[0_0_45px_rgba(255,40,40,0.35)]">
      <div className="flex items-center justify-between border-b border-[#a1161a] bg-[#a1161a] px-4 py-1.5 font-['Space_Mono'] text-[10px] uppercase tracking-[0.22em] text-white">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          INCOMING CRISIS · {crisis.source.toUpperCase()}
        </span>
        <button
          type="button"
          onClick={onDismiss}
          className="text-[10px] uppercase tracking-[0.18em] text-white/80 transition hover:text-white"
        >
          ack
        </button>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 font-['Space_Mono']">
        <div className="text-[28px] font-bold uppercase tracking-[0.08em] text-[#ff8a8a]">
          {crisis.crisis_type}
        </div>
        <div className="grid gap-1 text-[12px] leading-tight tracking-[0.04em] text-[#dbddea]">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#9ba0ad]">
            {crisis.zone}
            {crisis.floor ? ` · floor ${crisis.floor}` : ''}
          </span>
          <span>{crisis.description}</span>
          <span className="text-[10px] tracking-[0.08em] text-[#7a7e8b]">
            id {crisis.crisis_id} · detected {new Date(crisis.detected_at).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 text-[10px] uppercase tracking-[0.18em]">
          <span className="text-[#9ba0ad]">severity</span>
          <span className="text-[24px] font-bold leading-none text-[#ff5c5c]">{crisis.severity}</span>
        </div>
      </div>
    </div>
  );
}
