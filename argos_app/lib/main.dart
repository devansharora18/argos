import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  runApp(const ProviderScope(child: GuardianApp()));
}

enum SwipeDirection { up, down, left, right, none }

enum GuardianTab { status, reports, map, settings }

@immutable
class GestureState {
  const GestureState({
    required this.dragOffset,
    required this.activeDirection,
    required this.isDragging,
    required this.dragDistance,
    required this.thresholdPassed,
  });

  const GestureState.initial()
    : dragOffset = Offset.zero,
      activeDirection = SwipeDirection.none,
      isDragging = false,
      dragDistance = 0,
      thresholdPassed = false;

  final Offset dragOffset;
  final SwipeDirection activeDirection;
  final bool isDragging;
  final double dragDistance;
  final bool thresholdPassed;

  GestureState copyWith({
    Offset? dragOffset,
    SwipeDirection? activeDirection,
    bool? isDragging,
    double? dragDistance,
    bool? thresholdPassed,
  }) {
    return GestureState(
      dragOffset: dragOffset ?? this.dragOffset,
      activeDirection: activeDirection ?? this.activeDirection,
      isDragging: isDragging ?? this.isDragging,
      dragDistance: dragDistance ?? this.dragDistance,
      thresholdPassed: thresholdPassed ?? this.thresholdPassed,
    );
  }
}

class GestureStateNotifier extends StateNotifier<GestureState> {
  GestureStateNotifier({required this.threshold})
    : super(const GestureState.initial());

  final double threshold;

  Offset _origin = Offset.zero;
  bool _lockHapticTriggered = false;

  void startDrag(Offset origin) {
    _origin = origin;
    _lockHapticTriggered = false;
    state = const GestureState.initial().copyWith(isDragging: true);
  }

  void updateDrag(Offset currentPosition) {
    final offset = currentPosition - _origin;
    final distance = offset.distance;
    final direction = _resolveDirection(offset, distance);
    final thresholdPassed = distance >= threshold;

    if (direction != SwipeDirection.none &&
        direction != state.activeDirection) {
      HapticFeedback.selectionClick();
    }

    if (thresholdPassed &&
        !_lockHapticTriggered &&
        direction != SwipeDirection.none) {
      _lockHapticTriggered = true;
      _performDirectionalHaptic(direction);
    } else if (!thresholdPassed) {
      _lockHapticTriggered = false;
    }

    state = state.copyWith(
      dragOffset: offset,
      activeDirection: direction,
      isDragging: true,
      dragDistance: distance,
      thresholdPassed: thresholdPassed,
    );
  }

  SwipeDirection endDrag() {
    final validSelection =
        state.thresholdPassed && state.activeDirection != SwipeDirection.none;
    final selection = validSelection
        ? state.activeDirection
        : SwipeDirection.none;

    if (selection != SwipeDirection.none) {
      HapticFeedback.heavyImpact();
    }

    reset();
    return selection;
  }

  void reset() {
    _lockHapticTriggered = false;
    state = const GestureState.initial();
  }

  SwipeDirection _resolveDirection(Offset offset, double distance) {
    if (distance < 18) {
      return SwipeDirection.none;
    }

    if (offset.dx.abs() > offset.dy.abs()) {
      return offset.dx >= 0 ? SwipeDirection.right : SwipeDirection.left;
    }

    return offset.dy >= 0 ? SwipeDirection.down : SwipeDirection.up;
  }

  void _performDirectionalHaptic(SwipeDirection direction) {
    switch (direction) {
      case SwipeDirection.up:
        HapticFeedback.lightImpact();
        break;
      case SwipeDirection.left:
        HapticFeedback.selectionClick();
        break;
      case SwipeDirection.right:
        HapticFeedback.mediumImpact();
        break;
      case SwipeDirection.down:
        HapticFeedback.vibrate();
        break;
      case SwipeDirection.none:
        break;
    }
  }
}

final gestureProvider =
    StateNotifierProvider<GestureStateNotifier, GestureState>(
      (ref) => GestureStateNotifier(threshold: 104),
    );

final bottomTabProvider = StateProvider<GuardianTab>(
  (ref) => GuardianTab.status,
);

class NavigationController {
  const NavigationController();

  String? routeForDirection(SwipeDirection direction) {
    switch (direction) {
      case SwipeDirection.up:
        return '/voice';
      case SwipeDirection.left:
        return '/text';
      case SwipeDirection.right:
        return '/keyword';
      case SwipeDirection.down:
        return '/sos';
      case SwipeDirection.none:
        return null;
    }
  }

  Future<void> navigate(BuildContext context, SwipeDirection direction) async {
    final route = routeForDirection(direction);
    if (route == null) {
      return;
    }

    await Navigator.of(context).pushNamed(route);
  }
}

final navigationProvider = Provider<NavigationController>(
  (ref) => const NavigationController(),
);

class GuardianApp extends StatelessWidget {
  const GuardianApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Guardian',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF05080F),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFFF5F57),
          brightness: Brightness.dark,
        ),
      ),
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/':
            return MaterialPageRoute<void>(
              builder: (_) => const GuardianHomePage(),
              settings: settings,
            );
          case '/voice':
            return _buildActionRoute(
              settings: settings,
              title: 'Voice Reporting',
              subtitle:
                  'Live voice capture is ready. Keep the channel open until responders confirm your location.',
              icon: Icons.keyboard_voice_rounded,
              accent: const Color(0xFF67C7FF),
              beginOffset: const Offset(0, 0.2),
            );
          case '/text':
            return _buildActionRoute(
              settings: settings,
              title: 'Text Reporting',
              subtitle:
                  'Send a rapid text incident report with auto-attached location and timestamp.',
              icon: Icons.sms_rounded,
              accent: const Color(0xFFFFB476),
              beginOffset: const Offset(0.2, 0),
            );
          case '/keyword':
            return _buildActionRoute(
              settings: settings,
              title: 'Keyword Reporting',
              subtitle:
                  'Activate silent keyword detection for discreet emergency escalation.',
              icon: Icons.record_voice_over_rounded,
              accent: const Color(0xFF81F5BB),
              beginOffset: const Offset(-0.2, 0),
            );
          case '/sos':
            return _buildActionRoute(
              settings: settings,
              title: 'Instant SOS',
              subtitle:
                  'Immediate distress broadcast sent. Stay visible and keep this screen active.',
              icon: Icons.warning_amber_rounded,
              accent: const Color(0xFFFF6D66),
              beginOffset: const Offset(0, -0.2),
            );
          case '/reports':
            return _buildActionRoute(
              settings: settings,
              title: 'Reports',
              subtitle:
                  'Review incident history, response logs, and evidence captured across channels.',
              icon: Icons.article_rounded,
              accent: const Color(0xFFFFB476),
              beginOffset: const Offset(0.14, 0),
            );
          case '/map':
            return _buildActionRoute(
              settings: settings,
              title: 'Map',
              subtitle:
                  'Track your live location, safety perimeter, and nearby emergency resources.',
              icon: Icons.place_rounded,
              accent: const Color(0xFF70CEFF),
              beginOffset: const Offset(0, 0.16),
            );
          case '/settings':
            return _buildActionRoute(
              settings: settings,
              title: 'Settings',
              subtitle:
                  'Manage trusted contacts, privacy controls, and emergency automation preferences.',
              icon: Icons.settings_rounded,
              accent: const Color(0xFFD2D9EA),
              beginOffset: const Offset(-0.14, 0),
            );
          default:
            return MaterialPageRoute<void>(
              builder: (_) => const GuardianHomePage(),
              settings: settings,
            );
        }
      },
    );
  }
}

Route<void> _buildActionRoute({
  required RouteSettings settings,
  required String title,
  required String subtitle,
  required IconData icon,
  required Color accent,
  required Offset beginOffset,
}) {
  return PageRouteBuilder<void>(
    settings: settings,
    transitionDuration: const Duration(milliseconds: 320),
    reverseTransitionDuration: const Duration(milliseconds: 220),
    pageBuilder: (_, __, ___) => ActionPage(
      title: title,
      subtitle: subtitle,
      icon: icon,
      accent: accent,
    ),
    transitionsBuilder: (_, animation, __, child) {
      final curved = CurvedAnimation(
        parent: animation,
        curve: Curves.easeOutCubic,
        reverseCurve: Curves.easeInCubic,
      );

      return FadeTransition(
        opacity: curved,
        child: SlideTransition(
          position: Tween<Offset>(
            begin: beginOffset,
            end: Offset.zero,
          ).animate(curved),
          child: child,
        ),
      );
    },
  );
}

class GuardianHomePage extends ConsumerWidget {
  const GuardianHomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gesture = ref.watch(gestureProvider);
    final activeTab = ref.watch(bottomTabProvider);
    final lockedDirection = gesture.thresholdPassed
        ? gesture.activeDirection
        : SwipeDirection.none;

    final statusText = lockedDirection == SwipeDirection.none
        ? 'Swipe from center to choose a reporting channel.'
        : 'Release to confirm ${_directionTitle(lockedDirection)}.';

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF0A0F1A), Color(0xFF0A111D), Color(0xFF060910)],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Column(
              children: [
                const _HeaderSection(),
                const SizedBox(height: 18),
                Expanded(
                  child: Align(
                    alignment: const Alignment(0, 0.06),
                    child: const SOSRadialController(),
                  ),
                ),
                _GuidanceCard(
                  text: statusText,
                  activeDirection: lockedDirection,
                ),
                const SizedBox(height: 12),
                GuardianBottomBar(
                  selectedTab: activeTab,
                  onSelected: (tab) {
                    ref.read(bottomTabProvider.notifier).state = tab;
                    final route = _tabRoute(tab);
                    if (route == null) {
                      return;
                    }

                    Navigator.of(context).pushNamed(route).whenComplete(() {
                      if (context.mounted) {
                        ref.read(bottomTabProvider.notifier).state =
                            GuardianTab.status;
                      }
                    });
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class SOSRadialController extends ConsumerWidget {
  const SOSRadialController({super.key});

  static const double _controllerSize = 360;
  static const double _buttonSize = 228;
  static const double _activationRadius = 116;
  static const double _maxVisualDrag = 150;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gesture = ref.watch(gestureProvider);
    final progress = (gesture.dragDistance / 104).clamp(0.0, 1.0).toDouble();
    final clampedDrag = _clampOffset(gesture.dragOffset, _maxVisualDrag);
    final visualOffset = clampedDrag * 0.18;
    final activeDirection = gesture.activeDirection;
    final intensity = gesture.isDragging ? 0.28 + (0.72 * progress) : 0.14;

    return SwipeDirectionDetector(
      activationRadius: _activationRadius,
      child: SizedBox.square(
        dimension: _controllerSize,
        child: Stack(
          alignment: Alignment.center,
          children: [
            GlowRing(
              activeDirection: activeDirection,
              intensity: intensity,
              thresholdProgress: progress,
            ),
            CustomPaint(
              size: const Size.square(_controllerSize),
              painter: DragTrailPainter(
                dragOffset: clampedDrag,
                visible: gesture.isDragging,
                color: _directionColor(activeDirection).withOpacity(0.45),
              ),
            ),
            DirectionalLabel(
              text: 'VOICE REPORTING',
              direction: SwipeDirection.up,
              activeDirection: activeDirection,
              progress: progress,
              alignment: Alignment.topCenter,
              offset: const Offset(0, 14),
            ),
            DirectionalLabel(
              text: 'TEXT\nREPORTING',
              direction: SwipeDirection.left,
              activeDirection: activeDirection,
              progress: progress,
              alignment: Alignment.centerLeft,
              offset: const Offset(12, 0),
            ),
            DirectionalLabel(
              text: 'KEYWORD\nREPORTING',
              direction: SwipeDirection.right,
              activeDirection: activeDirection,
              progress: progress,
              alignment: Alignment.centerRight,
              offset: const Offset(-12, 0),
            ),
            DirectionalLabel(
              text: 'INSTANT SOS',
              direction: SwipeDirection.down,
              activeDirection: activeDirection,
              progress: progress,
              alignment: Alignment.bottomCenter,
              offset: const Offset(0, -16),
            ),
            TweenAnimationBuilder<Offset>(
              tween: Tween<Offset>(end: visualOffset),
              duration: Duration(milliseconds: gesture.isDragging ? 48 : 220),
              curve: Curves.easeOutCubic,
              builder: (context, offset, child) {
                return Transform.translate(offset: offset, child: child);
              },
              child: AnimatedScale(
                duration: Duration(milliseconds: gesture.isDragging ? 70 : 180),
                curve: Curves.easeOutBack,
                scale: gesture.isDragging ? 1.05 + (0.05 * progress) : 1,
                child: _SOSCoreButton(
                  size: _buttonSize,
                  activeDirection: activeDirection,
                  thresholdPassed: gesture.thresholdPassed,
                  progress: progress,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class SwipeDirectionDetector extends ConsumerStatefulWidget {
  const SwipeDirectionDetector({
    super.key,
    required this.child,
    required this.activationRadius,
  });

  final Widget child;
  final double activationRadius;

  @override
  ConsumerState<SwipeDirectionDetector> createState() =>
      _SwipeDirectionDetectorState();
}

class _SwipeDirectionDetectorState
    extends ConsumerState<SwipeDirectionDetector> {
  bool _tracking = false;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final center = Offset(
          constraints.maxWidth / 2,
          constraints.maxHeight / 2,
        );

        return GestureDetector(
          behavior: HitTestBehavior.translucent,
          onPanStart: (details) {
            final distanceFromCenter =
                (details.localPosition - center).distance;
            if (distanceFromCenter > widget.activationRadius) {
              return;
            }

            _tracking = true;
            final notifier = ref.read(gestureProvider.notifier);
            notifier.startDrag(center);
            notifier.updateDrag(details.localPosition);
          },
          onPanUpdate: (details) {
            if (!_tracking) {
              return;
            }
            ref
                .read(gestureProvider.notifier)
                .updateDrag(details.localPosition);
          },
          onPanEnd: (_) async {
            if (!_tracking) {
              return;
            }

            _tracking = false;
            final selection = ref.read(gestureProvider.notifier).endDrag();
            if (selection != SwipeDirection.none && mounted) {
              await ref.read(navigationProvider).navigate(context, selection);
            }
          },
          onPanCancel: () {
            if (!_tracking) {
              return;
            }

            _tracking = false;
            ref.read(gestureProvider.notifier).reset();
          },
          child: widget.child,
        );
      },
    );
  }
}

class DirectionalLabel extends StatelessWidget {
  const DirectionalLabel({
    super.key,
    required this.text,
    required this.direction,
    required this.activeDirection,
    required this.progress,
    required this.alignment,
    required this.offset,
  });

  final String text;
  final SwipeDirection direction;
  final SwipeDirection activeDirection;
  final double progress;
  final Alignment alignment;
  final Offset offset;

  @override
  Widget build(BuildContext context) {
    final isActive = direction == activeDirection;
    final emphasis = isActive ? 0.55 + (0.45 * progress) : 0.0;
    final textColor = Color.lerp(
      const Color(0xFFCDB4AE),
      Colors.white,
      emphasis,
    );

    return Align(
      alignment: alignment,
      child: Transform.translate(
        offset: offset,
        child: AnimatedOpacity(
          duration: const Duration(milliseconds: 110),
          opacity: isActive ? 1 : 0.62,
          child: AnimatedScale(
            duration: const Duration(milliseconds: 110),
            curve: Curves.easeOut,
            scale: isActive ? 1.08 : 1,
            child: Text(
              text,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: textColor,
                fontSize: 14.5,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.0,
                height: 1.2,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class GlowRing extends StatelessWidget {
  const GlowRing({
    super.key,
    required this.activeDirection,
    required this.intensity,
    required this.thresholdProgress,
  });

  final SwipeDirection activeDirection;
  final double intensity;
  final double thresholdProgress;

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: const Size.square(352),
      painter: _GlowRingPainter(
        activeDirection: activeDirection,
        intensity: intensity,
        thresholdProgress: thresholdProgress,
      ),
    );
  }
}

class _GlowRingPainter extends CustomPainter {
  _GlowRingPainter({
    required this.activeDirection,
    required this.intensity,
    required this.thresholdProgress,
  });

  final SwipeDirection activeDirection;
  final double intensity;
  final double thresholdProgress;

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final radius = (size.shortestSide / 2) - 18;

    final outerPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.2
      ..color = const Color(0x40EFB9B2);

    final innerPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 6
      ..color = const Color(0x1FF4C3BD);

    canvas.drawCircle(center, radius, outerPaint);
    canvas.drawCircle(center, radius - 18, innerPaint);

    final hintPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 11
      ..strokeCap = StrokeCap.round
      ..color = const Color(0x15FFFFFF);
    final hintRect = Rect.fromCircle(center: center, radius: radius - 9);

    for (final direction in SwipeDirection.values) {
      if (direction == SwipeDirection.none) {
        continue;
      }
      final angle = _directionToAngle(direction);
      canvas.drawArc(hintRect, angle - 0.23, 0.46, false, hintPaint);
    }

    if (activeDirection == SwipeDirection.none) {
      return;
    }

    final arcColor = _directionColor(activeDirection);
    final arcRect = Rect.fromCircle(center: center, radius: radius - 9);
    final startAngle = _directionToAngle(activeDirection) - 0.5;

    final glowPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 15
      ..strokeCap = StrokeCap.round
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 12)
      ..color = arcColor.withOpacity(0.34 + (0.45 * intensity));

    final crispPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 5.5
      ..strokeCap = StrokeCap.round
      ..color = arcColor.withOpacity(0.6 + (0.35 * thresholdProgress));

    canvas.drawArc(arcRect, startAngle, 1.0, false, glowPaint);
    canvas.drawArc(arcRect, startAngle, 1.0, false, crispPaint);
  }

  @override
  bool shouldRepaint(covariant _GlowRingPainter oldDelegate) {
    return oldDelegate.activeDirection != activeDirection ||
        oldDelegate.intensity != intensity ||
        oldDelegate.thresholdProgress != thresholdProgress;
  }
}

class DragTrailPainter extends CustomPainter {
  DragTrailPainter({
    required this.dragOffset,
    required this.visible,
    required this.color,
  });

  final Offset dragOffset;
  final bool visible;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    if (!visible || dragOffset.distance < 4) {
      return;
    }

    final center = size.center(Offset.zero);
    final end = center + dragOffset;

    final glowPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 22
      ..strokeCap = StrokeCap.round
      ..color = color.withOpacity(0.12)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 10);

    final linePaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4.5
      ..strokeCap = StrokeCap.round
      ..shader = LinearGradient(
        colors: [Colors.white.withOpacity(0.1), color.withOpacity(0.92)],
      ).createShader(Rect.fromPoints(center, end));

    canvas.drawLine(center, end, glowPaint);
    canvas.drawLine(center, end, linePaint);
    canvas.drawCircle(end, 5.5, Paint()..color = color.withOpacity(0.95));
  }

  @override
  bool shouldRepaint(covariant DragTrailPainter oldDelegate) {
    return oldDelegate.dragOffset != dragOffset ||
        oldDelegate.visible != visible ||
        oldDelegate.color != color;
  }
}

class _SOSCoreButton extends StatelessWidget {
  const _SOSCoreButton({
    required this.size,
    required this.activeDirection,
    required this.thresholdPassed,
    required this.progress,
  });

  final double size;
  final SwipeDirection activeDirection;
  final bool thresholdPassed;
  final double progress;

  @override
  Widget build(BuildContext context) {
    final accent = thresholdPassed
        ? _directionColor(activeDirection)
        : const Color(0xFFFF736C);

    return AnimatedContainer(
      duration: const Duration(milliseconds: 140),
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const RadialGradient(
          center: Alignment(-0.2, -0.28),
          radius: 1.05,
          colors: [Color(0xFFFF6961), Color(0xFFFF554F), Color(0xFFE6403A)],
        ),
        border: Border.all(
          color: thresholdPassed
              ? accent.withOpacity(0.95)
              : const Color(0xFFD83A35),
          width: thresholdPassed ? 5 : 3,
        ),
        boxShadow: [
          BoxShadow(
            color: accent.withOpacity(0.45),
            blurRadius: 24 + (18 * progress),
            spreadRadius: 3 + (4 * progress),
          ),
          const BoxShadow(
            color: Color(0x7A1C0000),
            blurRadius: 14,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          Text(
            '*',
            style: TextStyle(
              color: Color(0xFF550B09),
              fontSize: 78,
              fontWeight: FontWeight.w900,
              height: 0.8,
            ),
          ),
          Text(
            'SOS',
            style: TextStyle(
              color: Color(0xFF550B09),
              fontSize: 56,
              fontWeight: FontWeight.w900,
              letterSpacing: 0.5,
              height: 0.9,
            ),
          ),
        ],
      ),
    );
  }
}

class _HeaderSection extends StatelessWidget {
  const _HeaderSection();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0x24FF8B81),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.shield_outlined,
                color: Color(0xFFFFB2A7),
                size: 22,
              ),
            ),
            const SizedBox(width: 12),
            const Text(
              'Argos',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w700,
                color: Color(0xFFE3DFE2),
              ),
            ),
            const Spacer(),
            const Icon(
              Icons.sensors_rounded,
              color: Color(0xFFC2C4D0),
              size: 28,
            ),
          ],
        ),
        const SizedBox(height: 18),
        Row(
          children: [
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'CURRENT STATUS',
                  style: TextStyle(
                    color: Color(0xFFDEB8B0),
                    fontSize: 14,
                    letterSpacing: 1.1,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'You are safe.',
                  style: TextStyle(
                    color: Color(0xFFE5E8F0),
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
            const Spacer(),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: const Color(0xFF103C1E),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF1E7A42)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.circle, color: Color(0xFF43E173), size: 12),
                  SizedBox(width: 8),
                  Text(
                    'Protected',
                    style: TextStyle(
                      color: Color(0xFF43E173),
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _GuidanceCard extends StatelessWidget {
  const _GuidanceCard({required this.text, required this.activeDirection});

  final String text;
  final SwipeDirection activeDirection;

  @override
  Widget build(BuildContext context) {
    final isLocked = activeDirection != SwipeDirection.none;
    final accent = isLocked
        ? _directionColor(activeDirection)
        : const Color(0xFFAFB7C8);

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0xDF1A212D),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0x2AFFFFFF)),
      ),
      child: Row(
        children: [
          Icon(Icons.swipe_rounded, color: accent, size: 24),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                color: isLocked ? Colors.white : const Color(0xFFE1E5EF),
                fontSize: 15,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.2,
                height: 1.35,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class GuardianBottomBar extends StatelessWidget {
  const GuardianBottomBar({
    super.key,
    required this.selectedTab,
    required this.onSelected,
  });

  final GuardianTab selectedTab;
  final ValueChanged<GuardianTab> onSelected;

  static const List<GuardianTab> _tabs = [
    GuardianTab.status,
    GuardianTab.reports,
    GuardianTab.map,
    GuardianTab.settings,
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: const Color(0xF2090C13),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: const Color(0x24FFFFFF), width: 1),
        boxShadow: const [
          BoxShadow(
            color: Color(0xA1000000),
            blurRadius: 24,
            offset: Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        children: [
          for (final tab in _tabs)
            Expanded(
              child: _BottomBarTabButton(
                tab: tab,
                isActive: selectedTab == tab,
                onTap: () => onSelected(tab),
              ),
            ),
        ],
      ),
    );
  }
}

class _BottomBarTabButton extends StatelessWidget {
  const _BottomBarTabButton({
    required this.tab,
    required this.isActive,
    required this.onTap,
  });

  final GuardianTab tab;
  final bool isActive;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final foreground = isActive ? Colors.white : const Color(0xFF8A8F99);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(22),
          onTap: onTap,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            curve: Curves.easeOutCubic,
            padding: const EdgeInsets.symmetric(vertical: 11),
            decoration: BoxDecoration(
              color: isActive ? const Color(0xFFFF554B) : Colors.transparent,
              borderRadius: BorderRadius.circular(22),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(_tabIcon(tab), size: 27, color: foreground),
                const SizedBox(height: 6),
                Text(
                  _tabLabel(tab),
                  style: TextStyle(
                    color: foreground,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.0,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class ActionPage extends StatelessWidget {
  const ActionPage({
    super.key,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.accent,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF070B13),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(title),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: DecoratedBox(
            decoration: BoxDecoration(
              color: const Color(0xFF171E2B),
              borderRadius: BorderRadius.circular(26),
              border: Border.all(color: accent.withOpacity(0.4), width: 1.3),
              boxShadow: [
                BoxShadow(
                  color: accent.withOpacity(0.18),
                  blurRadius: 24,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: accent.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(icon, color: accent, size: 38),
                  ),
                  const SizedBox(height: 18),
                  Text(
                    title,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 30,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    subtitle,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: Color(0xFFCED4E1),
                      fontSize: 17,
                      height: 1.35,
                    ),
                  ),
                  const SizedBox(height: 22),
                  FilledButton.icon(
                    onPressed: () => Navigator.of(context).pop(),
                    style: FilledButton.styleFrom(
                      backgroundColor: accent,
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 12,
                      ),
                    ),
                    icon: const Icon(Icons.arrow_back_rounded),
                    label: const Text(
                      'Return To Controller',
                      style: TextStyle(fontWeight: FontWeight.w700),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

Color _directionColor(SwipeDirection direction) {
  switch (direction) {
    case SwipeDirection.up:
      return const Color(0xFF70CEFF);
    case SwipeDirection.left:
      return const Color(0xFFFFB985);
    case SwipeDirection.right:
      return const Color(0xFF81F5BD);
    case SwipeDirection.down:
      return const Color(0xFFFF7168);
    case SwipeDirection.none:
      return const Color(0xFFF2A19C);
  }
}

double _directionToAngle(SwipeDirection direction) {
  switch (direction) {
    case SwipeDirection.up:
      return -math.pi / 2;
    case SwipeDirection.down:
      return math.pi / 2;
    case SwipeDirection.left:
      return math.pi;
    case SwipeDirection.right:
      return 0;
    case SwipeDirection.none:
      return 0;
  }
}

String _directionTitle(SwipeDirection direction) {
  switch (direction) {
    case SwipeDirection.up:
      return 'Voice Reporting';
    case SwipeDirection.left:
      return 'Text Reporting';
    case SwipeDirection.right:
      return 'Keyword Reporting';
    case SwipeDirection.down:
      return 'Instant SOS';
    case SwipeDirection.none:
      return 'None';
  }
}

String _tabLabel(GuardianTab tab) {
  switch (tab) {
    case GuardianTab.status:
      return 'STATUS';
    case GuardianTab.reports:
      return 'REPORTS';
    case GuardianTab.map:
      return 'MAP';
    case GuardianTab.settings:
      return 'SETTINGS';
  }
}

IconData _tabIcon(GuardianTab tab) {
  switch (tab) {
    case GuardianTab.status:
      return Icons.error_outline_rounded;
    case GuardianTab.reports:
      return Icons.report_gmailerrorred_rounded;
    case GuardianTab.map:
      return Icons.place_outlined;
    case GuardianTab.settings:
      return Icons.settings_outlined;
  }
}

String? _tabRoute(GuardianTab tab) {
  switch (tab) {
    case GuardianTab.status:
      return null;
    case GuardianTab.reports:
      return '/reports';
    case GuardianTab.map:
      return '/map';
    case GuardianTab.settings:
      return '/settings';
  }
}

Offset _clampOffset(Offset value, double maxDistance) {
  final distance = value.distance;
  if (distance <= maxDistance || distance == 0) {
    return value;
  }

  final scale = maxDistance / distance;
  return Offset(value.dx * scale, value.dy * scale);
}
