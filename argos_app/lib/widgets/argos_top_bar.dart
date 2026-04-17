import 'package:flutter/material.dart';

class ArgosTopBar extends StatelessWidget {
  const ArgosTopBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0x24FF8B81),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.shield_outlined,
                color: Color(0xFFFFB2A7),
                size: 22,
              ),
            ),
            const SizedBox(width: 12),
            const Text(
              'Argos',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w700,
                color: Color(0xFFE3DFE2),
              ),
            ),
            const Spacer(),
            const Icon(
              Icons.sensors_rounded,
              color: Color(0xFFC2C4D0),
              size: 28,
            ),
          ],
        ),
        const SizedBox(height: 18),
        Row(
          children: [
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'CURRENT STATUS',
                  style: TextStyle(
                    color: Color(0xFFDEB8B0),
                    fontSize: 14,
                    letterSpacing: 1.1,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'You are safe.',
                  style: TextStyle(
                    color: Color(0xFFE5E8F0),
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
            const Spacer(),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: const Color(0xFF103C1E),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF1E7A42)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.circle, color: Color(0xFF43E173), size: 12),
                  SizedBox(width: 8),
                  Text(
                    'Protected',
                    style: TextStyle(
                      color: Color(0xFF43E173),
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }
}
