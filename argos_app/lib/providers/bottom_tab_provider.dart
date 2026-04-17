import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/argos_tab.dart';

final bottomTabProvider = StateProvider<ArgosTab>((ref) => ArgosTab.status);
