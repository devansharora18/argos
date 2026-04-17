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
