import 'package:argos_staff/argos_staff_app.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  testWidgets('Dashboard renders core sections', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: ArgosStaffApp()));

    expect(find.text('ARGOS_OPS'), findsOneWidget);
    expect(find.text('ON SHIFT'), findsOneWidget);
    expect(find.text('LIVE INCIDENT FEED'), findsOneWidget);
  });

  testWidgets('Dispatch page renders without layout exceptions', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const ProviderScope(child: ArgosStaffApp()));

    await tester.tap(find.text('DISPATCH'));
    await tester.pumpAndSettle();

    expect(find.text('MISSION DIRECTIVE'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Response page renders without layout exceptions', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const ProviderScope(child: ArgosStaffApp()));

    await tester.tap(find.text('RESPONSE'));
    await tester.pumpAndSettle();

    expect(find.text('RESPONDING - FLOOR 3 FIRE'), findsOneWidget);
    expect(find.text('TACTICAL COMMANDS'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
