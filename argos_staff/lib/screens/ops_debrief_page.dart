import 'package:flutter/material.dart';

import '../models/staff_tab.dart';
import '../routing/app_routes.dart';
import '../widgets/argos_screen_shell.dart';

class OpsDebriefPage extends StatelessWidget {
  const OpsDebriefPage({super.key, this.selectedTab = StaffTab.debrief});

  final StaffTab selectedTab;

  @override
  Widget build(BuildContext context) {
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
          children: const [
            _ResolvedHero(),
            SizedBox(height: 18),
            _PostActionDebriefCard(),
            SizedBox(height: 16),
            _SystemsAnalysisCard(),
            SizedBox(height: 24),
            _ViewFullReportButton(),
            SizedBox(height: 10),
            _BackToDashboardButton(),
          ],
        ),
      ),
    );
  }
}

class _ResolvedHero extends StatelessWidget {
  const _ResolvedHero();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 146,
          height: 146,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: const Color(0xFF0D3324),
            border: Border.all(color: const Color(0x662BE978), width: 2),
            boxShadow: const [
              BoxShadow(color: Color(0x3335EC80), blurRadius: 24),
            ],
          ),
          child: Container(
            width: 66,
            height: 66,
            decoration: const BoxDecoration(
              color: Color(0xFF56E983),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_rounded,
              size: 44,
              color: Color(0xFF0A2E1A),
            ),
          ),
        ),
        const SizedBox(height: 18),
        const Text(
          'INCIDENT RESOLVED',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w900,
            color: Color(0xFFE6D7DC),
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Room 312 Fire · Floor 3',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: Color(0xFFC5B6BC),
          ),
        ),
        const SizedBox(height: 14),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
          decoration: BoxDecoration(
            color: const Color(0x4D3B231D),
            borderRadius: BorderRadius.circular(3),
            border: Border.all(color: const Color(0x554E3840)),
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.timer_outlined, color: Color(0xFFFFC35F), size: 22),
              SizedBox(width: 8),
              Text(
                'Total response time: 08:42',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.0,
                  color: Color(0xFFFFC35F),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _PostActionDebriefCard extends StatelessWidget {
  const _PostActionDebriefCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF121622),
        border: Border(
          left: BorderSide(color: Color(0xFF2BE978), width: 5),
          top: BorderSide(color: Color(0xFF2A3042)),
          right: BorderSide(color: Color(0xFF2A3042)),
          bottom: BorderSide(color: Color(0xFF2A3042)),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Row(
              children: [
                Icon(Icons.memory_rounded, size: 21, color: Color(0xFF43EA83)),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'AI POST-ACTION DEBRIEF',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2.0,
                      color: Color(0xFF43EA83),
                    ),
                  ),
                ),
                Text(
                  'SYS-REP-992',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF707485),
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Divider(color: Color(0xFF2B3143), thickness: 1),
            SizedBox(height: 12),
            _GradeSummary(),
            SizedBox(height: 12),
            _DebriefMetricGrid(),
          ],
        ),
      ),
    );
  }
}

class _GradeSummary extends StatelessWidget {
  const _GradeSummary();

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 88,
          height: 88,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: const Color(0xFF143329),
            borderRadius: BorderRadius.circular(4),
            border: Border.all(color: const Color(0xFF2D6D50)),
          ),
          child: const Text(
            'A',
            style: TextStyle(
              fontSize: 42,
              fontWeight: FontWeight.w900,
              color: Color(0xFF4FE67D),
            ),
          ),
        ),
        const SizedBox(width: 12),
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'EXCELLENT',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFFE7D9DE),
                  height: 0.95,
                ),
              ),
              SizedBox(height: 8),
              Text(
                'Response execution met all critical safety '
                'parameters with high efficiency.',
                style: TextStyle(
                  height: 1.3,
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFFC7B8BE),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _DebriefMetricGrid extends StatelessWidget {
  const _DebriefMetricGrid();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: const [
        Row(
          children: [
            Expanded(
              child: _MetricTile(
                label: 'DETECTION SPEED',
                value: '00:12s',
                trailing: Icons.north_rounded,
                trailingColor: Color(0xFF48E07A),
              ),
            ),
            SizedBox(width: 8),
            Expanded(
              child: _MetricTile(
                label: 'DISPATCH ACCURACY',
                value: '99.8%',
                trailing: Icons.north_rounded,
                trailingColor: Color(0xFF48E07A),
              ),
            ),
          ],
        ),
        SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: _MetricTile(
                label: 'EQUIPMENT USAGE',
                value: 'Optimal',
                trailingText: '-',
              ),
            ),
            SizedBox(width: 8),
            Expanded(child: _CommunicationTile()),
          ],
        ),
      ],
    );
  }
}

class _MetricTile extends StatelessWidget {
  const _MetricTile({
    required this.label,
    required this.value,
    this.trailing,
    this.trailingColor,
    this.trailingText,
  });

  final String label;
  final String value;
  final IconData? trailing;
  final Color? trailingColor;
  final String? trailingText;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 86,
      padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
      decoration: BoxDecoration(
        color: const Color(0x4E371915),
        borderRadius: BorderRadius.circular(3),
        border: Border.all(color: const Color(0x5549343E)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.8,
              color: Color(0xFFA8979D),
            ),
          ),
          const Spacer(),
          Row(
            children: [
              Expanded(
                child: Text(
                  value,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFFE8DADF),
                  ),
                ),
              ),
              if (trailing != null)
                Icon(trailing, color: trailingColor, size: 28)
              else if (trailingText != null)
                Text(
                  trailingText!,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF797179),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

class _CommunicationTile extends StatelessWidget {
  const _CommunicationTile();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 86,
      padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
      decoration: BoxDecoration(
        color: const Color(0x4E371915),
        borderRadius: BorderRadius.circular(3),
        border: Border.all(color: const Color(0x5549343E)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: const [
              Expanded(
                child: Text(
                  'COMMUNICATION',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.8,
                    color: Color(0xFFA8979D),
                  ),
                ),
              ),
              Text(
                '4.8/5.0',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFFFFC25E),
                ),
              ),
            ],
          ),
          const Spacer(),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: const LinearProgressIndicator(
              minHeight: 6,
              value: 0.96,
              backgroundColor: Color(0x3343343A),
              color: Color(0xFFFFC25E),
            ),
          ),
        ],
      ),
    );
  }
}

class _SystemsAnalysisCard extends StatelessWidget {
  const _SystemsAnalysisCard();

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
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Row(
              children: [
                Icon(
                  Icons.psychology_alt_rounded,
                  size: 20,
                  color: Color(0xFFFFC35E),
                ),
                SizedBox(width: 8),
                Text(
                  'SYSTEMS ANALYSIS',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 2.0,
                    color: Color(0xFFFFC35E),
                  ),
                ),
              ],
            ),
            SizedBox(height: 10),
            Text(
              'Initial response time was optimal. Containment achieved 3 '
              'minutes ahead of projected baseline.',
              style: TextStyle(
                height: 1.4,
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: Color(0xFFD5C7CD),
              ),
            ),
            SizedBox(height: 10),
            Divider(color: Color(0xFF32384A), thickness: 1),
            SizedBox(height: 10),
            Text(
              'ACTION REQUIRED: ',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w900,
                color: Color(0xFFFFC35E),
              ),
            ),
            SizedBox(height: 4),
            Text(
              'Review communication logs for Floor 3 warden to ensure '
              'future checklist confirmation protocols are strictly '
              'followed during evacuation sequence.',
              style: TextStyle(
                height: 1.4,
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: Color(0xFFD5C7CD),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ViewFullReportButton extends StatelessWidget {
  const _ViewFullReportButton();

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Opening full report...')),
          );
        },
        child: Container(
          height: 64,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(2),
            border: Border.all(color: const Color(0xFF363B49), width: 2),
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.description_outlined,
                color: Color(0xFFE2D5DB),
                size: 28,
              ),
              SizedBox(width: 8),
              Text(
                'VIEW FULL REPORT',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.8,
                  color: Color(0xFFE2D5DB),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _BackToDashboardButton extends StatelessWidget {
  const _BackToDashboardButton();

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          Navigator.of(context).pushReplacementNamed(AppRoutes.home);
        },
        child: Container(
          height: 64,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: const Color(0xFFF23647),
            borderRadius: BorderRadius.circular(2),
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.grid_view_rounded, color: Color(0xFFFFD8DE), size: 28),
              SizedBox(width: 8),
              Text(
                'BACK TO DASHBOARD',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.8,
                  color: Color(0xFFFFD8DE),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
