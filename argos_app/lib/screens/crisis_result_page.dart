import 'package:flutter/material.dart';
import '../models/crisis_result.dart';
import '../services/haven_service.dart';

// ---------------------------------------------------------------------------
// CrisisResultPage
//
// Receives a [reportText], calls the HAVEN backend synchronously on load,
// and displays the full Gemini classification + orchestration result.
// Shows a loading state while the AI is thinking and an error state on failure.
// ---------------------------------------------------------------------------

class CrisisResultPage extends StatefulWidget {
  const CrisisResultPage({super.key, required this.reportText});

  final String reportText;

  @override
  State<CrisisResultPage> createState() => _CrisisResultPageState();
}

class _CrisisResultPageState extends State<CrisisResultPage> {
  CrisisResult? _result;
  String? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _analyze();
  }

  Future<void> _analyze() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final result = await HavenService.analyze(widget.reportText);
      if (mounted) {
        setState(() {
          _result = result;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _loading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF131313),
      appBar: AppBar(
        backgroundColor: const Color(0xFF131313),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: Color(0xFFE0BFB9)),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'AI RESPONSE',
          style: TextStyle(
            color: Color(0xFF9DB6FF),
            fontSize: 13,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.4,
          ),
        ),
      ),
      body: SafeArea(
        child: _loading
            ? const _LoadingView()
            : _error != null
                ? _ErrorView(error: _error!, onRetry: _analyze)
                : _ResultView(result: _result!),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

class _LoadingView extends StatelessWidget {
  const _LoadingView();

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(
              color: Color(0xFF9DB6FF),
              strokeWidth: 2.5,
            ),
            SizedBox(height: 28),
            Text(
              'HAVEN is analysing...',
              style: TextStyle(
                color: Color(0xFFF2F2F2),
                fontSize: 20,
                fontWeight: FontWeight.w700,
              ),
            ),
            SizedBox(height: 10),
            Text(
              'Gemini is classifying the crisis\nand building a dispatch plan.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Color(0xFFE0BFB9),
                fontSize: 15,
                fontWeight: FontWeight.w500,
                height: 1.4,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.error, required this.onRetry});

  final String error;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.wifi_off_rounded,
                color: Color(0xFFFF534A), size: 48),
            const SizedBox(height: 20),
            const Text(
              'Could not reach HAVEN',
              style: TextStyle(
                color: Color(0xFFF2F2F2),
                fontSize: 22,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              error,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Color(0xFFE0BFB9),
                fontSize: 13,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 28),
            FilledButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Retry'),
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF9DB6FF),
                foregroundColor: const Color(0xFF0A0B0F),
                padding: const EdgeInsets.symmetric(
                    horizontal: 28, vertical: 14),
                textStyle: const TextStyle(
                    fontSize: 16, fontWeight: FontWeight.w700),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------

class _ResultView extends StatelessWidget {
  const _ResultView({required this.result});

  final CrisisResult result;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(
          parent: AlwaysScrollableScrollPhysics()),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _CrisisHeaderCard(result: result),
          const SizedBox(height: 14),
          _SectionLabel(label: 'CLASSIFICATION'),
          const SizedBox(height: 8),
          _ReasoningCard(reasoning: result.classificationReasoning),
          const SizedBox(height: 14),
          _SectionLabel(label: 'DISPATCH PLAN'),
          const SizedBox(height: 8),
          if (result.dispatchDecisions.isEmpty)
            const _EmptyCard(message: 'No dispatch decisions from Gemini.')
          else
            ...result.dispatchDecisions
                .map((d) => _DispatchCard(decision: d))
                .toList(),
          const SizedBox(height: 14),
          _SectionLabel(label: 'GUEST NOTIFICATION'),
          const SizedBox(height: 8),
          _GuestNotificationCard(notification: result.guestNotification),
          const SizedBox(height: 14),
          if (result.externalEscalation.isRequired) ...[
            _SectionLabel(label: 'EXTERNAL ESCALATION'),
            const SizedBox(height: 8),
            _EscalationCard(escalation: result.externalEscalation),
            const SizedBox(height: 14),
          ],
          _SectionLabel(label: 'CONTROL ROOM SUMMARY'),
          const SizedBox(height: 8),
          _SummaryCard(summary: result.controlRoomSummary),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Header card — crisis type, severity, confidence
// ---------------------------------------------------------------------------

class _CrisisHeaderCard extends StatelessWidget {
  const _CrisisHeaderCard({required this.result});

  final CrisisResult result;

  Color get _severityColor {
    if (result.severity >= 4) return const Color(0xFFFF534A);
    if (result.severity == 3) return const Color(0xFFFFB347);
    return const Color(0xFF46DC72);
  }

  Color get _typeColor {
    switch (result.crisisType) {
      case 'fire':
        return const Color(0xFFFF534A);
      case 'medical':
        return const Color(0xFF46DC72);
      case 'security':
        return const Color(0xFFA7BFFF);
      case 'stampede':
        return const Color(0xFFFFB347);
      case 'structural':
        return const Color(0xFFE0BFB9);
      default:
        return const Color(0xFF9DB6FF);
    }
  }

  IconData get _typeIcon {
    switch (result.crisisType) {
      case 'fire':
        return Icons.local_fire_department_rounded;
      case 'medical':
        return Icons.medical_services_rounded;
      case 'security':
        return Icons.security_rounded;
      case 'stampede':
        return Icons.people_rounded;
      case 'structural':
        return Icons.warning_rounded;
      default:
        return Icons.help_outline_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final confidencePct = (result.confidence * 100).round();
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
      decoration: BoxDecoration(
        color: const Color(0xFF17171D),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: _typeColor.withOpacity(0.35), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: _typeColor.withOpacity(0.12),
            blurRadius: 20,
            spreadRadius: 1,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: _typeColor.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(_typeIcon, color: _typeColor, size: 16),
                    const SizedBox(width: 6),
                    Text(
                      result.crisisType.toUpperCase(),
                      style: TextStyle(
                        color: _typeColor,
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              Container(
                width: 10,
                height: 10,
                decoration: const BoxDecoration(
                  color: Color(0xFFFF534A),
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 6),
              const Text(
                'LIVE',
                style: TextStyle(
                  color: Color(0xFFFF534A),
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.2,
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'SEVERITY',
                    style: TextStyle(
                      color: Color(0xFFE0BFB9),
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.1,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: List.generate(5, (i) {
                      return Container(
                        width: 22,
                        height: 8,
                        margin: const EdgeInsets.only(right: 4),
                        decoration: BoxDecoration(
                          color: i < result.severity
                              ? _severityColor
                              : const Color(0xFF2A2A32),
                          borderRadius: BorderRadius.circular(4),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${result.severity} / 5',
                    style: TextStyle(
                      color: _severityColor,
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
              const Spacer(),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text(
                    'CONFIDENCE',
                    style: TextStyle(
                      color: Color(0xFFE0BFB9),
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.1,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '$confidencePct%',
                    style: const TextStyle(
                      color: Color(0xFF9DB6FF),
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              const Icon(Icons.layers_rounded,
                  color: Color(0xFFE0BFB9), size: 16),
              const SizedBox(width: 6),
              Text(
                'Floor ${result.floor}',
                style: const TextStyle(
                  color: Color(0xFFE0BFB9),
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(width: 16),
              const Icon(Icons.place_rounded,
                  color: Color(0xFFE0BFB9), size: 16),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  result.zone,
                  style: const TextStyle(
                    color: Color(0xFFE0BFB9),
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Section label
// ---------------------------------------------------------------------------

class _SectionLabel extends StatelessWidget {
  const _SectionLabel({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: const TextStyle(
        color: Color(0xFF9DB6FF),
        fontSize: 11,
        fontWeight: FontWeight.w700,
        letterSpacing: 1.5,
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Reasoning card
// ---------------------------------------------------------------------------

class _ReasoningCard extends StatelessWidget {
  const _ReasoningCard({required this.reasoning});

  final String reasoning;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF17171D),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        reasoning,
        style: const TextStyle(
          color: Color(0xFFE0E0E4),
          fontSize: 15,
          fontWeight: FontWeight.w500,
          height: 1.45,
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Dispatch card
// ---------------------------------------------------------------------------

class _DispatchCard extends StatelessWidget {
  const _DispatchCard({required this.decision});

  final DispatchDecision decision;

  @override
  Widget build(BuildContext context) {
    final isPrimary = decision.priority == 'primary';
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
      decoration: BoxDecoration(
        color: const Color(0xFF17171D),
        borderRadius: BorderRadius.circular(20),
        border: isPrimary
            ? Border.all(
                color: const Color(0xFFFF534A).withOpacity(0.4), width: 1)
            : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  decision.staffName.isNotEmpty
                      ? decision.staffName
                      : decision.staffId,
                  style: const TextStyle(
                    color: Color(0xFFF2F2F2),
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isPrimary
                      ? const Color(0xFFFF534A).withOpacity(0.18)
                      : const Color(0xFF9DB6FF).withOpacity(0.14),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  isPrimary ? 'PRIMARY' : 'SECONDARY',
                  style: TextStyle(
                    color: isPrimary
                        ? const Color(0xFFFF534A)
                        : const Color(0xFF9DB6FF),
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.0,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          Text(
            decision.role,
            style: const TextStyle(
              color: Color(0xFFE0BFB9),
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            decision.instruction,
            style: const TextStyle(
              color: Color(0xFFE0E0E4),
              fontSize: 14,
              fontWeight: FontWeight.w500,
              height: 1.4,
            ),
          ),
          if (decision.equipmentToBring.isNotEmpty) ...[
            const SizedBox(height: 10),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: decision.equipmentToBring
                  .map(
                    (e) => Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 9, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2A2A32),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        e,
                        style: const TextStyle(
                          color: Color(0xFFD0D0D6),
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ],
          if (decision.route.isNotEmpty) ...[
            const SizedBox(height: 10),
            Row(
              children: [
                const Icon(Icons.route_rounded,
                    color: Color(0xFF9DB6FF), size: 14),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    decision.route,
                    style: const TextStyle(
                      color: Color(0xFF9DB6FF),
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Guest notification card
// ---------------------------------------------------------------------------

class _GuestNotificationCard extends StatelessWidget {
  const _GuestNotificationCard({required this.notification});

  final GuestNotification notification;

  @override
  Widget build(BuildContext context) {
    final isUrgent = notification.tone == 'urgent';
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isUrgent
            ? const Color(0xFFFF534A).withOpacity(0.08)
            : const Color(0xFF17171D),
        borderRadius: BorderRadius.circular(20),
        border: isUrgent
            ? Border.all(
                color: const Color(0xFFFF534A).withOpacity(0.3), width: 1)
            : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                isUrgent
                    ? Icons.campaign_rounded
                    : Icons.notifications_rounded,
                color: isUrgent
                    ? const Color(0xFFFF534A)
                    : const Color(0xFF46DC72),
                size: 18,
              ),
              const SizedBox(width: 8),
              Text(
                isUrgent ? 'URGENT BROADCAST' : 'GUEST BROADCAST',
                style: TextStyle(
                  color: isUrgent
                      ? const Color(0xFFFF534A)
                      : const Color(0xFF46DC72),
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.1,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            '"${notification.message}"',
            style: const TextStyle(
              color: Color(0xFFF2F2F2),
              fontSize: 15,
              fontWeight: FontWeight.w600,
              fontStyle: FontStyle.italic,
              height: 1.45,
            ),
          ),
          if (notification.evacuationRoute.isNotEmpty) ...[
            const SizedBox(height: 10),
            Row(
              children: [
                const Icon(Icons.exit_to_app_rounded,
                    color: Color(0xFFE0BFB9), size: 14),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    notification.evacuationRoute,
                    style: const TextStyle(
                      color: Color(0xFFE0BFB9),
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// External escalation card (only shown when required)
// ---------------------------------------------------------------------------

class _EscalationCard extends StatelessWidget {
  const _EscalationCard({required this.escalation});

  final ExternalEscalation escalation;

  String get _serviceLabel {
    switch (escalation.service) {
      case 'fire_dept':
        return 'Fire Department';
      case 'ambulance':
        return 'Ambulance / EMS';
      case 'police':
        return 'Police';
      default:
        return escalation.service.toUpperCase();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFF534A).withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: const Color(0xFFFF534A).withOpacity(0.5),
          width: 1.2,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.phone_in_talk_rounded,
                  color: Color(0xFFFF534A), size: 20),
              const SizedBox(width: 8),
              Text(
                _serviceLabel,
                style: const TextStyle(
                  color: Color(0xFFFF534A),
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            escalation.reason,
            style: const TextStyle(
              color: Color(0xFFE0E0E4),
              fontSize: 14,
              fontWeight: FontWeight.w500,
              height: 1.4,
            ),
          ),
          if (escalation.autoCallInMinutes > 0) ...[
            const SizedBox(height: 8),
            Text(
              'Auto-call in ${escalation.autoCallInMinutes} min if not manually cancelled',
              style: const TextStyle(
                color: Color(0xFFFFB347),
                fontSize: 12,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Control room summary card
// ---------------------------------------------------------------------------

class _SummaryCard extends StatelessWidget {
  const _SummaryCard({required this.summary});

  final String summary;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF17171D),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.headset_mic_rounded,
                  color: Color(0xFF9DB6FF), size: 16),
              SizedBox(width: 6),
              Text(
                'FOR CONTROL ROOM OPERATORS',
                style: TextStyle(
                  color: Color(0xFF9DB6FF),
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.1,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            summary,
            style: const TextStyle(
              color: Color(0xFFE0E0E4),
              fontSize: 14,
              fontWeight: FontWeight.w500,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Empty state card
// ---------------------------------------------------------------------------

class _EmptyCard extends StatelessWidget {
  const _EmptyCard({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF17171D),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        message,
        style: const TextStyle(color: Color(0xFFE0BFB9), fontSize: 14),
      ),
    );
  }
}
