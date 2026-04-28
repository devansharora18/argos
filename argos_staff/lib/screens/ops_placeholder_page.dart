import 'package:flutter/material.dart';

import '../models/staff_tab.dart';
import '../widgets/argos_screen_shell.dart';

class OpsPlaceholderPage extends StatelessWidget {
  const OpsPlaceholderPage({
    super.key,
    required this.selectedTab,
    required this.title,
    required this.subtitle,
    required this.icon,
  });

  final StaffTab selectedTab;
  final String title;
  final String subtitle;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return ArgosScreenShell(
      selectedTab: selectedTab,
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF121622),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF283043)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(icon, size: 46, color: const Color(0xFFB9C2D9)),
                const SizedBox(height: 14),
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 23,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFFEFF2FA),
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  subtitle,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 15,
                    height: 1.4,
                    color: Color(0xFF8E95A8),
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
