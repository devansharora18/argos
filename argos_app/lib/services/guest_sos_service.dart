import 'dart:convert';

import 'package:http/http.dart' as http;

import 'api_config.dart';

class GuestSosService {
  const GuestSosService();

  Future<void> sendGuestSos() async {
    final response = await http.post(
      simTriggerUri(),
      headers: const {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'crisis_type': 'security',
        'severity': 5,
        'venue_id': 'venue_demo',
        'zone': 'Guest SOS',
        'floor': '1',
        'description': 'Guest SOS activated from the guest app.',
        'reported_by': 'guest-app',
      }),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('SOS dispatch failed with status ${response.statusCode}');
    }
  }
}
