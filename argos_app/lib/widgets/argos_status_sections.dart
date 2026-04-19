import 'package:flutter/material.dart';

class ArgosStatusSections extends StatelessWidget {
  const ArgosStatusSections({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: const [
        _LocationSectionCard(),
        SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: AspectRatio(
                aspectRatio: 1.02,
                child: _InfoSectionCard(
                  icon: Icons.health_and_safety_outlined,
                  iconColor: Color(0xFF54E58D),
                  title: 'Vital Signs',
                  subtitle: 'Syncing via Apple Watch',
                ),
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: AspectRatio(
                aspectRatio: 1.02,
                child: _InfoSectionCard(
                  icon: Icons.group_outlined,
                  iconColor: Color(0xFFF4B5A6),
                  title: '4 Contacts',
                  subtitle: 'Notified on activation',
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _LocationSectionCard extends StatelessWidget {
  const _LocationSectionCard();

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xDB2A2A2D),
      borderRadius: BorderRadius.circular(30),
      shadowColor: const Color(0x70000000),
      elevation: 8,
      child: InkWell(
        borderRadius: BorderRadius.circular(30),
        onTap: () {},
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: const Color(0xFF30476E),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(
                  Icons.location_on_outlined,
                  color: Color(0xFFA7BDFF),
                  size: 27,
                ),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'San Francisco, CA',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFFE9E9EC),
                      ),
                    ),
                    SizedBox(height: 1),
                    Text(
                      '37.7749\u00b0 N, 122.4194\u00b0 W',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFFBEBEC5),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    'ACCURACY',
                    style: TextStyle(
                      fontSize: 12,
                      letterSpacing: 1.0,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFE0C1B8),
                    ),
                  ),
                  SizedBox(height: 3),
                  Text(
                    'High (2m)',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFFAEC0FF),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoSectionCard extends StatelessWidget {
  const _InfoSectionCard({
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
    return Material(
      color: const Color(0xDB2A2A2D),
      borderRadius: BorderRadius.circular(30),
      shadowColor: const Color(0x70000000),
      elevation: 7,
      child: InkWell(
        borderRadius: BorderRadius.circular(30),
        onTap: () {},
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 15),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: iconColor, size: 30),
              const SizedBox(height: 16),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFFE8E8EB),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFFBBBCC3),
                  height: 1.2,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
