# ARGOS

> "Give every person in a crisis exactly the right slice of reality — nothing more, nothing less — at the exact moment they need it."

ARGOS is an AI-powered **Incident Commander** designed specifically for hospitality venues. Unlike traditional emergency systems that merely broadcast alerts, ARGOS builds a shared, intelligent understanding of reality to ensure every stakeholder—guests, staff, and management—knows exactly what to do and why during a crisis.

---

## 📖 Table of Contents

1. [Executive Summary](#-executive-summary)
2. [Project Philosophy](#-project-philosophy)
3. [Current Implementation](#-current-implementation)
4. [Technical Stack](#-technical-stack)
5. [Roadmap](#-roadmap)
6. [Repository Structure](#-repository-structure)
7. [Getting Started](#-getting-started)

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

The project is currently in the **substantiated prototype phase**, with a robust event-driven backend and scaffolded frontend applications.

### 1. Backend (The Orchestration Engine)
Located in `/backend`, the server-side logic is built with **Node.js/Express** and heavily utilizes **Firebase/Google Cloud** services.
- **Event-Driven Architecture:** Uses Google Cloud Pub/Sub to decouple ingestion, classification, and orchestration.
- **Crisis Classification:** Currently implemented using a regex-based keyword matching system in `classifyCrisis.ts`, designed to be replaced by multi-modal ML models.
- **Response Orchestration:** A heuristic-based engine in `orchestrateResponse.ts` that calculates the nearest available personnel based on role suitability (e.g., routing a Fire Marshal to a smoke report).
- **Repositories & Contracts:** Strong typing with Zod schemas and clear repository patterns for Crisis and Personnel data.

### 2. Control Room (Operator Interface)
Located in `/argos_control_room`, this is an **Electron + React** application.
- **Living Map:** A high-fidelity UI prototype featuring real-time telemetry simulation (smoke, temp, CO2).
- **Operator Dashboard:** Provides a centralized view of all floors, staff locations, and active alerts.
- **Telemetry Simulation:** Built-in logic to simulate environment changes and node connectivity for demo purposes.

### 3. Mobile Applications (Stakeholder Interfaces)
- **Guest App (`argos_app`):** Flutter-based interface for reporting emergencies and receiving evacuation guidance.
- **Staff App (`argos_staff`):** Flutter-based interface for receiving dispatches, acknowledging tasks, and updating incident status.

---

## 💻 Technical Stack

- **Backend:** Node.js, Express, TypeScript, Firebase Functions, Cloud Firestore, Cloud Pub/Sub.
- **Frontends:** Flutter (Mobile), React (Web/Electron), TailwindCSS.
- **AI/ML:** 

---

## 🗺 Roadmap

The project follows a 4-phase implementation plan as outlined in the [Master Project Plan](docs/HAVEN_Master_Plan.md).

### ✅ Phase 1: Foundation (Current Status)
- [x] Firebase Infrastructure setup.
- [x] Event-driven backend scaffold.
- [x] Basic heuristic-based classification and routing.
- [x] Control Room UI Prototype.
- [x] Flutter App scaffolding.

### ⏳ Phase 2: Intelligence Layer (Next Steps)
- [ ] **AI integration:** Replace heuristics with an AI model for deep contextual reasoning.
- [ ] **Multi-Modal Fusion:** Integrate Cloud Vision API and Speech-to-Text for advanced crisis extraction.
- [ ] **Decision Justification:** Implement "Explainable AI" panels showing Gemini's reasoning.

### 🎨 Phase 3: Real-time UI Polish
- [ ] **CustomPainter Maps:** Implement high-performance animated maps in Flutter.
- [ ] **Pulse Animations:** Add visual crisis indicators and staff threads to the dashboard.
- [ ] **FCM Integration:** Live push notifications for staff dispatch.

### 📡 Phase 4: Edge Layer & Demo
- [ ] **Jetson Deployment:** Local ML inference for offline resilience.
- [ ] **Offline Mode:** SQLite-based event queuing for internet-outage scenarios.
- [ ] **Post-Incident Debrief:** Automated report generation using Gemini.

---

## 📂 Repository Structure

```
argos/
├── argos_app/            # Flutter: Guest application
├── argos_staff/          # Flutter: Staff application
├── argos_control_room/   # Electron/React: Operator dashboard
├── backend/              # Node.js: Event-driven API and Workers
├── docs/                 # Extensive project documentation & ML plans
└── README.md             # Project overview (you are here)
```

---

## 🛠 Getting Started

### Backend Setup
```bash
cd backend
pnpm install
# Start emulators
firebase emulators:start --only firestore,pubsub
# Start server
pnpm start:server
```

### Control Room Setup
```bash
cd argos_control_room
npm install
npm run dev
```

### Documentation
For deep-dives into the architecture, refer to:
- [HAVEN Master Plan](docs/HAVEN_Master_Plan.md)
- [Jetson ML Plan](docs/HAVEN_Jetson_ML_Plan.docx)
- [Backend Deployment Guide](backend/DEPLOYMENT.md)

---
*ARGOS — Building clarity from chaos.*
