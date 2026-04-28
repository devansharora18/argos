import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../models/argos_tab.dart';
import '../screens/crisis_result_page.dart';
import '../widgets/argos_screen_shell.dart';

// ---------------------------------------------------------------------------
// Report texts sent to HAVEN for each keyword card tap.
// Realistic enough for Gemini to classify accurately.
// ---------------------------------------------------------------------------
const _kReportTexts = {
  'Medical':
      'Guest has collapsed and is unresponsive near the pool area. Bystanders attempting CPR. Requires immediate medical attention.',
  'Police':
      'Violent altercation in progress at the main lobby. One person may have a weapon. Situation is escalating rapidly.',
  'Fire':
      'Heavy smoke visible from the kitchen area. Fire alarm triggered on floor 3. Multiple guests evacuating. Smell of burning.',
  'Accident':
      'Vehicle accident with possible injuries reported at the main entrance. Multiple people involved. Emergency response needed immediately.',
  'Rescue':
      'Person is trapped under debris in Corridor A following a partial ceiling collapse. Structural cracking still audible.',
  'Other':
      'Safety hazard reported in the venue. Requires immediate inspection and response by security personnel.',
};

class KeywordReportingPage extends StatelessWidget {
  const KeywordReportingPage({super.key, this.selectedTab = ArgosTab.status});

  final ArgosTab selectedTab;

  void _navigate(BuildContext context, String keyword) {
    final reportText = _kReportTexts[keyword] ?? keyword;
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => CrisisResultPage(reportText: reportText),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ArgosScreenShell(
      selectedTab: selectedTab,
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(
          parent: AlwaysScrollableScrollPhysics(),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            const _KeywordHeader(),
            const SizedBox(height: 20),
            _PrimaryEmergencyCard(onTap: () => _navigate(context, 'Medical')),
            const SizedBox(height: 12),
            _EmergencyGrid(onTap: (kw) => _navigate(context, kw)),
            const SizedBox(height: 12),
            _OtherHazardCard(onTap: () => _navigate(context, 'Other')),
            const SizedBox(height: 14),
            const _TrackingOverviewCard(),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}

class _KeywordHeader extends StatelessWidget {
  const _KeywordHeader();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RichText(
          text: const TextSpan(
            style: TextStyle(
              fontSize: 47,
              fontWeight: FontWeight.w800,
              height: 1.02,
            ),
            children: [
              TextSpan(
                text: 'Report an\n',
                style: TextStyle(color: Color(0xFFF2F2F3)),
              ),
              TextSpan(
                text: 'Emergency',
                style: TextStyle(color: Color(0xFFFF5A4D)),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        const Text(
          'Select the type of assistance you need.\nHelp will be dispatched to your current\nlocation immediately.',
          style: TextStyle(
            color: Color(0xFFE8C2BB),
            fontSize: 16,
            fontWeight: FontWeight.w600,
            height: 1.42,
          ),
        ),
      ],
    );
  }
}

class _PrimaryEmergencyCard extends StatelessWidget {
  const _PrimaryEmergencyCard({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
      width: double.infinity,
      height: 170,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(34),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFFF5A53), Color(0xFFD31D29), Color(0xFFBA0916)],
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x88E62B33),
            blurRadius: 24,
            offset: Offset(0, 10),
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned(
            right: 18,
            top: 22,
            child: Icon(
              Icons.medical_services_rounded,
              color: const Color(0x33FFFFFF),
              size: 96,
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Icon(
                  Icons.medical_services_rounded,
                  color: Color(0xFFF7F7F8),
                  size: 40,
                ),
                Spacer(),
                Text(
                  'Medical',
                  style: TextStyle(
                    color: Color(0xFFF8F8F9),
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'Ambulance & Paramedics',
                  style: TextStyle(
                    color: Color(0xFFF7D7D3),
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ), // Container
    ); // GestureDetector
  }
}

class _EmergencyGrid extends StatelessWidget {
  const _EmergencyGrid({required this.onTap});

  final void Function(String keyword) onTap;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _EmergencyTypeCard(
                icon: Icons.security_rounded,
                iconColor: const Color(0xFFA7BFFF),
                title: 'Police',
                subtitle: 'Security & Safety',
                onTap: () => onTap('Police'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _EmergencyTypeCard(
                icon: Icons.local_fire_department_rounded,
                iconColor: const Color(0xFFF3B3A8),
                title: 'Fire',
                subtitle: 'Active\nfire/smoke',
                onTap: () => onTap('Fire'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _EmergencyTypeCard(
                icon: Icons.car_crash_rounded,
                iconColor: const Color(0xFF53E677),
                title: 'Accident',
                subtitle: 'Road & Vehicle',
                onTap: () => onTap('Accident'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _EmergencyTypeCard(
                icon: Icons.ac_unit_rounded,
                iconColor: const Color(0xFF4987FF),
                title: 'Rescue',
                subtitle: 'Entrapment/Search',
                onTap: () => onTap('Rescue'),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _EmergencyTypeCard extends StatelessWidget {
  const _EmergencyTypeCard({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 154,
        padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
        decoration: BoxDecoration(
          color: const Color(0xFF3B3B3E),
          borderRadius: BorderRadius.circular(30),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: iconColor, size: 34),
            const Spacer(),
            Text(
              title,
              style: const TextStyle(
                color: Color(0xFFE8E8EA),
                fontSize: 21,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: const TextStyle(
                color: Color(0xFFE2BBB5),
                fontSize: 13,
                fontWeight: FontWeight.w600,
                height: 1.3,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OtherHazardCard extends StatelessWidget {
  const _OtherHazardCard({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.fromLTRB(14, 18, 14, 18),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF2F3136), Color(0xFF292A30)],
          ),
          borderRadius: BorderRadius.circular(28),
        ),
        child: Row(
          children: const [
            Icon(Icons.warning_rounded, color: Color(0xFFBF9C9B), size: 44),
            SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Other',
                  style: TextStyle(
                    color: Color(0xFFE7E7E9),
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'Safety Hazard',
                  style: TextStyle(
                    color: Color(0xFFE3BBB5),
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _TrackingOverviewCard extends StatelessWidget {
  const _TrackingOverviewCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 18),
      decoration: BoxDecoration(
        color: const Color(0xFF2B2D33),
        borderRadius: BorderRadius.circular(30),
        boxShadow: const [
          BoxShadow(
            color: Color(0x6D000000),
            blurRadius: 24,
            offset: Offset(0, 12),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            width: double.infinity,
            height: 170,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(22),
              gradient: const RadialGradient(
                center: Alignment(0, 0.2),
                radius: 1.15,
                colors: [
                  Color(0xFF2E8A86),
                  Color(0xFF176B6F),
                  Color(0xFF124B50),
                ],
                stops: [0, 0.65, 1],
              ),
            ),
            child: Stack(
              children: [
                Positioned.fill(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(22),
                    child: CustomPaint(painter: _TrackingPatternPainter()),
                  ),
                ),
                const Align(
                  alignment: Alignment.bottomLeft,
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(18, 0, 18, 14),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.circle, color: Color(0xFF56E47B), size: 14),
                        SizedBox(width: 8),
                        Text(
                          'ACTIVE TRACKING',
                          style: TextStyle(
                            color: Color(0xFFEAF4F2),
                            fontSize: 12,
                            letterSpacing: 2.0,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Everything looks clear',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Color(0xFFEDEDF0),
              fontSize: 27,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'You are currently in a high-safety\nzone. No active alerts reported in\nthe last 15 minutes near your\nvicinity.',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Color(0xFFE4C0BA),
              fontSize: 16,
              fontWeight: FontWeight.w600,
              height: 1.34,
            ),
          ),
          const SizedBox(height: 10),
          const Text(
            '0.0km',
            style: TextStyle(
              color: Color(0xFF56E47B),
              fontSize: 35,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 2),
          const Text(
            'NEAREST THREAT',
            style: TextStyle(
              color: Color(0xFFE7C4BD),
              fontSize: 12,
              letterSpacing: 2.8,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

class _TrackingPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final linePaint = Paint()
      ..color = const Color(0x1FFFFFFF)
      ..strokeWidth = 1;

    for (double x = -size.width; x < size.width * 2; x += 18) {
      canvas.drawLine(
        Offset(x, 0),
        Offset(x - size.height, size.height),
        linePaint,
      );
    }

    final radialPaint = Paint()
      ..style = PaintingStyle.stroke
      ..color = const Color(0x1FFFFFFF)
      ..strokeWidth = 1;

    final center = size.center(Offset.zero);
    final maxRadius = math.min(size.width, size.height) * 0.9;
    for (double r = 20; r <= maxRadius; r += 14) {
      canvas.drawCircle(center, r, radialPaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
