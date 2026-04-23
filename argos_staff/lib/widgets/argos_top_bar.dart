import 'package:flutter/material.dart';

class ArgosTopBar extends StatelessWidget {
  const ArgosTopBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(18, 14, 18, 12),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF141828), Color(0xFF0E101A)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        border: Border(bottom: BorderSide(color: Color(0x3340495C))),
      ),
      child: Row(
        children: [
          const Icon(Icons.shield_outlined, size: 33, color: Color(0xFFFF3D52)),
          const SizedBox(width: 10),
          const Expanded(
            child: Text(
              'ARGOS_OPS',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                letterSpacing: 2.2,
                color: Color(0xFFFF3D52),
              ),
            ),
          ),
          const Icon(
            Icons.notifications_none_rounded,
            size: 30,
            color: Color(0xFF8A90A0),
          ),
          const SizedBox(width: 14),
          Container(
            width: 50,
            height: 50,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: const Color(0xFF2A1A1B),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFF544C58), width: 1.2),
            ),
            child: const Text(
              'JD',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: Color(0xFFEDEEF3),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
