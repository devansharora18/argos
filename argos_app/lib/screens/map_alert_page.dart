import 'package:flutter/material.dart';

import '../models/argos_tab.dart';
import '../widgets/argos_screen_shell.dart';

class MapAlertPage extends StatelessWidget {
  const MapAlertPage({super.key, this.selectedTab = ArgosTab.map});

  final ArgosTab selectedTab;

  @override
  Widget build(BuildContext context) {
    return ArgosScreenShell(
      selectedTab: selectedTab,
      child: LayoutBuilder(
        builder: (context, constraints) {
          return Container(
            decoration: const BoxDecoration(
              gradient: RadialGradient(
                center: Alignment(0.1, -0.3),
                radius: 1.2,
                colors: [
                  Color(0x1A426FC7),
                  Color(0x1213161E),
                  Color(0x00131313),
                ],
                stops: [0, 0.58, 1],
              ),
            ),
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(
                parent: AlwaysScrollableScrollPhysics(),
              ),
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SizedBox(height: 6),
                    Stack(
                      clipBehavior: Clip.none,
                      children: [
                        const _EmergencyAlertCard(),
                        Positioned(
                          left: 20,
                          right: 20,
                          bottom: -52,
                          child: _ImmediateActionCard(
                            onPressed: () {
                              ScaffoldMessenger.of(context)
                                ..hideCurrentSnackBar()
                                ..showSnackBar(
                                  const SnackBar(
                                    content: Text(
                                      'Navigation set to evacuation route.',
                                    ),
                                  ),
                                );
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 74),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 10),
                      child: Row(
                        children: [
                          Expanded(
                            child: _AlertMetric(
                              label: 'ETA TO ZONE',
                              value: '12 Mins',
                              valueColor: Color(0xFFF1F2F3),
                            ),
                          ),
                          SizedBox(width: 12),
                          Expanded(
                            child: _AlertMetric(
                              label: 'RISK LEVEL',
                              value: 'Severe',
                              valueColor: Color(0xFFF3A6A0),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 26),
                    _MapActionButton(
                      label: 'View Map',
                      icon: Icons.map_outlined,
                      backgroundColor: const Color(0xFF528AE8),
                      foregroundColor: const Color(0xFF052F73),
                      glowColor: const Color(0x3A4D8AFF),
                      onPressed: () {
                        ScaffoldMessenger.of(context)
                          ..hideCurrentSnackBar()
                          ..showSnackBar(
                            const SnackBar(
                              content: Text('Opening hazard map view...'),
                            ),
                          );
                      },
                    ),
                    const SizedBox(height: 12),
                    _MapActionButton(
                      label: 'I\'m OK / Dismiss',
                      icon: Icons.check_rounded,
                      backgroundColor: const Color(0xFF37383C),
                      foregroundColor: const Color(0xFFE7E7E9),
                      glowColor: const Color(0x00000000),
                      onPressed: () {
                        ScaffoldMessenger.of(context)
                          ..hideCurrentSnackBar()
                          ..showSnackBar(
                            const SnackBar(
                              content: Text('Alert dismissed. Stay safe.'),
                            ),
                          );
                      },
                    ),
                    const SizedBox(height: 8),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _EmergencyAlertCard extends StatelessWidget {
  const _EmergencyAlertCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
      decoration: BoxDecoration(
        color: const Color(0xFFFF5A50),
        borderRadius: BorderRadius.circular(44),
        border: Border.all(color: const Color(0x4CFFFFFF)),
        boxShadow: const [
          BoxShadow(color: Color(0xA1FF4A45), blurRadius: 52, spreadRadius: 6),
          BoxShadow(color: Color(0x68FF4F4A), blurRadius: 28, spreadRadius: 14),
          BoxShadow(color: Color(0x4CFF4F4A), blurRadius: 14, spreadRadius: 20),
        ],
      ),
      child: Column(
        children: [
          const Text(
            'EMERGENCY ALERT',
            style: TextStyle(
              color: Color(0xFFF5F5F5),
              fontSize: 15,
              letterSpacing: 3.0,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            width: 156,
            height: 156,
            decoration: BoxDecoration(
              color: const Color(0x1AFFFFFF),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0x36FFFFFF)),
            ),
            child: const Icon(
              Icons.flood_rounded,
              size: 86,
              color: Color(0xFFF9F9FA),
            ),
          ),
          const SizedBox(height: 18),
          const Text(
            'Flash Flood',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Color(0xFFF7F7F8),
              fontSize: 46,
              fontWeight: FontWeight.w800,
              height: 1,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Critical danger in your area',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Color(0xFFF8D3CF),
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 54),
        ],
      ),
    );
  }
}

class _ImmediateActionCard extends StatelessWidget {
  const _ImmediateActionCard({required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 12, 18, 12),
      decoration: BoxDecoration(
        color: const Color(0xFF2A2B30),
        borderRadius: BorderRadius.circular(26),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'IMMEDIATE ACTION',
                  style: TextStyle(
                    color: Color(0xFFF5B8AF),
                    fontSize: 11.5,
                    letterSpacing: 2.2,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Evacuate\nNorth',
                  style: TextStyle(
                    color: Color(0xFFEAEAEC),
                    fontSize: 21,
                    fontWeight: FontWeight.w700,
                    height: 1.06,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: onPressed,
              child: Container(
                width: 76,
                height: 76,
                decoration: BoxDecoration(
                  color: const Color(0x4C8A3832),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Icon(
                  Icons.north_rounded,
                  size: 50,
                  color: Color(0xFFFF6256),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _AlertMetric extends StatelessWidget {
  const _AlertMetric({
    required this.label,
    required this.value,
    required this.valueColor,
  });

  final String label;
  final String value;
  final Color valueColor;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Color(0xFFF0BEB6),
            fontSize: 12,
            letterSpacing: 2.0,
            fontWeight: FontWeight.w800,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: TextStyle(
            color: valueColor,
            fontSize: 21,
            fontWeight: FontWeight.w800,
          ),
        ),
      ],
    );
  }
}

class _MapActionButton extends StatelessWidget {
  const _MapActionButton({
    required this.label,
    required this.icon,
    required this.backgroundColor,
    required this.foregroundColor,
    required this.glowColor,
    required this.onPressed,
  });

  final String label;
  final IconData icon;
  final Color backgroundColor;
  final Color foregroundColor;
  final Color glowColor;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: glowColor, blurRadius: 20, spreadRadius: 1),
        ],
      ),
      child: SizedBox(
        width: double.infinity,
        child: FilledButton.icon(
          onPressed: onPressed,
          icon: Icon(icon, size: 25),
          label: Text(label),
          style: FilledButton.styleFrom(
            backgroundColor: backgroundColor,
            foregroundColor: foregroundColor,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
            ),
            textStyle: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
      ),
    );
  }
}
