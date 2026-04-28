import 'package:flutter/material.dart';

import '../models/crisis_profile.dart';
import '../models/staff_tab.dart';
import '../services/crisis_stream_service.dart';
import '../widgets/argos_screen_shell.dart';

class OpsDispatchPage extends StatelessWidget {
  const OpsDispatchPage({super.key, this.selectedTab = StaffTab.dispatch});

  final StaffTab selectedTab;

  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)?.settings.arguments;
    final crisis = args is IncomingCrisis ? args : null;
    final profile = StaffCrisisProfile.forType(crisis?.crisisType);

    return ArgosScreenShell(
      selectedTab: selectedTab,
      showProfileInTopBar: false,
      notificationColor: profile.accentColor,
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(
          parent: AlwaysScrollableScrollPhysics(),
        ),
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 22),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _DispatchAlertBanner(crisis: crisis, profile: profile),
            const SizedBox(height: 16),
            _IncidentHeaderCard(crisis: crisis, profile: profile),
            const SizedBox(height: 16),
            _MissionDirectiveCard(profile: profile),
            const SizedBox(height: 20),
            _BringWithYouSection(profile: profile),
            const SizedBox(height: 18),
            _PrimaryRouteCard(profile: profile),
            const SizedBox(height: 14),
            const _RouteMapCard(),
            const SizedBox(height: 18),
            const _PrimaryActionButton(),
            const SizedBox(height: 10),
            const _ActionRow(),
          ],
        ),
      ),
    );
  }
}

class _DispatchAlertBanner extends StatelessWidget {
  const _DispatchAlertBanner({required this.crisis, required this.profile});

  final IncomingCrisis? crisis;
  final StaffCrisisProfile profile;

  @override
  Widget build(BuildContext context) {
    final time = crisis?.detectedAt ?? DateTime.now();
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
      decoration: BoxDecoration(
        color: profile.accentColor,
        border: Border.all(color: const Color(0x66FFFFFF)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Icon(Icons.warning_rounded, color: Color(0xFF4B0A0F), size: 40),
          const SizedBox(width: 12),
          const Expanded(
            child: Text(
              'DISPATCH\nRECEIVED',
              style: TextStyle(
                height: 0.98,
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: Color(0xFF3D050C),
              ),
            ),
          ),
          Text(
            _formatTime(time),
            style: const TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.4,
              color: Color(0xFF4A0E15),
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime t) {
    final hh = t.hour.toString().padLeft(2, '0');
    final mm = t.minute.toString().padLeft(2, '0');
    final ss = t.second.toString().padLeft(2, '0');
    return '$hh:$mm:$ss';
  }
}

class _IncidentHeaderCard extends StatelessWidget {
  const _IncidentHeaderCard({required this.crisis, required this.profile});

  final IncomingCrisis? crisis;
  final StaffCrisisProfile profile;

  @override
  Widget build(BuildContext context) {
    final severity = crisis?.severity ?? 4;
    final zone = crisis?.zone ?? 'Awaiting location';
    final floor = crisis?.floor;

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF121622),
        border: Border.all(color: const Color(0xFF2B3042)),
      ),
      child: Stack(
        children: [
          Positioned(
            right: -26,
            top: -16,
            child: Icon(
              profile.icon,
              size: 150,
              color: profile.accentColor.withValues(alpha: 0.14),
            ),
          ),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _CardAccent(color: profile.accentColor),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            profile.icon,
                            size: 36,
                            color: profile.accentColor,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              profile.displayName,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFFEDEFF8),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        floor != null ? '$zone · Floor $floor' : zone,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFFA8AFC1),
                        ),
                      ),
                      if (crisis?.description.isNotEmpty ?? false) ...[
                        const SizedBox(height: 6),
                        Text(
                          crisis!.description,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            height: 1.4,
                            color: Color(0xFFB7BDD0),
                          ),
                        ),
                      ],
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          Expanded(
                            child: _DataCell(
                              label: 'SEVERITY',
                              value: severityCell(severity),
                              valueColor: severityColor(severity),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _DataCell(
                              label: 'POPULATION',
                              value: profile.populationAtRisk,
                              valueColor: const Color(0xFFFFC262),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      _DataCell(
                        label: 'AI CONFIDENCE',
                        value: profile.aiConfidence,
                        valueColor: const Color(0xFF58F78B),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _MissionDirectiveCard extends StatelessWidget {
  const _MissionDirectiveCard({required this.profile});

  final StaffCrisisProfile profile;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF111521),
        border: Border(
          left: BorderSide(color: profile.accentColor, width: 5),
          top: const BorderSide(color: Color(0xFF2A3042)),
          right: const BorderSide(color: Color(0xFF2A3042)),
          bottom: const BorderSide(color: Color(0xFF2A3042)),
        ),
      ),
      child: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF30333D), Color(0x00111521)],
            stops: [0, 0.23],
          ),
        ),
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'MISSION DIRECTIVE',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                letterSpacing: 2.0,
                color: Color(0xFFCBC5CE),
              ),
            ),
            const SizedBox(height: 8),
            const Divider(color: Color(0xFF4A4F63), thickness: 1),
            const SizedBox(height: 8),
            Text(
              profile.missionDirective,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                height: 1.45,
                letterSpacing: 0.8,
                color: Color(0xFFE1D7DA),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BringWithYouSection extends StatelessWidget {
  const _BringWithYouSection({required this.profile});

  final StaffCrisisProfile profile;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'BRING WITH YOU',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            letterSpacing: 2.2,
            color: Color(0xFFD3C7CB),
          ),
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final item in profile.gear)
              _GearChip(icon: item.icon, label: item.label),
          ],
        ),
      ],
    );
  }
}

class _PrimaryRouteCard extends StatelessWidget {
  const _PrimaryRouteCard({required this.profile});

  final StaffCrisisProfile profile;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
      decoration: BoxDecoration(
        color: const Color(0xFF121622),
        border: Border.all(color: const Color(0xFF2A3042)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'PRIMARY ROUTE',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              letterSpacing: 2.0,
              color: Color(0xFFD6CBD0),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            profile.primaryRoute,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: Color(0xFF58F58C),
            ),
          ),
          const SizedBox(height: 12),
          _HazardAdvisory(advisory: profile.hazardAdvisory),
        ],
      ),
    );
  }
}

class _RouteMapCard extends StatelessWidget {
  const _RouteMapCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 150,
      decoration: BoxDecoration(
        color: const Color(0xFF373D49),
        border: Border.all(color: const Color(0xFF4A5061)),
      ),
      child: CustomPaint(painter: _DispatchRouteMapPainter()),
    );
  }
}

class _PrimaryActionButton extends StatelessWidget {
  const _PrimaryActionButton();

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Status updated: EN ROUTE'),
              duration: Duration(milliseconds: 1300),
            ),
          );
        },
        child: Container(
          height: 72,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: const Color(0xFF07BF54),
            borderRadius: BorderRadius.circular(3),
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.directions_run_rounded,
                color: Color(0xFF082916),
                size: 30,
              ),
              SizedBox(width: 8),
              Text(
                'EN ROUTE',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2.2,
                  color: Color(0xFF082916),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ActionRow extends StatelessWidget {
  const _ActionRow();

  @override
  Widget build(BuildContext context) {
    return const Row(
      children: [
        Expanded(
          child: _SecondaryActionButton(
            label: 'ON SCENE',
            color: Color(0xFFD7CDD0),
          ),
        ),
        SizedBox(width: 8),
        Expanded(
          child: _SecondaryActionButton(
            label: 'NEED HELP',
            color: Color(0xFFFFC45D),
          ),
        ),
        SizedBox(width: 8),
        Expanded(
          child: _SecondaryActionButton(
            label: 'DECLINE',
            color: Color(0xFFC6B3BB),
          ),
        ),
      ],
    );
  }
}

class _CardAccent extends StatelessWidget {
  const _CardAccent({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(width: 5, color: color);
  }
}

class _DataCell extends StatelessWidget {
  const _DataCell({
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
      padding: const EdgeInsets.fromLTRB(10, 8, 10, 8),
      decoration: BoxDecoration(
        color: const Color(0x44261310),
        border: Border.all(color: const Color(0x553A3341)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 2.0,
              color: Color(0xFFCABCC0),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w800,
              color: valueColor,
            ),
          ),
        ],
      ),
    );
  }
}

class _GearChip extends StatelessWidget {
  const _GearChip({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 7),
      decoration: BoxDecoration(
        color: const Color(0x33281612),
        border: Border.all(color: const Color(0x774D404E)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 18, color: const Color(0xFFFFC26F)),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w800,
              color: Color(0xFFDCCED3),
            ),
          ),
        ],
      ),
    );
  }
}

class _HazardAdvisory extends StatelessWidget {
  const _HazardAdvisory({required this.advisory});

  final String advisory;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0x4C452E28),
        border: Border(
          left: BorderSide(color: Color(0xFFFFC35E), width: 4),
          top: BorderSide(color: Color(0x663A313D)),
          right: BorderSide(color: Color(0x663A313D)),
          bottom: BorderSide(color: Color(0x663A313D)),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(10, 8, 10, 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(
                  Icons.warning_amber_rounded,
                  size: 19,
                  color: Color(0xFFFFC35E),
                ),
                SizedBox(width: 6),
                Text(
                  'HAZARD ADVISORY',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.4,
                    color: Color(0xFFFFC35E),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 1),
            Text(
              advisory,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w800,
                color: Color(0xFFE9DDE0),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SecondaryActionButton extends StatelessWidget {
  const _SecondaryActionButton({required this.label, required this.color});

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Action selected: $label')));
        },
        child: Container(
          height: 44,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: const Color(0xFF121622),
            borderRadius: BorderRadius.circular(2),
            border: Border.all(color: const Color(0xFF434A5D)),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.4,
              color: color,
            ),
          ),
        ),
      ),
    );
  }
}

class _DispatchRouteMapPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final bgPaint = Paint()..color = const Color(0xFF4B515D);
    canvas.drawRect(Offset.zero & size, bgPaint);

    final blueprintPaint = Paint()
      ..color = const Color(0x66B1BAC9)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.6;
    for (double x = 12; x < size.width; x += 23) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), blueprintPaint);
    }
    for (double y = 10; y < size.height; y += 20) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), blueprintPaint);
    }

    final noisePaint = Paint()
      ..color = const Color(0x334A5668)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    final noisePath = Path();
    noisePath.moveTo(size.width * 0.08, size.height * 0.76);
    noisePath.lineTo(size.width * 0.18, size.height * 0.56);
    noisePath.lineTo(size.width * 0.24, size.height * 0.62);
    noisePath.lineTo(size.width * 0.44, size.height * 0.32);
    noisePath.lineTo(size.width * 0.55, size.height * 0.44);
    noisePath.lineTo(size.width * 0.74, size.height * 0.26);
    canvas.drawPath(noisePath, noisePaint);

    final routePaint = Paint()
      ..color = const Color(0xFF50EB84)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 5
      ..strokeCap = StrokeCap.round;
    _drawDashedLine(
      canvas,
      Offset(size.width * 0.1, size.height * 0.74),
      Offset(size.width * 0.4, size.height * 0.74),
      routePaint,
    );
    _drawDashedLine(
      canvas,
      Offset(size.width * 0.4, size.height * 0.74),
      Offset(size.width * 0.4, size.height * 0.42),
      routePaint,
    );
    _drawDashedLine(
      canvas,
      Offset(size.width * 0.4, size.height * 0.42),
      Offset(size.width * 0.8, size.height * 0.42),
      routePaint,
    );
    _drawDashedLine(
      canvas,
      Offset(size.width * 0.8, size.height * 0.42),
      Offset(size.width * 0.8, size.height * 0.24),
      routePaint,
    );

    final startPaint = Paint()..color = const Color(0xFF44E57A);
    final endPaint = Paint()..color = const Color(0xFFFF434E);
    canvas.drawCircle(
      Offset(size.width * 0.1, size.height * 0.74),
      9,
      startPaint,
    );
    canvas.drawCircle(
      Offset(size.width * 0.8, size.height * 0.24),
      11,
      endPaint,
    );

    final cornerPaint = Paint()..color = const Color(0x88212735);
    final cornerPath = Path()
      ..moveTo(0, size.height)
      ..lineTo(size.width * 0.06, size.height)
      ..lineTo(0, size.height * 0.88)
      ..close();
    canvas.drawPath(cornerPath, cornerPaint);
  }

  void _drawDashedLine(Canvas canvas, Offset p1, Offset p2, Paint paint) {
    const dash = 13.0;
    const gap = 8.0;
    final total = (p2 - p1).distance;
    final direction = (p2 - p1) / total;
    double distance = 0;

    while (distance < total) {
      final start = p1 + direction * distance;
      final end = p1 + direction * (distance + dash).clamp(0, total).toDouble();
      canvas.drawLine(start, end, paint);
      distance += dash + gap;
    }
  }

  @override
  bool shouldRepaint(covariant _DispatchRouteMapPainter oldDelegate) => false;
}
