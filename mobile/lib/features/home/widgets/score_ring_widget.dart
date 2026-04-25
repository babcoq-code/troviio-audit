import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../../../core/theme/app_colors.dart';

enum ScoreRingSize { small, medium, large }

class ScoreRingWidget extends StatefulWidget {
  final double score; // 0-100
  final ScoreRingSize size;
  final bool showLabel;
  final String label;

  const ScoreRingWidget({
    super.key,
    required this.score,
    this.size = ScoreRingSize.medium,
    this.showLabel = true,
    this.label = 'Picksy',
  });

  @override
  State<ScoreRingWidget> createState() => _ScoreRingWidgetState();
}

class _ScoreRingWidgetState extends State<ScoreRingWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _progressAnim;
  late Animation<double> _glowAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _progressAnim = Tween<double>(begin: 0, end: widget.score / 100).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
    _glowAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _controller.forward();
  }

  @override
  void didUpdateWidget(ScoreRingWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.score != widget.score) {
      _progressAnim = Tween<double>(
        begin: oldWidget.score / 100,
        end: widget.score / 100,
      ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));
      _controller.forward(from: 0);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  double get _dimension {
    switch (widget.size) {
      case ScoreRingSize.small: return 40;
      case ScoreRingSize.medium: return 64;
      case ScoreRingSize.large: return 120;
    }
  }

  double get _strokeWidth {
    switch (widget.size) {
      case ScoreRingSize.small: return 4;
      case ScoreRingSize.medium: return 6;
      case ScoreRingSize.large: return 9;
    }
  }

  double get _fontSize {
    switch (widget.size) {
      case ScoreRingSize.small: return 14;
      case ScoreRingSize.medium: return 22;
      case ScoreRingSize.large: return 36;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = AppColors.fromScore(widget.score);

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, _) {
        final displayScore = (_progressAnim.value * 100).round();
        return SizedBox(
          width: _dimension,
          height: _dimension,
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Glow
              AnimatedOpacity(
                opacity: _glowAnim.value,
                duration: const Duration(milliseconds: 400),
                child: Container(
                  width: _dimension,
                  height: _dimension,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: color.withOpacity(0.3),
                        blurRadius: _dimension * 0.3,
                        spreadRadius: _dimension * 0.05,
                      )
                    ],
                  ),
                ),
              ),
              // Ring
              CustomPaint(
                size: Size(_dimension, _dimension),
                painter: _ScoreRingPainter(
                  progress: _progressAnim.value,
                  color: color,
                  trackColor: const Color(0xFFEFE3D6),
                  strokeWidth: _strokeWidth,
                ),
              ),
              // Score text
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '$displayScore',
                    style: TextStyle(
                      fontFamily: 'Nunito',
                      fontSize: _fontSize,
                      fontWeight: FontWeight.w800,
                      color: color,
                      height: 1,
                    ),
                  ),
                  if (widget.showLabel && widget.size != ScoreRingSize.small)
                    Text(
                      widget.label.toUpperCase(),
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: _dimension * 0.1,
                        fontWeight: FontWeight.w700,
                        color: Colors.grey[500],
                        letterSpacing: 0.5,
                      ),
                    ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}

class _ScoreRingPainter extends CustomPainter {
  final double progress;
  final Color color;
  final Color trackColor;
  final double strokeWidth;

  _ScoreRingPainter({
    required this.progress,
    required this.color,
    required this.trackColor,
    required this.strokeWidth,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (math.min(size.width, size.height) - strokeWidth) / 2;

    // Track
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      0, 2 * math.pi, false,
      Paint()
        ..color = trackColor
        ..strokeWidth = strokeWidth
        ..style = PaintingStyle.stroke
        ..strokeCap = StrokeCap.round,
    );

    // Progress
    if (progress > 0) {
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        -math.pi / 2,
        2 * math.pi * progress,
        false,
        Paint()
          ..color = color
          ..strokeWidth = strokeWidth
          ..style = PaintingStyle.stroke
          ..strokeCap = StrokeCap.round,
      );
    }
  }

  @override
  bool shouldRepaint(_ScoreRingPainter old) =>
    old.progress != progress || old.color != color;
}


// ============================================================
//