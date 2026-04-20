import 'package:flutter/material.dart';

import '../models/argos_tab.dart';
import '../widgets/argos_screen_shell.dart';

class InstantSosPage extends StatelessWidget {
  const InstantSosPage({super.key, this.selectedTab = ArgosTab.status});

  final ArgosTab selectedTab;

  @override
  Widget build(BuildContext context) {
    return ArgosScreenShell(
      selectedTab: selectedTab,
      child: LayoutBuilder(
        builder: (context, constraints) {
          return SingleChildScrollView(
            physics: const BouncingScrollPhysics(
              parent: AlwaysScrollableScrollPhysics(),
            ),
            child: ConstrainedBox(
              constraints: BoxConstraints(minHeight: constraints.maxHeight),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  SizedBox(height: 2),
                  _EmergencyActivePill(),
                  SizedBox(height: 18),
                  Text(
                    'Help is on the way.',
                    style: TextStyle(
                      color: Color(0xFFEFF0F2),
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  SizedBox(height: 12),
                  Text(
                    'Emergency services and your primary\ncontacts have been notified of your\nlocation. Stay where you are if safe.',
                    style: TextStyle(
                      color: Color(0xE7DBB8B2),
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      height: 1.45,
                    ),
                  ),
                  SizedBox(height: 16),
                  _LiveGpsSharingCard(),
                  SizedBox(height: 14),
                  _CurrentLocationCard(),
                  SizedBox(height: 12),
                  _InstantActionRow(),
                  SizedBox(height: 12),
                  _StayVisibleCard(),
                  SizedBox(height: 8),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _EmergencyActivePill extends StatelessWidget {
  const _EmergencyActivePill();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF4B0E17),
        borderRadius: BorderRadius.circular(40),
      ),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.circle, size: 13, color: Color(0xFFF7A8A1)),
          SizedBox(width: 8),
          Text(
            'EMERGENCY ACTIVE',
            style: TextStyle(
              color: Color(0xFFF4B7AF),
              fontSize: 12,
              letterSpacing: 2.1,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }
}

class _LiveGpsSharingCard extends StatelessWidget {
  const _LiveGpsSharingCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 218,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(30),
        color: const Color(0xFF26252C),
      ),
      child: Stack(
        children: [
          Positioned.fill(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(30),
              child: CustomPaint(painter: _GpsMapPainter()),
            ),
          ),
          const Center(
            child: Icon(
              Icons.location_on_rounded,
              color: Color(0xFFCE2E34),
              size: 106,
            ),
          ),
          Align(
            alignment: Alignment.bottomLeft,
            child: Padding(
              padding: const EdgeInsets.only(left: 14, bottom: 14),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF47454D),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  'LIVE GPS SHARING',
                  style: TextStyle(
                    color: Color(0xFFEFBDB4),
                    fontSize: 12,
                    letterSpacing: 1.8,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _GpsMapPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final background = Paint()
      ..shader = const RadialGradient(
        center: Alignment.center,
        radius: 1.1,
        colors: [Color(0xFF38363F), Color(0xFF27262E), Color(0xFF1E1D24)],
        stops: [0, 0.6, 1],
      ).createShader(rect);
    canvas.drawRect(rect, background);

    final contourPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..color = const Color(0x66BC2C36);

    final center = size.center(Offset.zero);
    for (double r = 16; r <= size.shortestSide * 0.64; r += 16) {
      canvas.drawCircle(center, r, contourPaint);
    }

    final roadPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3
      ..color = const Color(0x77D33A43);

    canvas.drawLine(
      Offset(size.width * 0.06, size.height * 0.76),
      Offset(size.width * 0.94, size.height * 0.22),
      roadPaint,
    );
    canvas.drawLine(
      Offset(size.width * 0.15, size.height * 0.10),
      Offset(size.width * 0.92, size.height * 0.80),
      roadPaint,
    );

    final blockPaint = Paint()..color = const Color(0xAA23242A);
    for (int i = 0; i < 16; i++) {
      final x = (i % 4) * (size.width * 0.2) + 8;
      final y = (i ~/ 4) * (size.height * 0.2) + 8;
      final w = 18 + (i % 3) * 7;
      final h = 12 + (i % 2) * 10;
      canvas.drawRRect(
        RRect.fromRectAndRadius(
          Rect.fromLTWH(x, y, w.toDouble(), h.toDouble()),
          const Radius.circular(2),
        ),
        blockPaint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _CurrentLocationCard extends StatelessWidget {
  const _CurrentLocationCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2026),
        borderRadius: BorderRadius.circular(28),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Current Location',
            style: TextStyle(
              color: Color(0xFFEFEFF2),
              fontSize: 22,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            '248 Market St, San Francisco, CA',
            style: TextStyle(
              color: Color(0xFFE7BDB6),
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _ResponderBubble(
                color: const Color(0xFF4A98FF),
                icon: Icons.person_outline_rounded,
              ),
              Transform.translate(
                offset: const Offset(-8, 0),
                child: _ResponderBubble(
                  color: const Color(0xFF19C463),
                  icon: Icons.shield_outlined,
                ),
              ),
              const SizedBox(width: 4),
              const Text(
                '3 responders nearby',
                style: TextStyle(
                  color: Color(0xFFE2B6B1),
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ResponderBubble extends StatelessWidget {
  const _ResponderBubble({required this.color, required this.icon});

  final Color color;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 42,
      height: 42,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: Border.all(color: const Color(0xCC111217), width: 2),
      ),
      child: Icon(icon, color: const Color(0xFFF3F3F5), size: 20),
    );
  }
}

class _InstantActionRow extends StatelessWidget {
  const _InstantActionRow();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _InstantActionButton(
            icon: Icons.call_rounded,
            label: 'Call 911',
            onPressed: () {
              ScaffoldMessenger.of(context)
                ..hideCurrentSnackBar()
                ..showSnackBar(
                  const SnackBar(
                    content: Text('Dialing emergency services...'),
                  ),
                );
            },
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _InstantActionButton(
            icon: Icons.groups_2_outlined,
            label: 'Notify All',
            onPressed: () {
              ScaffoldMessenger.of(context)
                ..hideCurrentSnackBar()
                ..showSnackBar(
                  const SnackBar(
                    content: Text('Contacts and responders notified.'),
                  ),
                );
            },
          ),
        ),
      ],
    );
  }
}

class _InstantActionButton extends StatelessWidget {
  const _InstantActionButton({
    required this.icon,
    required this.label,
    required this.onPressed,
  });

  final IconData icon;
  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return FilledButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, size: 28),
      label: Text(label),
      style: FilledButton.styleFrom(
        backgroundColor: const Color(0xFF3A3B40),
        foregroundColor: const Color(0xFFE8E8EB),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        textStyle: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
      ),
    );
  }
}

class _StayVisibleCard extends StatelessWidget {
  const _StayVisibleCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF1F222A), Color(0xFF181A20)],
        ),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0x1AFFFFFF)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          _VisibilityBadge(),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Stay Visible',
                  style: TextStyle(
                    color: Color(0xFFEEEFF1),
                    fontSize: 21,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Your screen brightness has been\nincreased to max. Use the back\nlight if in the dark.',
                  style: TextStyle(
                    color: Color(0xFFE2BBB5),
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    height: 1.38,
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

class _VisibilityBadge extends StatelessWidget {
  const _VisibilityBadge();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 68,
      height: 68,
      decoration: BoxDecoration(
        color: const Color(0xFF2E3446),
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Icon(
        Icons.medical_information_outlined,
        color: Color(0xFF9CB6F7),
        size: 38,
      ),
    );
  }
}
