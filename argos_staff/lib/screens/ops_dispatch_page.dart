import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/crisis_result.dart';
import '../models/staff_tab.dart';
import '../providers/crisis_provider.dart';
import '../widgets/argos_screen_shell.dart';

class OpsDispatchPage extends ConsumerWidget {
  const OpsDispatchPage({super.key, this.selectedTab = StaffTab.dispatch});

  final StaffTab selectedTab;

  String _formatTime(String iso) {
    try {
      final dt = DateTime.parse(iso).toLocal();
      return '${dt.hour.toString().padLeft(2, '0')}:'
          '${dt.minute.toString().padLeft(2, '0')}:'
          '${dt.second.toString().padLeft(2, '0')}';
    } catch (_) {
      return '—';
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final crisis = ref.watch(crisisProvider);
    final dispatch = crisis?.primaryDispatch;

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
          children: [
            _DispatchAlertBanner(
              time: crisis != null ? _formatTime(crisis.timestamp) : '—',
              hasLive: crisis != null,
            ),
            if (dispatch != null) ...[
              const SizedBox(height: 10),
              _DispatchedToBanner(dispatch: dispatch),
            ],
            const SizedBox(height: 16),
            _IncidentHeaderCard(crisis: crisis),
            const SizedBox(height: 16),
            _MissionDirectiveCard(instruction: dispatch?.instruction),
            const SizedBox(height: 20),
            _BringWithYouSection(equipment: dispatch?.equipmentToBring),
            const SizedBox(height: 18),
            if (dispatch != null) ...[
              _PrimaryRouteCard(route: dispatch.route),
              const SizedBox(height: 14),
              _AnimatedRouteSteps(
                route: dispatch.route,
                equipment: dispatch.equipmentToBring,
              ),
            ] else ...[
              _PrimaryRouteCard(route: null),
              const SizedBox(height: 14),
              _AnimatedRouteSteps(route: null, equipment: const []),
            ],
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
  const _DispatchAlertBanner({required this.time, required this.hasLive});

  final String time;
  final bool hasLive;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
      decoration: BoxDecoration(
        color: hasLive ? const Color(0xFFFF4A58) : const Color(0xFF3A3A3A),
        border: Border.all(color: const Color(0x66FFFFFF)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Icon(Icons.warning_rounded, color: Color(0xFF4B0A0F), size: 40),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              hasLive ? 'DISPATCH\nRECEIVED' : 'STANDING\nBY',
              style: const TextStyle(
                height: 0.98,
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: Color(0xFF3D050C),
              ),
            ),
          ),
          Text(
            time,
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
}

// ---------------------------------------------------------------------------
// Dispatched-to banner — shows who has been sent (Rajan Mehta / primary)
// ---------------------------------------------------------------------------
class _DispatchedToBanner extends StatelessWidget {
  const _DispatchedToBanner({required this.dispatch});
  final DispatchDecision dispatch;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF0D1520),
        border: Border.all(color: const Color(0xFF2B3D5A)),
      ),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: const Color(0xFF0A1828),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFF3A6FA0), width: 1.5),
            ),
            child: const Icon(
              Icons.person_rounded,
              color: Color(0xFF5090D0),
              size: 22,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  dispatch.staffName.toUpperCase(),
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.0,
                    color: Color(0xFFD8E4F4),
                  ),
                ),
                Text(
                  dispatch.role.toUpperCase(),
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.4,
                    color: Color(0xFF5070A0),
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: const Color(0x33FF3A50),
              borderRadius: BorderRadius.circular(3),
              border: Border.all(color: const Color(0xFFFF3A50)),
            ),
            child: Text(
              dispatch.priority.toUpperCase(),
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.4,
                color: Color(0xFFFF6070),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _IncidentHeaderCard extends StatelessWidget {
  const _IncidentHeaderCard({required this.crisis});

  final CrisisResult? crisis;

  IconData get _icon {
    switch (crisis?.crisisType) {
      case 'fire': return Icons.local_fire_department_rounded;
      case 'medical': return Icons.medical_services_rounded;
      case 'security': return Icons.security_rounded;
      case 'stampede': return Icons.people_rounded;
      default: return Icons.warning_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final title = crisis != null
        ? '${crisis!.crisisType[0].toUpperCase()}${crisis!.crisisType.substring(1).replaceAll('_', ' ')} Emergency'
        : 'NO ACTIVE INCIDENT';
    final location = crisis != null
        ? 'Floor ${crisis!.floor} · ${crisis!.zone}'
        : 'System monitoring all floors';
    final severity = crisis != null ? 'SEV ${crisis!.severity}/5' : '—';
    final conf = crisis != null
        ? 'CONF: ${(crisis!.confidence * 100).round()}%'
        : 'STANDBY';

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
              _icon,
              size: 150,
              color: const Color(0xFFFF4A58).withValues(alpha: 0.14),
            ),
          ),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const _CardAccent(color: Color(0xFFFF3D52)),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(_icon, size: 36, color: const Color(0xFFFF5868)),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              title,
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
                        location,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFFA8AFC1),
                        ),
                      ),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          Expanded(
                            child: _DataCell(
                              label: 'SEVERITY',
                              value: severity,
                              valueColor: const Color(0xFFFF5C67),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _DataCell(
                              label: 'AI CONFIDENCE',
                              value: conf,
                              valueColor: const Color(0xFF58F78B),
                            ),
                          ),
                        ],
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
  const _MissionDirectiveCard({required this.instruction});

  final String? instruction;

  @override
  Widget build(BuildContext context) {
    final text = instruction?.toUpperCase() ??
        'AWAITING DISPATCH FROM CONTROL ROOM.\n'
        'STAND BY FOR GEMINI AI ASSIGNMENT.';

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
              text,
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
  const _BringWithYouSection({required this.equipment});

  final List<String>? equipment;

  IconData _iconFor(String item) {
    final lower = item.toLowerCase();
    if (lower.contains('fire') || lower.contains('extinguish')) return Icons.fire_extinguisher_rounded;
    if (lower.contains('radio') || lower.contains('comm')) return Icons.radio_rounded;
    if (lower.contains('medical') || lower.contains('first aid') || lower.contains('kit')) return Icons.medical_services_rounded;
    if (lower.contains('gear') || lower.contains('protect') || lower.contains('tactical')) return Icons.shield_rounded;
    if (lower.contains('aed') || lower.contains('defib')) return Icons.favorite_rounded;
    if (lower.contains('torch') || lower.contains('light')) return Icons.flashlight_on_rounded;
    return Icons.inventory_2_rounded;
  }

  @override
  Widget build(BuildContext context) {
    final items = equipment?.isNotEmpty == true ? equipment! : <String>[];

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
        if (items.isEmpty)
          const Text(
            'Equipment list will appear on dispatch',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Color(0xFF3A4260),
            ),
          )
        else
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: items
                .map((item) => _GearChip(icon: _iconFor(item), label: item))
                .toList(),
          ),
      ],
    );
  }
}

class _PrimaryRouteCard extends StatelessWidget {
  const _PrimaryRouteCard({required this.route});

  final String? route;

  @override
  Widget build(BuildContext context) {
    final routeText = (route != null && route!.isNotEmpty)
        ? route!
        : 'Awaiting route from AI dispatch...';

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
            routeText,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: Color(0xFF58F58C),
            ),
          ),
          const SizedBox(height: 12),
          const _HazardAdvisory(),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Animated step-by-step route — each waypoint fades in with a staggered delay
// ---------------------------------------------------------------------------
class _AnimatedRouteSteps extends StatefulWidget {
  const _AnimatedRouteSteps({required this.route, required this.equipment});
  final String? route;
  final List<String> equipment;

  @override
  State<_AnimatedRouteSteps> createState() => _AnimatedRouteStepsState();
}

class _AnimatedRouteStepsState extends State<_AnimatedRouteSteps>
    with TickerProviderStateMixin {
  late final List<AnimationController> _controllers;
  late final List<Animation<double>> _fades;
  List<String> _steps = [];

  /// Parses route string into dramatic waypoint steps.
  /// Injects floor-switch banners, equipment pickup steps, and start/end labels.
  static List<String> _build(String? raw, List<String> equipment) {
    if (raw == null || raw.isEmpty) return [];

    // Split on →, commas, periods or semicolons
    final chunks = raw
        .split(RegExp(r'[→,;.]'))
        .map((s) => s.trim())
        .where((s) => s.length > 3)
        .toList();

    final result = <String>[];
    int? lastFloor;
    bool equipmentInjected = false;

    for (int i = 0; i < chunks.length; i++) {
      final chunk = chunks[i];

      // Detect floor mentions like "floor 3", "3rd floor", "level 2"
      final floorMatch = RegExp(
        r'(?:floor|level|fl\.?)\s*(\d+)',
        caseSensitive: false,
      ).firstMatch(chunk);

      if (floorMatch != null) {
        final floor = int.tryParse(floorMatch.group(1) ?? '');
        if (floor != null && floor != lastFloor) {
          if (lastFloor != null) {
            // Inject equipment pickup BEFORE the floor switch (at stairwell)
            if (!equipmentInjected && equipment.isNotEmpty) {
              result.add('🔧 COLLECT: ${equipment[0]}');
              if (equipment.length > 1) {
                result.add('🔧 COLLECT: ${equipment[1]}');
              }
              equipmentInjected = true;
            }
            result.add('⬆ FLOOR SWITCH → FLOOR $floor');
          }
          lastFloor = floor;
        }
      }
      result.add(chunk);
    }

    // If no floor switch found, inject equipment after first step
    if (!equipmentInjected && equipment.isNotEmpty && result.length >= 2) {
      result.insert(1, '🔧 COLLECT: ${equipment[0]}');
      if (equipment.length > 1) result.insert(2, '🔧 COLLECT: ${equipment[1]}');
    }

    return result;
  }

  void _rebuildSteps() {
    _steps = _build(widget.route, widget.equipment);
    _buildAnimations(_steps);
    if (mounted) setState(() {});
  }

  void _buildAnimations(List<String> steps) {
    for (final c in _controllers) {
      c.dispose();
    }
    _controllers.clear();
    _fades.clear();

    for (int i = 0; i < steps.length; i++) {
      final ctrl = AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 400),
      );
      _controllers.add(ctrl);
      _fades.add(CurvedAnimation(parent: ctrl, curve: Curves.easeOut));
      // stagger: 180 ms per step
      Future.delayed(Duration(milliseconds: 180 * i), () {
        if (mounted) ctrl.forward();
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _controllers = [];
    _fades = [];
    _steps = _build(widget.route, widget.equipment);
    _buildAnimations(_steps);
  }

  @override
  void didUpdateWidget(_AnimatedRouteSteps oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.route != widget.route ||
        oldWidget.equipment != widget.equipment) {
      _rebuildSteps();
    }
  }

  @override
  void dispose() {
    for (final c in _controllers) {
      c.dispose();
    }
    super.dispose();
  }

  bool _isFloorSwitch(String step) => step.startsWith('⬆ FLOOR SWITCH');
  bool _isEquipment(String step) => step.startsWith('🔧 COLLECT:');

  IconData _iconFor(int index, int total) {
    final step = _steps[index];
    if (_isFloorSwitch(step)) return Icons.swap_vert_rounded;
    if (_isEquipment(step)) return Icons.fire_extinguisher_rounded;
    if (index == 0) return Icons.my_location_rounded;
    if (index == total - 1) return Icons.crisis_alert_rounded;
    if (step.toLowerCase().contains('stair')) return Icons.stairs_rounded;
    if (step.toLowerCase().contains('lift') ||
        step.toLowerCase().contains('elevator')) {
      return Icons.elevator_rounded;
    }
    if (step.toLowerCase().contains('exit') ||
        step.toLowerCase().contains('door')) {
      return Icons.door_front_door_rounded;
    }
    if (step.toLowerCase().contains('corridor') ||
        step.toLowerCase().contains('hall')) {
      return Icons.linear_scale_rounded;
    }
    return Icons.turn_right_rounded;
  }

  Color _colorFor(int index, int total) {
    final step = _steps[index];
    if (_isFloorSwitch(step)) return const Color(0xFFFFB347);
    if (_isEquipment(step)) return const Color(0xFFFFD700);
    if (index == 0) return const Color(0xFF38E785);
    if (index == total - 1) return const Color(0xFFFF3A50);
    return const Color(0xFF5B9CF6);
  }

  @override
  Widget build(BuildContext context) {
    if (_steps.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF0C1018),
          border: Border.all(color: const Color(0xFF1E2436)),
        ),
        child: const Row(
          children: [
            Icon(Icons.route_rounded, color: Color(0xFF2A3048), size: 28),
            SizedBox(width: 12),
            Text(
              'Route will appear on dispatch',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Color(0xFF3A4260),
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0C1018),
        border: Border.all(color: const Color(0xFF1E2436)),
      ),
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.route_rounded, color: Color(0xFF5B9CF6), size: 16),
              SizedBox(width: 8),
              Text(
                'ROUTE TO INCIDENT',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 2.2,
                  color: Color(0xFF7080A0),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          for (int i = 0; i < _steps.length; i++) ...[
            FadeTransition(
              opacity: _fades[i],
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(-0.15, 0),
                  end: Offset.zero,
                ).animate(_fades[i]),
                child: _isFloorSwitch(_steps[i])
                    // ── Floor-switch: full-width dramatic orange banner ──
                    ? Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6),
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0x25FFB347),
                            border: Border.all(
                              color: const Color(0xFFFFB347),
                              width: 1,
                            ),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                Icons.swap_vert_rounded,
                                color: Color(0xFFFFB347),
                                size: 18,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                _steps[i].replaceFirst('⬆ ', ''),
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 1.6,
                                  color: Color(0xFFFFB347),
                                ),
                              ),
                            ],
                          ),
                        ),
                      )
                    : _isEquipment(_steps[i])
                    // ── Equipment pickup: yellow highlight box ────────────
                    ? Padding(
                        padding: const EdgeInsets.symmetric(vertical: 5),
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0x22FFD700),
                            border: Border.all(
                              color: const Color(0xFFFFD700),
                              width: 1,
                            ),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                Icons.fire_extinguisher_rounded,
                                color: Color(0xFFFFD700),
                                size: 18,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _steps[i].replaceFirst('🔧 ', ''),
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 1.2,
                                    color: Color(0xFFFFD700),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      )
                    // ── Normal waypoint step ──────────────────────────────
                    : Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Column(
                            children: [
                              Container(
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: _colorFor(i, _steps.length)
                                      .withValues(alpha: 0.15),
                                  border: Border.all(
                                    color: _colorFor(i, _steps.length),
                                    width: 1.5,
                                  ),
                                ),
                                child: Icon(
                                  _iconFor(i, _steps.length),
                                  size: 16,
                                  color: _colorFor(i, _steps.length),
                                ),
                              ),
                              if (i < _steps.length - 1)
                                Container(
                                  width: 1.5,
                                  height: 26,
                                  color: const Color(0xFF2A3448),
                                ),
                            ],
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.only(top: 6),
                              child: Text(
                                _steps[i],
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  height: 1.35,
                                  color: i == _steps.length - 1
                                      ? const Color(0xFFFFB0B8)
                                      : const Color(0xFFD0D8EC),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
              ),
            ),
          ],
        ],
      ),
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

// _DispatchRouteMapPainter removed — replaced by _AnimatedRouteSteps
