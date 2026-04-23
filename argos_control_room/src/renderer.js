const floorState = {
  B1: {
    path: 'M 170 460 L 360 460 L 360 350 L 470 350',
    roomLabel: 'RM 108',
    unitLabel: 'SM',
    stairLabel: 'STAIRWELL A',
    severity: 'SEV 2 / 5',
    riskCount: '12 AT RISK',
    eta: '05:28',
    location: 'Basement 1 · Storage Sector',
    telemetry: {
      smoke: '210',
      temp: '92C',
      co2: 'NORMAL',
      audio: 'MUTED',
    },
    reasoning: [
      'Analyzing telemetry for basement channels...',
      'No secondary flare signatures confirmed.',
      'Ventilation remains stable. Continue suppression sweep.',
    ],
  },
  1: {
    path: 'M 180 420 L 300 420 L 300 290 L 430 290',
    roomLabel: 'RM 145',
    unitLabel: 'RK',
    stairLabel: 'STAIRWELL B',
    severity: 'SEV 3 / 5',
    riskCount: '26 AT RISK',
    eta: '04:12',
    location: 'Floor 1 · West Annex',
    telemetry: {
      smoke: '330',
      temp: '144C',
      co2: 'RISING',
      audio: 'DISTORTED',
    },
    reasoning: [
      'Smoke density rising near corridor west node.',
      'Predictive model suggests evacuation lane split.',
      'Routing nearest unit to RM 145 for confirmation.',
    ],
  },
  2: {
    path: 'M 170 460 L 320 460 L 320 240 L 510 240',
    roomLabel: 'RM 244',
    unitLabel: 'MT',
    stairLabel: 'STAIRWELL C',
    severity: 'SEV 3 / 5',
    riskCount: '31 AT RISK',
    eta: '03:59',
    location: 'Floor 2 · Core Hall',
    telemetry: {
      smoke: '388',
      temp: '162C',
      co2: 'RISING',
      audio: 'ANOMALY',
    },
    reasoning: [
      'Heat spread vector is moving north-east.',
      'Cross-floor plume risk moderate.',
      'Preparing corridor lock for emergency team transit.',
    ],
  },
  3: {
    path: 'M 170 460 L 440 460 L 440 260 L 540 260',
    roomLabel: 'RM 312',
    unitLabel: 'JD',
    stairLabel: 'STAIRWELL C',
    severity: 'SEV 4 / 5',
    riskCount: '47 AT RISK',
    eta: '03:42',
    location: 'Room 312 · Floor 3 · East Wing',
    telemetry: {
      smoke: '450',
      temp: '185C',
      co2: 'NORMAL',
      audio: 'ANOMALY DETECTED',
    },
    reasoning: [
      'Analyzing telemetry...',
      'Stairwell A shows abnormal heat signature.',
      'Path block detected. Rerouting egress to Stairwell C.',
    ],
  },
  4: {
    path: 'M 170 460 L 320 460 L 320 210 L 570 210',
    roomLabel: 'RM 411',
    unitLabel: 'SM',
    stairLabel: 'STAIRWELL D',
    severity: 'SEV 5 / 5',
    riskCount: '83 AT RISK',
    eta: '02:28',
    location: 'Floor 4 · Main Atrium',
    telemetry: {
      smoke: '625',
      temp: '240C',
      co2: 'CRITICAL',
      audio: 'DISTRESS SIGNALS',
    },
    reasoning: [
      'Thermal field unstable over Atrium grid.',
      'Immediate reinforcement required.',
      'Escalating to severe incident protocol.',
    ],
  },
  5: {
    path: 'M 170 460 L 300 460 L 300 170 L 610 170',
    roomLabel: 'RM 506',
    unitLabel: 'RK',
    stairLabel: 'STAIRWELL E',
    severity: 'SEV 5 / 5',
    riskCount: '109 AT RISK',
    eta: '01:54',
    location: 'Floor 5 · Sky Lobby',
    telemetry: {
      smoke: '712',
      temp: '286C',
      co2: 'CRITICAL',
      audio: 'PANIC CLUSTER',
    },
    reasoning: [
      'Ceiling thermal inversion is accelerating fire spread.',
      'Upper deck egress now restricted.',
      'Override request queued for manual command approval.',
    ],
  },
};

const els = {
  tabs: Array.from(document.querySelectorAll('.floor-tab')),
  path: document.getElementById('evacPath'),
  roomLabel: document.getElementById('roomLabel'),
  unitLabel: document.getElementById('unitLabel'),
  stairLabel: document.getElementById('stairLabel'),
  severityChip: document.getElementById('severityChip'),
  riskCount: document.getElementById('riskCount'),
  etaValue: document.getElementById('etaValue'),
  incidentLocation: document.getElementById('incidentLocation'),
  reasoningList: document.getElementById('reasoningList'),
  smokeValue: document.getElementById('smokeValue'),
  tempValue: document.getElementById('tempValue'),
  co2Value: document.getElementById('co2Value'),
  audioValue: document.getElementById('audioValue'),
  clock: document.getElementById('liveClock'),
  nodesOnline: document.getElementById('nodesOnline'),
  toastStack: document.getElementById('toastStack'),
  alertButton: document.getElementById('alertButton'),
  commandButtons: Array.from(document.querySelectorAll('.cmd-button')),
  zoomButtons: Array.from(document.querySelectorAll('.map-control')),
};

let activeFloor = '3';
let currentZoom = 1;

const setFloor = (floor) => {
  const next = floorState[floor];
  if (!next) {
    return;
  }

  activeFloor = floor;

  els.tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.floor === floor);
  });

  els.path.setAttribute('d', next.path);
  els.roomLabel.textContent = next.roomLabel;
  els.unitLabel.textContent = next.unitLabel;
  els.stairLabel.textContent = next.stairLabel;
  els.severityChip.textContent = next.severity;
  els.riskCount.textContent = next.riskCount;
  els.etaValue.textContent = next.eta;
  els.incidentLocation.textContent = next.location;

  els.reasoningList.innerHTML = '';
  next.reasoning.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    els.reasoningList.appendChild(li);
  });

  els.smokeValue.textContent = next.telemetry.smoke;
  els.tempValue.textContent = next.telemetry.temp;
  els.co2Value.textContent = next.telemetry.co2;
  els.audioValue.textContent = next.telemetry.audio;
};

const pushToast = (message) => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  els.toastStack.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2600);
};

const syncClock = () => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  els.clock.textContent = `${hh}:${mm}:${ss}`;
};

const tickTelemetry = () => {
  const base = floorState[activeFloor].telemetry;
  const smoke = Math.max(120, Number.parseInt(base.smoke, 10) + (Math.floor(Math.random() * 9) - 4));
  const temp = Math.max(60, Number.parseInt(base.temp, 10) + (Math.floor(Math.random() * 5) - 2));
  els.smokeValue.textContent = String(smoke);
  els.tempValue.textContent = `${temp}C`;

  const nodeCount = 240 + Math.floor(Math.random() * 13);
  els.nodesOnline.textContent = `${nodeCount} NODES ONLINE`;
};

els.tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    setFloor(tab.dataset.floor);
    pushToast(`Floor ${tab.dataset.floor} context loaded`);
  });
});

els.commandButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const cmd = button.dataset.cmd || 'unknown';
    pushToast(`Command issued: ${cmd.toUpperCase()}`);
  });
});

els.alertButton.addEventListener('click', () => {
  pushToast('Alert channel acknowledged by operator JD');
});

els.zoomButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const direction = button.dataset.zoom;
    const delta = direction === 'in' ? 0.08 : -0.08;
    currentZoom = Math.min(1.35, Math.max(0.85, currentZoom + delta));
    document.querySelector('.map-svg').style.transform = `scale(${currentZoom.toFixed(2)})`;
    document.querySelector('.map-svg').style.transformOrigin = 'center center';
  });
});

setFloor(activeFloor);
syncClock();
setInterval(syncClock, 1000);
setInterval(tickTelemetry, 1400);

if (window.argosMeta?.electron) {
  pushToast(`Electron ${window.argosMeta.electron} ready on ${window.argosMeta.platform}`);
}
