import 'package:flutter/material.dart';

import '../models/argos_tab.dart';
import '../widgets/argos_screen_shell.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key, this.selectedTab = ArgosTab.settings});

  final ArgosTab selectedTab;

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _pushNotifications = true;
  bool _alwaysOnGps = true;
  bool _biometricLock = false;

  static const List<_EmergencyContact> _contacts = [
    _EmergencyContact(
      name: 'Sarah Reyes',
      avatarColor: Color(0xFF1F2A55),
      iconColor: Color(0xFF6F8DFF),
    ),
    _EmergencyContact(
      name: 'Marco Villanueva',
      avatarColor: Color(0xFF3A1F4E),
      iconColor: Color(0xFFC18CFF),
    ),
    _EmergencyContact(
      name: 'Dr. Kim Park',
      avatarColor: Color(0xFF153A24),
      iconColor: Color(0xFF65E0A0),
    ),
  ];

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
            const Text(
              'Settings',
              style: TextStyle(
                color: Color(0xFFF1F2F4),
                fontSize: 44,
                fontWeight: FontWeight.w800,
                height: 1.05,
              ),
            ),
            const SizedBox(height: 20),
            _ProfileCard(
              name: 'Alex Reyes',
              email: 'alex@argosprotect.com',
              onTap: () {},
            ),
            const SizedBox(height: 14),
            _SettingTile(
              title: 'Push Notifications',
              subtitle: 'Alerts for nearby emergencies',
              value: _pushNotifications,
              onChanged: (v) => setState(() => _pushNotifications = v),
            ),
            const SizedBox(height: 12),
            _SettingTile(
              title: 'Always-on GPS',
              subtitle: 'Precise location tracking',
              value: _alwaysOnGps,
              onChanged: (v) => setState(() => _alwaysOnGps = v),
            ),
            const SizedBox(height: 12),
            _SettingTile(
              title: 'Biometric Lock',
              subtitle: 'Protect SOS activation',
              value: _biometricLock,
              onChanged: (v) => setState(() => _biometricLock = v),
            ),
            const SizedBox(height: 26),
            const Text(
              'EMERGENCY CONTACTS',
              style: TextStyle(
                color: Color(0xFF7A7E89),
                fontSize: 12,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.6,
              ),
            ),
            const SizedBox(height: 12),
            for (var i = 0; i < _contacts.length; i++) ...[
              _ContactTile(contact: _contacts[i]),
              if (i != _contacts.length - 1) const SizedBox(height: 10),
            ],
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }
}

class _ProfileCard extends StatelessWidget {
  const _ProfileCard({
    required this.name,
    required this.email,
    required this.onTap,
  });

  final String name;
  final String email;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(22),
        child: Container(
          padding: const EdgeInsets.fromLTRB(14, 14, 16, 14),
          decoration: BoxDecoration(
            color: const Color(0xFF1A1C24),
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: const Color(0x14FFFFFF)),
          ),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: const BoxDecoration(
                  color: Color(0xFF1F2A55),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.person_outline_rounded,
                  color: Color(0xFF8FA6FF),
                  size: 28,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        color: Color(0xFFF1F2F4),
                        fontSize: 19,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      email,
                      style: const TextStyle(
                        color: Color(0xFF9498A4),
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.chevron_right_rounded,
                color: Color(0xFF6E727D),
                size: 26,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SettingTile extends StatelessWidget {
  const _SettingTile({
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
  });

  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 14, 14, 14),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1C24),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0x14FFFFFF)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Color(0xFFF1F2F4),
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: Color(0xFF9498A4),
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          Switch.adaptive(
            value: value,
            onChanged: onChanged,
            activeColor: Colors.white,
            activeTrackColor: const Color(0xFFFF554B),
            inactiveThumbColor: Colors.white,
            inactiveTrackColor: const Color(0xFF3A3D47),
            trackOutlineColor:
                const WidgetStatePropertyAll(Colors.transparent),
          ),
        ],
      ),
    );
  }
}

class _EmergencyContact {
  const _EmergencyContact({
    required this.name,
    required this.avatarColor,
    required this.iconColor,
  });

  final String name;
  final Color avatarColor;
  final Color iconColor;
}

class _ContactTile extends StatelessWidget {
  const _ContactTile({required this.contact});

  final _EmergencyContact contact;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 12, 16, 12),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1C24),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0x14FFFFFF)),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: contact.avatarColor,
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.person_outline_rounded,
              color: contact.iconColor,
              size: 24,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Text(
              contact.name,
              style: const TextStyle(
                color: Color(0xFFF1F2F4),
                fontSize: 17,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(
              Icons.phone_outlined,
              color: Color(0xFFB8BBC6),
              size: 22,
            ),
            visualDensity: VisualDensity.compact,
          ),
        ],
      ),
    );
  }
}
