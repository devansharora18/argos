import 'package:flutter/material.dart';

import '../models/argos_tab.dart';
import '../routing/app_routes.dart';
import 'argos_bottom_bar.dart';
import 'argos_top_bar.dart';

class ArgosScreenShell extends StatelessWidget {
  const ArgosScreenShell({
    super.key,
    required this.selectedTab,
    required this.child,
  });

  final ArgosTab selectedTab;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF131313),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Column(
            children: [
              const ArgosTopBar(),
              const SizedBox(height: 14),
              Expanded(child: child),
              const SizedBox(height: 10),
              ArgosBottomBar(
                selectedTab: selectedTab,
                onSelected: (tab) {
                  final targetRoute = tab.route ?? AppRoutes.home;
                  final currentRoute =
                      ModalRoute.of(context)?.settings.name ?? AppRoutes.home;

                  if (currentRoute == targetRoute) {
                    return;
                  }

                  Navigator.of(context).pushReplacementNamed(targetRoute);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
