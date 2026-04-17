import 'package:flutter/material.dart';

import '../features/sos/sos_helpers.dart';
import '../models/swipe_direction.dart';

class GuidanceCard extends StatelessWidget {
  const GuidanceCard({
    super.key,
    required this.text,
    required this.activeDirection,
  });

  final String text;
  final SwipeDirection activeDirection;

  @override
  Widget build(BuildContext context) {
    final isLocked = activeDirection != SwipeDirection.none;
    final accent = isLocked
        ? directionColor(activeDirection)
        : const Color(0xFFAFB7C8);

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0xDF1A212D),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0x2AFFFFFF)),
      ),
      child: Row(
        children: [
          Icon(Icons.swipe_rounded, color: accent, size: 24),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                color: isLocked ? Colors.white : const Color(0xFFE1E5EF),
                fontSize: 15,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.2,
                height: 1.35,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
