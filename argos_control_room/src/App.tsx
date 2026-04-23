import { useCallback, useEffect, useState } from 'react';

import { CenterPanel } from './components/control-room/CenterPanel';
import { LeftPanel } from './components/control-room/LeftPanel';
import { RightPanel } from './components/control-room/RightPanel';
import { ToastStack } from './components/control-room/ToastStack';
import { TopBar } from './components/control-room/TopBar';
import { floorState } from './data/controlRoomData';
import type { FloorKey, TelemetrySnapshot, Toast } from './types/controlRoom';
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
          onAcknowledgeAlert={handleAcknowledgeAlert}
        />

        <main className="grid min-h-0 flex-1 grid-cols-[280px_minmax(480px,1fr)_320px] gap-3 overflow-hidden p-3 max-[1220px]:grid-cols-1 max-[1220px]:overflow-auto max-[1480px]:grid-cols-[240px_minmax(480px,1fr)_300px]">
          <LeftPanel />

          <CenterPanel
            activeFloor={activeFloor}
            activeSnapshot={activeSnapshot}
            zoom={zoom}
            onFloorSelect={handleFloorSelect}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />

          <RightPanel
            activeFloor={activeFloor}
            activeSnapshot={activeSnapshot}
            telemetry={telemetry}
            onCommand={handleCommand}
          />
        </main>
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}
