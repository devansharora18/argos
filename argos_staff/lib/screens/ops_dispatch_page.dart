import 'package:flutter/material.dart';

import '../models/staff_tab.dart';
import '../widgets/argos_screen_shell.dart';

class OpsDispatchPage extends StatelessWidget {
  const OpsDispatchPage({super.key, this.selectedTab = StaffTab.dispatch});

  final StaffTab selectedTab;

  @override
  Widget build(BuildContext context) {
    return ArgosScreenShell(
      selectedTab: selectedTab,
      showProfileInTopBar: false,
      notificationColor: const Color(0xFFFF3D52),
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(
          parent: AlwaysScrollableScrollPhysics(),
        ),
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 22),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: const [
            _DispatchAlertBanner(),
            SizedBox(height: 16),
            _IncidentHeaderCard(),
            SizedBox(height: 16),
            _MissionDirectiveCard(),
            SizedBox(height: 20),
            _BringWithYouSection(),
            SizedBox(height: 18),
            _PrimaryRouteCard(),
            SizedBox(height: 14),
            _RouteMapCard(),
            SizedBox(height: 18),
            _PrimaryActionButton(),
            SizedBox(height: 10),
            _ActionRow(),
          ],
        ),
      ),
    );
  }
}

class _DispatchAlertBanner extends StatelessWidget {
  const _DispatchAlertBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
      decoration: BoxDecoration(
        color: const Color(0xFFFF4A58),
        border: Border.all(color: const Color(0x66FFFFFF)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: const [
          Icon(Icons.warning_rounded, color: Color(0xFF4B0A0F), size: 40),
          SizedBox(width: 12),
          Expanded(
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
            '14:32:06',
            style: TextStyle(
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
}

class _IncidentHeaderCard extends StatelessWidget {
  const _IncidentHeaderCard();

  @override
  Widget build(BuildContext context) {
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
              Icons.local_fire_department_rounded,
              size: 150,
              color: const Color(0xFFFF4A58).withValues(alpha: 0.14),
            ),
          ),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              _CardAccent(color: Color(0xFFFF3D52)),
              Expanded(
                child: Padding(
                  padding: EdgeInsets.fromLTRB(14, 14, 14, 14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.local_fire_department_rounded,
                            size: 36,
                            color: Color(0xFFFF5868),
                          ),
                          SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Structural Fire',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFFEDEFF8),
                              ),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Room 312 · Floor 3 · East Wing',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFFA8AFC1),
                        ),
                      ),
                      SizedBox(height: 14),
                      Row(
                        children: [
                          Expanded(
                            child: _DataCell(
                              label: 'SEVERITY',
                              value: 'SEV 4/5',
                              valueColor: Color(0xFFFF5C67),
                            ),
                          ),
                          SizedBox(width: 6),
                          Expanded(
                            child: _DataCell(
                              label: 'POPULATION',
                              value: '47 AT RISK',
                              valueColor: Color(0xFFFFC262),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 6),
                      _DataCell(
                        label: 'AI CONFIDENCE',
                        value: 'CONF: 0.94',
                        valueColor: Color(0xFF58F78B),
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
  const _MissionDirectiveCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF111521),
        border: Border(
          left: BorderSide(color: Color(0xFFFF3D52), width: 5),
          top: BorderSide(color: Color(0xFF2A3042)),
          right: BorderSide(color: Color(0xFF2A3042)),
          bottom: BorderSide(color: Color(0xFF2A3042)),
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
        child: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'MISSION DIRECTIVE',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                letterSpacing: 2.0,
                color: Color(0xFFCBC5CE),
              ),
            ),
            SizedBox(height: 8),
            Divider(color: Color(0xFF4A4F63), thickness: 1),
            SizedBox(height: 8),
            Text(
              'IMMEDIATE RESPONSE REQUIRED. PROCEED TO\n'
              'ROOM 312 VIA AUTHORIZED ROUTE.\n'
              'SUPPRESSION PRIORITY. SECURE PERIMETER\n'
              'AND AWAIT HAZMAT TEAM ARRIVAL.',
              style: TextStyle(
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
  const _BringWithYouSection();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: const [
        Text(
          'BRING WITH YOU',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            letterSpacing: 2.2,
            color: Color(0xFFD3C7CB),
          ),
        ),
        SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            _GearChip(
              icon: Icons.fire_extinguisher_rounded,
              label: 'Fire Extinguisher',
            ),
            _GearChip(icon: Icons.radio_rounded, label: 'Radio Unit 03'),
            _GearChip(icon: Icons.shield_rounded, label: 'Protective Gear'),
          ],
        ),
      ],
    );
  }
}

class _PrimaryRouteCard extends StatelessWidget {
  const _PrimaryRouteCard();

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
        children: const [
          Text(
            'PRIMARY ROUTE',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              letterSpacing: 2.0,
              color: Color(0xFFD6CBD0),
            ),
          ),
          SizedBox(height: 10),
          Text(
            'Via East Corridor -> Stairwell C',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: Color(0xFF58F58C),
            ),
          ),
          SizedBox(height: 12),
          _HazardAdvisory(),
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
  const _HazardAdvisory();

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
      child: const Padding(
        padding: EdgeInsets.fromLTRB(10, 8, 10, 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
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
            SizedBox(height: 1),
            Text(
              'Stairwell A BLOCKED',
              style: TextStyle(
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
