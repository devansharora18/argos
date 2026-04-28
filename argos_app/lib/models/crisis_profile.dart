import 'package:flutter/material.dart';

/// Visual + copy variant per crisis type for the guest app's alert screen.
class GuestCrisisProfile {
  const GuestCrisisProfile({
    required this.displayName,
    required this.subtitle,
    required this.heroIcon,
    required this.heroColor,
    required this.heroShadowColor,
    required this.actionLabel,
    required this.actionIcon,
    required this.actionAccentColor,
  });

  final String displayName;
  final String subtitle;
  final IconData heroIcon;
  final Color heroColor;
  final Color heroShadowColor;
  final String actionLabel;
  final IconData actionIcon;
  final Color actionAccentColor;

  static const _fallback = GuestCrisisProfile(
    displayName: 'Emergency',
    subtitle: 'Follow staff guidance immediately',
    heroIcon: Icons.warning_rounded,
    heroColor: Color(0xFFFF5A50),
    heroShadowColor: Color(0xA1FF4A45),
    actionLabel: 'Follow\nStaff',
    actionIcon: Icons.assistant_direction_rounded,
    actionAccentColor: Color(0xFFFF6256),
  );

  static const Map<String, GuestCrisisProfile> _byType = {
    'fire': GuestCrisisProfile(
      displayName: 'Fire',
      subtitle: 'Critical danger in your area',
      heroIcon: Icons.local_fire_department_rounded,
      heroColor: Color(0xFFFF5A50),
      heroShadowColor: Color(0xA1FF4A45),
      actionLabel: 'Evacuate\nNow',
      actionIcon: Icons.directions_run_rounded,
      actionAccentColor: Color(0xFFFF6256),
    ),
    'smoke': GuestCrisisProfile(
      displayName: 'Smoke',
      subtitle: 'Smoke detected — stay low and exit',
      heroIcon: Icons.cloud_rounded,
      heroColor: Color(0xFFB97052),
      heroShadowColor: Color(0xA1B97052),
      actionLabel: 'Stay Low\nExit Fast',
      actionIcon: Icons.south_east_rounded,
      actionAccentColor: Color(0xFFFFB58A),
    ),
    'medical': GuestCrisisProfile(
      displayName: 'Medical',
      subtitle: 'Medical emergency in progress',
      heroIcon: Icons.medical_services_rounded,
      heroColor: Color(0xFFE04A6B),
      heroShadowColor: Color(0xA1E04A6B),
      actionLabel: 'Give Space\nWait',
      actionIcon: Icons.front_hand_rounded,
      actionAccentColor: Color(0xFFFFB0BD),
    ),
    'security': GuestCrisisProfile(
      displayName: 'Security Threat',
      subtitle: 'Security incident — shelter in place',
      heroIcon: Icons.shield_rounded,
      heroColor: Color(0xFF8B3A3A),
      heroShadowColor: Color(0xA18B3A3A),
      actionLabel: 'Lock Door\nStay Quiet',
      actionIcon: Icons.lock_rounded,
      actionAccentColor: Color(0xFFFFB1A8),
    ),
    'stampede': GuestCrisisProfile(
      displayName: 'Crowd Surge',
      subtitle: 'Stay clear of crowd pinch points',
      heroIcon: Icons.groups_rounded,
      heroColor: Color(0xFFE07A2A),
      heroShadowColor: Color(0xA1E07A2A),
      actionLabel: 'Move Away\nFrom Crowd',
      actionIcon: Icons.swap_horiz_rounded,
      actionAccentColor: Color(0xFFFFC07A),
    ),
    'structural': GuestCrisisProfile(
      displayName: 'Structural Hazard',
      subtitle: 'Structural integrity compromised',
      heroIcon: Icons.foundation_rounded,
      heroColor: Color(0xFF6B6B7B),
      heroShadowColor: Color(0xA16B6B7B),
      actionLabel: 'Evacuate\nBuilding',
      actionIcon: Icons.exit_to_app_rounded,
      actionAccentColor: Color(0xFFD2D5E0),
    ),
    'flood': GuestCrisisProfile(
      displayName: 'Flash Flood',
      subtitle: 'Rising water — move to higher ground',
      heroIcon: Icons.flood_rounded,
      heroColor: Color(0xFF4A90C2),
      heroShadowColor: Color(0xA14A90C2),
      actionLabel: 'Higher\nGround',
      actionIcon: Icons.north_rounded,
      actionAccentColor: Color(0xFF8FCEFF),
    ),
  };

  static GuestCrisisProfile forType(String? crisisType) {
    if (crisisType == null) return _fallback;
    return _byType[crisisType.toLowerCase()] ?? _fallback;
  }
}

String severityLabel(int severity) {
  switch (severity) {
    case 5:
      return 'Critical';
    case 4:
      return 'Severe';
    case 3:
      return 'High';
    case 2:
      return 'Moderate';
    case 1:
      return 'Low';
    default:
      return 'Unknown';
  }
}

String etaForSeverity(int severity) {
  switch (severity) {
    case 5:
      return '5 Mins';
    case 4:
      return '8 Mins';
    case 3:
      return '12 Mins';
    case 2:
      return '18 Mins';
    case 1:
      return '25 Mins';
    default:
      return '— Mins';
  }
}

Color severityColor(int severity) {
  if (severity >= 5) return const Color(0xFFFF6256);
  if (severity >= 4) return const Color(0xFFF3A6A0);
  if (severity >= 3) return const Color(0xFFFFC56B);
  if (severity >= 2) return const Color(0xFFFFE08A);
  return const Color(0xFFB6E0A4);
}
