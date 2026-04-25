import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTheme {
  // ─────────────────────────────────────────────────────────
  // LIGHT THEME
  // ─────────────────────────────────────────────────────────
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: _lightColorScheme,
      textTheme: _buildTextTheme(isLight: true),
      scaffoldBackgroundColor: AppColors.cream,
      cardTheme: _cardTheme,
      elevatedButtonTheme: _elevatedButtonTheme,
      inputDecorationTheme: _inputDecorationTheme(isLight: true),
      bottomNavigationBarTheme: _bottomNavTheme(isLight: true),
      appBarTheme: _appBarTheme(isLight: true),
      chipTheme: _chipTheme,
      floatingActionButtonTheme: _fabTheme,
      dialogTheme: _dialogTheme,
      snackBarTheme: _snackBarTheme,
    );
  }

  // ─────────────────────────────────────────────────────────
  // DARK THEME
  // ─────────────────────────────────────────────────────────
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: _darkColorScheme,
      textTheme: _buildTextTheme(isLight: false),
      scaffoldBackgroundColor: AppColors.night,
      cardTheme: _cardTheme.copyWith(
        color: const Color(0xFF161827),
        shadowColor: AppColors.coral.withOpacity(0.2),
      ),
      elevatedButtonTheme: _elevatedButtonTheme,
      inputDecorationTheme: _inputDecorationTheme(isLight: false),
      bottomNavigationBarTheme: _bottomNavTheme(isLight: false),
      appBarTheme: _appBarTheme(isLight: false),
      chipTheme: _chipTheme,
      floatingActionButtonTheme: _fabTheme,
      dialogTheme: _dialogTheme,
      snackBarTheme: _snackBarTheme,
    );
  }

  // ─────────────────────────────────────────────────────────
  // COLOR SCHEMES
  // ─────────────────────────────────────────────────────────
  static const ColorScheme _lightColorScheme = ColorScheme.light(
    primary:          AppColors.coral,
    primaryContainer: Color(0xFFFFE0DD),
    secondary:        AppColors.mint,
    secondaryContainer: Color(0xFFD1F7E5),
    tertiary:         AppColors.blue,
    tertiaryContainer: Color(0xFFD9DCFF),
    surface:          Colors.white,
    background:       AppColors.cream,
    error:            Color(0xFFFF4D4D),
    onPrimary:        Colors.white,
    onSecondary:      AppColors.ink,
    onTertiary:       Colors.white,
    onSurface:        AppColors.ink,
    onBackground:     AppColors.ink,
    onError:          Colors.white,
    brightness:       Brightness.light,
  );

  static const ColorScheme _darkColorScheme = ColorScheme.dark(
    primary:          AppColors.coral,
    primaryContainer: Color(0xFF731B16),
    secondary:        AppColors.mint,
    secondaryContainer: Color(0xFF0E4D33),
    tertiary:         AppColors.blueLight,
    tertiaryContainer: Color(0xFF141B6F),
    surface:          Color(0xFF161827),
    background:       AppColors.night,
    error:            Color(0xFFFF6B6B),
    onPrimary:        Colors.white,
    onSecondary:      AppColors.ink,
    onTertiary:       AppColors.ink,
    onSurface:        AppColors.cream,
    onBackground:     AppColors.cream,
    onError:          AppColors.ink,
    brightness:       Brightness.dark,
  );

  // ─────────────────────────────────────────────────────────
  // TEXT THEME
  // ─────────────────────────────────────────────────────────
  static TextTheme _buildTextTheme({required bool isLight}) {
    final baseColor = isLight ? AppColors.ink : AppColors.cream;
    final mutedColor = isLight ? const Color(0xFF7F7A76) : const Color(0xFFAFA79F);

    return TextTheme(
      // Display (Sora)
      displayLarge: GoogleFonts.sora(fontSize: 32, fontWeight: FontWeight.w700, letterSpacing: -0.5, color: baseColor),
      displayMedium: GoogleFonts.sora(fontSize: 26, fontWeight: FontWeight.w700, letterSpacing: -0.3, color: baseColor),
      displaySmall: GoogleFonts.sora(fontSize: 22, fontWeight: FontWeight.w600, letterSpacing: -0.2, color: baseColor),
      // Headline (Sora)
      headlineLarge: GoogleFonts.sora(fontSize: 20, fontWeight: FontWeight.w600, letterSpacing: -0.1, color: baseColor),
      headlineMedium: GoogleFonts.sora(fontSize: 18, fontWeight: FontWeight.w600, color: baseColor),
      headlineSmall: GoogleFonts.sora(fontSize: 16, fontWeight: FontWeight.w600, color: baseColor),
      // Title (Inter)
      titleLarge: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600, color: baseColor),
      titleMedium: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w500, color: baseColor),
      titleSmall: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: baseColor),
      // Body (Inter)
      bodyLarge: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w400, color: baseColor),
      bodyMedium: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, color: baseColor),
      bodySmall: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w400, color: mutedColor),
      // Label (Inter)
      labelLarge: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: baseColor),
      labelMedium: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: baseColor),
      labelSmall: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, letterSpacing: 0.2, color: mutedColor),
    );
  }

  // ─────────────────────────────────────────────────────────
  // COMPONENTS
  // ─────────────────────────────────────────────────────────
  static const CardTheme _cardTheme = CardTheme(
    elevation: 0,
    color: Colors.white,
    shadowColor: Color(0x1AFF6B5F),
    surfaceTintColor: Colors.transparent,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(24)),
      side: BorderSide(color: Color(0xFFEFE3D6), width: 1),
    ),
    margin: EdgeInsets.zero,
  );

  static ElevatedButtonThemeData get _elevatedButtonTheme =>
    ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.coral,
        foregroundColor: Colors.white,
        elevation: 0,
        shadowColor: Colors.transparent,
        shape: const StadiumBorder(),
        minimumSize: const Size(double.infinity, 52),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        textStyle: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700),
      ).copyWith(
        backgroundColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.pressed)) return AppColors.coralDark;
          if (states.contains(MaterialState.disabled)) return const Color(0xFFEFE3D6);
          return AppColors.coral;
        }),
        foregroundColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.disabled)) return const Color(0xFFAFA79F);
          return Colors.white;
        }),
        overlayColor: MaterialStateProperty.all(Colors.white.withOpacity(0.1)),
        elevation: MaterialStateProperty.all(0),
      ),
    );

  static InputDecorationTheme _inputDecorationTheme({required bool isLight}) =>
    InputDecorationTheme(
      filled: true,
      fillColor: isLight ? Colors.white : const Color(0xFF242634),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(
          color: isLight ? const Color(0xFFEFE3D6) : const Color(0xFF2B2E3D),
          width: 1.5,
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.blue, width: 2),
      ),
      hintStyle: GoogleFonts.inter(
        fontSize: 14, fontWeight: FontWeight.w400,
        color: (isLight ? AppColors.ink : AppColors.cream).withOpacity(0.4),
      ),
      prefixIconColor: isLight ? const Color(0xFFB0AAA2) : const Color(0xFF7F7A76),
    );

  static BottomNavigationBarThemeData _bottomNavTheme({required bool isLight}) =>
    BottomNavigationBarThemeData(
      backgroundColor: isLight ? Colors.white : const Color(0xFF161827),
      selectedItemColor: AppColors.coral,
      unselectedItemColor: const Color(0xFFAFA79F),
      selectedLabelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600),
      unselectedLabelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w400),
      type: BottomNavigationBarType.fixed,
      elevation: 8,
    );

  static AppBarTheme _appBarTheme({required bool isLight}) => AppBarTheme(
    backgroundColor: isLight ? Colors.white : const Color(0xFF161827),
    foregroundColor: isLight ? AppColors.ink : AppColors.cream,
    elevation: 0,
    centerTitle: true,
    shadowColor: AppColors.coral.withOpacity(0.1),
    titleTextStyle: GoogleFonts.sora(
      fontSize: 18, fontWeight: FontWeight.w600,
      color: isLight ? AppColors.ink : AppColors.cream,
    ),
  );

  static const ChipThemeData _chipTheme = ChipThemeData(
    shape: StadiumBorder(),
    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
    elevation: 0,
    backgroundColor: Color(0xFFEFE3D6),
    selectedColor: AppColors.coral,
    labelStyle: TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
    side: BorderSide.none,
  );

  static const FloatingActionButtonThemeData _fabTheme =
    FloatingActionButtonThemeData(
      backgroundColor: AppColors.coral,
      foregroundColor: Colors.white,
      elevation: 4,
      shape: CircleBorder(),
    );

  static const DialogTheme _dialogTheme = DialogTheme(
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(24)),
    ),
    elevation: 8,
    shadowColor: Color(0x1AFF6B5F),
    surfaceTintColor: Colors.transparent,
  );

  static const SnackBarThemeData _snackBarTheme = SnackBarThemeData(
    backgroundColor: AppColors.ink,
    contentTextStyle: TextStyle(color: AppColors.cream, fontSize: 14, fontWeight: FontWeight.w500),
    behavior: SnackBarBehavior.floating,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(12)),
    ),
    elevation: 8,
  );
}


// ============================================================
//