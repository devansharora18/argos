import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'routing/app_router.dart';

class ArgosApp extends StatelessWidget {
  const ArgosApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Argos',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF05080F),
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
