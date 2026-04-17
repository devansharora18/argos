import 'package:flutter/material.dart';

import '../models/argos_tab.dart';
import '../widgets/argos_screen_shell.dart';

class TextReportPage extends StatefulWidget {
  const TextReportPage({super.key, this.selectedTab = ArgosTab.status});

  final ArgosTab selectedTab;

  @override
  State<TextReportPage> createState() => _TextReportPageState();
}

class _TextReportPageState extends State<TextReportPage> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ArgosScreenShell(
      selectedTab: widget.selectedTab,
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(
          parent: AlwaysScrollableScrollPhysics(),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Text(
                  'EMERGENCY REPORT',
                  style: TextStyle(
                    color: Color(0xFF9DB6FF),
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.1,
                  ),
                ),
                const Spacer(),
                Container(
                  width: 12,
                  height: 12,
                  decoration: const BoxDecoration(
                    color: Color(0xFFFF534A),
                    shape: BoxShape.circle,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            const Text(
              'What is happening?',
              style: TextStyle(
                color: Color(0xFFF2F2F2),
                fontSize: 45,
                fontWeight: FontWeight.w800,
                height: 1.02,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Describe your situation clearly. Your message will be sent immediately to the nearest response center with your location coordinates.',
              style: TextStyle(
                color: Color(0xFFE0BFB9),
                fontSize: 18,
                fontWeight: FontWeight.w600,
                height: 1.45,
              ),
            ),
            const SizedBox(height: 28),
            _MessageInputCard(controller: _controller),
            const SizedBox(height: 14),
            const _InfoCard(
              icon: Icons.lightbulb_outline_rounded,
              iconColor: Color(0xFF9BB7FF),
              title: 'Be Concise',
              subtitle:
                  'Focus on the \'Who\', \'What\', and \'Where\' for faster response.',
            ),
            const SizedBox(height: 14),
            const _InfoCard(
              icon: Icons.shield_outlined,
              iconColor: Color(0xFF46DC72),
              title: 'Secure Channel',
              subtitle:
                  'This communication is encrypted and prioritized on the network.',
            ),
            const SizedBox(height: 20),
            _SendReportButton(
              onPressed: () {
                FocusScope.of(context).unfocus();
                ScaffoldMessenger.of(context)
                  ..hideCurrentSnackBar()
                  ..showSnackBar(
                    const SnackBar(
                      content: Text('Emergency text report sent.'),
                    ),
                  );
              },
            ),
            const SizedBox(height: 10),
            const Center(
              child: Text(
                'EMERGENCY SERVICES WILL BE CONTACTED INSTANTLY',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Color(0xFFE7C9C2),
                  fontSize: 11.5,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.1,
                ),
              ),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}

class _MessageInputCard extends StatelessWidget {
  const _MessageInputCard({required this.controller});

  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(18, 18, 18, 14),
      decoration: BoxDecoration(
        color: const Color(0xFF0A0B0F),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: const Color(0xFF20242D), width: 1.2),
      ),
      child: Column(
        children: [
          TextField(
            controller: controller,
            minLines: 8,
            maxLines: 8,
            style: const TextStyle(
              color: Color(0xFFECEDEF),
              fontSize: 18,
              fontWeight: FontWeight.w500,
              height: 1.35,
            ),
            decoration: const InputDecoration(
              border: InputBorder.none,
              isCollapsed: true,
              hintText:
                  'Type here... (e.g., \'Minor car accident at the intersection, no immediate injuries, blocking one lane.\')',
              hintStyle: TextStyle(
                color: Color(0xFF6C646A),
                fontSize: 18,
                fontWeight: FontWeight.w500,
                height: 1.35,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Align(
            alignment: Alignment.centerRight,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: const Color(0xFF222329),
                borderRadius: BorderRadius.circular(26),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.location_on_outlined,
                    color: Color(0xFFE6C4BD),
                    size: 20,
                  ),
                  SizedBox(width: 8),
                  Text(
                    'GPS Active',
                    style: TextStyle(
                      color: Color(0xFFE6C4BD),
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  const _InfoCard({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(18, 16, 18, 16),
      decoration: BoxDecoration(
        color: const Color(0xFF17171D),
        borderRadius: BorderRadius.circular(30),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: iconColor, size: 28),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(
              color: Color(0xFFE6E6E8),
              fontSize: 22,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 5),
          Text(
            subtitle,
            style: const TextStyle(
              color: Color(0xFFD0B6AF),
              fontSize: 17,
              fontWeight: FontWeight.w500,
              height: 1.35,
            ),
          ),
        ],
      ),
    );
  }
}

class _SendReportButton extends StatelessWidget {
  const _SendReportButton({required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(34),
        boxShadow: const [
          BoxShadow(color: Color(0x66FF3E38), blurRadius: 26, spreadRadius: 1),
        ],
      ),
      child: SizedBox(
        width: double.infinity,
        child: FilledButton(
          onPressed: onPressed,
          style: FilledButton.styleFrom(
            backgroundColor: const Color(0xFFFF443F),
            foregroundColor: const Color(0xFF2B0705),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
            ),
            textStyle: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
            ),
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Send Report'),
              SizedBox(width: 10),
              Icon(Icons.send_rounded, size: 22),
            ],
          ),
        ),
      ),
    );
  }
}
