import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'routing/app_router.dart';
import 'routing/app_routes.dart';
import 'services/crisis_stream_service.dart';

class ArgosApp extends StatefulWidget {
  const ArgosApp({super.key});

  @override
  State<ArgosApp> createState() => _ArgosAppState();
}

class _ArgosAppState extends State<ArgosApp> {
  final GlobalKey<NavigatorState> _navigatorKey = GlobalKey<NavigatorState>();
  final GlobalKey<ScaffoldMessengerState> _messengerKey =
      GlobalKey<ScaffoldMessengerState>();
  final CrisisStreamService _crisisStream = CrisisStreamService();
  StreamSubscription<IncomingCrisis>? _crisisSub;

  @override
  void initState() {
    super.initState();
    _crisisSub = _crisisStream.crises.listen(_handleIncomingCrisis);
    _crisisStream.start();
  }

  void _handleIncomingCrisis(IncomingCrisis crisis) {
    final navigator = _navigatorKey.currentState;
    if (navigator == null) return;

    final currentRoute =
        ModalRoute.of(navigator.context)?.settings.name ?? AppRoutes.home;
    if (currentRoute != AppRoutes.map) {
      navigator.pushNamedAndRemoveUntil(
        AppRoutes.map,
        (route) => false,
        arguments: crisis,
      );
    }

    _messengerKey.currentState
      ?..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          backgroundColor: const Color(0xFFFF4A58),
          duration: const Duration(seconds: 4),
          content: Text(
            '${crisis.crisisType.toUpperCase()} detected · ${crisis.zone}',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.5,
            ),
          ),
        ),
      );
  }

  @override
  void dispose() {
    _crisisSub?.cancel();
    _crisisStream.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Argos',
      debugShowCheckedModeBanner: false,
      navigatorKey: _navigatorKey,
      scaffoldMessengerKey: _messengerKey,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF131313),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFFF5F57),
          brightness: Brightness.dark,
        ),
      ),
      onGenerateRoute: AppRouter.onGenerateRoute,
    );
  }
}

void main() {
  runApp(const ProviderScope(child: ArgosApp()));
}
