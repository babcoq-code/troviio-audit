import 'package:flutter/material.dart';

class AppColors {
  // ── Couleurs primaires ──────────────────────────────────────
  static const Color coral     = Color(0xFFFF6B5F);  // Coral Pop — CTA, énergie
  static const Color coralDark = Color(0xFFE5554A);
  static const Color coralLight = Color(0xFFFF9A92);

  static const Color mint      = Color(0xFF3ED6A3);  // Mint Smart — Succès
  static const Color mintDark  = Color(0xFF1BAE7D);
  static const Color mintLight = Color(0xFF8AF0CC);

  static const Color blue      = Color(0xFF4257FF);  // Blueberry Trust — IA
  static const Color blueDark  = Color(0xFF2638D9);
  static const Color blueLight = Color(0xFF8C98FF);

  // ── Neutres ────────────────────────────────────────────────
  static const Color cream     = Color(0xFFFFF7ED);  // Background clair
  static const Color ink       = Color(0xFF161827);  // Texte principal
  static const Color night     = Color(0xFF0E1020);  // Background sombre

  // ── Score colors ───────────────────────────────────────────
  static const Color scoreExcellent = mint;    // 80-100
  static const Color scoreGood      = blue;    // 60-79
  static const Color scoreMedium    = Color(0xFFFFB347); // 40-59 (Amber — exclusif score)
  static const Color scoreLow       = coral;   // 0-39

  // ── Gradients ──────────────────────────────────────────────
  static const LinearGradient coralIntelligence = LinearGradient(
    colors: [Color(0xFFFF6B5F), Color(0xFFFFB067)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient mintConfidence = LinearGradient(
    colors: [Color(0xFF3ED6A3), Color(0xFF9AF7D4)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient blueAI = LinearGradient(
    colors: [Color(0xFF4257FF), Color(0xFF8A7CFF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient hero = LinearGradient(
    colors: [Color(0xFFFF6B5F), Color(0xFFFFB020), Color(0xFF3ED6A3)],
    stops: [0.0, 0.42, 1.0],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient nightGlow = LinearGradient(
    colors: [Color(0xFF0E1020), Color(0xFF1A1C3A)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // ── Catégories ─────────────────────────────────────────────
  static const LinearGradient robotVacuum = LinearGradient(
    colors: [Color(0xFF4257FF), Color(0xFF3ED6A3)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient tvOled = LinearGradient(
    colors: [Color(0xFF161827), Color(0xFF4257FF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient machineCafe = LinearGradient(
    colors: [Color(0xFFFF6B5F), Color(0xFFFFB020)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Méthode utilitaire : score → couleur
  static Color fromScore(double score) {
    if (score >= 80) return scoreExcellent;
    if (score >= 60) return scoreGood;
    if (score >= 40) return scoreMedium;
    return scoreLow;
  }
}

// ── Extensions ─────────────────────────────────────────────
extension PicksyColorScheme on ColorScheme {
  Color get coral    => AppColors.coral;
  Color get mint     => AppColors.mint;
  Color get blue     => AppColors.blue;
  Color get cream    => AppColors.cream;
  Color get ink      => AppColors.ink;
  Color get night    => AppColors.night;
}

extension PicksyContext on BuildContext {
  ColorScheme get colors => Theme.of(this).colorScheme;
  TextTheme   get text   => Theme.of(this).textTheme;
  bool get isDark => Theme.of(this).brightness == Brightness.dark;
}


// ============================================================
//