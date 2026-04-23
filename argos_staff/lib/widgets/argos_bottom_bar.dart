import 'package:flutter/material.dart';

import '../models/staff_tab.dart';

class ArgosBottomBar extends StatelessWidget {
  const ArgosBottomBar({
    super.key,
    required this.selectedTab,
    required this.onSelected,
  });

  final StaffTab selectedTab;
  final ValueChanged<StaffTab> onSelected;

  static const List<StaffTab> _tabs = [
    StaffTab.dashboard,
    StaffTab.dispatch,
    StaffTab.response,
    StaffTab.debrief,
  ];

  @override
  Widget build(BuildContext context) {
    final selectedIndex = _tabs.indexOf(selectedTab);
    final safeIndex = selectedIndex < 0 ? 0 : selectedIndex;

    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF0F111B),
        border: Border(top: BorderSide(color: Color(0x3340495C))),
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              height: 2,
              child: LayoutBuilder(
                builder: (context, constraints) {
                  final tabWidth = constraints.maxWidth / _tabs.length;

                  return Stack(
                    fit: StackFit.expand,
                    children: [
                      const ColoredBox(color: Color(0x1AFFFFFF)),
                      AnimatedPositioned(
                        duration: const Duration(milliseconds: 220),
                        curve: Curves.easeOutCubic,
                        left: tabWidth * safeIndex,
                        width: tabWidth,
                        child: const ColoredBox(
                          color: Color(0xFFFF3D52),
                          child: SizedBox(height: 2),
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 10, 8, 8),
              child: Row(
                children: [
                  for (final tab in _tabs)
                    Expanded(
                      child: _BottomBarTabButton(
                        tab: tab,
                        isActive: selectedTab == tab,
                        onTap: () => onSelected(tab),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BottomBarTabButton extends StatelessWidget {
  const _BottomBarTabButton({
    required this.tab,
    required this.isActive,
    required this.onTap,
  });

  final StaffTab tab;
  final bool isActive;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final foreground = isActive
        ? const Color(0xFFFF3D52)
        : const Color(0xFF7A7F8B);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(tab.icon, color: foreground, size: 30),
              const SizedBox(height: 6),
              Text(
                tab.label,
                style: TextStyle(
                  color: foreground,
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.0,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
