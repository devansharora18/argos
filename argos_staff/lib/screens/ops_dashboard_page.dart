import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/staff_tab.dart';
import '../providers/ops_status_provider.dart';
import '../widgets/argos_screen_shell.dart';

class OpsDashboardPage extends ConsumerWidget {
  const OpsDashboardPage({super.key, this.selectedTab = StaffTab.dashboard});

  final StaffTab selectedTab;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final onShift = ref.watch(onShiftProvider);

    return ArgosScreenShell(
      selectedTab: selectedTab,
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(18, 18, 18, 22),
        physics: const BouncingScrollPhysics(
          parent: AlwaysScrollableScrollPhysics(),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Good afternoon, John D.',
              style: TextStyle(
                fontSize: 21,
                fontWeight: FontWeight.w800,
                color: Color(0xFFF4F6FB),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'FIRE MARSHAL  -  FLOOR 2',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.4,
                color: Color(0xFF7B8090),
              ),
            ),
            const SizedBox(height: 20),
            _OnShiftCard(
              onShift: onShift,
              onToggle: () =>
                  ref.read(onShiftProvider.notifier).state = !onShift,
            ),
            const SizedBox(height: 16),
            const _AssignmentCard(),
            const SizedBox(height: 16),
            const _MetricCard(
              label: 'RESPONSES TODAY',
              value: '3',
              valueColor: Color(0xFFF0F3FA),
            ),
            const SizedBox(height: 10),
            const _MetricCard(
              label: 'CURRENT GRADE',
              value: 'A',
              valueColor: Color(0xFFFFC066),
            ),
            const SizedBox(height: 10),
            const _MetricCard(
              label: 'ACTIVE INCIDENTS',
              value: '2',
              valueColor: Color(0xFFFF4E60),
            ),
            const SizedBox(height: 24),
            const Text(
              'LIVE INCIDENT FEED',
              style: TextStyle(
                fontSize: 19,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.6,
                color: Color(0xFFF0F2F8),
              ),
            ),
            const SizedBox(height: 14),
            const _IncidentCard(
              title: 'Structural Fire',
              location: 'Floor 3, Room 312',
              severity: 'SEV 4',
              accent: Color(0xFFFF3F54),
              badgeBorder: Color(0xFFFF4D61),
              badgeBackground: Color(0x33FF4D61),
            ),
            const SizedBox(height: 12),
            const _IncidentCard(
              title: 'Crowd Density',
              location: 'Lobby, West Entrance',
              severity: 'SEV 2',
              accent: Color(0xFFFFBA57),
              badgeBorder: Color(0xFFFFBE66),
              badgeBackground: Color(0x33FFC061),
            ),
          ],
        ),
      ),
    );
  }
}

class _OnShiftCard extends StatelessWidget {
  const _OnShiftCard({required this.onShift, required this.onToggle});

  final bool onShift;
  final VoidCallback onToggle;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0xFF111521),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: onShift ? const Color(0xFF31E07D) : const Color(0xFF51596D),
          width: 2,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 16,
            height: 16,
            decoration: const BoxDecoration(
              color: Color(0xFF31E07D),
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 12),
          Text(
            onShift ? 'ON SHIFT' : 'OFF SHIFT',
            style: TextStyle(
              fontSize: 23,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.6,
              color: onShift
                  ? const Color(0xFF38E785)
                  : const Color(0xFF98A0B3),
            ),
          ),
          const Spacer(),
          _ShiftToggle(onShift: onShift, onToggle: onToggle),
        ],
      ),
    );
  }
}

class _ShiftToggle extends StatelessWidget {
  const _ShiftToggle({required this.onShift, required this.onToggle});

  final bool onShift;
  final VoidCallback onToggle;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(40),
        onTap: onToggle,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          curve: Curves.easeOut,
          width: 116,
          height: 62,
          padding: const EdgeInsets.all(7),
          decoration: BoxDecoration(
            color: onShift ? const Color(0xFF46DD78) : const Color(0xFF7D8394),
            borderRadius: BorderRadius.circular(40),
          ),
          child: AnimatedAlign(
            duration: const Duration(milliseconds: 180),
            curve: Curves.easeOut,
            alignment: onShift ? Alignment.centerRight : Alignment.centerLeft,
            child: Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                color: onShift
                    ? const Color(0xFF2A080E)
                    : const Color(0xFFD0D5E1),
                shape: BoxShape.circle,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _AssignmentCard extends StatelessWidget {
  const _AssignmentCard();

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: const _DashedBorderPainter(),
      child: Container(
        height: 196,
        color: const Color(0xFF070A14),
        alignment: Alignment.center,
        child: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.hourglass_empty_rounded,
              size: 58,
              color: Color(0xFF767D8B),
            ),
            SizedBox(height: 12),
            Text(
              'No active assignment. Standing by.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.5,
                color: Color(0xFF8A909C),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.label,
    required this.value,
    required this.valueColor,
  });

  final String label;
  final String value;
  final Color valueColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 18),
      decoration: BoxDecoration(
        color: const Color(0xFF131623),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFF282F41)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              letterSpacing: 2.2,
              color: Color(0xFF8D93A2),
            ),
          ),
          const SizedBox(height: 14),
          Text(
            value,
            style: TextStyle(
              fontSize: 45,
              fontWeight: FontWeight.w800,
              color: valueColor,
            ),
          ),
        ],
      ),
    );
  }
}

class _IncidentCard extends StatelessWidget {
  const _IncidentCard({
    required this.title,
    required this.location,
    required this.severity,
    required this.accent,
    required this.badgeBorder,
    required this.badgeBackground,
  });

  final String title;
  final String location;
  final String severity;
  final Color accent;
  final Color badgeBorder;
  final Color badgeBackground;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF141823),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFF2A3144)),
      ),
      child: Row(
        children: [
          Container(
            width: 6,
            height: 130,
            decoration: BoxDecoration(
              color: accent,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(8),
                bottomLeft: Radius.circular(8),
              ),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 14, 14, 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 21,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFFF1F4FB),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    location,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF8E95A6),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: badgeBackground,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: badgeBorder),
                    ),
                    child: Text(
                      severity,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.2,
                        color: badgeBorder,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _DashedBorderPainter extends CustomPainter {
  const _DashedBorderPainter();

  static const double _dashWidth = 10;
  static const double _dashSpace = 7;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0x4A8A93A4)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    _drawHorizontal(canvas, paint, 1, size.width - 1);
    _drawHorizontal(canvas, paint, size.height - 1, size.width - 1);
    _drawVertical(canvas, paint, 1, size.height - 1);
    _drawVertical(canvas, paint, size.width - 1, size.height - 1);
  }

  void _drawHorizontal(Canvas canvas, Paint paint, double y, double width) {
    double x = 1;
    while (x < width) {
      final endX = (x + _dashWidth).clamp(0, width).toDouble();
      canvas.drawLine(Offset(x, y), Offset(endX, y), paint);
      x += _dashWidth + _dashSpace;
    }
  }

  void _drawVertical(Canvas canvas, Paint paint, double x, double height) {
    double y = 1;
    while (y < height) {
      final endY = (y + _dashWidth).clamp(0, height).toDouble();
      canvas.drawLine(Offset(x, y), Offset(x, endY), paint);
      y += _dashWidth + _dashSpace;
    }
  }

  @override
  bool shouldRepaint(covariant _DashedBorderPainter oldDelegate) => false;
}
