import 'package:flutter/material.dart';

import 'swipe_direction.dart';

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

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }

    return other is GestureState &&
        other.dragOffset == dragOffset &&
        other.activeDirection == activeDirection &&
        other.isDragging == isDragging &&
        other.dragDistance == dragDistance &&
        other.thresholdPassed == thresholdPassed;
  }

  @override
  int get hashCode {
    return Object.hash(
      dragOffset,
      activeDirection,
      isDragging,
      dragDistance,
      thresholdPassed,
    );
  }
}
