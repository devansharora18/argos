import 'package:flutter/material.dart';

import '../models/staff_tab.dart';
import '../screens/ops_dashboard_page.dart';
import '../screens/ops_dispatch_page.dart';
import '../screens/ops_placeholder_page.dart';
import '../screens/ops_response_page.dart';
import 'app_routes.dart';

class AppRouter {
  const AppRouter._();

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppRoutes.home:
        return MaterialPageRoute<void>(
          builder: (_) => const OpsDashboardPage(),
          settings: settings,
        );
      case AppRoutes.dispatch:
        return _buildRoute(
          settings: settings,
          beginOffset: const Offset(0.16, 0),
          child: const OpsDispatchPage(),
        );
      case AppRoutes.response:
        return _buildRoute(
          settings: settings,
          beginOffset: const Offset(0, 0.16),
          child: const OpsResponsePage(),
        );
      case AppRoutes.debrief:
        return _buildRoute(
          settings: settings,
          beginOffset: const Offset(-0.16, 0),
          child: const OpsPlaceholderPage(
            selectedTab: StaffTab.debrief,
            title: 'Debrief Archive',
            subtitle: 'Post-incident summaries and notes will show here.',
            icon: Icons.meeting_room_outlined,
          ),
        );
      default:
        return MaterialPageRoute<void>(
          builder: (_) => const OpsDashboardPage(),
          settings: settings,
        );
    }
  }

  static Route<void> _buildRoute({
    required RouteSettings settings,
    required Widget child,
    required Offset beginOffset,
  }) {
    return PageRouteBuilder<void>(
      settings: settings,
      transitionDuration: const Duration(milliseconds: 260),
      reverseTransitionDuration: const Duration(milliseconds: 190),
      pageBuilder: (context, animation, secondaryAnimation) => child,
      transitionsBuilder: (context, animation, secondaryAnimation, pageChild) {
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
            child: pageChild,
          ),
        );
      },
    );
  }
}
