import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../models/swipe_direction.dart';

Color directionColor(SwipeDirection direction) {
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

double directionToAngle(SwipeDirection direction) {
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

String directionTitle(SwipeDirection direction) {
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

Offset clampOffset(Offset value, double maxDistance) {
  final distance = value.distance;
  if (distance <= maxDistance || distance == 0) {
    return value;
  }

  final scale = maxDistance / distance;
  return Offset(value.dx * scale, value.dy * scale);
}
