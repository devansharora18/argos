import 'package:flutter/material.dart';

import '../models/argos_tab.dart';
import '../screens/action_page.dart';
import '../screens/argos_home_page.dart';
import 'app_routes.dart';

class AppRouter {
  const AppRouter._();

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppRoutes.home:
        return MaterialPageRoute<void>(
          builder: (_) => const ArgosHomePage(),
          settings: settings,
        );
      case AppRoutes.voice:
        return _buildActionRoute(
          settings: settings,
          selectedTab: ArgosTab.status,
          title: 'Voice Reporting',
          subtitle:
              'Live voice capture is ready. Keep the channel open until responders confirm your location.',
          icon: Icons.keyboard_voice_rounded,
          accent: const Color(0xFF67C7FF),
          beginOffset: const Offset(0, 0.2),
        );
      case AppRoutes.text:
        return _buildActionRoute(
          settings: settings,
          selectedTab: ArgosTab.status,
          title: 'Text Reporting',
          subtitle:
              'Send a rapid text incident report with auto-attached location and timestamp.',
          icon: Icons.sms_rounded,
          accent: const Color(0xFFFFB476),
          beginOffset: const Offset(0.2, 0),
        );
      case AppRoutes.keyword:
        return _buildActionRoute(
          settings: settings,
          selectedTab: ArgosTab.status,
          title: 'Keyword Reporting',
          subtitle:
              'Activate silent keyword detection for discreet emergency escalation.',
          icon: Icons.record_voice_over_rounded,
          accent: const Color(0xFF81F5BB),
          beginOffset: const Offset(-0.2, 0),
        );
      case AppRoutes.sos:
        return _buildActionRoute(
          settings: settings,
          selectedTab: ArgosTab.status,
          title: 'Instant SOS',
          subtitle:
              'Immediate distress broadcast sent. Stay visible and keep this screen active.',
          icon: Icons.warning_amber_rounded,
          accent: const Color(0xFFFF6D66),
          beginOffset: const Offset(0, -0.2),
        );
      case AppRoutes.reports:
        return _buildActionRoute(
          settings: settings,
          selectedTab: ArgosTab.reports,
          title: 'Reports',
          subtitle:
              'Review incident history, response logs, and evidence captured across channels.',
          icon: Icons.article_rounded,
          accent: const Color(0xFFFFB476),
          beginOffset: const Offset(0.14, 0),
        );
      case AppRoutes.map:
        return _buildActionRoute(
          settings: settings,
          selectedTab: ArgosTab.map,
          title: 'Map',
          subtitle:
              'Track your live location, safety perimeter, and nearby emergency resources.',
          icon: Icons.place_rounded,
          accent: const Color(0xFF70CEFF),
          beginOffset: const Offset(0, 0.16),
        );
      case AppRoutes.settings:
        return _buildActionRoute(
          settings: settings,
          selectedTab: ArgosTab.settings,
          title: 'Settings',
          subtitle:
              'Manage trusted contacts, privacy controls, and emergency automation preferences.',
          icon: Icons.settings_rounded,
          accent: const Color(0xFFD2D9EA),
          beginOffset: const Offset(-0.14, 0),
        );
      default:
        return MaterialPageRoute<void>(
          builder: (_) => const ArgosHomePage(),
          settings: settings,
        );
    }
  }

  static Route<void> _buildActionRoute({
    required RouteSettings settings,
    required ArgosTab selectedTab,
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
        selectedTab: selectedTab,
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
}
