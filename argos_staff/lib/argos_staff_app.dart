import 'package:flutter/material.dart';

import 'routing/app_router.dart';

class ArgosStaffApp extends StatelessWidget {
  const ArgosStaffApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Argos Ops',
      debugShowCheckedModeBanner: false,
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
