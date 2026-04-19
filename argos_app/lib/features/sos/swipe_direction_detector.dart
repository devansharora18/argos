import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/swipe_direction.dart';
import '../../providers/gesture_provider.dart';
import '../../providers/navigation_provider.dart';

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
  int? _activePointer;
  ProviderContainer? _container;

  Offset? _centerFromRenderBox() {
    final renderObject = context.findRenderObject();
    if (renderObject is! RenderBox || !renderObject.hasSize) {
      return null;
    }

    final size = renderObject.size;
    return Offset(size.width / 2, size.height / 2);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _container = ProviderScope.containerOf(context, listen: false);
  }

  void _unlockGestureState({bool useRef = true}) {
    _tracking = false;
    _activePointer = null;

    if (useRef) {
      ref.read(sosInputLockProvider.notifier).state = false;
      return;
    }

    _container?.read(sosInputLockProvider.notifier).state = false;
  }

  @override
  void dispose() {
    _unlockGestureState(useRef: false);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RawGestureDetector(
      behavior: HitTestBehavior.translucent,
      gestures: {
        EagerGestureRecognizer:
            GestureRecognizerFactoryWithHandlers<EagerGestureRecognizer>(
              () => EagerGestureRecognizer(),
              (instance) {},
            ),
      },
      child: Listener(
        behavior: HitTestBehavior.translucent,
        onPointerDown: (event) {
          if (_activePointer != null) {
            return;
          }

          final center = _centerFromRenderBox();
          if (center == null) {
            ref.read(sosInputLockProvider.notifier).state = false;
            return;
          }

          final isInsideActivationArea =
              (event.localPosition - center).distance <=
              widget.activationRadius;

          ref.read(sosInputLockProvider.notifier).state =
              isInsideActivationArea;
          if (!isInsideActivationArea) {
            return;
          }

          _activePointer = event.pointer;
          _tracking = true;
          final notifier = ref.read(gestureProvider.notifier);
          notifier.startDrag(center);
          notifier.updateDrag(event.localPosition);
        },
        onPointerMove: (event) {
          if (!_tracking || event.pointer != _activePointer) {
            return;
          }

          ref.read(gestureProvider.notifier).updateDrag(event.localPosition);
        },
        onPointerUp: (event) {
          if (!_tracking || event.pointer != _activePointer) {
            if (event.pointer == _activePointer) {
              _unlockGestureState();
            }
            return;
          }

          final selection = ref.read(gestureProvider.notifier).endDrag();
          _unlockGestureState();
          if (selection != SwipeDirection.none && mounted) {
            ref.read(navigationProvider).navigate(context, selection);
          }
        },
        onPointerCancel: (event) {
          if (event.pointer != _activePointer) {
            return;
          }

          ref.read(gestureProvider.notifier).reset();
          _unlockGestureState();
        },
        child: widget.child,
      ),
    );
  }
}
