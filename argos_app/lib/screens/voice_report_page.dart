import 'dart:async';

import 'package:flutter/material.dart';

import '../models/argos_tab.dart';
import '../widgets/argos_screen_shell.dart';

class VoiceReportPage extends StatefulWidget {
  const VoiceReportPage({super.key, this.selectedTab = ArgosTab.status});

  final ArgosTab selectedTab;

  @override
  State<VoiceReportPage> createState() => _VoiceReportPageState();
}

class _VoiceReportPageState extends State<VoiceReportPage>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pulseController;

  Timer? _recordingTimer;
  int _elapsedSeconds = 0;
  bool _isRecording = false;
  bool _hasRecording = false;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    );
  }

  @override
  void dispose() {
    _recordingTimer?.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  void _toggleRecording() {
    setState(() {
      if (_isRecording) {
        _isRecording = false;
        _hasRecording = _elapsedSeconds > 0;
        _recordingTimer?.cancel();
        _pulseController.stop();
        _pulseController.reset();
      } else {
        _isRecording = true;
        _hasRecording = false;
        _elapsedSeconds = 0;
        _pulseController.repeat();
        _recordingTimer = Timer.periodic(const Duration(seconds: 1), (_) {
          if (!mounted) return;
          setState(() => _elapsedSeconds += 1);
        });
      }
    });
  }

  void _sendRecording() {
    setState(() {
      _isRecording = false;
      _hasRecording = false;
      _elapsedSeconds = 0;
      _recordingTimer?.cancel();
      _pulseController.stop();
      _pulseController.reset();
    });
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text('Voice report sent to nearest response center.'),
        ),
      );
  }

  String get _formattedDuration {
    final minutes = _elapsedSeconds ~/ 60;
    final seconds = _elapsedSeconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final canSend = _hasRecording && !_isRecording;

    return ArgosScreenShell(
      selectedTab: widget.selectedTab,
      child: Padding(
        padding: const EdgeInsets.only(top: 4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'VOICE REPORT',
              style: TextStyle(
                color: Color(0xFF3B8AFF),
                fontSize: 13,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.6,
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'Speak your\nsituation.',
              style: TextStyle(
                color: Color(0xFFF1F2F4),
                fontSize: 44,
                fontWeight: FontWeight.w800,
                height: 1.05,
              ),
            ),
            const SizedBox(height: 14),
            const Text(
              'Your recording will be transcribed and sent to the nearest response center.',
              style: TextStyle(
                color: Color(0xFFE0BDB6),
                fontSize: 16,
                fontWeight: FontWeight.w600,
                height: 1.4,
              ),
            ),
            Expanded(
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _MicButton(
                      isRecording: _isRecording,
                      pulse: _pulseController,
                      onTap: _toggleRecording,
                    ),
                    const SizedBox(height: 24),
                    _StatusLabel(
                      isRecording: _isRecording,
                      hasRecording: _hasRecording,
                      duration: _formattedDuration,
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(
              width: double.infinity,
              height: 64,
              child: FilledButton(
                onPressed: canSend ? _sendRecording : null,
                style: FilledButton.styleFrom(
                  backgroundColor: const Color(0xFFFF5A4F),
                  foregroundColor: const Color(0xFF1A0707),
                  disabledBackgroundColor: const Color(0xFF1E2027),
                  disabledForegroundColor: const Color(0xFF6B6E78),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  textStyle: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                child: const Text('Send Recording'),
              ),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}

class _MicButton extends StatelessWidget {
  const _MicButton({
    required this.isRecording,
    required this.pulse,
    required this.onTap,
  });

  final bool isRecording;
  final AnimationController pulse;
  final VoidCallback onTap;

  static const double _coreSize = 152;
  static const double _maxRing = 280;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: _maxRing,
      height: _maxRing,
      child: Stack(
        alignment: Alignment.center,
        children: [
          if (isRecording) ...[
            _PulseRing(controller: pulse, delayFraction: 0),
            _PulseRing(controller: pulse, delayFraction: 0.5),
          ],
          GestureDetector(
            onTap: onTap,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 220),
              curve: Curves.easeOut,
              width: _coreSize,
              height: _coreSize,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isRecording
                    ? const Color(0xFFFF5A4F)
                    : const Color(0xFF1F2128),
                border: Border.all(
                  color: isRecording
                      ? const Color(0xFFFF7E74)
                      : const Color(0x1AFFFFFF),
                  width: 1.4,
                ),
                boxShadow: isRecording
                    ? const [
                        BoxShadow(
                          color: Color(0x66FF5A4F),
                          blurRadius: 30,
                          spreadRadius: 4,
                        ),
                      ]
                    : null,
              ),
              child: Center(
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 180),
                  transitionBuilder: (child, anim) =>
                      ScaleTransition(scale: anim, child: child),
                  child: isRecording
                      ? Container(
                          key: const ValueKey('stop'),
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: const Color(0xFF4A0E0A),
                            borderRadius: BorderRadius.circular(6),
                          ),
                        )
                      : const Icon(
                          Icons.mic_none_rounded,
                          key: ValueKey('mic'),
                          size: 64,
                          color: Color(0xFFB8BBC6),
                        ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PulseRing extends StatelessWidget {
  const _PulseRing({required this.controller, required this.delayFraction});

  final AnimationController controller;
  final double delayFraction;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        final raw = (controller.value + delayFraction) % 1.0;
        final scale = 0.55 + (raw * 0.85);
        final opacity = (1.0 - raw).clamp(0.0, 1.0) * 0.55;
        return Opacity(
          opacity: opacity,
          child: Transform.scale(
            scale: scale,
            child: Container(
              width: _MicButton._maxRing,
              height: _MicButton._maxRing,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0x33FF5A4F),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _StatusLabel extends StatelessWidget {
  const _StatusLabel({
    required this.isRecording,
    required this.hasRecording,
    required this.duration,
  });

  final bool isRecording;
  final bool hasRecording;
  final String duration;

  @override
  Widget build(BuildContext context) {
    if (isRecording) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: const [
          _PulsingDot(),
          SizedBox(width: 8),
          Text(
            'Recording...',
            style: TextStyle(
              color: Color(0xFFFF8E84),
              fontSize: 16,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      );
    }
    final text = hasRecording
        ? 'Recording ready  $duration'
        : 'Tap to start recording';
    return Text(
      text,
      style: const TextStyle(
        color: Color(0xFF8C8F99),
        fontSize: 16,
        fontWeight: FontWeight.w600,
      ),
    );
  }
}

class _PulsingDot extends StatefulWidget {
  const _PulsingDot();

  @override
  State<_PulsingDot> createState() => _PulsingDotState();
}

class _PulsingDotState extends State<_PulsingDot>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 900),
  )..repeat(reverse: true);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: Tween<double>(begin: 0.4, end: 1.0).animate(_c),
      child: Container(
        width: 8,
        height: 8,
        decoration: const BoxDecoration(
          color: Color(0xFFFF5A4F),
          shape: BoxShape.circle,
        ),
      ),
    );
  }
}
