import 'package:flutter/material.dart';

import '../models/staff_tab.dart';
import '../routing/app_routes.dart';
import 'argos_bottom_bar.dart';
import 'argos_top_bar.dart';

class ArgosScreenShell extends StatelessWidget {
  const ArgosScreenShell({
    super.key,
    required this.selectedTab,
    required this.child,
    this.showProfileInTopBar = true,
    this.notificationColor = const Color(0xFF8A90A0),
  });

  final StaffTab selectedTab;
  final Widget child;
  final bool showProfileInTopBar;
  final Color notificationColor;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF06070D),
      body: Column(
        children: [
          SafeArea(
            bottom: false,
            child: ArgosTopBar(
              showProfileAvatar: showProfileInTopBar,
              notificationColor: notificationColor,
            ),
          ),
          Expanded(child: child),
          ArgosBottomBar(
            selectedTab: selectedTab,
            onSelected: (tab) {
              final targetRoute = tab.route ?? AppRoutes.home;
              final currentRoute =
                  ModalRoute.of(context)?.settings.name ?? AppRoutes.home;

              if (targetRoute == currentRoute) {
                return;
              }

              Navigator.of(context).pushReplacementNamed(targetRoute);
            },
          ),
        ],
      ),
    );
  }
}
