import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:argos_app/main.dart';

void main() {
  testWidgets('Argos SOS controller and bottom bar render', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const ProviderScope(child: GuardianApp()));

    expect(find.text('Argos'), findsOneWidget);
    expect(find.text('VOICE REPORTING'), findsOneWidget);
    expect(find.text('TEXT\nREPORTING'), findsOneWidget);
    expect(find.text('KEYWORD\nREPORTING'), findsOneWidget);
    expect(find.text('INSTANT SOS'), findsOneWidget);
    expect(find.text('SOS'), findsOneWidget);
    expect(find.text('STATUS'), findsOneWidget);
    expect(find.text('REPORTS'), findsOneWidget);
    expect(find.text('MAP'), findsOneWidget);
    expect(find.text('SETTINGS'), findsOneWidget);
  });
}
