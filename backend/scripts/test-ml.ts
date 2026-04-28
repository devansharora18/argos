/**
 * HAVEN ML Pipeline Test
 * ----------------------
 * Tests Gemini classification + orchestration directly — no Firebase/emulators needed.
 * Just needs GEMINI_API_KEY in .env
 *
 * Run: npm run test:ml
 */

import 'dotenv/config';
import { classifyWithGemini, orchestrateWithGemini } from '../src/integrations/gemini/geminiClient';

// ---------------------------------------------------------------------------
// Pretty print helpers
// ---------------------------------------------------------------------------

const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';
const DIM    = '\x1b[2m';
const RED    = '\x1b[31m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE   = '\x1b[34m';
const CYAN   = '\x1b[36m';
const WHITE  = '\x1b[37m';

function header(text: string) {
  const line = '━'.repeat(58);
  console.log(`\n${BOLD}${CYAN}${line}${RESET}`);
  console.log(`${BOLD}${WHITE}  ${text}${RESET}`);
  console.log(`${BOLD}${CYAN}${line}${RESET}`);
}

function subheader(text: string) {
  console.log(`\n${BOLD}${BLUE}  ▶ ${text}${RESET}`);
}

function field(label: string, value: string | number | boolean, color = WHITE) {
  console.log(`  ${DIM}${label.padEnd(24)}${RESET}${color}${value}${RESET}`);
}

function severityBar(severity: number): string {
  const filled = '█'.repeat(severity);
  const empty  = '░'.repeat(5 - severity);
  const color  = severity >= 4 ? RED : severity >= 3 ? YELLOW : GREEN;
  return `${color}${filled}${DIM}${empty}${RESET} ${severity}/5`;
}

function confidenceBar(confidence: number): string {
  const pct    = Math.round(confidence * 100);
  const filled = Math.round(confidence * 20);
  const empty  = 20 - filled;
  const color  = confidence >= 0.8 ? GREEN : confidence >= 0.6 ? YELLOW : RED;
  return `${color}${'▓'.repeat(filled)}${DIM}${'░'.repeat(empty)}${RESET} ${pct}%`;
}

function crisisTypeColor(type: string): string {
  const colors: Record<string, string> = {
    fire:       '\x1b[91m',  // bright red
    medical:    '\x1b[93m',  // bright yellow
    security:   '\x1b[95m',  // bright magenta
    stampede:   '\x1b[91m',  // bright red
    structural: '\x1b[33m',  // yellow
    unknown:    '\x1b[37m',  // white
  };
  return `${colors[type] ?? WHITE}${type.toUpperCase()}${RESET}`;
}

function ok(msg: string)   { console.log(`  ${GREEN}✓${RESET}  ${msg}`); }
function warn(msg: string) { console.log(`  ${YELLOW}⚠${RESET}  ${msg}`); }
function err(msg: string)  { console.log(`  ${RED}✗${RESET}  ${msg}`); }

// ---------------------------------------------------------------------------
// Test scenarios
// ---------------------------------------------------------------------------

interface TestCase {
  name: string;
  reportText: string;
  floor: string;
  zone: string;
  triggerSources: string[];
  expectType: string;
}

const TEST_CASES: TestCase[] = [
  {
    name: 'Kitchen Fire',
    reportText:
      'Heavy smoke visible coming from the kitchen area. Fire alarm on floor 3 just triggered. ' +
      'Multiple guests evacuating the restaurant. Smell of burning, possible electrical fire.',
    floor: '3',
    zone: 'Kitchen / Restaurant',
    triggerSources: ['smoke_sensor_3A', 'fire_alarm_3B'],
    expectType: 'fire',
  },
  {
    name: 'Pool Medical Emergency',
    reportText:
      'Guest collapsed near the swimming pool and is unresponsive. Bystanders performing CPR. ' +
      'No AED nearby. Approximately 60 years old male, no visible injuries.',
    floor: '2',
    zone: 'Pool Deck',
    triggerSources: ['panic_button_2C'],
    expectType: 'medical',
  },
  {
    name: 'Lobby Security Threat',
    reportText:
      'Violent altercation in the main lobby between two guests. One person appears to have ' +
      'a weapon. Multiple guests frightened and backing away. Situation escalating rapidly.',
    floor: '1',
    zone: 'Main Lobby',
    triggerSources: ['cctv_alert_1A'],
    expectType: 'security',
  },
  {
    name: 'Ballroom Stampede',
    reportText:
      'Crowd surge at the Grand Ballroom entrance. People are being crushed against the doors. ' +
      'Several guests have fallen. Estimated 200+ people in the area. Someone shouted fire.',
    floor: '1',
    zone: 'Grand Ballroom',
    triggerSources: ['crowd_density_sensor_1D', 'panic_button_1E'],
    expectType: 'stampede',
  },
  {
    name: 'Ceiling Collapse',
    reportText:
      'Part of the ceiling in Corridor A has collapsed. Dust and debris everywhere. ' +
      'Two guests may be trapped under rubble. Structural cracking sounds still audible.',
    floor: '4',
    zone: 'Corridor A',
    triggerSources: ['vibration_sensor_4A'],
    expectType: 'structural',
  },
];

// ---------------------------------------------------------------------------
// Mock venue context for orchestration test
// ---------------------------------------------------------------------------

const MOCK_PERSONNEL = [
  { staff_id: 'staff_fire_01', name: 'Rajesh Kumar',    role: 'fire_marshal',    floor: '3', certifications: ['fire_safety', 'evacuation_coordinator', 'first_aid'] },
  { staff_id: 'staff_med_01',  name: 'Dr. Priya Sharma',role: 'medical_officer', floor: '2', certifications: ['advanced_first_aid', 'aed_certified', 'trauma_response'] },
  { staff_id: 'staff_sec_01',  name: 'Arjun Singh',     role: 'security',        floor: '1', certifications: ['crowd_control', 'cctv_monitoring'] },
  { staff_id: 'staff_sec_02',  name: 'Vikram Nair',     role: 'security',        floor: '4', certifications: ['crowd_control'] },
  { staff_id: 'staff_gen_01',  name: 'Meera Patel',     role: 'general_staff',   floor: '2', certifications: ['basic_first_aid'] },
];

const MOCK_ROUTES = [
  { route_id: 'north_stairwell',  status: 'open',   label: 'North Stairwell' },
  { route_id: 'south_exit',       status: 'open',   label: 'South Emergency Exit' },
  { route_id: 'east_fire_escape', status: 'open',   label: 'East Fire Escape' },
  { route_id: 'west_stairwell',   status: 'closed', label: 'West Stairwell (CLOSED)' },
];

const MOCK_EQUIPMENT = [
  { station_id: 'equip_fire_3a', type: 'fire_extinguisher',  floor: '3' },
  { station_id: 'equip_aed_2a',  type: 'aed_defibrillator',  floor: '2' },
  { station_id: 'equip_fa_1a',   type: 'first_aid_kit',       floor: '1' },
];

// ---------------------------------------------------------------------------
// Rate limit helper — free tier allows ~15 RPM, add a pause between calls
// ---------------------------------------------------------------------------

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Run classification tests
// ---------------------------------------------------------------------------

async function runClassificationTests(): Promise<Map<string, Awaited<ReturnType<typeof classifyWithGemini>>>> {
  header('STEP 1 — GEMINI FLASH CLASSIFICATION');
  console.log(`${DIM}  Testing all 5 crisis scenarios...${RESET}\n`);

  const results = new Map<string, Awaited<ReturnType<typeof classifyWithGemini>>>();
  let passed = 0;

  for (const tc of TEST_CASES) {
    subheader(`Scenario: ${tc.name}`);
    console.log(`  ${DIM}Floor ${tc.floor} | Zone: ${tc.zone}${RESET}`);
    console.log(`  ${DIM}Triggers: ${tc.triggerSources.join(', ')}${RESET}`);

    const start = Date.now();
    try {
      const result = await classifyWithGemini(
        tc.reportText,
        tc.floor,
        tc.zone,
        tc.triggerSources
      );
      const ms = Date.now() - start;

      field('Crisis Type',  crisisTypeColor(result.crisis_type));
      field('Severity',     severityBar(result.severity));
      field('Confidence',   confidenceBar(result.confidence));
      field('Floor',        result.floor, CYAN);
      field('Zone',         result.zone,  CYAN);
      field('Latency',      `${ms}ms`, ms < 2000 ? GREEN : YELLOW);
      console.log(`\n  ${DIM}Reasoning:${RESET}`);
      console.log(`  ${WHITE}"${result.reasoning}"${RESET}`);

      const correct = result.crisis_type === tc.expectType;
      if (correct) {
        ok(`Correct type: expected ${tc.expectType}`);
        passed++;
      } else {
        warn(`Got ${result.crisis_type}, expected ${tc.expectType}`);
      }

      results.set(tc.name, result);
    } catch (e) {
      err(`Failed: ${e instanceof Error ? e.message : String(e)}`);
    }

    console.log();
    // Pause between calls to stay within free-tier rate limits (15 RPM)
    await sleep(4500);
  }

  console.log(`${BOLD}  Classification score: ${passed === TEST_CASES.length ? GREEN : YELLOW}${passed}/${TEST_CASES.length} correct${RESET}`);
  return results;
}

// ---------------------------------------------------------------------------
// Run orchestration test (fire scenario — most complex)
// ---------------------------------------------------------------------------

async function runOrchestrationTest(
  classResults: Map<string, Awaited<ReturnType<typeof classifyWithGemini>>>
) {
  header('STEP 2 — GEMINI PRO ORCHESTRATION');
  console.log(`${DIM}  Using fire scenario result + mock venue context...${RESET}\n`);

  const fireResult = classResults.get('Kitchen Fire');
  if (!fireResult) {
    err('Fire classification result not available — skipping orchestration test');
    return;
  }

  subheader('Inputs');
  field('Crisis type',    crisisTypeColor(fireResult.crisis_type));
  field('Severity',       severityBar(fireResult.severity));
  field('Personnel',      `${MOCK_PERSONNEL.length} available`, CYAN);
  field('Evacuation routes', `${MOCK_ROUTES.filter(r => r.status === 'open').length} open, 1 closed`, CYAN);

  const start = Date.now();
  try {
    const plan = await orchestrateWithGemini(
      {
        crisis_type: fireResult.crisis_type,
        severity:    fireResult.severity,
        floor:       '3',
        zone:        'Kitchen / Restaurant',
        report_text: TEST_CASES[0]!.reportText,
      },
      {
        current_time:       new Date().toISOString(),
        available_personnel: MOCK_PERSONNEL,
        evacuation_routes:  MOCK_ROUTES,
        equipment_stations: MOCK_EQUIPMENT,
      }
    );
    const ms = Date.now() - start;

    subheader('Dispatch Decisions');
    for (const d of plan.dispatch_decisions) {
      const priority = d.priority === 'primary' ? `${RED}PRIMARY${RESET}` : `${YELLOW}SECONDARY${RESET}`;
      console.log(`\n  ${BOLD}${d.staff_name}${RESET} (${d.role}) — ${priority}`);
      console.log(`  ${DIM}Instruction:${RESET} ${WHITE}${d.instruction}${RESET}`);
      if (d.equipment_to_bring.length) {
        console.log(`  ${DIM}Equipment:${RESET}   ${CYAN}${d.equipment_to_bring.join(', ')}${RESET}`);
      }
      console.log(`  ${DIM}Route:${RESET}       ${CYAN}${d.route}${RESET}`);
    }

    if (plan.backup_assignments.length) {
      subheader('Backup Assignments (Standby)');
      for (const b of plan.backup_assignments) {
        console.log(`  ${DIM}${b.role}${RESET} — ${b.instruction}`);
      }
    }

    subheader('Guest Notification');
    const toneColor = plan.guest_notification.tone === 'urgent' ? RED : GREEN;
    field('Tone',            `${toneColor}${plan.guest_notification.tone.toUpperCase()}${RESET}`);
    field('Affected floors', plan.guest_notification.affected_floors.join(', '), CYAN);
    field('Route',           plan.guest_notification.evacuation_route, CYAN);
    console.log(`\n  ${DIM}Message:${RESET}`);
    console.log(`  ${WHITE}"${plan.guest_notification.message}"${RESET}`);

    subheader('Control Room Summary');
    console.log(`  ${WHITE}${plan.control_room_summary}${RESET}`);

    subheader('External Escalation');
    if (plan.external_escalation.required) {
      console.log(`  ${RED}${BOLD}REQUIRED — ${plan.external_escalation.service.replace('_', ' ').toUpperCase()}${RESET}`);
      console.log(`  ${DIM}Reason: ${plan.external_escalation.reason}${RESET}`);
      console.log(`  ${DIM}Auto-call in: ${plan.external_escalation.auto_call_in_minutes} minutes${RESET}`);
    } else {
      console.log(`  ${GREEN}Not required — on-site team sufficient${RESET}`);
    }

    subheader('Decision Reasoning');
    console.log(`  ${WHITE}${plan.decision_reasoning}${RESET}`);

    subheader('Alternatives Considered (What Gemini Rejected)');
    for (const alt of plan.alternatives_considered) {
      console.log(`  ${DIM}• ${alt}${RESET}`);
    }

    field('\nOrchestration confidence', confidenceBar(plan.confidence));
    field('Latency',                   `${ms}ms`, ms < 5000 ? GREEN : YELLOW);

    ok('Orchestration complete');
  } catch (e) {
    err(`Failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

// ---------------------------------------------------------------------------
// Run a quick stampede orchestration (to show external escalation)
// ---------------------------------------------------------------------------

async function runStampedeOrchestration() {
  header('STEP 3 — STAMPEDE SCENARIO (External Escalation Demo)');
  console.log(`${DIM}  Stampede forces Gemini to trigger external emergency services...${RESET}\n`);

  const start = Date.now();
  try {
    const plan = await orchestrateWithGemini(
      {
        crisis_type: 'stampede',
        severity: 5,
        floor: '1',
        zone: 'Grand Ballroom',
        report_text:
          'Crowd surge at the Grand Ballroom entrance. People are being crushed against the doors. ' +
          'Several guests have fallen. Estimated 200+ people in the area.',
        estimated_persons: 200,
      },
      {
        current_time: new Date().toISOString(),
        available_personnel: MOCK_PERSONNEL,
        evacuation_routes: MOCK_ROUTES,
        equipment_stations: MOCK_EQUIPMENT,
      }
    );
    const ms = Date.now() - start;

    subheader('Dispatch Decisions');
    for (const d of plan.dispatch_decisions) {
      const priority = d.priority === 'primary' ? `${RED}PRIMARY${RESET}` : `${YELLOW}SECONDARY${RESET}`;
      console.log(`  ${BOLD}${d.staff_name}${RESET} (${d.role}) — ${priority}: ${d.instruction}`);
    }

    subheader('External Escalation');
    if (plan.external_escalation.required) {
      console.log(`  ${RED}${BOLD}🚨 REQUIRED — ${plan.external_escalation.service.replace(/_/g, ' ').toUpperCase()}${RESET}`);
      console.log(`  ${DIM}Reason: ${plan.external_escalation.reason}${RESET}`);
      console.log(`  ${YELLOW}Auto-call in: ${plan.external_escalation.auto_call_in_minutes} minutes${RESET}`);
      ok('External escalation correctly triggered for stampede severity 5');
    } else {
      warn('External escalation NOT triggered — unexpected for severity 5 stampede');
    }

    subheader('Guest Notification');
    console.log(`  ${toneLabel(plan.guest_notification.tone)} "${plan.guest_notification.message}"`);

    field('\nLatency', `${ms}ms`, ms < 5000 ? GREEN : YELLOW);
  } catch (e) {
    err(`Failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

function toneLabel(tone: string): string {
  return tone === 'urgent'
    ? `${RED}[URGENT]${RESET}`
    : `${GREEN}[CALM]${RESET}`;
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

function printSummary() {
  header('TEST COMPLETE');
  console.log(`
  What was tested:
  ${GREEN}✓${RESET}  Gemini Flash — 5 crisis scenarios classified
  ${GREEN}✓${RESET}  Gemini Pro   — fire orchestration (multi-dispatch, guest msg)
  ${GREEN}✓${RESET}  Gemini Pro   — stampede (external escalation path)

  What these power in the live demo:
  ${CYAN}•${RESET}  POST /api/v1/demo/trigger → full pipeline fires
  ${CYAN}•${RESET}  Firestore updates in real time as each worker runs
  ${CYAN}•${RESET}  FCM pushes to staff devices + guest broadcast

  Next: run the full HTTP pipeline test
  ${DIM}  npm run test:pipeline${RESET}
`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main() {
  console.clear();
  header('HAVEN — ML PIPELINE TEST');
  console.log(`${DIM}  Gemini API Key: ${process.env.GEMINI_API_KEY?.slice(0, 12)}...${RESET}`);
  console.log(`${DIM}  Model (classify): gemini-2.5-flash${RESET}`);
  console.log(`${DIM}  Model (orchestrate): gemini-2.5-pro${RESET}`);

  const classResults = await runClassificationTests();
  await runOrchestrationTest(classResults);
  await runStampedeOrchestration();
  printSummary();
}

main().catch(err => {
  console.error(`\n${RED}Fatal error:${RESET}`, err);
  process.exit(1);
});
