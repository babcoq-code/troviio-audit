import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import 'score_ring_widget.dart';

class CategoryCardWidget extends StatefulWidget {
  final String emoji;
  final String name;
  final double score;        // 0-100
  final bool isUpdated;
  final LinearGradient gradient;
  final VoidCallback onTap;
  final String heroTag;

  const CategoryCardWidget({
    super.key,
    required this.emoji,
    required this.name,
    required this.score,
    this.isUpdated = false,
    required this.gradient,
    required this.onTap,
    required this.heroTag,
  });

  @override
  State<CategoryCardWidget> createState() => _CategoryCardWidgetState();
}

class _CategoryCardWidgetState extends State<CategoryCardWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _pressCtrl;
  late Animation<double> _scaleAnim;
  Offset _offset = Offset.zero;

  @override
  void initState() {
    super.initState();
    _pressCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
      value: 1.0,
    );
    _scaleAnim = Tween<double>(begin: 1.0, end: 0.96).animate(
      CurvedAnimation(parent: _pressCtrl, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _pressCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _pressCtrl.forward(),
      onTapUp: (_) { _pressCtrl.reverse(); widget.onTap(); },
      onTapCancel: () => _pressCtrl.reverse(),
      onPanUpdate: (details) {
        setState(() {
          _offset += details.delta * 0.12;
          _offset = Offset(
            _offset.dx.clamp(-8.0, 8.0),
            _offset.dy.clamp(-8.0, 8.0),
          );
        });
      },
      onPanEnd: (_) {
        setState(() => _offset = Offset.zero);
      },
      child: AnimatedBuilder(
        animation: _pressCtrl,
        builder: (ctx, child) => Transform(
          transform: Matrix4.identity()
            ..scale(_scaleAnim.value)
            ..translate(_offset.dx, _offset.dy),
          alignment: Alignment.center,
          child: child,
        ),
        child: Hero(
          tag: widget.heroTag,
          child: Container(
            height: 180,
            decoration: BoxDecoration(
              gradient: widget.gradient,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: widget.gradient.colors.first.withOpacity(0.35),
                  blurRadius: 20,
                  spreadRadius: 0,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(widget.emoji, style: const TextStyle(fontSize: 36)),
                      if (widget.isUpdated)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.25),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            'Mis à jour',
                            style: GoogleFonts.inter(
                              fontSize: 11, fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const Spacer(),
                  Text(
                    widget.name,
                    style: GoogleFonts.sora(
                      fontSize: 18, fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      ScoreRingWidget(
                        score: widget.score,
                        size: ScoreRingSize.small,
                        showLabel: false,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${widget.score.round()}/100',
                        style: GoogleFonts.nunito(
                          fontSize: 20, fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}


// ============================================================
// USAGE EXAMPLE : lib/features/home/home_screen.dart
// ============================================================

// MaterialApp(
//   title: 'Picksy',
//   theme: AppTheme.lightTheme,
//   darkTheme: AppTheme.darkTheme,
//   themeMode: ThemeMode.system,
//   home: const HomeScreen(),
// )

// CategoryCardWidget(
//   emoji: '🤖',
//   name: 'Robot Aspirateur',
//   score: 87,
//   isUpdated: true,
//   gradient: AppColors.robotVacuum,
//   heroTag: 'category_robot',
//   onTap: () => Navigator.push(context, ...),
// )

// ScoreRingWidget(score: 87, size: ScoreRingSize.large)

// pubspec.yaml — Dépendances à ajouter :
// dependencies:
//   google_fonts: ^6.1.0
//   flutter_svg: ^2.0.9
//   cached_network_image: ^3.3.1
//
// dev_dependencies:
//   flutter_gen_runner: ^5.3.2