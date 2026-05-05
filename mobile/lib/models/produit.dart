class Produit {
  final String marque;
  final String nom;
  final String slug;
  final String asin;
  final int prixEur;
  final String imageUrl;
  final String lienAffiliation;
  final double score;
  final String verdict;
  final String description;
  final Map<String, String> specs;
  final List<String> pros;
  final List<String> cons;
  final Map<String, int> useCaseScores;
  final String testSummary;
  final bool actif;

  Produit({
    required this.marque,
    required this.nom,
    required this.slug,
    required this.asin,
    required this.prixEur,
    required this.imageUrl,
    required this.lienAffiliation,
    required this.score,
    required this.verdict,
    required this.description,
    required this.specs,
    required this.pros,
    required this.cons,
    required this.useCaseScores,
    required this.testSummary,
    required this.actif,
  });

  factory Produit.fromJson(Map<String, dynamic> json) {
    return Produit(
      marque: json['marque'] as String? ?? '',
      nom: json['nom'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      asin: json['asin'] as String? ?? '',
      prixEur: json['prix_eur'] as int? ?? 0,
      imageUrl: json['image_url'] as String? ?? '',
      lienAffiliation: json['lien_affiliation'] as String? ?? '',
      score: (json['score'] as num?)?.toDouble() ?? 0.0,
      verdict: json['verdict'] as String? ?? '',
      description: json['description'] as String? ?? '',
      specs: (json['specs'] as Map<String, dynamic>?)
              ?.map((k, v) => MapEntry(k, v.toString())) ??
          {},
      pros: (json['pros'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      cons: (json['cons'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      useCaseScores: (json['use_case_scores'] as Map<String, dynamic>?)
              ?.map((k, v) => MapEntry(k, (v as num).toInt())) ??
          {},
      testSummary: json['test_summary'] as String? ?? '',
      actif: json['actif'] as bool? ?? true,
    );
  }

  String get nomComplet => '$marque ${nom.replaceFirst(marque, '').trim()}';
  String get formattedPrix => '${prixEur}€';
}

class Categorie {
  final String nom;
  final String slug;
  final List<Produit> produits;
  final String? emoji;

  Categorie({
    required this.nom,
    required this.slug,
    required this.produits,
    this.emoji,
  });

  factory Categorie.fromJson(Map<String, dynamic> json) {
    final produitsList = (json['produits'] as List<dynamic>?)
            ?.map((e) => Produit.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];
    return Categorie(
      nom: json['nom'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      produits: produitsList,
      emoji: json['emoji'] as String?,
    );
  }

  int get totalProduits => produits.length;

  int get scoreMoyen {
    if (produits.isEmpty) return 0;
    final total = produits.fold<double>(0, (sum, p) => sum + p.score);
    return (total / produits.length).round();
  }
}
