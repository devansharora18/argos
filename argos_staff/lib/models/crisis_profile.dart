import 'package:flutter/material.dart';

class GearItem {
  const GearItem({required this.icon, required this.label});
  final IconData icon;
  final String label;
}

/// Per-crisis-type playbook for the staff dispatch screen.
class StaffCrisisProfile {
  const StaffCrisisProfile({
    required this.displayName,
    required this.icon,
    required this.accentColor,
    required this.missionDirective,
    required this.gear,
    required this.primaryRoute,
    required this.hazardAdvisory,
    required this.populationAtRisk,
    required this.aiConfidence,
  });

  final String displayName;
  final IconData icon;
  final Color accentColor;
  final String missionDirective;
  final List<GearItem> gear;
  final String primaryRoute;
  final String hazardAdvisory;
  final String populationAtRisk;
  final String aiConfidence;

  static const _fallback = StaffCrisisProfile(
    displayName: 'Incident',
    icon: Icons.warning_rounded,
    accentColor: Color(0xFFFF3D52),
    missionDirective:
        'IMMEDIATE RESPONSE REQUIRED. ASSESS SCENE AND REPORT FINDINGS.\n'
        'AWAIT FURTHER INSTRUCTION FROM CONTROL.',
    gear: [
      GearItem(icon: Icons.radio_rounded, label: 'Radio Unit 03'),
      GearItem(icon: Icons.shield_rounded, label: 'Protective Gear'),
    ],
    primaryRoute: 'Via nearest authorized corridor',
    hazardAdvisory: 'Awaiting hazard assessment',
    populationAtRisk: 'PENDING',
    aiConfidence: 'CONF: 0.85',
  );

  static const Map<String, StaffCrisisProfile> _byType = {
    'fire': StaffCrisisProfile(
      displayName: 'Structural Fire',
      icon: Icons.local_fire_department_rounded,
      accentColor: Color(0xFFFF3D52),
      missionDirective:
          'IMMEDIATE RESPONSE REQUIRED. PROCEED TO ZONE.\n'
          'SUPPRESSION PRIORITY. SECURE PERIMETER\n'
          'AND AWAIT HAZMAT TEAM ARRIVAL.',
      gear: [
        GearItem(icon: Icons.fire_extinguisher_rounded, label: 'Fire Extinguisher'),
        GearItem(icon: Icons.radio_rounded, label: 'Radio Unit 03'),
        GearItem(icon: Icons.shield_rounded, label: 'Protective Gear'),
      ],
      primaryRoute: 'Via East Corridor -> Stairwell C',
      hazardAdvisory: 'Stairwell A BLOCKED',
      populationAtRisk: '47 AT RISK',
      aiConfidence: 'CONF: 0.94',
    ),
    'smoke': StaffCrisisProfile(
      displayName: 'Smoke Detection',
      icon: Icons.cloud_rounded,
      accentColor: Color(0xFFE07A52),
      missionDirective:
          'INVESTIGATE SOURCE OF SMOKE.\n'
          'CHECK FOR ACTIVE FIRE.\n'
          'DEPLOY VENTILATION AND CLEAR AREA.',
      gear: [
        GearItem(icon: Icons.masks_rounded, label: 'Smoke Hood'),
        GearItem(icon: Icons.radio_rounded, label: 'Radio Unit 03'),
        GearItem(icon: Icons.flashlight_on_rounded, label: 'Flashlight'),
      ],
      primaryRoute: 'Via service corridor -> Mechanical room',
      hazardAdvisory: 'Visibility reduced',
      populationAtRisk: '22 AT RISK',
      aiConfidence: 'CONF: 0.81',
    ),
    'medical': StaffCrisisProfile(
      displayName: 'Medical Emergency',
      icon: Icons.medical_services_rounded,
      accentColor: Color(0xFFE04A6B),
      missionDirective:
          'ASSESS PATIENT. CHECK AIRWAY AND BREATHING.\n'
          'ADMINISTER FIRST AID. CLEAR BYSTANDERS.\n'
          'PREPARE FOR EMS HANDOFF.',
      gear: [
        GearItem(icon: Icons.medical_services_rounded, label: 'First Aid Kit'),
        GearItem(icon: Icons.monitor_heart_rounded, label: 'AED'),
        GearItem(icon: Icons.radio_rounded, label: 'Radio Unit 03'),
      ],
      primaryRoute: 'Via main corridor -> direct route',
      hazardAdvisory: 'Crowd control may be required',
      populationAtRisk: '1 PATIENT',
      aiConfidence: 'CONF: 0.88',
    ),
    'security': StaffCrisisProfile(
      displayName: 'Security Threat',
      icon: Icons.shield_rounded,
      accentColor: Color(0xFF8B3A3A),
      missionDirective:
          'ESTABLISH PERIMETER. DO NOT ENGAGE.\n'
          'EVACUATE NON-COMBATANTS QUIETLY.\n'
          'AWAIT LAW ENFORCEMENT.',
      gear: [
        GearItem(icon: Icons.security_rounded, label: 'Body Armor'),
        GearItem(icon: Icons.radio_rounded, label: 'Radio Unit 03'),
        GearItem(icon: Icons.lock_rounded, label: 'Restraints'),
      ],
      primaryRoute: 'Via covered approach -> Security lobby',
      hazardAdvisory: 'Hostile party — DO NOT engage',
      populationAtRisk: '60+ AT RISK',
      aiConfidence: 'CONF: 0.86',
    ),
    'stampede': StaffCrisisProfile(
      displayName: 'Crowd Surge',
      icon: Icons.groups_rounded,
      accentColor: Color(0xFFE07A2A),
      missionDirective:
          'OPEN ALTERNATE EGRESS. CONTROL CHOKEPOINTS.\n'
          'ASSIST FALLEN GUESTS.\n'
          'PREVENT SECONDARY CRUSH EVENTS.',
      gear: [
        GearItem(icon: Icons.campaign_rounded, label: 'Megaphone'),
        GearItem(icon: Icons.radio_rounded, label: 'Radio Unit 03'),
        GearItem(icon: Icons.fence_rounded, label: 'Crowd Barriers'),
      ],
      primaryRoute: 'Via service door -> Exit B annex',
      hazardAdvisory: 'Pinch point at main exit',
      populationAtRisk: '180+ AT RISK',
      aiConfidence: 'CONF: 0.83',
    ),
    'structural': StaffCrisisProfile(
      displayName: 'Structural Hazard',
      icon: Icons.foundation_rounded,
      accentColor: Color(0xFF6B6B7B),
      missionDirective:
          'EVACUATE AFFECTED ZONE IMMEDIATELY.\n'
          'ESTABLISH EXCLUSION PERIMETER.\n'
          'AWAIT STRUCTURAL ENGINEER.',
      gear: [
        GearItem(icon: Icons.construction_rounded, label: 'Hard Hat'),
        GearItem(icon: Icons.flashlight_on_rounded, label: 'Headlamp'),
        GearItem(icon: Icons.radio_rounded, label: 'Radio Unit 03'),
      ],
      primaryRoute: 'Via stable corridor -> Outside muster point',
      hazardAdvisory: 'Avoid load-bearing walls',
      populationAtRisk: '34 AT RISK',
      aiConfidence: 'CONF: 0.79',
    ),
    'flood': StaffCrisisProfile(
      displayName: 'Flooding',
      icon: Icons.flood_rounded,
      accentColor: Color(0xFF4A90C2),
      missionDirective:
          'SHUT OFF MAIN WATER VALVE. CONTAIN SPREAD.\n'
          'EVACUATE LOWER LEVELS.\n'
          'ASSIST GUESTS TO HIGHER GROUND.',
      gear: [
        GearItem(icon: Icons.waves_rounded, label: 'Wading Boots'),
        GearItem(icon: Icons.radio_rounded, label: 'Radio Unit 03'),
        GearItem(icon: Icons.water_drop_rounded, label: 'Sandbags'),
      ],
      primaryRoute: 'Via dry stairwell -> Upper floors',
      hazardAdvisory: 'Slip hazard, electrical risk',
      populationAtRisk: '15 AT RISK',
      aiConfidence: 'CONF: 0.82',
    ),
  };

  static StaffCrisisProfile forType(String? crisisType) {
    if (crisisType == null) return _fallback;
    return _byType[crisisType.toLowerCase()] ?? _fallback;
  }
}

String severityCell(int severity) => 'SEV $severity/5';

Color severityColor(int severity) {
  if (severity >= 5) return const Color(0xFFFF3D52);
  if (severity >= 4) return const Color(0xFFFF5C67);
  if (severity >= 3) return const Color(0xFFFFAA62);
  return const Color(0xFFFFD062);
}
