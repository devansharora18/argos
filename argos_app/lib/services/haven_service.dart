import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/crisis_result.dart';

// ---------------------------------------------------------------------------
// HAVEN Backend URL
//
// Change _baseUrl to match where your backend is running:
//   Android emulator  →  http://10.0.2.2:8080
//   iOS simulator     →  http://localhost:8080
//   Physical device   →  http://<your-machine-ip>:8080
//   Web (same host)   →  http://localhost:8080
// ---------------------------------------------------------------------------
const String _baseUrl = 'http://localhost:8080';

class HavenService {
  static const String _analyzeEndpoint = '$_baseUrl/api/v1/demo/analyze';

  /// Sends [reportText] to the HAVEN backend, runs Gemini classification +
  /// orchestration synchronously, and returns the full [CrisisResult].
  ///
  /// Throws an [Exception] if the backend returns a non-200 status or if
  /// the network request times out (30 s).
  static Future<CrisisResult> analyze(String reportText) async {
    final response = await http
        .post(
          Uri.parse(_analyzeEndpoint),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'report_text': reportText,
            'venue_id': 'venue_demo_001',
          }),
        )
        .timeout(const Duration(seconds: 90));

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      return CrisisResult.fromJson(json);
    } else {
      throw Exception(
        'Backend error ${response.statusCode}: ${response.body}',
      );
    }
  }
}
