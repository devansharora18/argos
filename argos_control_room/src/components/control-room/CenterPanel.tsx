import { floorOrder, type FloorKey, type FloorSnapshot } from '../../types/controlRoom';
import { layerViews } from '../../data/controlRoomData';

type CenterPanelProps = {
  activeFloor: FloorKey;
  activeSnapshot: FloorSnapshot;
  zoom: number;
  onFloorSelect: (floor: FloorKey) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export function CenterPanel({
  activeFloor,
  activeSnapshot,
  zoom,
  onFloorSelect,
  onZoomIn,
  onZoomOut,
}: CenterPanelProps): JSX.Element {
  return (
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
            onClick={() => onFloorSelect(floor)}
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
          <rect
            x="18"
            y="18"
            width="744"
            height="584"
            fill="#171c28"
            stroke="#30374a"
            strokeWidth="2"
          />
          <rect
            x="64"
            y="66"
            width="652"
            height="488"
            fill="#141826"
            stroke="#272d3c"
            strokeWidth="1.5"
          />
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
