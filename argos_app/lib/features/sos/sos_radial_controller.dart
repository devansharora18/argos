import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/swipe_direction.dart';
import '../../providers/gesture_provider.dart';
import 'sos_helpers.dart';
import 'swipe_direction_detector.dart';

class SOSRadialController extends ConsumerWidget {
  const SOSRadialController({super.key});

  static const double _controllerSize = 360;
  static const double _buttonSize = 228;
  static const double _activationRadius = 116;
  static const double _maxVisualDrag = 150;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gesture = ref.watch(gestureProvider);
    final progress = (gesture.dragDistance / gestureActivationThreshold)
        .clamp(0.0, 1.0)
        .toDouble();
    final clampedDrag = clampOffset(gesture.dragOffset, _maxVisualDrag);
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
                color: directionColor(activeDirection).withOpacity(0.45),
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
                child: SOSCoreButton(
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
      painter: GlowRingPainter(
        activeDirection: activeDirection,
        intensity: intensity,
        thresholdProgress: thresholdProgress,
      ),
    );
  }
}

class GlowRingPainter extends CustomPainter {
  GlowRingPainter({
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
      final angle = directionToAngle(direction);
      canvas.drawArc(hintRect, angle - 0.23, 0.46, false, hintPaint);
    }

    if (activeDirection == SwipeDirection.none) {
      return;
    }

    final arcColor = directionColor(activeDirection);
    final arcRect = Rect.fromCircle(center: center, radius: radius - 9);
    final startAngle = directionToAngle(activeDirection) - 0.5;

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
  bool shouldRepaint(covariant GlowRingPainter oldDelegate) {
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

class SOSCoreButton extends StatelessWidget {
  const SOSCoreButton({
    super.key,
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
        ? directionColor(activeDirection)
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
      child: const Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
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
