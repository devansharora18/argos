import 'dart:async';

import 'package:flutter/material.dart';

import 'routing/app_router.dart';
import 'routing/app_routes.dart';
import 'services/crisis_stream_service.dart';

class ArgosStaffApp extends StatefulWidget {
  const ArgosStaffApp({super.key});

  @override
  State<ArgosStaffApp> createState() => _ArgosStaffAppState();
}

class _ArgosStaffAppState extends State<ArgosStaffApp> {
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
    if (currentRoute != AppRoutes.dispatch) {
      navigator.pushNamedAndRemoveUntil(
        AppRoutes.dispatch,
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
            'DISPATCH · ${crisis.crisisType.toUpperCase()} · ${crisis.zone}',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.6,
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
      title: 'Argos Ops',
      debugShowCheckedModeBanner: false,
      navigatorKey: _navigatorKey,
      scaffoldMessengerKey: _messengerKey,
      theme: ThemeData(
        brightness: Brightness.dark,
        useMaterial3: true,
        fontFamily: 'monospace',
        scaffoldBackgroundColor: const Color(0xFF06070D),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFFF4C5D),
          brightness: Brightness.dark,
        ),
      ),
      onGenerateRoute: AppRouter.onGenerateRoute,
    );
  }
}
