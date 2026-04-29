import { useCallback, useEffect, useRef, useState } from 'react';

import { CenterPanel } from './components/control-room/CenterPanel';
import { LeftPanel } from './components/control-room/LeftPanel';
import { RightPanel } from './components/control-room/RightPanel';
import { ToastStack } from './components/control-room/ToastStack';
import { TopBar } from './components/control-room/TopBar';
import { floorState } from './data/controlRoomData';
import { floorOrder, type FloorKey, type LiveIncident, type TelemetrySnapshot, type Toast } from './types/controlRoom';
import { formatClock, mutateValue } from './utils/controlRoom';

export default function App(): JSX.Element {
  const [activeFloor, setActiveFloor] = useState<FloorKey>('3');
  const [clock, setClock] = useState<string>(() => formatClock(new Date()));
  const [nodesOnline, setNodesOnline] = useState<number>(247);
  const [zoom, setZoom] = useState<number>(1);
  const [telemetry, setTelemetry] = useState<TelemetrySnapshot>(
    () => ({ ...floorState['3'].telemetry }),
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [liveIncident, setLiveIncident] = useState<LiveIncident | null>(null);
  const [switchingToFloor, setSwitchingToFloor] = useState<FloorKey | null>(null);
  const lastTimestampRef = useRef<string | null>(null);

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

  // Poll backend every 3 s for live incident from HAVEN / Gemini
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/demo/latest');
        if (res.ok) {
          const data: LiveIncident = await res.json();
          if (data.timestamp !== lastTimestampRef.current) {
            lastTimestampRef.current = data.timestamp;
            setLiveIncident(data);

            const incidentFloor = data.floor as FloorKey;
            const incidentIdx = floorOrder.indexOf(incidentFloor);

            if (incidentIdx >= 0) {
              // Walk through every floor from 1 up to the incident floor
              // so judges watch the map step through each level
              const startIdx = floorOrder.indexOf('1');
              const journey = startIdx <= incidentIdx
                ? floorOrder.slice(startIdx, incidentIdx + 1)
                : [incidentFloor];

              journey.forEach((floor, i) => {
                window.setTimeout(() => {
                  setSwitchingToFloor(floor);
                  setActiveFloor(floor);
                  // Clear the overlay badge on the final floor after a beat
                  if (i === journey.length - 1) {
                    window.setTimeout(() => setSwitchingToFloor(null), 1200);
                  }
                }, i * 650); // 650 ms per floor step
              });
            }

            pushToast(
              `⚠ INCIDENT: ${data.crisis_type.toUpperCase()} SEV ${data.severity} — FLOOR ${data.floor}`,
            );
          }
        }
      } catch {
        // backend not yet up or no incident — silently ignore
      }
    };
    const timer = window.setInterval(poll, 3000);
    return () => window.clearInterval(timer);
  }, [pushToast]);

  const handleFloorSelect = useCallback(
    (floor: FloorKey) => {
      setActiveFloor(floor);
      pushToast(`Floor ${floor} context loaded`);
    },
    [pushToast],
  );

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(1.35, Number((prev + 0.08).toFixed(2))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(0.85, Number((prev - 0.08).toFixed(2))));
  }, []);

  const handleCommand = useCallback(
    (command: string) => {
      pushToast(`Command issued: ${command}`);
    },
    [pushToast],
  );

  const handleAcknowledgeAlert = useCallback(() => {
    pushToast('Alert channel acknowledged by operator JD');
  }, [pushToast]);

  return (
    <div className="h-full overflow-hidden text-[#ddd7dd]">
      <div className="flex h-full flex-col">
        <TopBar
          activeFloor={activeFloor}
          severity={activeSnapshot.severity}
          clock={clock}
          nodesOnline={nodesOnline}
          liveIncident={liveIncident}
          onAcknowledgeAlert={handleAcknowledgeAlert}
        />

        <main className="grid min-h-0 flex-1 grid-cols-[260px_minmax(0,1fr)_300px] gap-3 overflow-hidden p-3 max-[1100px]:grid-cols-[220px_minmax(0,1fr)_260px] max-[900px]:grid-cols-1 max-[900px]:overflow-y-auto">
          <LeftPanel liveIncident={liveIncident} />

          <CenterPanel
            activeFloor={activeFloor}
            activeSnapshot={activeSnapshot}
            zoom={zoom}
            liveIncident={liveIncident}
            switchingToFloor={switchingToFloor}
            onFloorSelect={handleFloorSelect}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />

          <RightPanel
            activeFloor={activeFloor}
            activeSnapshot={activeSnapshot}
            telemetry={telemetry}
            liveIncident={liveIncident}
            onCommand={handleCommand}
          />
        </main>
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}
