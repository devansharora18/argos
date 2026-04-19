import 'package:flutter/material.dart';

import '../models/argos_tab.dart';

class ArgosBottomBar extends StatelessWidget {
  const ArgosBottomBar({
    super.key,
    required this.selectedTab,
    required this.onSelected,
  });

  final ArgosTab selectedTab;
  final ValueChanged<ArgosTab> onSelected;

  static const List<ArgosTab> _tabs = [
    ArgosTab.status,
    ArgosTab.reports,
    ArgosTab.map,
    ArgosTab.settings,
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: const Color(0xF2090C13),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: const Color(0x24FFFFFF), width: 1),
        boxShadow: const [
          BoxShadow(
            color: Color(0xA1000000),
            blurRadius: 24,
            offset: Offset(0, 10),
          ),
        ],
      ),
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
    );
  }
}

class _BottomBarTabButton extends StatelessWidget {
  const _BottomBarTabButton({
    required this.tab,
    required this.isActive,
    required this.onTap,
  });

  final ArgosTab tab;
  final bool isActive;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final foreground = isActive ? Colors.white : const Color(0xFF8A8F99);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(22),
          onTap: onTap,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            curve: Curves.easeOutCubic,
            padding: const EdgeInsets.symmetric(vertical: 11),
            decoration: BoxDecoration(
              color: isActive ? const Color(0xFFFF554B) : Colors.transparent,
              borderRadius: BorderRadius.circular(22),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(tab.icon, size: 27, color: foreground),
                const SizedBox(height: 6),
                Text(
                  tab.label,
                  style: TextStyle(
                    color: foreground,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.0,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
