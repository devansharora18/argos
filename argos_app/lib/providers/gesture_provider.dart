import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/gesture_state.dart';
import '../models/swipe_direction.dart';

const double gestureActivationThreshold = 104;

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
      (ref) => GestureStateNotifier(threshold: gestureActivationThreshold),
    );
