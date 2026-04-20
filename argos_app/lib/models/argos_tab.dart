import 'package:flutter/material.dart';

import '../routing/app_routes.dart';

enum ArgosTab { status, reports, map, settings }

extension ArgosTabX on ArgosTab {
  String get label {
    switch (this) {
      case ArgosTab.status:
        return 'STATUS';
      case ArgosTab.reports:
        return 'REPORTS';
      case ArgosTab.map:
        return 'MAP';
      case ArgosTab.settings:
        return 'SETTINGS';
    }
  }

  IconData get icon {
    switch (this) {
      case ArgosTab.status:
        return Icons.error_outline_rounded;
      case ArgosTab.reports:
        return Icons.report_gmailerrorred_rounded;
      case ArgosTab.map:
        return Icons.place_outlined;
      case ArgosTab.settings:
        return Icons.settings_outlined;
    }
  }

  String? get route {
    switch (this) {
      case ArgosTab.status:
        return null;
      case ArgosTab.reports:
        return AppRoutes.reports;
      case ArgosTab.map:
        return AppRoutes.map;
      case ArgosTab.settings:
        return AppRoutes.settings;
    }
  }
}
