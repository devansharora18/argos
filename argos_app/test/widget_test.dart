import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:argos_app/main.dart';

void main() {
  testWidgets('Guardian SOS controller renders directional hints', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const ProviderScope(child: GuardianApp()));

    expect(find.text('Guardian'), findsOneWidget);
    expect(find.text('VOICE REPORTING'), findsOneWidget);
    expect(find.text('TEXT\nREPORTING'), findsOneWidget);
    expect(find.text('KEYWORD\nREPORTING'), findsOneWidget);
    expect(find.text('INSTANT SOS'), findsOneWidget);
    expect(find.text('SOS'), findsOneWidget);
  });
}
