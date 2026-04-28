import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'api_config.dart';

class IncomingCrisis {
  IncomingCrisis({
    required this.crisisId,
    required this.crisisType,
    required this.severity,
    required this.zone,
    required this.floor,
    required this.description,
    required this.detectedAt,
  });

  final String crisisId;
  final String crisisType;
  final int severity;
  final String zone;
  final String? floor;
  final String description;
  final DateTime detectedAt;

  factory IncomingCrisis.fromJson(Map<String, dynamic> json) {
    return IncomingCrisis(
      crisisId: json['crisis_id'] as String? ?? 'unknown',
      crisisType: json['crisis_type'] as String? ?? 'unknown',
      severity: (json['severity'] as num?)?.toInt() ?? 1,
      zone: json['zone'] as String? ?? 'Unknown zone',
      floor: json['floor'] as String?,
      description: json['description'] as String? ?? '',
      detectedAt: DateTime.tryParse(json['detected_at'] as String? ?? '') ??
          DateTime.now(),
    );
  }
}

class CrisisStreamService {
  CrisisStreamService();

  final _controller = StreamController<IncomingCrisis>.broadcast();
  HttpClient? _client;
  bool _disposed = false;

  Stream<IncomingCrisis> get crises => _controller.stream;

  void start() {
    if (_disposed) return;
    unawaited(_connect());
  }

  Future<void> _connect() async {
    while (!_disposed) {
      try {
        _client = HttpClient()..connectionTimeout = const Duration(seconds: 8);
        final request = await _client!.getUrl(simStreamUri());
        request.headers.set('Accept', 'text/event-stream');
        request.headers.set('Cache-Control', 'no-cache');
        final response = await request.close();

        if (response.statusCode != 200) {
          await response.drain<void>();
          throw HttpException('SSE returned ${response.statusCode}');
        }

        await _readEvents(response);
      } catch (_) {
        // swallow and retry
      } finally {
        _client?.close(force: true);
        _client = null;
      }

      if (_disposed) break;
      await Future<void>.delayed(const Duration(seconds: 3));
    }
  }

  Future<void> _readEvents(HttpClientResponse response) async {
    String? eventName;
    final dataLines = <String>[];

    final lines = response
        .transform(utf8.decoder)
        .transform(const LineSplitter());

    await for (final line in lines) {
      if (line.isEmpty) {
        if (dataLines.isNotEmpty && eventName == 'crisis.detected') {
          _emit(dataLines.join('\n'));
        }
        eventName = null;
        dataLines.clear();
        continue;
      }
      if (line.startsWith(':')) {
        continue;
      }
      if (line.startsWith('event:')) {
        eventName = line.substring(6).trim();
      } else if (line.startsWith('data:')) {
        dataLines.add(line.substring(5).trimLeft());
      }
    }
  }

  void _emit(String rawJson) {
    try {
      final decoded = jsonDecode(rawJson);
      if (decoded is Map<String, dynamic>) {
        _controller.add(IncomingCrisis.fromJson(decoded));
      }
    } catch (_) {}
  }

  Future<void> dispose() async {
    _disposed = true;
    _client?.close(force: true);
    await _controller.close();
  }
}
