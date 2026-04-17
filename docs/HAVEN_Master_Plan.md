# HAVEN — Hospitality AI Vigilance & Emergency Network
## Master Project Plan · Hackathon Edition

**Version:** 1.0 | **Date:** April 17, 2026 | **Status:** Planning  
**Tech Stack:** Flutter · Firebase · Google Cloud · Gemini API · Vertex AI

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement Analysis](#2-problem-statement-analysis)
3. [Solution Architecture](#3-solution-architecture)
4. [Google Tech Stack](#4-google-tech-stack)
5. [Data Models](#5-data-models)
6. [ML Pipeline — Cloud Layer](#6-ml-pipeline--cloud-layer)
7. [ML Pipeline — Edge Layer (Jetson)](#7-ml-pipeline--edge-layer-jetson)
8. [Hybrid Edge-Cloud Architecture](#8-hybrid-edge-cloud-architecture)
9. [Flutter App Structure](#9-flutter-app-structure)
10. [Implementation Roadmap](#10-implementation-roadmap)
11. [Google Cloud Setup](#11-google-cloud-setup)
12. [What to Build vs Simulate](#12-what-to-build-vs-simulate)
13. [Demo Script](#13-demo-script)
14. [Judging Criteria Alignment](#14-judging-criteria-alignment)
15. [Risks and Mitigations](#15-risks-and-mitigations)
16. [Open Questions](#16-open-questions)
17. [Appendices](#17-appendices)

---

## 1. EXECUTIVE SUMMARY

HAVEN is an AI-powered Incident Commander for hospitality venues. It does not send alerts — it builds a shared, intelligent understanding of reality so every person in a crisis knows exactly what to do, and why.

> **Core Insight:** A hotel crisis is not an information problem. It is a clarity problem. The data exists. The staff exists. The tools exist. What collapses is everyone's understanding of reality — simultaneously.

> **One Line:** "Give every person in a crisis exactly the right slice of reality — nothing more, nothing less — at the exact moment they need it."

### Three Differentiators

| Property | Description |
|----------|-------------|
| **AMBIENT** | Silent in normal operation. No maintenance. Activates instantly on crisis onset and becomes the single source of truth for all stakeholders simultaneously. |
| **ASYMMETRIC** | The fire marshal sees his floor, his task, his route. The guest sees one calm instruction. The manager sees the full picture. Same crisis. Three completely different realities. All correct. |
| **ALIVE** | The hotel floor plan is not a static map. It breathes. Crisis origin pulses warm. Staff threads converge toward it. Evacuation corridors illuminate around it. When resolved — the map goes quiet. |

### What HAVEN Is NOT
- Not a panic button / SOS app
- Not a notification broadcaster
- Not a dashboard reporting tool
- Not a replacement for existing hotel infrastructure

### What HAVEN IS
- An AI Incident Commander
- A situational awareness engine
- A real-time decision and dispatch system
- A personalized clarity machine under chaos

---

## 2. PROBLEM STATEMENT ANALYSIS

**Problem:** Rapid Crisis Response — Accelerated Emergency Response and Crisis Coordination in Hospitality

### The Core Problem

Hospitality venues face unpredictable, high-stakes emergencies. They already have cameras, trained staff, check-in systems, control rooms, and communication tools. When a crisis happens, all of these things become siloed. The orchestration fails. People do not know who to send, where to go, or what to tell guests.

### What Makes This Hard

- Staff are distributed across floors with no unified coordination
- CCTV feeds are fragmented and unmonitored in real time
- Radio communication creates noise, not clarity
- Wrong responders get dispatched (medical staff sent to a security threat)
- Guests receive no information or panic-inducing information
- No single person has the complete picture at any moment

### What Judges Are Looking For

| Expected | Not Expected |
|----------|--------------|
| Orchestration engine | Another SOS button |
| AI-powered routing decisions | Generic alert broadcast |
| Bridges silos between guests, staff, first responders | Dashboard-first thinking |
| Contextual intelligence | Reactive-only automation |
| Intelligence at the core | Reporting as the focus |

---

## 3. SOLUTION ARCHITECTURE

### 3.1 Three-Layer Experience Design

```
┌─────────────────────────────────────────────────────────┐
│                    SAME CRISIS EVENT                    │
├───────────────┬───────────────────┬─────────────────────┤
│  GUEST VIEW   │    STAFF VIEW     │  CONTROL ROOM VIEW  │
│               │                   │                     │
│  "Please use  │  "Fire - Room 312 │  Full living map    │
│  Stairwell C. │  Take ext. Stn B. │  All staff threads  │
│  Stay calm."  │  Medical standby" │  Gemini reasoning   │
│               │                   │  One-tap override   │
└───────────────┴───────────────────┴─────────────────────┘
```

**GUEST LAYER:**
- Single calm instruction on screen
- Personalized to their exact floor
- Evacuation route shown as a visual arrow
- No information overload — zero noise

**STAFF LAYER:**
- One screen, one mission
- Exact instruction + equipment to bring + route to take
- Accept / Decline / Need Help / Resolved status buttons
- No radio chaos — replaces fragmented communication

**CONTROL ROOM LAYER:**
- Living floor map (the centerpiece visual of the entire product)
- All staff positions in real time with role indicators
- Crisis pulse with severity level indicator
- Gemini reasoning panel — the AI shows its thinking in real time
- One-tap override for any automated decision

### 3.2 Five-Stage Pipeline

```
[STAGE 1]        [STAGE 2]          [STAGE 3]         [STAGE 4]         [STAGE 5]
Ingestion   →   Extraction    →   Classification  →  Orchestration  →  Action
(All inputs)   (Features)        (Crisis Event)     (Gemini Brain)    (Dispatch)
```

| Stage | Name | Description |
|-------|------|-------------|
| 1 | Ingestion | Accept signals from every source simultaneously: voice, text, camera frames, IoT sensors, manual SOS |
| 2 | Feature Extraction | Transform raw signals into structured features using Cloud Vision API, Speech-to-Text API, Gemini multimodal |
| 3 | Crisis Classification | Multi-modal fusion of all signals into a structured Crisis Event Object with type, severity, location, confidence |
| 4 | Gemini Orchestration | The AI Incident Commander — contextual awareness, dispatch decisions with justification, guest notifications, escalation |
| 5 | Action & Feedback | FCM dispatch to staff, geofenced guest notifications, real-time map updates, post-incident debrief |

### 3.3 Four-Agent Architecture

**INTAKE AGENT**
- Trigger: Any input channel (voice, text, sensor, camera)
- Function: Normalizes all inputs into a structured CrisisEvent object
- Input: Raw report or sensor payload
- Output: CrisisEvent JSON → Firestore

**CLASSIFICATION + ROUTING AGENT**
- Trigger: New CrisisEvent in Firestore
- Function: Gemini 1.5 Pro with full venue context — classifies type, severity, routes to correct personnel
- Input: CrisisEvent + venue context (time, occupancy, floor plan, personnel, history)
- Output: Dispatch decisions with justification and alternatives considered
- Key Feature: Routes CORRECT role to CORRECT crisis type (never sends medical to security threat)

**COMMUNICATION AGENT**
- Trigger: Dispatch decision ready
- Function: Generates three distinct messages — staff task instruction, guest floor notification (calm tone), manager summary
- Output: FCM pushes to target devices, Firestore update triggers Flutter real-time render

**ESCALATION MONITOR AGENT**
- Trigger: Cloud Scheduler every 60 seconds
- Checks:
  - Staff non-response after 30 seconds → auto-assign backup
  - Crisis persists past threshold → escalate to external services
  - Severity increase signals → upgrade response
- Thresholds: Fire=5min, Medical=3min, Security=4min, Stampede=2min

### 3.4 Contextual Awareness — The Key Differentiator

Every Gemini decision is informed by full situational context, not just the crisis report.

```
Standard system prompt:        "Smoke near elevator, Floor 3 — classify this."
HAVEN system prompt:           "It is 11:30 PM. Conference ongoing on Floor 3
                                with 47 expected attendees. A false alarm occurred
                                2 hours ago on this floor. Fire extinguisher at
                                Station B is confirmed stocked. Stairwell A is
                                currently under maintenance (blocked). Fire marshal
                                John is on shift on Floor 2, 90 seconds from Floor 3.
                                
                                Crisis reported: Smoke near elevator, Floor 3.
                                
                                Make the optimal decision with justification."
```

This transforms HAVEN from reactive to situationally intelligent.

### 3.5 Decision Justification — Explainable AI

HAVEN does not just output "Dispatch John." Every decision includes:

```json
{
  "decision": "Dispatch John D. (fire_marshal)",
  "reason": "Closest trained fire responder on shift (Floor 2, 90s response time). Conference on Floor 3 elevates risk to Critical.",
  "alternatives_considered": [
    "Staff Mike (Floor 5) — rejected: 3x distance, no fire certification",
    "Auto-escalate immediately — rejected: confidence 0.87, not yet threshold"
  ],
  "risk_level": "HIGH",
  "confidence": 0.87,
  "escalate_if_unresolved_in_minutes": 5
}
```

---

## 4. GOOGLE TECH STACK

### 4.1 Full Stack Map

| Layer | Technology | Purpose in HAVEN |
|-------|-----------|-----------------|
| **Frontend** | Flutter | Cross-platform app: Guest, Staff, Control Room — single codebase |
| **Realtime DB** | Cloud Firestore | Crisis state, personnel roster, floor plan data, event timeline |
| **Auth** | Firebase Auth | Role-based access: guest / staff / manager |
| **Serverless** | Cloud Functions (Gen2) | ML pipeline triggers, agent logic |
| **Push** | Firebase Cloud Messaging | Targeted staff dispatch, geofenced guest alerts |
| **Hosting** | Firebase Hosting | Control room web dashboard |
| **Event Bus** | Cloud Pub/Sub | Async event streaming between pipeline stages |
| **Containers** | Cloud Run | Feature extraction microservices (stateless, scalable) |
| **Scheduling** | Cloud Scheduler | Escalation monitor every 60 seconds |
| **Storage** | Cloud Storage | Camera frame buffer, snapshot evidence |
| **Analytics** | BigQuery | Post-incident patterns, false positive rates |
| **Vision** | Cloud Vision API | Person count, fire/smoke detection, object detection |
| **Speech** | Speech-to-Text API | Voice crisis report transcription |
| **Video** | Video Intelligence API | Activity recognition in camera streams |
| **AI Brain** | Gemini 1.5 Pro | Orchestration agent — complex reasoning, full context |
| **AI Fast** | Gemini 1.5 Flash | Visual frame analysis — speed-optimized, real-time |
| **Custom ML** | Vertex AI | Multi-modal fusion classifier (crisis type + severity) |

### 4.2 Complete Data Flow (12 Steps)

```
Step 1  ─  Guest/Staff submits report via Flutter (voice or text)
Step 2  ─  Cloud Function triggers on Firestore write
Step 3  ─  Speech-to-Text transcribes voice input
Step 4  ─  Cloud Vision API analyzes camera frames from affected floor
Step 5  ─  Gemini Flash performs visual scene understanding
Step 6  ─  Multi-modal features fused → CrisisEvent object created
Step 7  ─  Gemini Pro orchestrates full response (dispatch, comms, escalation)
Step 8  ─  Firebase writes dispatch decision to Firestore
Step 9  ─  FCM pushes targeted notification to dispatched staff device
Step 10 ─  FCM multicast to all guests on affected floors
Step 11 ─  Flutter living map updates in real time (Firestore stream)
Step 12 ─  Control room sees full picture + AI reasoning panel

TARGET: Under 10 seconds from voice report to staff device dispatch
```

---

## 5. DATA MODELS

### 5.1 CrisisEvent Object

```
crisis_id               string      UUID, primary key
venue_id                string      Hotel/property identifier
crisis_type             enum        fire | medical | security | stampede | structural | unknown
severity                integer     1 (low) to 5 (catastrophic)
confidence              float       0.0 to 1.0
floor                   string      "3", "Lobby", "Rooftop"
zone                    string      "East Wing", "Conference Hall B"
status                  enum        detected | dispatched | active | resolved | false_alarm
detected_at             timestamp   First detection timestamp
trigger_sources         array       ["camera_3F_east", "smoke_sensor_3E", "guest_report_001"]
estimated_persons       integer     Estimated persons at risk
nearby_assets           array       ["fire_extinguisher_B", "first_aid_B2", "defibrillator_3W"]
evacuation_routes       array       [{route_id, status: CLEAR|BLOCKED, capacity, estimated_time}]
gemini_reasoning        string      Full AI reasoning text (shown in control room)
alternatives_considered array       List of options Gemini evaluated and rejected
external_escalation     object      {required, service, reason, auto_escalate_at}
timeline                array       [{event, timestamp, type: detection|dispatch|update|resolve}]
```

### 5.2 Personnel Object

```
staff_id                string      UUID
name                    string      Display name
role                    enum        fire_marshal | medical_officer | security | general_staff
floor                   string      Current location floor
on_shift                boolean     True if currently on duty
fcm_token               string      Device push token
current_assignment      string|null null when available, crisisId when deployed
status                  enum        available | responding | unavailable | off_shift
certifications          array       ["fire_safety_level2", "first_aid", "aed_certified"]
equipment_assigned      array       ["radio_03", "first_aid_kit_A"]
```

### 5.3 Floor Plan Graph

```
nodes    array    [{id, type: room|corridor|exit|stairs, floor, zone, coordinates: {x,y}}]
edges    array    [{from, to, distance_meters, type: corridor|stairs|emergency_exit}]
exits    array    [{node_id, label, capacity, status: CLEAR|BLOCKED}]
equipment_stations    map    {station_id: {type, zone, floor, last_inspected}}
zones    map    {zone_name: {bounding_polygon, typical_occupancy, fire_zone_id}}
```

---

## 6. ML PIPELINE — CLOUD LAYER

### 6.1 Visual Feature Extraction

**API:** Google Cloud Vision API (batch all features in single API call)  
**Input:** JPEG frame from hotel camera, sampled at 1fps  
**Single API call extracts:**
- `OBJECT_LOCALIZATION` → Person count (confidence threshold: 0.7)
- `LABEL_DETECTION` → Fire/smoke signals (keywords: fire, smoke, flame, burning, threshold: 0.75)
- `SAFE_SEARCH_DETECTION` → Violence signals
- Object bounding boxes for hazard detection

**Crowd density mapping:**
| Person Count | Density Level | Action Threshold |
|-------------|---------------|-----------------|
| 0–4 | LOW | Monitor only |
| 5–14 | MEDIUM | Passive alert |
| 15–29 | HIGH | Active watch |
| 30+ | CRITICAL | Immediate flag |

**Additional: Gemini Flash multimodal analysis**  
Prompt includes: floor, time of day, expected occupancy, recent alert count  
Output: `anomaly_type`, `confidence`, `crowd_behavior`, `urgent`, `observations`  
Latency target: under 2 seconds

### 6.2 Audio Feature Extraction

**API:** Google Speech-to-Text API  
**Primary language:** en-IN | **Fallback:** hi-IN  
**Pipeline:** Audio bytes → transcription → keyword matching → confidence scoring

**Crisis keyword sets:**
| Crisis Type | Keywords |
|-------------|----------|
| fire | fire, smoke, burning, flames, smell, hot |
| medical | help, heart attack, unconscious, bleeding, fell, collapsed |
| security | gun, weapon, attack, threat, robbery, knife |
| stampede | crush, stampede, pushing, crowd, trapped, falling |

**Output:** `transcription`, `crisis_signals` map, `primary_signal`, `requires_action` boolean

### 6.3 Multi-Modal Fusion Classifier

**Platform:** Vertex AI (GradientBoostingClassifier, deployed as prediction endpoint)  
**Input feature vector:** 18 dimensions

| Feature Group | Features |
|---------------|----------|
| Visual (5) | person_count, crowd_density_score, fire_smoke_signal, anomaly_confidence, crowd_behavior_score |
| Audio (3) | audio_crisis_signal, audio_keyword_count, noise_level |
| Sensor (3) | smoke_ppm, temperature_celsius, co2_ppm |
| Context (5) | hour_of_day, day_of_week, floor_occupancy, time_since_last_incident, active_events_count |
| History (2) | false_alarm_rate_floor, historical_incident_rate |

**Output:** crisis_type (7 classes), severity (1–5), confidence score

### 6.4 Gemini Orchestration Prompt Design

**Model:** Gemini 1.5 Pro  
**Temperature:** 0.1 (low — crisis decisions need consistency, not creativity)  
**Response format:** `application/json` (structured output enforced)  
**Max output tokens:** 2048

**Full input context to Gemini:**
- Complete CrisisEvent object
- Current time of day
- Floor-by-floor occupancy estimates
- Active hotel events (conferences, weddings, etc.)
- On-shift personnel: names, roles, current floors, availability
- Equipment locations and last inspection dates
- Evacuation route status (clear/blocked)
- Last 2 hours of incident history including false alarms

**Gemini JSON output schema:**
```
crisis_assessment:
  type, severity, confidence, affected_zone,
  estimated_persons_at_risk, time_to_escalation_minutes

dispatch_decisions: [
  {staff_id, staff_name, role, instruction,
   priority: primary|secondary,
   equipment_to_bring: [...],
   route_to_take: string}
]

backup_assignments: [same structure, auto-trigger if primary unresponsive]

guest_notification:
  {affected_floors, message, evacuation_route, tone: calm|urgent}

control_room_summary: string (one paragraph)

external_escalation:
  {required, service: fire_dept|ambulance|police|none,
   reason, auto_call_in_minutes}

decision_reasoning: string
alternatives_considered: [string]
confidence: float
```

**Crisis-to-responder routing rules (hardcoded in prompt):**
| Crisis Type | Primary Responder | Secondary | Do NOT Send | External Threshold |
|-------------|------------------|-----------|-------------|-------------------|
| Fire | fire_marshal | security (evacuation) | medical as primary | 5 minutes |
| Medical | medical_officer | nearest available | — | 3 minutes |
| Security | security_officer | lockdown protocol | medical or fire | 4 minutes |
| Stampede | security + medical simultaneously | immediate external | — | 2 minutes |
| Structural | security (evacuation only) | none | anyone into affected zone | Immediate |

### 6.5 Evacuation Route Engine

**Algorithm:** Dijkstra shortest path on floor plan graph (NetworkX library)  
**Graph:** Nodes = rooms/zones/corridors/exits. Edges = passageways with distance weights in meters  
**Pre-processing:** Remove crisis zones and blocked routes from graph copy before pathfinding  
**Output:** Ordered list of safe exit paths, sorted by distance, with exit capacity  
**Used by:** Routing Agent (staff path) + Communication Agent (guest instructions)

### 6.6 Escalation Monitor

**Trigger:** Cloud Scheduler every 60 seconds  
**Active crisis checks:**

Check 1 — Staff Non-Response:
- If `status == dispatched` and elapsed > 30 seconds and no acceptance recorded
- Action: Trigger backup assignment from pre-computed backup list

Check 2 — Status Stagnation:
- If `status == active` and elapsed > type-specific threshold
- Action: External escalation with property address, floor plan URL, live crisis summary

Check 3 — Severity Escalation:
- New sensor readings or additional reports pushing confidence above next severity tier
- Action: Upgrade crisis severity, re-run orchestration, notify manager

### 6.7 Post-Incident Debrief Agent

**Trigger:** Firestore write — `status` field changes to `resolved` or `false_alarm`  
**Model:** Gemini 1.5 Pro  
**Output JSON:**
```
incident_summary: string
response_quality:
  detection_speed_assessment: string
  dispatch_accuracy: correct|incorrect|suboptimal
  communication_effectiveness: 1-5
  overall_grade: A|B|C|D|F
timeline_analysis: [{phase, duration_seconds, assessment}]
false_positive_likelihood: 0.0-1.0
improvement_recommendations: [string]
model_feedback:
  classification_was_correct: boolean
  severity_was_accurate: boolean
  dispatch_was_optimal: boolean
```

**Storage:** Firestore `/incident_reports/{crisisId}` + BigQuery daily summary table  
**BigQuery analytics:** detection speed, dispatch accuracy, false positive rate per floor, AI confidence trends

---

## 7. ML PIPELINE — EDGE LAYER (JETSON)

### 7.1 Hardware Selection

| Spec | Raspberry Pi 5 | Jetson Nano (4GB) | Jetson Orin Nano Super ✅ |
|------|---------------|-------------------|--------------------------|
| AI Performance | ~13 GFLOPS | 472 GFLOPS | 67 TOPS |
| RAM | 8GB LPDDR4X | 4GB LPDDR4 | 8GB LPDDR5 |
| Power (idle/active) | 5W / 15W | 5W / 10W | 7W / 25W |
| Cost | ~$80 | ~$99 | ~$249 |
| TensorRT support | No | Yes (TRT 8) | Yes (TRT 8.6) |
| INT8 quantization | No | Yes | Yes |
| Camera interfaces | 2x CSI | 2x CSI + USB | 2x CSI + 4x USB |
| Offline ML | CPU only | GPU-accelerated | GPU+DLA accelerated |
| Kubernetes (K3s) | Yes | Yes | Yes |

**Recommendation: NVIDIA Jetson Orin Nano Super**  
Justification: 67 TOPS enables running YOLOv8, CNN-LSTM, audio models concurrently. TensorRT INT8 reduces YOLOv8-nano latency to ~15ms. DLA (Deep Learning Accelerator) offloads inference from main CPU. UPS HAT support ensures uninterruptible operation.

### 7.2 Local ML Models on Jetson

All models run concurrently in an asyncio Python pipeline. Total inference budget: <150ms.

---

**Model 1: YOLOv8-nano — Visual Crisis Detection**
| Property | Specification |
|----------|--------------|
| Purpose | Person detection, fire/smoke detection, crowd density estimation |
| Architecture | YOLOv8-nano (CSP-DarkNet backbone, decoupled head) |
| Input | 640×640 JPEG frame from RTSP camera stream |
| Output | Bounding boxes, classes (person/fire/smoke), confidence scores |
| Latency (Orin Nano Super, TRT INT8) | ~15ms per frame |
| Latency (Jetson Nano, TRT INT8) | ~45ms per frame |
| Model size (FP32) | 6.3 MB |
| Model size (INT8 quantized) | 1.8 MB |
| Optimization | PyTorch → ONNX → TensorRT INT8 with calibration dataset (500 hotel images) |
| Framework | TensorRT 8.6 + Python bindings |
| Accuracy (fire/smoke) | 94.3% mAP@0.5 (FIRE dataset) |
| Trigger threshold | Fire confidence > 0.75 OR person_count > 30 in <5s |

---

**Model 2: CNN-LSTM + Farneback Optical Flow — Crowd Behavior**
| Property | Specification |
|----------|--------------|
| Purpose | Stampede prediction, panic detection, abnormal crowd movement |
| Architecture | Farneback optical flow → 4-layer CNN feature extractor → 2-layer LSTM (hidden=128) |
| Input | 16 consecutive frames at 5fps, optical flow magnitude + direction maps |
| Output | 4-class behavior: normal / agitated / panicking / surging |
| Latency (Orin Nano Super) | ~80ms for 16-frame window |
| Model size (TFLite INT8) | 4.2 MB |
| Optimization | TFLite INT8 quantization + GPU delegate |
| Framework | TFLite 2.x with GPU delegate |
| Accuracy | 99.75% (4-class, per research benchmark) |
| Advance warning | 2-minute lead time before stampede threshold |
| Trigger threshold | panicking or surging confidence > 0.80 |

---

**Model 3: MediaPipe Pose — Medical Emergency Detection**
| Property | Specification |
|----------|--------------|
| Purpose | Individual fainting, falling, collapse detection |
| Architecture | MediaPipe BlazePose (33 landmarks) + rule-based posture classifier |
| Input | Single camera frame, up to 4 persons simultaneously |
| Output | Pose landmarks, collapse flag, fall velocity estimate |
| Latency (Orin Nano Super) | ~33ms |
| Model size | 6.9 MB (BlazePose Full) |
| Optimization | Runs on CPU + NEON SIMD; optional GPU delegate |
| Framework | MediaPipe Python (0.10.x) |
| Trigger logic | Hip landmark drops below knee height within 3 consecutive frames AND confidence > 0.85 |

---

**Model 4: YAMNet (TFLite) — Audio Anomaly Detection**
| Property | Specification |
|----------|--------------|
| Purpose | Scream detection, glass breaking, gunshot, explosion, crowd panic |
| Architecture | MobileNetV1 depth-wise separable convolutions, trained on AudioSet (521 classes) |
| Input | 0.975s audio chunk, 16kHz mono, log-mel spectrogram |
| Output | 521-class audio event probabilities |
| Latency (Orin Nano Super) | ~50ms per chunk |
| Model size (TFLite) | 3.7 MB |
| Optimization | TFLite INT8 with CPU kernels + XNNPACK delegate |
| Framework | TFLite 2.x |
| Crisis classes monitored | Screaming (class 80), Breaking (class 461), Explosion (class 428), Crowd noise (class 137) |
| Trigger threshold | Any crisis class > 0.65 probability for 3 consecutive chunks |

---

**Model 5: XGBoost — Sensor Fusion Classifier**
| Property | Specification |
|----------|--------------|
| Purpose | Multi-sensor crisis classification using IoT data |
| Architecture | XGBoost GradientBoostedTrees (100 estimators, max_depth=6) |
| Input | smoke_ppm, temperature_celsius, co2_ppm, humidity_pct, pressure_hpa |
| Output | Crisis type probability distribution (fire/normal/co_leak/hvac_fault) |
| Latency | <5ms (CPU inference, no GPU required) |
| Model size | 0.8 MB |
| Framework | XGBoost Python, ONNX export for portability |
| Training data | Synthetic + augmented sensor readings for each crisis type |
| Trigger threshold | fire probability > 0.70 OR co_leak probability > 0.80 |

---

**Model 6: TinyML Seismic CNN — Structural Anomaly**
| Property | Specification |
|----------|--------------|
| Purpose | Structural stress detection from vibration sensors (earthquake, explosion, structural failure) |
| Architecture | 3-layer 1D CNN, 38,000 parameters total |
| Input | 1 second of accelerometer data (MPU-6050 / ADXL345), 100Hz sampling, 3-axis |
| Output | 4-class: normal / seismic / mechanical / impact |
| Latency (Orin Nano Super) | <7ms |
| Model size | 0.15 MB (INT8) |
| Optimization | TFLite Micro INT8 — designed for microcontroller deployment |
| Framework | TFLite Micro / TFLite Python |
| Accuracy | 97.12% |
| Trigger threshold | seismic or impact class > 0.85 AND duration > 500ms |

---

**Model 7: MobileNetV3-Small — Lightweight Visual Backup**
| Property | Specification |
|----------|--------------|
| Purpose | Fallback visual classifier when YOLOv8 is under load |
| Architecture | MobileNetV3-Small (2.5M parameters) |
| Input | 224×224 RGB image |
| Output | 5-class: normal / fire / smoke / medical / crowd |
| Latency | ~12ms (TensorRT INT8) |
| Model size | 2.9 MB (INT8) |
| Framework | TensorRT INT8 |

---

### 7.3 TensorRT Optimization Pipeline

```
Step 1: Train in PyTorch (or download pretrained YOLOv8n)
Step 2: Export to ONNX
        yolo export model=yolov8n.pt format=onnx opset=17

Step 3: Convert to TensorRT with INT8 calibration
        trtexec --onnx=yolov8n.onnx \
                --saveEngine=yolov8n_int8.trt \
                --int8 \
                --calib=calibration_cache.bin \
                --workspace=4096 \
                --device=0

Step 4: Validate accuracy on calibration set (target: <2% mAP drop)
Step 5: Deploy in Python with pycuda / tensorrt bindings
```

**Speedup table (Jetson Orin Nano Super):**
| Model | FP32 Latency | FP16 Latency | INT8 Latency | Memory (INT8) |
|-------|-------------|-------------|-------------|---------------|
| YOLOv8-nano | 89ms | 34ms | 15ms | 1.8 MB |
| CNN-LSTM | 210ms | 115ms | 80ms | 4.2 MB |
| MobileNetV3 | 48ms | 22ms | 12ms | 2.9 MB |
| Seismic CNN | 18ms | 9ms | 7ms | 0.15 MB |

### 7.4 Complete Inference Latency Budget

**All models run concurrently via asyncio:**
| Model | Latency | Runs on |
|-------|---------|---------|
| YOLOv8-nano (visual) | 15ms | TensorRT / GPU |
| Farneback optical flow | 25ms | OpenCV / CPU |
| CNN-LSTM (crowd behavior) | 80ms | TFLite / GPU delegate |
| MediaPipe Pose | 33ms | CPU + NEON |
| YAMNet (audio) | 50ms | TFLite / CPU |
| XGBoost (sensors) | 5ms | CPU |
| Seismic CNN | 7ms | TFLite Micro |
| **Total pipeline (parallel)** | **~90ms** | **All cores** |
| **Local alert dispatch** | **+20ms** | **MQTT pub** |
| **Cloud sync (Firestore)** | **+200ms** | **Network** |
| **Gemini orchestration** | **+3,000–5,000ms** | **Cloud API** |
| **FCM delivery** | **+500–1,000ms** | **Google FCM** |
| **Total end-to-end** | **~5–7 seconds** | |

### 7.5 Software Stack on Jetson

| Layer | Technology | Version |
|-------|-----------|---------|
| OS | Ubuntu 22.04 + JetPack 6.x | LTS |
| CUDA | CUDA 12.x | JetPack bundled |
| Inference - TRT | TensorRT 8.6 | JetPack bundled |
| Inference - TFLite | TensorFlow Lite 2.14 | pip install |
| Inference - MediaPipe | MediaPipe 0.10 | pip install |
| Camera pipeline | GStreamer 1.20 + OpenCV | apt + pip |
| Async pipeline | Python asyncio + aiohttp | Python 3.10 |
| Local messaging | Mosquitto MQTT broker 2.0 | apt |
| Local database | SQLite 3.x (offline queue) | stdlib |
| Containerization | Docker 24.x + K3s 1.29 | — |
| Cloud sync | Firebase Admin SDK + offline persistence | pip install |
| Sensor interface | RPi.GPIO / smbus2 | pip install |

**GStreamer RTSP pipeline:**
```
gst-launch-1.0 rtspsrc location=rtsp://camera_ip:554/stream \
  ! rtph264depay ! h264parse ! nvv4l2decoder \
  ! nvvidconv ! video/x-raw,format=BGRx \
  ! videoconvert ! video/x-raw,format=BGR \
  ! appsink
```

---

## 8. HYBRID EDGE-CLOUD ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                    JETSON ORIN NANO SUPER                       │
│  (Hotel premises — mounted in control room or server closet)   │
│                                                                 │
│  YOLOv8  CNN-LSTM  MediaPipe  YAMNet  XGBoost  Seismic        │
│  ↓                                                              │
│  asyncio Crisis Pipeline → Local Crisis Event                   │
│  ↓                                                              │
│  MQTT (Mosquitto) ←→ Local staff radio bridge                  │
│  ↓                                                              │
│  Firebase SDK (offline queue if no internet)                    │
└────────────────────────┬────────────────────────────────────────┘
                         │  Internet
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                     GOOGLE CLOUD                                │
│                                                                 │
│  Cloud Functions → Gemini 1.5 Pro (Orchestration)             │
│  Cloud Vision API (enhanced visual analysis)                   │
│  Firestore (ground truth, sync target)                         │
│  FCM (push to staff + guest devices)                           │
│  BigQuery (analytics, historical patterns)                     │
└─────────────────────────────────────────────────────────────────┘
```

### What Runs LOCAL (Jetson — always on, no internet required)
- All ML inference (7 models, <90ms pipeline)
- Local crisis detection and classification
- MQTT messaging to local control room terminal
- Offline crisis event queue (SQLite)
- Local alert to on-premises devices via Wi-Fi

### What Runs in CLOUD (Google — enhanced when online)
- Gemini 1.5 Pro orchestration (deep reasoning, routing)
- Enhanced Cloud Vision API analysis (more accurate than local)
- FCM push to guest/staff mobile devices
- Firestore ground truth and cross-venue sync
- BigQuery analytics and debrief generation

### Offline Mode (internet outage scenario)
1. Jetson detects crisis locally with full ML pipeline
2. Local crisis stored in SQLite offline queue
3. MQTT message sent to on-premises control room terminal
4. On-site staff notified via local Wi-Fi push
5. When connectivity restored: SQLite queue syncs to Firestore
6. Gemini debrief generated retroactively
7. Full incident report reconstructed from local logs

---

## 9. FLUTTER APP STRUCTURE

### 9.1 Project Structure
```
lib/
├── main.dart                    # Role-based routing (guest/staff/manager)
├── services/
│   ├── auth_service.dart        # Firebase Auth
│   ├── crisis_service.dart      # Firestore CRUD + streams
│   ├── fcm_service.dart         # Push notification handler
│   └── voice_report_service.dart # Speech-to-Text
├── models/
│   ├── crisis_event.dart
│   ├── personnel.dart
│   └── floor_plan.dart
├── screens/
│   ├── guest/
│   │   ├── guest_home.dart
│   │   ├── report_emergency.dart
│   │   ├── active_crisis_screen.dart
│   │   └── all_clear_screen.dart
│   ├── staff/
│   │   ├── staff_dashboard.dart
│   │   ├── dispatch_received.dart
│   │   ├── active_response.dart
│   │   └── history_screen.dart
│   └── control_room/
│       ├── control_room_shell.dart
│       ├── living_map.dart          # The centrepiece
│       ├── crisis_detail_panel.dart
│       ├── personnel_panel.dart
│       ├── incident_log.dart
│       └── analytics_screen.dart
└── widgets/
    ├── floor_map_painter.dart   # CustomPainter implementation
    ├── crisis_pin.dart
    ├── staff_pin.dart
    ├── evacuation_route.dart
    └── gemini_reasoning_panel.dart
```

### 9.2 Three Role Views

**GUEST VIEW (4 screens):**
- Home: Large "Report Emergency" button (voice or text), property info, QR check-in
- Reporting: Voice recording with live transcription, floor selection, submit
- Active Crisis: Single calm instruction, evacuation route arrow, reassurance message, progress indicator
- All Clear: Crisis resolved confirmation, "Thank you for staying calm" message

**STAFF VIEW (4 screens):**
- Dashboard: On-shift status toggle, current assignment card, shift overview
- Dispatch Received: Full-screen alert (crisis type icon, instruction, equipment list, route)
- Active Response: Large status buttons — En Route / On Scene / Need Help / Resolved
- History: Past assignments with debrief grades and key learnings

**CONTROL ROOM VIEW (5 screens, tablet/web):**
- Living Floor Map: Full-screen animated floor plan — the product's visual identity
- Crisis Detail Panel: Selected crisis with full Gemini reasoning, timeline, dispatch status
- Personnel Panel: All on-shift staff, roles, floors, assignment status
- Incident Log: Chronological event stream across all active crises
- Analytics: BigQuery charts — response times, false positive rates, staff performance

### 9.3 Living Floor Map Implementation

**Technology:** Flutter CustomPainter + AnimationController + Firestore real-time streams

**Visual elements:**
| Element | Description | Animation |
|---------|-------------|-----------|
| Crisis origin | Red/orange filled circle at crisis coordinates | Scale pulse 0.6→1.0, 1.2s loop, reverse: true |
| Severity badge | Number overlay on crisis pin (1–5) | Static |
| Staff pins | Colored circles by role (red=fire, blue=medical, gray=security) | Position interpolates to assignment |
| Dispatch threads | White lines from staff current position to assigned crisis | Fade in on dispatch |
| Evacuation routes | Green glowing path (only when status=CLEAR) | Opacity pulse 0.7→1.0 |
| Zone labels | Text overlays for floor zones | Static |
| Normal state | Quiet floor plan, all gray | No animation |

**Real-time update cycle:**
```
Firestore snapshot → setState() → CustomPainter.repaint()
~50ms update latency (Firestore real-time streams)
AnimationController runs independently at 60fps
```

---

## 10. IMPLEMENTATION ROADMAP

### Phase 0 — Foundation (Hours 0–2)
- [ ] Firebase project creation (Firestore, Auth, FCM, Hosting)
- [ ] Flutter app scaffold with `go_router` role-based routing
- [ ] Firestore schema: crises, personnel, floor_plans collections
- [ ] Firestore security rules (guest/staff/manager roles)
- [ ] Google Cloud project setup, billing enabled
- [ ] All required APIs enabled (see Section 11)
- [ ] Gemini API key configured and tested with hello-world prompt
- [ ] Seed Firestore with demo hotel data (personnel, floor plan, guests)

### Phase 1 — Core Pipeline (Hours 2–6)
- [ ] Cloud Function: `ingestCrisisReport` (HTTP trigger, text + voice)
- [ ] Speech-to-Text integration (voice → transcription)
- [ ] Cloud Vision API integration (frame → visual features)
- [ ] Basic Gemini orchestration prompt (classification + dispatch)
- [ ] Firestore write on crisis detection
- [ ] FCM basic push to staff Flutter app
- [ ] Crisis event created end-to-end (report → Firestore)

### Phase 2 — Intelligence Layer (Hours 6–12)
- [ ] Multi-modal feature fusion (visual + audio + sensor)
- [ ] Full contextual Gemini prompt (time, occupancy, history, equipment, routes)
- [ ] Structured JSON output from Gemini (enforced schema)
- [ ] Decision justification in Gemini response
- [ ] Backup dispatch logic (primary unavailable → secondary)
- [ ] Escalation monitor Cloud Function (Cloud Scheduler, 60s interval)
- [ ] Routing agent (Dijkstra on floor plan graph, NetworkX)
- [ ] Guest FCM geofenced multicast

### Phase 3 — Flutter UI (Hours 12–18)
- [ ] CustomPainter floor map (floor plan outline, zones)
- [ ] Crisis pulse animation (AnimationController, scale/opacity)
- [ ] Staff pin rendering (role colors, position)
- [ ] Dispatch thread lines (staff → crisis)
- [ ] Evacuation route paths (green, CLEAR only)
- [ ] Firestore real-time stream → map repaint
- [ ] Staff dispatch card (full-screen, accept/decline/status)
- [ ] Guest calm notification screen
- [ ] Gemini reasoning panel (collapsible, control room)
- [ ] Role-based auth flow and navigation

### Phase 4 — Demo Polish (Hours 18–24)
- [ ] Demo mode: simulated sensor triggers (one-tap crisis injection)
- [ ] End-to-end demo flow tested 5+ times
- [ ] Post-incident debrief screen
- [ ] Multi-crisis handling (two simultaneous crises)
- [ ] Edge cases: staff unavailable, escalation path
- [ ] Performance profiling (target <10s end-to-end confirmed)
- [ ] Flutter web build for control room (laptop demo)
- [ ] Pre-recorded fallback demo video
- [ ] Pitch deck synchronized to demo flow

---

## 11. GOOGLE CLOUD SETUP

### APIs to Enable
```bash
gcloud services enable \
  vision.googleapis.com \
  videointelligence.googleapis.com \
  speech.googleapis.com \
  aiplatform.googleapis.com \
  pubsub.googleapis.com \
  cloudfunctions.googleapis.com \
  cloudscheduler.googleapis.com \
  bigquery.googleapis.com \
  run.googleapis.com \
  firestore.googleapis.com
```

### Cloud Functions Deployment Map

| Function Name | Trigger | Purpose |
|--------------|---------|---------|
| `ingestCrisisReport` | HTTP | Accept report from Flutter app |
| `extractVisualFeatures` | Pub/Sub: crisis-frames | Cloud Vision API analysis |
| `classifyCrisis` | Firestore: /crises/{id} onCreate | Multi-modal fusion, CrisisEvent creation |
| `orchestrateResponse` | Firestore: /crises/{id} onUpdate (status=classified) | Gemini Pro full orchestration |
| `dispatchToStaff` | Pub/Sub: dispatch-decisions | FCM push to staff devices |
| `broadcastGuestNotification` | Pub/Sub: dispatch-decisions | FCM multicast to affected floors |
| `monitorEscalation` | Cloud Scheduler: every 60s | Non-response detection, backup dispatch |
| `generateDebrief` | Firestore: /crises/{id} onUpdate (status=resolved) | Gemini debrief generation |

### Firestore Security Rules Summary
```
Guests:   read own check-in record, write crisis reports
Staff:    read assigned crisis + own personnel record, write status updates
Managers: read/write all collections
Cloud Functions: admin via service account (Firebase Admin SDK)
```

---

## 12. WHAT TO BUILD VS SIMULATE

### Build for Real (Essential for Demo)
| Item | Why Build It |
|------|-------------|
| Flutter living map with CustomPainter | The visual anchor of the entire demo |
| Gemini reasoning pipeline (full prompt) | The core differentiator — must be real |
| Firestore real-time sync | Powers the "alive" map experience |
| FCM staff dispatch | Demonstrates actual end-to-end dispatch |
| Voice input → Speech-to-Text | Makes demo visceral and impressive |
| Cloud Vision API frame analysis | Shows multi-modal capability |
| Multi-agent Cloud Functions | Demonstrates architectural depth |
| Escalation monitor logic | Shows the system thinking beyond first action |

### Simulate Cleanly (Mock, Don't Waste Time)
| Item | How to Simulate |
|------|----------------|
| CCTV live feed | Pre-recorded 30-second hotel lobby clip, loop it |
| IoT sensor data | Mock JSON payload with hardcoded smoke_ppm, temp values |
| Guest room occupancy | Pre-seeded Firestore data (47 guests on Floor 3) |
| External emergency call | Show countdown timer + "Call initiated" UI state |
| Multi-property scale | Mention in pitch, don't demo |
| BigQuery historical data | Seed with 30 days of synthetic incidents |

---

## 13. DEMO SCRIPT (HACKATHON PITCH)

**Setup:** Laptop (Flutter web — control room) + 2 phones (staff app + guest app)  
**Total demo time:** 90 seconds  
**Principle:** The product tells its own story. Minimal narration needed.

| Time | Action | What Judges See |
|------|--------|----------------|
| 0:00 | Open control room on laptop | Quiet hotel floor map. All gray. Normal state. "The hotel is calm." |
| 0:10 | On guest phone, tap Report Emergency → speak: "There's smoke near the elevator on the third floor." | Live speech transcription on screen |
| 0:25 | Show Cloud Vision API frame (camera 3F East) flagging fire anomaly | Multi-modal input: voice + visual combined |
| 0:35 | Floor 3 begins to pulse red on map | "The map just came alive." |
| 0:42 | Gemini reasoning panel opens on control room | AI thinking in real time — visible decision process |
| 0:55 | Gemini output: fire, severity 4, 47 at risk, John dispatched, Stairwell C | "The AI just became an incident commander." |
| 1:05 | FCM push hits staff phone — full-screen dispatch | Staff sees: exact room, equipment to bring, route to take |
| 1:12 | Guest phone shows: "Please proceed to Stairwell C. Stay calm." | "Every stakeholder gets exactly what they need." |
| 1:20 | Control room: staff thread appears on map connecting to crisis pin | The map is now a live picture of the response |
| 1:30 | Staff taps Resolved | Map pulse fades. Debrief auto-generates. Hotel returns to quiet. |

> **Pitch closer:** "Most systems send alerts. HAVEN builds a shared, intelligent understanding of reality — so every person in a crisis knows exactly what to do, and why."

---

## 14. JUDGING CRITERIA ALIGNMENT

### Innovation and Creativity ★★★★★
- Personalized reality for each stakeholder is a novel UX concept for crisis response
- Living floor map as a primary UI metaphor — not a list, not a dashboard
- Gemini as an Incident Commander (not a chatbot, not a classifier)
- Asymmetric information design: same event, three different truths

### Technical Implementation ★★★★★
- Full Google stack (Flutter, Firebase, Gemini, Cloud Vision, Speech-to-Text, Vertex AI, BigQuery)
- Multi-agent pipeline architecture with 4 specialized agents
- Multi-modal ML fusion: vision + audio + sensors
- Edge-local inference on Jetson for offline resilience
- End-to-end latency under 10 seconds
- Real-time Firestore architecture powering live map

### Impact and Scalability ★★★★☆
- Primary: Hospitality venues globally (hotels, resorts, conference centers)
- Extensible: Airports, stadiums, malls, universities (same architecture)
- Plugin system: New crisis types via `crisis_registry.yaml`
- No new hardware required — works with existing cameras and staff devices
- Edge-first design works in low-connectivity venues

### User Experience ★★★★★
- Three perfectly differentiated role experiences from a single codebase
- Guest UX: zero information overload, psychological safety under crisis
- Staff UX: eliminates choice paralysis, one screen one action
- Control room: situational awareness at a glance, never overwhelming
- Explainable AI: reasoning visible, not a black box

### Use of Google Technologies ★★★★★
Every Google technology used meaningfully, not decoratively:
- Flutter: cross-platform, real-time map, role-based UX
- Firebase (Firestore, Auth, FCM, Hosting): entire real-time backend
- Gemini 1.5 Pro: deep contextual orchestration brain
- Gemini 1.5 Flash: fast visual analysis
- Cloud Vision API: multi-feature frame analysis in one call
- Speech-to-Text: voice crisis report input
- Vertex AI: custom multi-modal fusion classifier
- Cloud Functions: entire agent pipeline
- Cloud Scheduler: escalation monitor
- BigQuery: post-incident analytics

---

## 15. RISKS AND MITIGATIONS

| Risk | Description | Mitigation |
|------|-------------|------------|
| **False Positives** | Staff loses trust after repeated false alarms | Conservative confidence thresholds. Multi-signal confirmation required. Gemini considers false alarm history. Per-floor threshold adaptation. |
| **Gemini Latency** | Orchestration step takes >5s in real crisis | Gemini Flash for visual path (fast). Pro only for final decision. Parallel feature extraction. Cache common decision patterns. |
| **Staff App Adoption** | Staff don't use phones or ignore FCM push | Works on any Android/iOS. Offline-capable FCM receipt. Control room manual dispatch override always available. |
| **Multi-Crisis Overload** | Two simultaneous crises, insufficient staff | Gemini receives all active crises in prompt. Priority scoring. Resource allocation across crises. Visual separation on map. |
| **Internet Outage** | Firebase/Gemini unreachable during crisis | Edge Jetson provides full local ML detection. MQTT local messaging. SQLite offline queue. Crisis resolved locally, synced retroactively. |
| **Demo Failure** | Live demo breaks during pitch | Full demo mode with mock inputs. Pre-recorded 90-second fallback video. Firebase emulator for offline. All Gemini outputs pre-cached. |
| **Jetson Unavailable** | No Jetson hardware for hackathon | Cloud-only mode: manual camera frame upload triggers pipeline. Same architecture, no edge layer. Demo not diminished. |

---

## 16. OPEN QUESTIONS

| Question | Recommendation |
|----------|---------------|
| Single Flutter app with role switching or three separate apps? | **Single app, role set at login.** Simpler demo, more technically impressive. |
| Real hotel SVG floor map or simplified diagrammatic? | **Simplified diagrammatic.** Faster to build, crisis dynamics clearer. |
| Should guest check-in be demoed? | **No.** Pre-seed Firestore. Check-in flow wastes demo time. |
| Show Gemini reasoning in control room or keep hidden? | **SHOW IT.** Biggest differentiator. Judges love explainable AI. |
| Demo external escalation call? | **Show the decision + countdown.** Simulate the actual call. |
| Include Jetson in hackathon demo? | **Show architecture diagram.** If hardware available, demonstrate offline mode as bonus. |

---

## 17. APPENDICES

### Appendix A: Crisis Type Quick Reference

| Crisis | Primary | Secondary | Do NOT | External Service | Auto-Escalate |
|--------|---------|-----------|--------|-----------------|---------------|
| Fire | fire_marshal | security (evacuation) | Medical as primary | Fire Department | 5 minutes |
| Medical | medical_officer | nearest available | — | Ambulance | 3 minutes |
| Security | security_officer | lockdown protocol | Medical or fire as primary | Police | 4 minutes |
| Stampede | security + medical simultaneously | Immediate external | Delay external | All services | 2 minutes |
| Structural | security (evacuation only) | None | Anyone into affected zone | Fire Department | Immediate |

### Appendix B: Gemini Prompt Philosophy

The difference between a losing integration and a winning one:

> **Losing:** "Classify this text as fire, medical, or security."  
> **Winning:** "You are an AI Incident Commander. Here is the complete state of this venue at this exact moment. Here are the constraints. Here are the people available. Here is the history. Make the best decision for human safety and explain your reasoning."

The prompt should feel like briefing a highly trained expert, not filling a form.  
Give Gemini the full picture and trust it to reason.  
The quality of your prompt is the quality of your system.

- **Temperature: 0.1** — crisis decisions need consistency, not creativity
- **Response format: JSON** — structured output for programmatic action
- **Model: Gemini 1.5 Pro** for orchestration (reasoning depth), **Flash** for visual analysis (speed)
- **Never use few-shot examples for routing rules** — hardcode them as system constraints

### Appendix C: Demo Data Seed (Firestore)

**Personnel (pre-seeded for demo):**
```
John D.     — fire_marshal    — Floor 2 — on_shift: true  — available
Sarah M.    — medical_officer — Floor 1 — on_shift: true  — available
Rajan K.    — security        — Lobby   — on_shift: true  — available
Mike T.     — fire_marshal    — Floor 4 — on_shift: true  — available (backup)
```

**Floor 3 guests (pre-seeded):**
```
47 guests — conference group — Floor 3 — active check-in
FCM tokens: seeded for demo devices
```

**Equipment stations (pre-seeded):**
```
station_B — fire_extinguisher — Floor 3 East Wing — inspected: current
station_B2 — first_aid_kit   — Floor 3 West Wing — inspected: current
```

**Evacuation routes (pre-seeded):**
```
stairwell_A — Floor 3 — status: BLOCKED (maintenance)
stairwell_C — Floor 3 — status: CLEAR — capacity: 80
emergency_exit_E — Floor 3 — status: CLEAR — capacity: 40
```

### Appendix D: One-Sentence Pitches by Audience

| Audience | Pitch |
|----------|-------|
| Judges | "HAVEN is the AI Incident Commander that transforms a hotel's fragmented crisis response into coordinated, intelligent action — routing the right people to the right place with the right information, in seconds." |
| Hotel Operators | "HAVEN turns your existing cameras, staff, and systems into a coordinated crisis response without replacing anything you already have." |
| Technical Reviewers | "A multi-agent Gemini pipeline running on Google Cloud that performs multi-modal crisis classification, contextual routing, and personalized stakeholder communication with sub-10-second end-to-end latency." |
| Investors | "HAVEN solves the last-mile problem of hospitality emergency response — not detection, but decision — and scales from a single hotel to an entire global brand." |

---

*HAVEN Master Plan v1.0 — Confidential — Hackathon Use Only*
