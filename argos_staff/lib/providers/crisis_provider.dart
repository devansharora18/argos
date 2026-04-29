import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/crisis_result.dart';
import '../services/haven_service.dart';

// ---------------------------------------------------------------------------
// crisisProvider — holds the latest CrisisResult from the HAVEN backend.
// Auto-polls every 3 s. All screens read from this single source of truth.
// ---------------------------------------------------------------------------

final crisisProvider =
    StateNotifierProvider<CrisisNotifier, CrisisResult?>((ref) {
  return CrisisNotifier();
});

class CrisisNotifier extends StateNotifier<CrisisResult?> {
  CrisisNotifier() : super(null) {
    _start();
  }

  Timer? _timer;

  void _start() {
    _poll(); // immediate first fetch
    _timer = Timer.periodic(const Duration(seconds: 3), (_) => _poll());
  }

  Future<void> _poll() async {
    final result = await HavenService.fetchLatest();
    if (result != null && result.timestamp != state?.timestamp) {
      state = result;
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
