import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/swipe_direction.dart';
import '../routing/app_routes.dart';

class NavigationController {
  const NavigationController();

  String? routeForDirection(SwipeDirection direction) {
    switch (direction) {
      case SwipeDirection.up:
        return AppRoutes.voice;
      case SwipeDirection.left:
        return AppRoutes.text;
      case SwipeDirection.right:
        return AppRoutes.keyword;
      case SwipeDirection.down:
        return AppRoutes.sos;
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
