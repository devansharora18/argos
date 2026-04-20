import 'dart:async';
import 'dart:math' as math;

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
  late final AnimationController _waveController;

  Timer? _recordingTimer;
  int _elapsedSeconds = 42;
  bool _isRecording = true;

  @override
  void initState() {
    super.initState();
    _waveController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
    _startRecordingTimer();
  }

  @override
  void dispose() {
    _recordingTimer?.cancel();
    _waveController.dispose();
    super.dispose();
  }

  void _startRecordingTimer() {
    _recordingTimer?.cancel();
    _recordingTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted || !_isRecording) {
        return;
      }

      setState(() {
        _elapsedSeconds += 1;
      });
    });
  }

  void _setRecording(bool value) {
    if (_isRecording == value) {
      return;
    }

    setState(() {
      _isRecording = value;
    });

    if (value) {
      _waveController.repeat();
      _startRecordingTimer();
      return;
    }

    _recordingTimer?.cancel();
    _waveController.stop(canceled: false);
  }

  String get _formattedDuration {
    final minutes = _elapsedSeconds ~/ 60;
    final seconds = _elapsedSeconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  void _discardRecording() {
    _setRecording(false);
    setState(() {
      _elapsedSeconds = 0;
    });
  }

  void _sendReport() {
    _setRecording(false);
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text('Voice report sent to emergency dispatch.'),
        ),
      );
  }

  @override
  Widget build(BuildContext context) {
    return ArgosScreenShell(
      selectedTab: widget.selectedTab,
      child: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(0, 0.1),
            radius: 1.05,
            colors: [Color(0x2A5A1D1D), Color(0x08191921), Color(0x00131313)],
            stops: [0, 0.62, 1],
          ),
        ),
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(
            parent: AlwaysScrollableScrollPhysics(),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 2),
              const Text(
                'Voice Reporting',
                style: TextStyle(
                  color: Color(0xFFF1F2F4),
                  fontSize: 54,
                  fontWeight: FontWeight.w800,
                  height: 1.0,
                ),
              ),
              const SizedBox(height: 14),
              const Text(
                'Describe the situation clearly. Your audio is encrypted and shared with emergency dispatchers instantly.',
                style: TextStyle(
                  color: Color(0xFFE0BDB6),
                  fontSize: 17,
                  fontWeight: FontWeight.w600,
                  height: 1.45,
                ),
              ),
              const SizedBox(height: 22),
              Center(
                child: Text(
                  _formattedDuration,
                  style: const TextStyle(
                    color: Color(0xFFF2ABA2),
                    fontSize: 78,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.6,
                    height: 1,
                  ),
                ),
              ),
              const SizedBox(height: 4),
              Center(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 220),
                      width: 11,
                      height: 11,
                      decoration: BoxDecoration(
                        color: _isRecording
                            ? const Color(0xFFFFA9A0)
                            : const Color(0x66948D8E),
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      'LIVE RECORDING',
                      style: TextStyle(
                        color: _isRecording
                            ? const Color(0xFFE4C2BC)
                            : const Color(0xA89A8E8E),
                        fontSize: 11.5,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 2,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Center(
                child: _VoiceWaveform(
                  controller: _waveController,
                  isRecording: _isRecording,
                ),
              ),
              const SizedBox(height: 20),
              Center(
                child: _HoldToRecordButton(
                  isRecording: _isRecording,
                  onHoldChanged: _setRecording,
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: _VoiceActionButton(
                      label: 'Discard',
                      icon: Icons.close_rounded,
                      backgroundColor: const Color(0xFF292A2F),
                      foregroundColor: const Color(0xFFE4E4E5),
                      glowColor: const Color(0x00000000),
                      onPressed: _discardRecording,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _VoiceActionButton(
                      label: 'Send Report',
                      icon: Icons.send_rounded,
                      backgroundColor: const Color(0xFF0EBE55),
                      foregroundColor: const Color(0xFFF2FFF7),
                      glowColor: const Color(0x540EBE55),
                      onPressed: _sendReport,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 22),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
                decoration: BoxDecoration(
                  color: const Color(0xFF16171D),
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: const Color(0x1AFFFFFF)),
                ),
                child: const Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _InfoBadgeIcon(),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'We automatically capture your location and device health to provide first responders with essential context.',
                        style: TextStyle(
                          color: Color(0xFFE1C2BB),
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          height: 1.45,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoBadgeIcon extends StatelessWidget {
  const _InfoBadgeIcon();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 52,
      height: 52,
      decoration: BoxDecoration(
        color: const Color(0xFF242735),
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Icon(
        Icons.info_outline_rounded,
        color: Color(0xFFA0B7FF),
        size: 31,
      ),
    );
  }
}

class _VoiceWaveform extends StatelessWidget {
  const _VoiceWaveform({required this.controller, required this.isRecording});

  final AnimationController controller;
  final bool isRecording;

  static const List<double> _baseHeights = [
    24,
    52,
    86,
    62,
    112,
    118,
    92,
    112,
    78,
    98,
    24,
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 188,
      child: AnimatedBuilder(
        animation: controller,
        builder: (context, _) {
          final phase = controller.value * math.pi * 2;

          return Row(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              for (var i = 0; i < _baseHeights.length; i++) ...[
                if (i > 0) const SizedBox(width: 10),
                _WaveBar(
                  baseHeight: _baseHeights[i],
                  phase: phase,
                  index: i,
                  isRecording: isRecording,
                ),
              ],
            ],
          );
        },
      ),
    );
  }
}

class _WaveBar extends StatelessWidget {
  const _WaveBar({
    required this.baseHeight,
    required this.phase,
    required this.index,
    required this.isRecording,
  });

  final double baseHeight;
  final double phase;
  final int index;
  final bool isRecording;

  @override
  Widget build(BuildContext context) {
    final wave = (math.sin(phase + (index * 0.56)) + 1) / 2;
    final amplitude = isRecording ? 0.58 + (wave * 0.42) : 0.32;
    final barHeight = baseHeight * amplitude;
    final barColor = Color.lerp(
      const Color(0xFF7F3835),
      const Color(0xFFFF5A4F),
      isRecording ? (0.28 + (wave * 0.72)) : 0.2,
    );

    return AnimatedContainer(
      duration: const Duration(milliseconds: 160),
      curve: Curves.easeOutCubic,
      width: 9,
      height: barHeight,
      decoration: BoxDecoration(
        color: barColor,
        borderRadius: BorderRadius.circular(18),
      ),
    );
  }
}

class _HoldToRecordButton extends StatelessWidget {
  const _HoldToRecordButton({
    required this.isRecording,
    required this.onHoldChanged,
  });

  final bool isRecording;
  final ValueChanged<bool> onHoldChanged;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(999),
        onHighlightChanged: onHoldChanged,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          width: 236,
          height: 236,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              center: const Alignment(-0.22, -0.26),
              radius: 1.04,
              colors: [
                const Color(0xFFF48A84),
                const Color(0xFFFF5F55),
                isRecording ? const Color(0xFFFF4C46) : const Color(0xFFEC4E47),
              ],
            ),
            border: Border.all(color: const Color(0xFFEA8982), width: 6),
            boxShadow: [
              BoxShadow(
                color: isRecording
                    ? const Color(0x99FF604C)
                    : const Color(0x52FF604C),
                blurRadius: isRecording ? 48 : 26,
                spreadRadius: isRecording ? 10 : 3,
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.mic_rounded, size: 52, color: Color(0xFF520906)),
              const SizedBox(height: 6),
              Text(
                'HOLD TO RECORD',
                style: TextStyle(
                  color: const Color(0xFF520906),
                  fontSize: isRecording ? 18 : 17,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.0,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _VoiceActionButton extends StatelessWidget {
  const _VoiceActionButton({
    required this.label,
    required this.icon,
    required this.backgroundColor,
    required this.foregroundColor,
    required this.glowColor,
    required this.onPressed,
  });

  final String label;
  final IconData icon;
  final Color backgroundColor;
  final Color foregroundColor;
  final Color glowColor;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: glowColor, blurRadius: 18, spreadRadius: 1),
        ],
      ),
      child: FilledButton.icon(
        onPressed: onPressed,
        icon: Icon(icon, size: 22),
        label: Text(label),
        style: FilledButton.styleFrom(
          backgroundColor: backgroundColor,
          foregroundColor: foregroundColor,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          textStyle: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}
