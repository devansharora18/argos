import 'dart:io' show Platform;

const String _envBaseUrl = String.fromEnvironment('ARGOS_BACKEND_URL');

String resolveBackendBaseUrl() {
  if (_envBaseUrl.isNotEmpty) {
    return _envBaseUrl;
  }
  // 10.0.2.2 maps to the host's localhost from the Android emulator.
  if (Platform.isAndroid) {
    return 'http://10.0.2.2:8080';
  }
  return 'http://localhost:8080';
}

Uri simStreamUri() {
  return Uri.parse('${resolveBackendBaseUrl()}/api/v1/sim/events/stream');
}
