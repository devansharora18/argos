import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/crisis_result.dart';

// Change _baseUrl to match your backend:
//   Android emulator  →  http://10.0.2.2:8080
//   iOS simulator     →  http://localhost:8080
//   Web / macOS       →  http://localhost:8080
const String _baseUrl = 'http://localhost:8080';

class HavenService {
  /// Polls /api/v1/demo/latest. Returns null if no incident yet (204).
  static Future<CrisisResult?> fetchLatest() async {
    try {
      final response = await http
          .get(Uri.parse('$_baseUrl/api/v1/demo/latest'))
          .timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        return CrisisResult.fromJson(json);
      }
      return null; // 204 = no incident yet
    } catch (_) {
      return null;
    }
  }
}
