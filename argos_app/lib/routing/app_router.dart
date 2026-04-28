import 'package:flutter/material.dart';

import '../models/argos_tab.dart';
import '../screens/action_page.dart';
import '../screens/argos_home_page.dart';
import '../screens/instant_sos_page.dart';
import '../screens/keyword_reporting_page.dart';
import '../screens/map_alert_page.dart';
import '../screens/reports_status_page.dart';
import '../screens/settings_page.dart';
import '../screens/text_report_page.dart';
import '../screens/voice_report_page.dart';
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
        return _buildVoiceRoute(
          settings: settings,
          selectedTab: ArgosTab.status,
          beginOffset: const Offset(0, 0.2),
        );
      case AppRoutes.text:
        return _buildTextRoute(
          settings: settings,
          selectedTab: ArgosTab.status,
          beginOffset: const Offset(0.2, 0),
        );
      case AppRoutes.keyword:
        return _buildKeywordRoute(
          settings: settings,
          selectedTab: ArgosTab.status,
          beginOffset: const Offset(-0.2, 0),
        );
      case AppRoutes.sos:
        return _buildSosRoute(
          settings: settings,
          selectedTab: ArgosTab.status,
          beginOffset: const Offset(0, -0.2),
        );
      case AppRoutes.reports:
        return _buildReportsRoute(
          settings: settings,
          selectedTab: ArgosTab.reports,
          beginOffset: const Offset(0.14, 0),
        );
      case AppRoutes.map:
        return _buildMapRoute(
          settings: settings,
          selectedTab: ArgosTab.map,
          beginOffset: const Offset(0, 0.16),
        );
      case AppRoutes.settings:
        return _buildSettingsRoute(
          settings: settings,
          selectedTab: ArgosTab.settings,
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

  static Route<void> _buildTextRoute({
    required RouteSettings settings,
    required ArgosTab selectedTab,
    required Offset beginOffset,
  }) {
    return PageRouteBuilder<void>(
      settings: settings,
      transitionDuration: const Duration(milliseconds: 320),
      reverseTransitionDuration: const Duration(milliseconds: 220),
      pageBuilder: (_, __, ___) => TextReportPage(selectedTab: selectedTab),
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

  static Route<void> _buildVoiceRoute({
    required RouteSettings settings,
    required ArgosTab selectedTab,
    required Offset beginOffset,
  }) {
    return PageRouteBuilder<void>(
      settings: settings,
      transitionDuration: const Duration(milliseconds: 320),
      reverseTransitionDuration: const Duration(milliseconds: 220),
      pageBuilder: (_, __, ___) => VoiceReportPage(selectedTab: selectedTab),
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

  static Route<void> _buildMapRoute({
    required RouteSettings settings,
    required ArgosTab selectedTab,
    required Offset beginOffset,
  }) {
    return PageRouteBuilder<void>(
      settings: settings,
      transitionDuration: const Duration(milliseconds: 320),
      reverseTransitionDuration: const Duration(milliseconds: 220),
      pageBuilder: (_, __, ___) => MapAlertPage(selectedTab: selectedTab),
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

  static Route<void> _buildReportsRoute({
    required RouteSettings settings,
    required ArgosTab selectedTab,
    required Offset beginOffset,
  }) {
    return PageRouteBuilder<void>(
      settings: settings,
      transitionDuration: const Duration(milliseconds: 320),
      reverseTransitionDuration: const Duration(milliseconds: 220),
      pageBuilder: (_, __, ___) => ReportsStatusPage(selectedTab: selectedTab),
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

  static Route<void> _buildKeywordRoute({
    required RouteSettings settings,
    required ArgosTab selectedTab,
    required Offset beginOffset,
  }) {
    return PageRouteBuilder<void>(
      settings: settings,
      transitionDuration: const Duration(milliseconds: 320),
      reverseTransitionDuration: const Duration(milliseconds: 220),
      pageBuilder: (_, __, ___) =>
          KeywordReportingPage(selectedTab: selectedTab),
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

  static Route<void> _buildSettingsRoute({
    required RouteSettings settings,
    required ArgosTab selectedTab,
    required Offset beginOffset,
  }) {
    return PageRouteBuilder<void>(
      settings: settings,
      transitionDuration: const Duration(milliseconds: 320),
      reverseTransitionDuration: const Duration(milliseconds: 220),
      pageBuilder: (_, __, ___) => SettingsPage(selectedTab: selectedTab),
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

  static Route<void> _buildSosRoute({
    required RouteSettings settings,
    required ArgosTab selectedTab,
    required Offset beginOffset,
  }) {
    return PageRouteBuilder<void>(
      settings: settings,
      transitionDuration: const Duration(milliseconds: 320),
      reverseTransitionDuration: const Duration(milliseconds: 220),
      pageBuilder: (_, __, ___) => InstantSosPage(selectedTab: selectedTab),
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
