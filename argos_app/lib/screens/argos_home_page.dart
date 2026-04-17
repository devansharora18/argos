import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../features/sos/sos_helpers.dart';
import '../features/sos/sos_radial_controller.dart';
import '../models/argos_tab.dart';
import '../models/swipe_direction.dart';
import '../providers/bottom_tab_provider.dart';
import '../providers/gesture_provider.dart';
import '../widgets/argos_bottom_bar.dart';
import '../widgets/argos_top_bar.dart';
import '../widgets/guidance_card.dart';

class ArgosHomePage extends ConsumerWidget {
  const ArgosHomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gesture = ref.watch(gestureProvider);
    final activeTab = ref.watch(bottomTabProvider);
    final lockedDirection = gesture.thresholdPassed
        ? gesture.activeDirection
        : SwipeDirection.none;

    final statusText = lockedDirection == SwipeDirection.none
        ? 'Swipe from center to choose a reporting channel.'
        : 'Release to confirm ${directionTitle(lockedDirection)}.';

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF0A0F1A), Color(0xFF0A111D), Color(0xFF060910)],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Column(
              children: [
                const ArgosTopBar(),
                const SizedBox(height: 18),
                const Expanded(
                  child: Align(
                    alignment: Alignment(0, 0.06),
                    child: SOSRadialController(),
                  ),
                ),
                GuidanceCard(
                  text: statusText,
                  activeDirection: lockedDirection,
                ),
                const SizedBox(height: 12),
                ArgosBottomBar(
                  selectedTab: activeTab,
                  onSelected: (tab) {
                    ref.read(bottomTabProvider.notifier).state = tab;
                    final route = tab.route;
                    if (route == null) {
                      return;
                    }

                    Navigator.of(context).pushNamed(route).whenComplete(() {
                      if (context.mounted) {
                        ref.read(bottomTabProvider.notifier).state =
                            ArgosTab.status;
                      }
                    });
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
