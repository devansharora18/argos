import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../features/sos/sos_radial_controller.dart';
import '../models/argos_tab.dart';
import '../providers/gesture_provider.dart';
import '../widgets/argos_screen_shell.dart';
import '../widgets/argos_status_sections.dart';

class ArgosHomePage extends ConsumerStatefulWidget {
  const ArgosHomePage({super.key});

  @override
  ConsumerState<ArgosHomePage> createState() => _ArgosHomePageState();
}

class _ArgosHomePageState extends ConsumerState<ArgosHomePage> {
  final ScrollController _scrollController = ScrollController();
  ScrollHoldController? _scrollHoldController;
  late final ProviderSubscription<bool> _inputLockSubscription;
  late final ProviderSubscription<bool> _dragSubscription;

  bool _isSosInputLocked = false;
  bool _isSosDragging = false;

  bool get _shouldLockScroll => _isSosInputLocked || _isSosDragging;

  @override
  void initState() {
    super.initState();

    _inputLockSubscription = ref.listenManual<bool>(sosInputLockProvider, (
      _,
      next,
    ) {
      if (_isSosInputLocked == next) {
        return;
      }

      setState(() {
        _isSosInputLocked = next;
      });
      _syncParentScrollLock();
    });

    _dragSubscription = ref.listenManual<bool>(
      gestureProvider.select((state) => state.isDragging),
      (_, next) {
        if (_isSosDragging == next) {
          return;
        }

        setState(() {
          _isSosDragging = next;
        });
        _syncParentScrollLock();
      },
    );
  }

  void _syncParentScrollLock() {
    if (_shouldLockScroll) {
      _acquireScrollHold();
    } else {
      _releaseScrollHold();
    }
  }

  void _acquireScrollHold() {
    if (_scrollHoldController != null) {
      return;
    }

    if (!_scrollController.hasClients) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          _acquireScrollHold();
        }
      });
      return;
    }

    _scrollHoldController = _scrollController.position.hold(() {});
  }

  void _releaseScrollHold() {
    _scrollHoldController?.cancel();
    _scrollHoldController = null;
  }

  @override
  void dispose() {
    _releaseScrollHold();
    _inputLockSubscription.close();
    _dragSubscription.close();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ArgosScreenShell(
      selectedTab: ArgosTab.status,
      child: LayoutBuilder(
        builder: (context, constraints) {
          return SingleChildScrollView(
            controller: _scrollController,
            physics: _shouldLockScroll
                ? const NeverScrollableScrollPhysics()
                : const BouncingScrollPhysics(
                    parent: AlwaysScrollableScrollPhysics(),
                  ),
            child: ConstrainedBox(
              constraints: BoxConstraints(minHeight: constraints.maxHeight),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Align(
                    alignment: Alignment(0, 0.05),
                    child: SOSRadialController(),
                  ),
                  SizedBox(height: 10),
                  ArgosStatusSections(),
                  SizedBox(height: 6),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
