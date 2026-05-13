# ARGOS

> "Give every person in a crisis exactly the right slice of reality — nothing more, nothing less — at the exact moment they need it."

ARGOS is an AI-powered **Incident Commander** designed specifically for hospitality venues. Unlike traditional emergency systems that merely broadcast alerts, ARGOS builds a shared, intelligent understanding of reality to ensure every stakeholder—guests, staff, and management—knows exactly what to do and why during a crisis.

---

## Screenshots


<div align="center" style="display:flex; flex-wrap:wrap; gap:16px; justify-content:center;">

<img src="https://github.com/user-attachments/assets/676a48e8-86c8-4590-9462-362a22fa608d" alt="Screenshot 5" width="180"/>

<img src="https://github.com/user-attachments/assets/7d24a645-6edc-4b6f-a6c2-8a4180eb8c14" alt="Screenshot 4" width="180"/>

<img src="https://github.com/user-attachments/assets/d539314f-fa23-4532-9526-b86816e2de5a" alt="Screenshot 3" width="180"/>

<img src="https://github.com/user-attachments/assets/fb7fdc29-2c83-4969-a76e-5ff3eeffa017" alt="Screenshot 2" width="180"/>

<img src="https://github.com/user-attachments/assets/bcba0f8c-77d7-41e6-b073-f49f6edc2129" alt="Screenshot 1" width="180"/>

</div>

## 🎬 Prototype Submission

The prototype demonstrates each surface of ARGOS as a standalone, high-fidelity build. End-to-end orchestration across surfaces is scheduled post-prototype; for the demo, surfaces share a common scripted incident ("Fire — Floor 3, East Wing") so the experience reads as one connected system.

| Deliverable | Link |
|---|---|
| **Live landing site** | https://argos-omega.vercel.app/ |
| **Demo video** | https://www.youtube.com/watch?v=_RrRsBSGrsI |
| **Pitch deck (PPT)** | _TBD_ |
| **Source repo** | This repository |


---

## 📖 Table of Contents

1. [Executive Summary](#-executive-summary)
2. [Project Philosophy](#-project-philosophy)
3. [Current Implementation](#-current-implementation)
4. [Technical Stack](#-technical-stack)
5. [Roadmap](#-roadmap)
6. [Repository Structure](#-repository-structure)
7. [Getting Started](#-getting-started)
8. [Demo Playbook](#-demo-playbook)

---

## 🚀 Executive Summary

Hospitality crises often suffer from a "clarity problem" rather than an information problem. Data exists (CCTV, sensors, staff reports), but it becomes siloed under stress. ARGOS bridges these silos by orchestrating a unified response powered by Google's Gemini AI.

### Core Value Proposition:
- **For Guests:** Single, calm instructions personalized to their location (e.g., "Use Stairwell C").
- **For Staff:** "One screen, one mission" — precise instructions, equipment lists, and navigation.
- **For Control Room:** A "living map" providing total situational awareness and AI-driven decision support.

---

## 🧠 Project Philosophy

| Property | Description |
|----------|-------------|
| **AMBIENT** | Silent in normal operation. Activates instantly on crisis onset to become the single source of truth. |
| **ASYMMETRIC** | Delivers different, role-appropriate realities to different stakeholders simultaneously. |
| **ALIVE** | The floor plan is a breathing entity that pulses with crisis data and illuminates evacuation corridors. |

---

## 🛠 Current Implementation

The project is in **full intelligence tier**, with AI-driven crisis classification and orchestration now live. The event-driven backend powers real-time crisis detection, multi-modal analysis, and AI reasoning, while four frontend surfaces deliver different role-appropriate views of the crisis.

### 1. Backend (The AI-Powered Orchestration Engine)
Located in `/backend`, the server-side logic is built with **Node.js/Express** and deeply integrates **Firebase/Google Cloud** with **Gemini AI**.

**AI/ML Pipeline:**
- **Crisis Classification (Gemini 2.5 Flash):** Multi-modal analysis combining text reports, voice transcripts (Speech-to-Text), and camera frames (Cloud Vision API) to automatically classify crisis type (fire, medical, security, stampede, structural), severity (1–5), and confidence scores.
- **Response Orchestration (Gemini 2.5 Pro):** Full incident commander reasoning that generates:
  - Multi-dispatch decisions routing specialized personnel to the crisis
  - Guest notifications tailored to affected floors and crisis type
  - Control room summaries with alternatives considered
  - External escalation recommendations (fire dept, ambulance, police)
- **Visual Intelligence (Cloud Vision API):** Detects person count, fire/smoke signals, security threats, and scene context from camera frames.
- **Voice Reports (Google Speech-to-Text):** Transcribes guest/staff audio reports in Indian English with Hindi/US fallbacks before classification.
- **FCM Push Notifications:** Sends high-priority dispatches to staff devices and guest broadcasts.

**Event-Driven Architecture:** Uses Google Cloud Pub/Sub to decouple ingestion, classification, orchestration, and dispatch into a resilient multi-stage pipeline.

**Workers:** `classifyCrisis` (Gemini Flash → classification), `orchestrateResponse` (Gemini Pro → dispatch plan), `dispatchToStaff` (FCM → staff), `notifyGuests` (FCM broadcast), plus escalation monitoring and edge replay.

**Resilience:** Fallback to proximity-based single-dispatch if Gemini is unavailable; pipeline never stops.

**Repositories & Contracts:** Strong typing with Zod schemas, versioned OpenAPI spec (`backend/openapi/openapi.v1.yaml`), and clear repository patterns for Crisis, Personnel, and Venue data.

### 2. Landing Site (Public Marketing Surface)
Located in `/argos_landing`, built with **React + Vite + Tailwind + Framer Motion**.
- Pages: **Crisis**, **Solutions**, **Hardware**, **Request Demo**.
- Animated hero sections, scroll reveals, and a working FormSubmit-backed demo intake form.
- Designed to be the public, deployable face of the project.

### 3. Control Room (Operator Interface)
Located in `/argos_control_room`, this is an **Electron + React** application.
- **Living Map:** A high-fidelity UI prototype featuring real-time telemetry simulation (smoke, temp, CO2).
- **Operator Dashboard:** Centralized view of floors, staff locations, and active alerts (`TopBar`, `LeftPanel`, `CenterPanel`, `RightPanel`, `ToastStack`).
- **Telemetry Simulation:** Built-in logic to simulate environment changes and node connectivity for demo purposes — no backend required to demo.

### 4. Guest App (`argos_app`)
Flutter application for the people inside the venue.
- Screens: home/status, voice report (animated mic + pulse rings), text report, keyword report, instant SOS (radial gesture), map alert, reports status, settings (profile + toggles + emergency contacts).
- Custom branded launcher icons, adaptive Android icon with black background, in-app top-bar logo.

### 5. Staff App (`argos_staff`)
Flutter application for on-the-ground responders.
- Screens: ops dashboard, dispatch, response, debrief.
- Same logo/icon treatment as the guest app for visual consistency.

---

## 💻 Technical Stack

- **Backend:** Node.js, Express, TypeScript, Firebase Functions, Cloud Firestore, Cloud Pub/Sub, Zod, OpenAPI.
- **Frontends:** Flutter (mobile guest + staff), React + Vite + Tailwind (landing + Electron control room), Framer Motion.
- **Tooling:** pnpm workspaces, Vitest (backend), ESLint + Prettier, Husky.
- **AI/ML:** Google Gemini 2.5 Flash (classification), Gemini 2.5 Pro (orchestration), Cloud Vision API (frame analysis), Google Speech-to-Text (voice transcription), Firebase Cloud Messaging (dispatch + guest notifications).

---

## 🗺 Roadmap

The project follows a 4-phase implementation plan as outlined in the [Master Project Plan](docs/HAVEN_Master_Plan.md).

### ✅ Phase 1: Foundation (Completed)
- [x] Firebase Infrastructure setup.
- [x] Event-driven backend scaffold.
- [x] Basic heuristic-based classification and routing.
- [x] Control Room UI Prototype with telemetry simulation.
- [x] Flutter app scaffolding (guest + staff).
- [x] Public landing site with marketing pages and demo intake.
- [x] Brand system (logo + adaptive launcher icons across all surfaces).

### ✅ Phase 2: Intelligence Layer (Completed)
- [x] **AI integration:** Gemini 2.5 Flash for classification, Gemini 2.5 Pro for orchestration.
- [x] **Multi-Modal Fusion:** Cloud Vision API for frame analysis, Speech-to-Text for voice reports.
- [x] **Decision Justification:** Gemini reasoning, alternatives considered, and control room summaries.
- [x] **Firebase Cloud Messaging:** FCM staff dispatch and guest broadcast notifications.
- [x] **Fallback Resilience:** Proximity-based fallback when Gemini is unavailable.
- [x] **Firestore Demo Seed:** Complete venue with personnel, routes, and equipment.

### ⏳ Phase 3: Real-time UI Polish & Client Wiring
- [ ] **CustomPainter Maps:** High-performance animated floor maps in Flutter.
- [ ] **Pulse Animations:** Visual crisis indicators and staff location threads.
- [ ] **Live Backend Wiring:** Connect guest/staff apps and control room to the live API over OpenAPI contract.
- [ ] **Crisis Timeline Streams:** Real-time Firestore subscriptions for crisis updates.

### 📡 Phase 4: Edge Layer & Production Hardening
- [ ] **Jetson Deployment:** Local NVIDIA Jetson Orin Nano inference for offline resilience.
- [ ] **Offline Mode:** SQLite-based event queuing for internet-outage scenarios.
- [ ] **Post-Incident Debrief:** Automated report generation and analytics using Gemini.
- [ ] **Production Scaling:** Load testing, observability dashboards, and SLO compliance.

---

## 📂 Repository Structure

```
argos/
├── argos_landing/        # React/Vite: Public marketing site
├── argos_app/            # Flutter: Guest application
├── argos_staff/          # Flutter: Staff application
├── argos_control_room/   # Electron/React: Operator dashboard
├── backend/              # Node.js: Event-driven API and workers
├── docs/                 # Project documentation & ML plans
├── logos/                # Source brand assets
└── README.md             # Project overview (you are here)
```

---

## 🛠 Getting Started

Each surface runs independently. Pick the one you want to demo.

### Landing Site (`argos_landing`)
```bash
cd argos_landing
npm install
npm run dev          # http://localhost:5173
npm run build        # production bundle (deploys cleanly to Vercel/Netlify)
```

### Control Room (`argos_control_room`)
```bash
cd argos_control_room
npm install
npm run dev          # launches Electron + Vite together
```

### Guest App (`argos_app`)
```bash
cd argos_app
flutter pub get
flutter run          # select an emulator/device when prompted
```

### Staff App (`argos_staff`)
```bash
cd argos_staff
flutter pub get
flutter run
```

### Backend (`backend`)
```bash
cd backend
pnpm install
firebase emulators:start --only firestore,pubsub   # in one terminal
pnpm start:server                                  # in another
pnpm test                                          # vitest suite
```

### Documentation
For deep-dives into the architecture, refer to:
- [HAVEN Master Plan](docs/HAVEN_Master_Plan.md)
- [Jetson ML Plan](docs/HAVEN_Jetson_ML_Plan.docx)
- [Backend Deployment Guide](backend/DEPLOYMENT.md)
- [Backend Development Guide](backend/DEVELOPMENT.md)
- [OpenAPI Spec](backend/openapi/openapi.v1.yaml)

---

## 🎥 Demo Playbook

The prototype is demoed as a single scripted incident — **"Fire — Floor 3, East Wing"** — narrated across all four surfaces.

1. **Landing site** — establish the product and value prop.
2. **Guest app** — a guest taps voice report, records the situation, and sees a calm evacuation prompt.
3. **Control room** — operator's living map lights up with the new alert, telemetry pulses, staff threads light up.
4. **Staff app** — the assigned responder's dispatch view shows the task, location, and equipment list.

Surfaces are not live-wired for the prototype; the shared incident lives in seeded data per surface and the video editor stitches the moments together. See the demo video for the canonical narrative.

---
*ARGOS — Building clarity from chaos.*
