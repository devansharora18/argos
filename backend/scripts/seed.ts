/**
 * HAVEN Demo Seed Script
 * ----------------------
 * Populates Firestore with a complete demo venue so judges can trigger a
 * live end-to-end pipeline run on the spot.
 *
 * Usage:
 *   npm run seed
 *
 * Requires GOOGLE_APPLICATION_CREDENTIALS (or ADC) in the environment.
 * The script is fully idempotent — safe to run multiple times.
 */

import '../src/integrations/firebase/admin'; // initialise Firebase Admin
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const db = getFirestore();

// ---------------------------------------------------------------------------
// Demo constants
// ---------------------------------------------------------------------------

const VENUE_ID   = 'venue_demo_001';
const TENANT_ID  = 'tenant_demo_001';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function log(section: string, id: string) {
  console.log(`  ✓  ${section.padEnd(22)} ${id}`);
}

async function upsert(ref: FirebaseFirestore.DocumentReference, data: object) {
  await ref.set(data, { merge: true });
}

// ---------------------------------------------------------------------------
// Venue document
// ---------------------------------------------------------------------------

async function seedVenue() {
  console.log('\n📍 Venue');
  await upsert(db.collection('venues').doc(VENUE_ID), {
    venue_id: VENUE_ID,
    tenant_id: TENANT_ID,
    name: 'Grand Meridian Hotel',
    address: '12 Residency Road, Bengaluru, Karnataka 560025',
    floors: ['1', '2', '3', '4', '5', 'B1'],
    timezone: 'Asia/Kolkata',
    capacity: 850,
    created_at: new Date().toISOString(),
  });
  log('venue', VENUE_ID);
}

// ---------------------------------------------------------------------------
// Personnel
// ---------------------------------------------------------------------------

interface StaffSeed {
  staff_id: string;
  name: string;
  role: string;
  floor: string;
  certifications: string[];
  fcm_token?: string;
}

const STAFF: StaffSeed[] = [
  {
    staff_id: 'staff_fire_01',
    name: 'Rajesh Kumar',
    role: 'fire_marshal',
    floor: '3',
    certifications: ['fire_safety', 'evacuation_coordinator', 'first_aid'],
  },
  {
    staff_id: 'staff_med_01',
    name: 'Dr. Priya Sharma',
    role: 'medical_officer',
    floor: '2',
    certifications: ['advanced_first_aid', 'aed_certified', 'trauma_response'],
  },
  {
    staff_id: 'staff_sec_01',
    name: 'Arjun Singh',
    role: 'security',
    floor: '1',
    certifications: ['crowd_control', 'cctv_monitoring'],
  },
  {
    staff_id: 'staff_sec_02',
    name: 'Vikram Nair',
    role: 'security',
    floor: '4',
    certifications: ['crowd_control'],
  },
  {
    staff_id: 'staff_gen_01',
    name: 'Meera Patel',
    role: 'general_staff',
    floor: '2',
    certifications: ['basic_first_aid'],
  },
  {
    staff_id: 'staff_gen_02',
    name: 'Rahul Verma',
    role: 'general_staff',
    floor: '5',
    certifications: [],
  },
];

async function seedPersonnel() {
  console.log('\n👥 Personnel');
  const personnelCol = db
    .collection('venues').doc(VENUE_ID)
    .collection('personnel');

  for (const s of STAFF) {
    await upsert(personnelCol.doc(s.staff_id), {
      staff_id: s.staff_id,
      venue_id: VENUE_ID,
      name: s.name,
      role: s.role,
      floor: s.floor,
      certifications: s.certifications,
      on_shift: true,
      status: 'available',
      current_assignment: null,
      // fcm_token is intentionally left unset here — the Flutter app writes
      // this field on login. Seed just ensures the record exists.
    });
    log(s.role, `${s.staff_id} (${s.name}, floor ${s.floor})`);
  }
}

// ---------------------------------------------------------------------------
// Evacuation routes
// ---------------------------------------------------------------------------

const ROUTES = [
  { route_id: 'route_north_stairwell',   label: 'North Stairwell',       status: 'open',   floors: ['1','2','3','4','5'] },
  { route_id: 'route_south_exit',        label: 'South Emergency Exit',   status: 'open',   floors: ['1','B1'] },
  { route_id: 'route_east_fire_escape',  label: 'East Fire Escape',       status: 'open',   floors: ['2','3','4','5'] },
  { route_id: 'route_service_corridor',  label: 'Service Corridor B',     status: 'open',   floors: ['1','2','3'] },
  { route_id: 'route_west_stairwell',    label: 'West Stairwell',         status: 'closed', floors: ['1','2','3','4','5'] },
];

async function seedEvacuationRoutes() {
  console.log('\n🚪 Evacuation routes');
  const routesCol = db
    .collection('venues').doc(VENUE_ID)
    .collection('evacuation_routes');

  for (const r of ROUTES) {
    await upsert(routesCol.doc(r.route_id), r);
    log(r.status === 'open' ? 'open' : 'closed ⚠️', r.label);
  }
}

// ---------------------------------------------------------------------------
// Equipment stations
// ---------------------------------------------------------------------------

const EQUIPMENT = [
  { station_id: 'equip_fire_3a',     type: 'fire_extinguisher',  floor: '3', zone: 'Corridor A' },
  { station_id: 'equip_fire_1b',     type: 'fire_extinguisher',  floor: '1', zone: 'Main Lobby' },
  { station_id: 'equip_fire_2a',     type: 'fire_extinguisher',  floor: '2', zone: 'Restaurant' },
  { station_id: 'equip_aed_2a',      type: 'aed_defibrillator',  floor: '2', zone: 'Fitness Centre' },
  { station_id: 'equip_aed_1a',      type: 'aed_defibrillator',  floor: '1', zone: 'Concierge Desk' },
  { station_id: 'equip_firstaid_1a', type: 'first_aid_kit',       floor: '1', zone: 'Security Office' },
  { station_id: 'equip_firstaid_3b', type: 'first_aid_kit',       floor: '3', zone: 'Housekeeping Store' },
  { station_id: 'equip_hose_4a',     type: 'fire_hose_reel',      floor: '4', zone: 'East Corridor' },
  { station_id: 'equip_hose_5a',     type: 'fire_hose_reel',      floor: '5', zone: 'West Corridor' },
];

async function seedEquipmentStations() {
  console.log('\n🧯 Equipment stations');
  const equipCol = db
    .collection('venues').doc(VENUE_ID)
    .collection('equipment_stations');

  for (const e of EQUIPMENT) {
    await upsert(equipCol.doc(e.station_id), e);
    log(e.type, `Floor ${e.floor} — ${e.zone}`);
  }
}

// ---------------------------------------------------------------------------
// Tenant document (needed for auth scope checks)
// ---------------------------------------------------------------------------

async function seedTenant() {
  console.log('\n🏢 Tenant');
  await upsert(db.collection('tenants').doc(TENANT_ID), {
    tenant_id: TENANT_ID,
    name: 'Grand Meridian Group',
    venue_ids: [VENUE_ID],
    created_at: new Date().toISOString(),
  });
  log('tenant', TENANT_ID);
}

// ---------------------------------------------------------------------------
// Demo user accounts (stored so Firebase auth tokens can be minted in demo)
// ---------------------------------------------------------------------------

async function seedDemoUsers() {
  console.log('\n🔑 Demo user refs (Firestore only — create Firebase Auth users manually)');
  const usersCol = db.collection('users');

  const users = [
    { uid: 'demo_manager_01',  role: 'manager', name: 'Sanjay Mehta',  venue_id: VENUE_ID, tenant_id: TENANT_ID },
    { uid: 'demo_staff_fire',  role: 'staff',   name: 'Rajesh Kumar',  venue_id: VENUE_ID, tenant_id: TENANT_ID, staff_id: 'staff_fire_01' },
    { uid: 'demo_staff_med',   role: 'staff',   name: 'Dr. Priya Sharma', venue_id: VENUE_ID, tenant_id: TENANT_ID, staff_id: 'staff_med_01' },
    { uid: 'demo_guest_01',    role: 'guest',   name: 'Anjali Roy',    venue_id: VENUE_ID, tenant_id: TENANT_ID },
  ];

  for (const u of users) {
    await upsert(usersCol.doc(u.uid), { ...u, created_at: new Date().toISOString() });
    log(u.role, `${u.uid} (${u.name})`);
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  HAVEN  —  Demo Seed');
  console.log(`  Venue : ${VENUE_ID}`);
  console.log(`  Tenant: ${TENANT_ID}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await seedTenant();
  await seedVenue();
  await seedPersonnel();
  await seedEvacuationRoutes();
  await seedEquipmentStations();
  await seedDemoUsers();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  ✅  Seed complete');
  console.log(`\n  To trigger a demo crisis run:\n`);
  console.log(`  curl -X POST http://localhost:8080/api/v1/demo/trigger \\`);
  console.log(`    -H 'Content-Type: application/json' \\`);
  console.log(`    -d '{"scenario":"fire","venue_id":"${VENUE_ID}"}'`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(err => {
  console.error('\n❌  Seed failed:', err);
  process.exit(1);
});
