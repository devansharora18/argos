// Shared model for the HAVEN /api/v1/demo/analyze + /latest response.

class DispatchDecision {
  final String staffId;
  final String staffName;
  final String role;
  final String instruction;
  final String priority;
  final List<String> equipmentToBring;
  final String route;

  const DispatchDecision({
    required this.staffId,
    required this.staffName,
    required this.role,
    required this.instruction,
    required this.priority,
    required this.equipmentToBring,
    required this.route,
  });

  factory DispatchDecision.fromJson(Map<String, dynamic> json) =>
      DispatchDecision(
        staffId: json['staff_id'] as String? ?? '',
        staffName: json['staff_name'] as String? ?? '',
        role: json['role'] as String? ?? '',
        instruction: json['instruction'] as String? ?? '',
        priority: json['priority'] as String? ?? 'secondary',
        equipmentToBring:
            (json['equipment_to_bring'] as List<dynamic>? ?? [])
                .map((e) => e.toString())
                .toList(),
        route: json['route'] as String? ?? '',
      );
}

class GuestNotification {
  final List<String> affectedFloors;
  final String message;
  final String evacuationRoute;
  final String tone;

  const GuestNotification({
    required this.affectedFloors,
    required this.message,
    required this.evacuationRoute,
    required this.tone,
  });

  factory GuestNotification.fromJson(Map<String, dynamic> json) =>
      GuestNotification(
        affectedFloors: (json['affected_floors'] as List<dynamic>? ?? [])
            .map((e) => e.toString())
            .toList(),
        message: json['message'] as String? ?? '',
        evacuationRoute: json['evacuation_route'] as String? ?? '',
        tone: json['tone'] as String? ?? 'calm',
      );
}

class ExternalEscalation {
  final bool isRequired;
  final String service;
  final String reason;
  final int autoCallInMinutes;

  const ExternalEscalation({
    required this.isRequired,
    required this.service,
    required this.reason,
    required this.autoCallInMinutes,
  });

  factory ExternalEscalation.fromJson(Map<String, dynamic> json) =>
      ExternalEscalation(
        isRequired: json['required'] as bool? ?? false,
        service: json['service'] as String? ?? 'none',
        reason: json['reason'] as String? ?? '',
        autoCallInMinutes:
            (json['auto_call_in_minutes'] as num? ?? 0).toInt(),
      );
}

class CrisisResult {
  final String crisisType;
  final int severity;
  final double confidence;
  final String floor;
  final String zone;
  final String classificationReasoning;
  final List<DispatchDecision> dispatchDecisions;
  final GuestNotification guestNotification;
  final String controlRoomSummary;
  final ExternalEscalation externalEscalation;
  final String decisionReasoning;
  final double orchestrationConfidence;
  final String timestamp;

  const CrisisResult({
    required this.crisisType,
    required this.severity,
    required this.confidence,
    required this.floor,
    required this.zone,
    required this.classificationReasoning,
    required this.dispatchDecisions,
    required this.guestNotification,
    required this.controlRoomSummary,
    required this.externalEscalation,
    required this.decisionReasoning,
    required this.orchestrationConfidence,
    required this.timestamp,
  });

  DispatchDecision? get primaryDispatch {
    try {
      return dispatchDecisions.firstWhere((d) => d.priority == 'primary');
    } catch (_) {
      return dispatchDecisions.isNotEmpty ? dispatchDecisions.first : null;
    }
  }

  factory CrisisResult.fromJson(Map<String, dynamic> json) => CrisisResult(
        crisisType: json['crisis_type'] as String? ?? 'unknown',
        severity: (json['severity'] as num? ?? 1).toInt(),
        confidence: (json['confidence'] as num? ?? 0).toDouble(),
        floor: json['floor'] as String? ?? 'unknown',
        zone: json['zone'] as String? ?? 'unknown',
        classificationReasoning:
            json['classification_reasoning'] as String? ?? '',
        dispatchDecisions:
            (json['dispatch_decisions'] as List<dynamic>? ?? [])
                .map((e) =>
                    DispatchDecision.fromJson(e as Map<String, dynamic>))
                .toList(),
        guestNotification: GuestNotification.fromJson(
          json['guest_notification'] as Map<String, dynamic>? ?? {},
        ),
        controlRoomSummary: json['control_room_summary'] as String? ?? '',
        externalEscalation: ExternalEscalation.fromJson(
          json['external_escalation'] as Map<String, dynamic>? ?? {},
        ),
        decisionReasoning: json['decision_reasoning'] as String? ?? '',
        orchestrationConfidence:
            (json['orchestration_confidence'] as num? ?? 0).toDouble(),
        timestamp: json['timestamp'] as String? ?? '',
      );
}
