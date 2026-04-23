import 'package:flutter/material.dart';

import '../routing/app_routes.dart';

enum StaffTab { dashboard, dispatch, response, debrief }

extension StaffTabX on StaffTab {
  String get label {
    switch (this) {
      case StaffTab.dashboard:
        return 'DASHBOARD';
      case StaffTab.dispatch:
        return 'DISPATCH';
      case StaffTab.response:
        return 'RESPONSE';
      case StaffTab.debrief:
        return 'DEBRIEF';
    }
  }

  IconData get icon {
    switch (this) {
      case StaffTab.dashboard:
        return Icons.grid_view_rounded;
      case StaffTab.dispatch:
        return Icons.warning_amber_rounded;
      case StaffTab.response:
        return Icons.adjust_rounded;
      case StaffTab.debrief:
        return Icons.meeting_room_outlined;
    }
  }

  String? get route {
    switch (this) {
      case StaffTab.dashboard:
        return null;
      case StaffTab.dispatch:
        return AppRoutes.dispatch;
      case StaffTab.response:
        return AppRoutes.response;
      case StaffTab.debrief:
        return AppRoutes.debrief;
    }
  }
}
