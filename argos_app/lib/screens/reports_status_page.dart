import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../models/argos_tab.dart';
import '../widgets/argos_screen_shell.dart';

class ReportsStatusPage extends StatelessWidget {
  const ReportsStatusPage({super.key, this.selectedTab = ArgosTab.reports});

  final ArgosTab selectedTab;

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
          children: const [
            SizedBox(height: 2),
            Text(
              'My Status',
              style: TextStyle(
                color: Color(0xFFF2F2F4),
                fontSize: 48,
                fontWeight: FontWeight.w800,
                height: 1,
              ),
            ),
            SizedBox(height: 10),
            Text(
              'Update your current safety state for emergency responders.',
              style: TextStyle(
                color: Color(0xFFE6BFB8),
                fontSize: 16,
                fontWeight: FontWeight.w600,
                height: 1.35,
              ),
            ),
            SizedBox(height: 18),
            _StatusCard(
              backgroundColor: Color(0xFF0CB74E),
              tileColor: Color(0xFF01A43E),
              icon: Icons.check_circle_rounded,
              iconColor: Color(0xFF013A18),
              title: 'I am safe',
              subtitle: 'All clear, no immediate danger',
              titleColor: Color(0xFF032D15),
              subtitleColor: Color(0xFF094B27),
              badgeText: 'ACTIVE CHECK-IN',
              badgeColor: Color(0xFF043317),
            ),
            SizedBox(height: 12),
            _StatusCard(
              backgroundColor: Color(0xFFFF594E),
              tileColor: Color(0xFFD94840),
              icon: Icons.wifi_tethering_rounded,
              iconColor: Color(0xFFF5F5F6),
              title: 'I need help',
              subtitle: 'Immediate emergency dispatch',
              titleColor: Color(0xFFF8F8F9),
              subtitleColor: Color(0xFFF4D6D2),
            ),
            SizedBox(height: 12),
            _StatusCard(
              backgroundColor: Color(0xFF3B3B3E),
              tileColor: Color(0xFF6B5A5D),
              icon: Icons.warning_amber_rounded,
              iconColor: Color(0xFFF6B0A8),
              title: 'I am stuck',
              subtitle: 'Require assistance, non-critical',
              titleColor: Color(0xFFE4E2E3),
              subtitleColor: Color(0xFFE2BDB8),
            ),
            SizedBox(height: 20),
            _LiveLocationSection(),
            SizedBox(height: 12),
            _MapPreviewCard(),
            SizedBox(height: 12),
            _SafetyGuidanceCard(),
            SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}

class _StatusCard extends StatelessWidget {
  const _StatusCard({
    required this.backgroundColor,
    required this.tileColor,
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.titleColor,
    required this.subtitleColor,
    this.badgeText,
    this.badgeColor,
  });

  final Color backgroundColor;
  final Color tileColor;
  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final Color titleColor;
  final Color subtitleColor;
  final String? badgeText;
  final Color? badgeColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(28),
        boxShadow: const [
          BoxShadow(
            color: Color(0x66000000),
            blurRadius: 18,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: tileColor,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(icon, color: iconColor, size: 38),
              ),
              const Spacer(),
              if (badgeText != null)
                Text(
                  badgeText!,
                  style: TextStyle(
                    color: badgeColor ?? const Color(0xFF112113),
                    fontSize: 10.5,
                    letterSpacing: 1.9,
                    fontWeight: FontWeight.w800,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 54),
          Text(
            title,
            style: TextStyle(
              color: titleColor,
              fontSize: 27,
              fontWeight: FontWeight.w800,
              height: 1,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            style: TextStyle(
              color: subtitleColor,
              fontSize: 15,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _LiveLocationSection extends StatelessWidget {
  const _LiveLocationSection();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.near_me_rounded, color: Color(0xFF8AB2FF), size: 18),
              SizedBox(width: 6),
              Text(
                'LIVE LOCATION',
                style: TextStyle(
                  color: Color(0xFFF5BDB4),
                  fontSize: 12,
                  letterSpacing: 2.2,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Text(
            '247 Harrison Street',
            style: TextStyle(
              color: Color(0xFFF1F1F3),
              fontSize: 24,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 3),
          const Text(
            'Lower East Side, Manhattan\nNew York, NY 10002',
            style: TextStyle(
              color: Color(0xFFE6C3BD),
              fontSize: 17,
              fontWeight: FontWeight.w600,
              height: 1.32,
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFF2D3444),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.gps_fixed_rounded,
                  size: 16,
                  color: Color(0xFF9BC0FF),
                ),
                SizedBox(width: 6),
                Text(
                  'GPS ACCURACY: 4M',
                  style: TextStyle(
                    color: Color(0xFF9BC0FF),
                    fontSize: 11.5,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.7,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MapPreviewCard extends StatelessWidget {
  const _MapPreviewCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 248,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        color: const Color(0xFF141418),
        boxShadow: const [
          BoxShadow(
            color: Color(0x7F000000),
            blurRadius: 24,
            offset: Offset(0, 12),
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned.fill(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: CustomPaint(painter: _MapGridPainter()),
            ),
          ),
          Center(
            child: Container(
              width: 18,
              height: 18,
              decoration: const BoxDecoration(
                color: Color(0xFFF6A49A),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Center(
            child: Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: const Color(0x44F6A49A),
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0x66FFFFFF)),
              ),
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Container(
                width: 120,
                height: 10,
                decoration: BoxDecoration(
                  color: const Color(0x66FFFFFF),
                  borderRadius: BorderRadius.circular(100),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x88FFFFFF),
                      blurRadius: 16,
                      spreadRadius: 1,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MapGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;

    final bgPaint = Paint()
      ..shader = const RadialGradient(
        center: Alignment.center,
        radius: 1.05,
        colors: [Color(0xFF2A1F1D), Color(0xFF1A1A1D), Color(0xFF121216)],
        stops: [0, 0.55, 1],
      ).createShader(rect);
    canvas.drawRect(rect, bgPaint);

    final linePaint = Paint()
      ..color = const Color(0x2FFFFFFF)
      ..strokeWidth = 1;

    const radialLines = 22;
    final center = size.center(Offset.zero);
    final radius = size.shortestSide * 0.72;

    for (var i = 0; i < radialLines; i++) {
      final angle = (2 * math.pi * i) / radialLines;
      final end = Offset(
        center.dx + radius * math.cos(angle),
        center.dy + radius * math.sin(angle),
      );
      canvas.drawLine(center, end, linePaint);
    }

    for (var r = 22.0; r <= radius; r += 16) {
      canvas.drawCircle(center, r, linePaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _SafetyGuidanceCard extends StatelessWidget {
  const _SafetyGuidanceCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 18),
      decoration: BoxDecoration(
        color: const Color(0xFF191B22),
        borderRadius: BorderRadius.circular(24),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Safety Guidance',
            style: TextStyle(
              color: Color(0xFFF0F0F2),
              fontSize: 23,
              fontWeight: FontWeight.w700,
            ),
          ),
          SizedBox(height: 14),
          _GuidanceRow(
            icon: Icons.shield_outlined,
            title: 'Emergency Contacts',
            description:
                'Your emergency contacts have\nbeen notified of your status.',
          ),
          SizedBox(height: 12),
          _GuidanceRow(
            icon: Icons.support_agent_rounded,
            title: 'Direct Line',
            description:
                'Tap and hold SOS for 3 seconds to\ncall 911 directly.',
          ),
        ],
      ),
    );
  }
}

class _GuidanceRow extends StatelessWidget {
  const _GuidanceRow({
    required this.icon,
    required this.title,
    required this.description,
  });

  final IconData icon;
  final String title;
  final String description;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: const Color(0xFF9DBDFF), size: 30),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: Color(0xFFE7E7EA),
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                description,
                style: const TextStyle(
                  color: Color(0xFFE0C1BB),
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  height: 1.35,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
