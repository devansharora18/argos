import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/staff_tab.dart';
import '../providers/crisis_provider.dart';
import '../widgets/argos_screen_shell.dart';

class OpsResponsePage extends ConsumerWidget {
  const OpsResponsePage({super.key, this.selectedTab = StaffTab.response});

  final StaffTab selectedTab;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final crisis = ref.watch(crisisProvider);
    final dispatch = crisis?.primaryDispatch;

    final String missionTitle = crisis != null
        ? '${crisis.crisisType[0].toUpperCase()}${crisis.crisisType.substring(1).replaceAll('_', ' ').toUpperCase()}'
        : 'STRUCTURAL FIRE';

    final String missionLocation = crisis != null
        ? 'Floor ${crisis.floor}, ${crisis.zone}'
        : 'Room 312, Floor 3';

    final String bannerText = crisis != null
        ? 'RESPONDING — FLOOR ${crisis.floor} ${crisis.crisisType.toUpperCase()}'
        : 'RESPONDING - FLOOR 3 FIRE';

    return ArgosScreenShell(
      selectedTab: selectedTab,
      showProfileInTopBar: false,
      notificationColor: const Color(0xFFFF3D52),
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(
          parent: AlwaysScrollableScrollPhysics(),
        ),
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 22),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _ResponseStatusBanner(text: bannerText),
            const SizedBox(height: 14),
            _CurrentMissionCard(
              title: missionTitle,
              location: missionLocation,
              hasLive: crisis != null,
            ),
            const SizedBox(height: 16),
            const _SectionLabel('LIVE UPDATES'),
            const SizedBox(height: 10),
            // Live AI control room summary at top
            if (crisis != null) ...[
              _UpdateCard(
                accent: const Color(0xFFFFB6B7),
                icon: Icons.psychology_rounded,
                title: 'AI ANALYSIS',
                timestamp: 'LIVE',
                body: crisis.controlRoomSummary,
                titleColor: const Color(0xFFFFB6B7),
              ),
              const SizedBox(height: 8),
            ],
            // Dispatch instruction if assigned
            if (dispatch != null) ...[
              _UpdateCard(
                accent: const Color(0xFFFFC35F),
                icon: Icons.assignment_ind_rounded,
                title: 'YOUR ASSIGNMENT',
                timestamp: 'DISPATCH',
                body: dispatch.instruction,
                titleColor: const Color(0xFFFFC35F),
              ),
              const SizedBox(height: 8),
            ],
            // Guest notification
            if (crisis != null) ...[
              _UpdateCard(
                accent: const Color(0xFFFF314D),
                icon: Icons.groups_rounded,
                title: 'GUEST NOTIFICATION',
                timestamp: 'BROADCAST',
                body:
                    '${crisis.guestNotification.message} Route: ${crisis.guestNotification.evacuationRoute}',
                titleColor: const Color(0xFFFF314D),
              ),
              const SizedBox(height: 8),
            ],
            // Static fallback updates shown when no live incident
            if (crisis == null) ...[
              const _UpdateCard(
                accent: Color(0xFFFFB6B7),
                icon: Icons.local_fire_department_rounded,
                title: 'CRITICAL ALERT',
                timestamp: 'T-00:45',
                body:
                    'Thermal imaging confirms secondary hotspot in adjacent ductwork. Proceed with extreme caution.',
                titleColor: Color(0xFFFFB6B7),
              ),
              const SizedBox(height: 8),
              const _UpdateCard(
                accent: Color(0xFFFFC35F),
                icon: Icons.wifi_tethering_rounded,
                title: 'SYSTEM ALERT',
                timestamp: 'T-01:12',
                body:
                    'HVAC lockdown initiated for Floor 3. Visibility dropping rapidly in main access corridor.',
                titleColor: Color(0xFFFFC35F),
              ),
              const SizedBox(height: 8),
              const _UpdateCard(
                accent: Color(0xFFFF314D),
                icon: Icons.groups_rounded,
                title: 'DISPATCH LOG',
                timestamp: 'T-02:30',
                body:
                    'Evacuation of Floor 4 complete. Medical staging area established at North Exit point.',
                titleColor: Color(0xFFFF314D),
              ),
            ],
            const SizedBox(height: 16),
            const _SectionLabel('TACTICAL COMMANDS'),
            const SizedBox(height: 10),
            const _PrimaryTacticalButton(),
            const SizedBox(height: 8),
            const _DualTacticalRow(),
            const SizedBox(height: 10),
            const _ResolvedButton(),
            const SizedBox(height: 16),
            const _SectionLabel('EQUIPMENT CHECK'),
            const SizedBox(height: 10),
            _EquipmentCheckCard(
              equipment: dispatch?.equipmentToBring ?? [],
            ),
          ],
        ),
      ),
    );
  }
}

class _ResponseStatusBanner extends StatelessWidget {
  const _ResponseStatusBanner({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 10, 14, 10),
      decoration: BoxDecoration(
        color: const Color(0xFFFFBABA),
        border: Border.all(color: const Color(0x99FFD0D0)),
        boxShadow: const [
          BoxShadow(color: Color(0x22FF6D73), blurRadius: 16, spreadRadius: 2),
        ],
      ),
      child: Row(
        children: [
          const Icon(
            Icons.warning_amber_rounded,
            color: Color(0xFF671218),
            size: 32,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.2,
                color: Color(0xFF6C131A),
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0x8F710F18),
              borderRadius: BorderRadius.circular(4),
            ),
            child: const Text(
              '04:32',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.6,
                color: Color(0xFFFFCACC),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CurrentMissionCard extends StatelessWidget {
  const _CurrentMissionCard({
    required this.title,
    required this.location,
    required this.hasLive,
  });

  final String title;
  final String location;
  final bool hasLive;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF121622),
        border: Border(
          left: BorderSide(color: Color(0xFFFFC35E), width: 5),
          top: BorderSide(color: Color(0xFF2A3042)),
          right: BorderSide(color: Color(0xFF2A3042)),
          bottom: BorderSide(color: Color(0xFF2A3042)),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'CURRENT MISSION',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 2.0,
                      color: Color(0xFFA7A0A9),
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: hasLive
                        ? const Color(0x3D1F3A22)
                        : const Color(0x3D4A3522),
                    borderRadius: BorderRadius.circular(3),
                    border: Border.all(
                      color: hasLive
                          ? const Color(0xFF2A7840)
                          : const Color(0xFF695438),
                    ),
                  ),
                  child: Text(
                    hasLive ? 'LIVE' : 'EN ROUTE',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.3,
                      color: hasLive
                          ? const Color(0xFF50E888)
                          : const Color(0xFFD1B289),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Divider(color: Color(0xFF2E3548), thickness: 1),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w900,
                color: Color(0xFFE7D9DE),
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              location,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: Color(0xFFC3B4B9),
              ),
            ),
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(12, 14, 12, 14),
              decoration: BoxDecoration(
                color: const Color(0x4B351714),
                border: Border.all(color: const Color(0x553B2A34)),
              ),
              child: const Row(
                children: [
                  Expanded(
                    child: Text(
                      'ESTIMATED TIME OF\nARRIVAL',
                      style: TextStyle(
                        height: 1.18,
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.8,
                        color: Color(0xFF9F8D92),
                      ),
                    ),
                  ),
                  Text(
                    '1 MIN 20\nSEC',
                    textAlign: TextAlign.right,
                    style: TextStyle(
                      height: 1.22,
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFFE5D3D8),
                      letterSpacing: 0.8,
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

class _SectionLabel extends StatelessWidget {
  const _SectionLabel(this.label);

  final String label;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            letterSpacing: 2.4,
            color: Color(0xFFAA9BA1),
          ),
        ),
        const SizedBox(height: 8),
        const Divider(color: Color(0xFF1F2533), thickness: 1),
      ],
    );
  }
}

class _UpdateCard extends StatelessWidget {
  const _UpdateCard({
    required this.accent,
    required this.icon,
    required this.title,
    required this.timestamp,
    required this.body,
    required this.titleColor,
  });

  final Color accent;
  final IconData icon;
  final String title;
  final String timestamp;
  final String body;
  final Color titleColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF131722),
        border: Border(
          left: BorderSide(color: accent, width: 4),
          top: const BorderSide(color: Color(0xFF252B3A)),
          right: const BorderSide(color: Color(0xFF252B3A)),
          bottom: const BorderSide(color: Color(0xFF252B3A)),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 20, color: titleColor),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.5,
                      color: titleColor,
                    ),
                  ),
                ),
                Text(
                  timestamp,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.2,
                    color: Color(0xFFA1969D),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              body,
              style: const TextStyle(
                height: 1.35,
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: Color(0xFFD7C7CC),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PrimaryTacticalButton extends StatelessWidget {
  const _PrimaryTacticalButton();

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Status updated: ON SCENE'),
              duration: Duration(milliseconds: 1200),
            ),
          );
        },
        child: Container(
          height: 66,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: const Color(0xFF08C158),
            borderRadius: BorderRadius.circular(3),
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.place_rounded, color: Color(0xFF072913), size: 30),
              SizedBox(width: 6),
              Text(
                'I AM ON SCENE',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.8,
                  color: Color(0xFF072913),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _DualTacticalRow extends StatelessWidget {
  const _DualTacticalRow();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: const [
        Expanded(
          child: _TacticalButton(
            icon: Icons.gps_fixed_rounded,
            lineOne: 'SEND LOCATION',
            lineTwo: '',
            iconColor: Color(0xFFB5A8B0),
            textColor: Color(0xFFD7C9CF),
          ),
        ),
        SizedBox(width: 8),
        Expanded(
          child: _TacticalButton(
            icon: Icons.sos_rounded,
            lineOne: 'SOS',
            lineTwo: 'NEED BACKUP',
            iconColor: Color(0xFFFFA0AA),
            textColor: Color(0xFFFFB7BC),
          ),
        ),
      ],
    );
  }
}

class _TacticalButton extends StatelessWidget {
  const _TacticalButton({
    required this.icon,
    required this.lineOne,
    required this.lineTwo,
    required this.iconColor,
    required this.textColor,
  });

  final IconData icon;
  final String lineOne;
  final String lineTwo;
  final Color iconColor;
  final Color textColor;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          final label = lineTwo.isEmpty ? lineOne : '$lineOne $lineTwo';
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Action selected: $label')));
        },
        child: Container(
          height: 92,
          decoration: BoxDecoration(
            color: const Color(0xFF121622),
            borderRadius: BorderRadius.circular(2),
            border: Border.all(color: const Color(0xFF4A4F63)),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 28, color: iconColor),
              const SizedBox(height: 5),
              if (lineTwo.isNotEmpty)
                Text(
                  lineOne,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.5,
                    color: textColor,
                  ),
                ),
              Text(
                lineTwo.isEmpty ? lineOne : lineTwo,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.5,
                  color: textColor,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ResolvedButton extends StatelessWidget {
  const _ResolvedButton();

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Incident marked as resolved')),
          );
        },
        child: Container(
          height: 62,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(2),
            border: Border.all(color: const Color(0xFF2BE978), width: 2),
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.check_circle_outline_rounded,
                color: Color(0xFF2BE978),
                size: 30,
              ),
              SizedBox(width: 8),
              Text(
                'INCIDENT RESOLVED',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.6,
                  color: Color(0xFF2BE978),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EquipmentCheckCard extends StatelessWidget {
  const _EquipmentCheckCard({required this.equipment});

  final List<String> equipment;

  @override
  Widget build(BuildContext context) {
    // Use live equipment from AI if available, else show defaults
    final items = equipment.isNotEmpty
        ? equipment
        : ['FIRE EXTINGUISHER', 'RADIO COMM UNIT', 'TACTICAL GEAR SET'];

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF121622),
        borderRadius: BorderRadius.circular(3),
        border: Border.all(color: const Color(0xFF2D3447)),
      ),
      child: Column(
        children: [
          for (int i = 0; i < items.length; i++) ...[
            if (i > 0)
              const Divider(height: 1, color: Color(0xFF232A39)),
            _EquipmentItem(
              label: items[i].toUpperCase(),
              checked: i < 2, // first two pre-checked, rest unchecked
            ),
          ],
        ],
      ),
    );
  }
}

class _EquipmentItem extends StatelessWidget {
  const _EquipmentItem({required this.label, required this.checked});

  final String label;
  final bool checked;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 58,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: Row(
          children: [
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: checked
                    ? const Color(0xFF55E47B)
                    : const Color(0xFF241214),
                borderRadius: BorderRadius.circular(3),
                border: Border.all(
                  color: checked
                      ? const Color(0xFF55E47B)
                      : const Color(0xFF6A4D53),
                ),
              ),
              child: checked
                  ? const Icon(
                      Icons.check_rounded,
                      size: 22,
                      color: Color(0xFF0D3C1D),
                    )
                  : null,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.0,
                  color: checked
                      ? const Color(0xFFDCCFD4)
                      : const Color(0xFFA99198),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
