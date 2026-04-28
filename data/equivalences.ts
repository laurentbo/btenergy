// ─── ÉQUIVALENCES D'INGRÉDIENTS ──────────────────────────────────────────────
// Permet au coaché de remplacer un ingrédient par un équivalent nutritionnel
// Clé = forme normalisée (lowercase, sans accent), valeur = liste d'équivalents

export type EquivalenceEntry = {
  group: string          // Catégorie (oléagineux, fruits, protéines…)
  alts: string[]         // Ingrédients de substitution
  note?: string          // Conseil nutritionnel court
}

export const EQUIVALENCES: Record<string, EquivalenceEntry> = {
  // ── Oléagineux ──────────────────────────────────────────────────────────
  "amandes": {
    group: "Oléagineux",
    alts: ["noisettes", "noix de cajou", "noix", "pistaches", "noix de pécan"],
    note: "Même apport en bons lipides et protéines végétales · portion = 1 petite poignée (25–30 g)"
  },
  "amandes grillées": {
    group: "Oléagineux",
    alts: ["noisettes", "noix de cajou", "noix", "pistaches"],
    note: "Grillées = meilleur goût · crus = plus d'enzymes actives"
  },
  "noisettes": {
    group: "Oléagineux",
    alts: ["amandes", "noix de cajou", "noix", "pistaches"],
    note: "Riches en vitamine E et magnésium · 25 g suffisent"
  },
  "noix de cajou": {
    group: "Oléagineux",
    alts: ["amandes", "noisettes", "noix", "pistaches"],
    note: "Plus riches en glucides que les autres · idéal avant effort"
  },
  "noix": {
    group: "Oléagineux",
    alts: ["amandes", "noisettes", "noix de cajou", "noix du Brésil"],
    note: "Cerneaux = source n°1 d'oméga-3 végétaux ALA · 5–6 cerneaux"
  },
  "noix du brésil": {
    group: "Oléagineux",
    alts: ["amandes", "noix", "noisettes"],
    note: "Exceptionnelle source de sélénium · 2 noix/jour suffisent"
  },
  "noix de macadamia": {
    group: "Oléagineux",
    alts: ["amandes", "noisettes", "noix de cajou"],
    note: "Les plus riches en acide oléique (comme l'huile d'olive) · 20 g"
  },
  "pistaches": {
    group: "Oléagineux",
    alts: ["amandes", "noisettes", "noix de cajou"],
    note: "Riches en lutéine et vitamine B6 · 30 g = 1 portion"
  },

  // ── Céréales & féculents ─────────────────────────────────────────────────
  "riz complet": {
    group: "Céréales",
    alts: ["quinoa", "riz basmati", "sarrasin", "boulgour", "millet"],
    note: "IG bas · riche en fibres · cuisson 35 min"
  },
  "riz basmati": {
    group: "Céréales",
    alts: ["riz complet", "quinoa", "boulgour", "millet"],
    note: "IG modéré · digeste · cuisson 12 min"
  },
  "quinoa": {
    group: "Céréales",
    alts: ["riz complet", "boulgour", "sarrasin", "millet"],
    note: "Protéine complète végétale · 8 g de protéines / 100 g cuit"
  },
  "boulgour": {
    group: "Céréales",
    alts: ["quinoa", "riz complet", "sarrasin"],
    note: "Blé précuit · cuisson rapide (15 min) · riche en fibres"
  },
  "sarrasin": {
    group: "Céréales",
    alts: ["quinoa", "riz complet", "millet"],
    note: "Sans gluten · riche en rutine (anti-inflammatoire) · cuisson 15 min"
  },
  "millet": {
    group: "Céréales",
    alts: ["quinoa", "riz complet", "sarrasin"],
    note: "Le plus digeste des grains · idéal inflammation intestinale"
  },
  "patate douce": {
    group: "Féculents",
    alts: ["pommes de terre vapeur", "courge butternut", "panais"],
    note: "IG modéré (50 vapeur) · riche en bêta-carotène et potassium"
  },
  "pommes de terre vapeur": {
    group: "Féculents",
    alts: ["patate douce", "igname", "courge butternut"],
    note: "Vapeur ou chemise = IG bas (50) vs frites (IG 95)"
  },

  // ── Protéines animales ───────────────────────────────────────────────────
  "saumon vapeur": {
    group: "Poissons",
    alts: ["truite vapeur", "maquereau", "sardines fraîches", "bar"],
    note: "Oméga-3 EPA/DHA · 150 g = portion · 2–3x / semaine conseillé"
  },
  "saumon fumé": {
    group: "Poissons",
    alts: ["truite fumée", "maquereau fumé", "sardines à l'huile d'olive"],
    note: "Riche en oméga-3 · attention au sel · 80–100 g en entrée"
  },
  "sardines à l'huile d'olive": {
    group: "Poissons",
    alts: ["maquereau en boîte", "thon au naturel", "hareng fumé"],
    note: "Excellente source d'oméga-3 et de calcium · économique et pratique"
  },
  "thon": {
    group: "Poissons",
    alts: ["sardines à l'huile d'olive", "maquereau", "saumon"],
    note: "Préférer au naturel · max 2x / semaine (mercure)"
  },
  "blanc de poulet": {
    group: "Viandes",
    alts: ["blanc de dinde", "escalope de veau", "filet de lapin"],
    note: "Protéines maigres · 150 g = apport idéal"
  },
  "volaille grillée": {
    group: "Viandes",
    alts: ["poulet fermier", "dinde", "pintade", "faisan"],
    note: "Préférer label rouge ou bio · protéines complètes"
  },
  "dinde en escalope": {
    group: "Viandes",
    alts: ["blanc de poulet", "escalope de veau", "filet de porc"],
    note: "Viande maigre riche en tryptophane (sommeil et humeur)"
  },
  "œufs mollets": {
    group: "Œufs",
    alts: ["œufs durs", "œufs pochés", "œufs au plat"],
    note: "Jaune mi-cuit = oméga-3 et vitamines préservés · 2 œufs/repas"
  },

  // ── Fruits ───────────────────────────────────────────────────────────────
  "myrtilles": {
    group: "Fruits rouges",
    alts: ["framboises", "cassis", "mûres", "fraises"],
    note: "Anthocyanes (anti-inflammatoire) · se congèlent très bien"
  },
  "myrtilles & framboises": {
    group: "Fruits rouges",
    alts: ["framboises", "cassis", "mûres", "fraises", "groseilles"],
    note: "Fruits rouges = les + riches en antioxydants · 100–150 g"
  },
  "framboises": {
    group: "Fruits rouges",
    alts: ["myrtilles", "fraises", "cassis", "mûres"],
    note: "Riches en fibres et en ellagitanins (anticancer) · faibles en sucre"
  },
  "fruits rouges": {
    group: "Fruits rouges",
    alts: ["myrtilles", "framboises", "fraises", "cassis", "mûres"],
    note: "Les + riches en antioxydants · frais ou surgelés = même valeur"
  },
  "banane": {
    group: "Fruits",
    alts: ["mangue mûre", "datte fraîche", "papaye"],
    note: "Énergie rapide + tryptophane (sérotonine) · plus mûre = IG plus élevé"
  },
  "pomme": {
    group: "Fruits",
    alts: ["poire", "pêche", "abricot", "nectarine"],
    note: "Pectine = prébiotique intestinal · manger avec la peau (lavée)"
  },
  "kiwi": {
    group: "Fruits",
    alts: ["orange", "mandarine", "citron"],
    note: "2× plus de vitamine C que l'orange · riche en actinidine (digestion)"
  },
  "avocat": {
    group: "Fruits gras",
    alts: ["purée d'amande", "houmous maison"],
    note: "Graisses mono-insaturées · vitamine E · 1/2 avocat = 1 portion"
  },

  // ── Légumes ──────────────────────────────────────────────────────────────
  "brocolis": {
    group: "Légumes crucifères",
    alts: ["chou-fleur", "kale", "chou de Bruxelles", "chou frisé"],
    note: "Sulforaphane = détoxifiant hépatique · ne pas trop cuire"
  },
  "brocolis vapeur": {
    group: "Légumes crucifères",
    alts: ["chou-fleur vapeur", "haricots verts vapeur", "courgettes vapeur"],
    note: "Al dente = sulforaphane maximal · 5 min vapeur"
  },
  "épinards": {
    group: "Légumes feuilles",
    alts: ["mâche", "roquette", "blettes", "kale"],
    note: "Fer non-hémique + vitamine C = absorbés ensemble · 60 g crus"
  },
  "courgettes vapeur": {
    group: "Légumes",
    alts: ["haricots verts", "brocolis vapeur", "asperges"],
    note: "Très digeste · pauvre en calories · cuisson 8 min vapeur"
  },
  "haricots verts vapeur": {
    group: "Légumes",
    alts: ["courgettes vapeur", "brocolis vapeur", "asperges"],
    note: "Riches en vitamine K et folates · croquants = préservation des nutriments"
  },
  "carottes": {
    group: "Légumes",
    alts: ["betterave crue", "panais", "céleri-rave"],
    note: "Bêta-carotène mieux absorbé cuit avec un peu de matière grasse"
  },

  // ── Légumineuses ─────────────────────────────────────────────────────────
  "lentilles": {
    group: "Légumineuses",
    alts: ["pois chiches", "haricots blancs", "flageolets", "pois cassés"],
    note: "Protéines + fibres + fer · tremper la nuit = meilleure digestion"
  },
  "pois chiches": {
    group: "Légumineuses",
    alts: ["lentilles", "haricots blancs", "pois cassés", "flageolets"],
    note: "Riches en zinc et en fer · en boîte = OK si rincés soigneusement"
  },
  "haricots blancs": {
    group: "Légumineuses",
    alts: ["lentilles", "pois chiches", "flageolets"],
    note: "Riches en fibres solubles · soutiennent la flore intestinale"
  },

  // ── Huiles & condiments ──────────────────────────────────────────────────
  "huile d'olive": {
    group: "Huiles",
    alts: ["huile de lin (non chauffée)", "huile d'avocat", "huile de noix (non chauffée)"],
    note: "Extra-vierge = polyphénols préservés · ne pas dépasser 160°C"
  },
  "miel brut": {
    group: "Sucrants naturels",
    alts: ["sirop d'agave", "sirop d'érable", "sucre de coco"],
    note: "Miel cru = enzymes et propolis · ne jamais chauffer au-dessus de 40°C"
  },

  // ── Superaliments ────────────────────────────────────────────────────────
  "spiruline": {
    group: "Superaliments",
    alts: ["chlorella", "moringa", "maca"],
    note: "1 c. à café (3–5 g) · protéines complètes + fer + B12 · commencer progressivement"
  },
  "graines de chia": {
    group: "Graines",
    alts: ["graines de lin moulues", "graines de chanvre", "graines de sésame"],
    note: "Tremper 15 min avant consommation · 2 c. à soupe = 1 portion"
  },
  "graines de lin moulues": {
    group: "Graines",
    alts: ["graines de chia", "graines de chanvre", "graines de sésame"],
    note: "Moudre au moment = absorption oméga-3 maximale"
  },
}

// ─── HELPER : retrouve les équivalences pour un item de repas ────────────────
export function getEquivalence(item: string): EquivalenceEntry | null {
  // Normalise : lowercase, supprime accents, trim
  const normalize = (s: string) =>
    s.toLowerCase()
     .normalize("NFD").replace(/\p{Diacritic}/gu, "")
     .replace(/[^a-z0-9\s]/g, "")
     .trim()

  const key = normalize(item)

  // Cherche une correspondance exacte ou partielle
  for (const [k, v] of Object.entries(EQUIVALENCES)) {
    const nk = normalize(k)
    if (key === nk || key.includes(nk) || nk.includes(key)) {
      return v
    }
  }
  return null
}

// ─── SIMPLIFICATION DES NOMS D'INGRÉDIENTS ──────────────────────────────────
// Doit être défini AVANT categorizeIngredient qui l'utilise

const CANONICAL: Record<string, string> = {
  "eau citronnee": "Citron",
  "eau citronnee tiede": "Citron",
  "eau citronnee gingembre": "Citron + Gingembre",
  "eau chaude citron gingembre": "Citron + Gingembre",
  "eau chaude citron curcuma": "Citron + Curcuma",
  "jus citron": "Citron",
  "jus de citron": "Citron",
  "fruits de saison": "Fruits de saison",
  "un fruit pomme poire ou agrume": "Pomme / Poire / Agrume",
  "un fruit": "Fruit de saison",
  "fruits rouges": "Fruits rouges",
  "fruits secs melanges": "Fruits secs mélangés",
  "blanc de poisson au citron": "Poisson blanc",
  "poulet roti aux herbes de provence": "Poulet rôti",
  "blanc de poulet grille aux herbes": "Blanc de poulet",
  "filet de bar en croute d herbes": "Bar",
  "filet de cabillaud en papillote citron herbes": "Cabillaud",
  "smoothie detox epinards banane pomme verte gingembre eau de coco": "Smoothie détox",
  "smoothie vert epinards avocat pomme spiruline citron": "Smoothie vert",
  "granola maison fruits yaourt de coco miel": "Granola maison",
  "grand smoothie ceremoniel banane cacao cru datte lait d amande maca": "Smoothie cérémoniel",
  "huile d olive citron": "Huile d'olive",
  "eau de coco": "Eau de coco",
  "potage de poireaux": "Poireaux",
  "compote de pommes sans sucre noix": "Compote de pommes",
  "grande salade composee": "Salade composée",
  "poire ou raisin frais": "Poire / Raisin",
  "kiwi ou orange": "Kiwi / Orange",
  "papaye ou ananas frais": "Papaye / Ananas",
  "mangue ou melon": "Mangue / Melon",
  "figues fraiches ou kakis": "Figues / Kakis",
  "abricots frais ou secs 3": "Abricots",
  "2 mandarines noisettes": "Mandarines + Noisettes",
  "chocolat noir 85 2 carres noix du bresil 2": "Chocolat noir 85%",
  "cerises ou prunes fraiches": "Cerises / Prunes",
  "fruits exotiques fruits de la passion litchi papaye": "Fruits exotiques",
}

const nn = (s: string) =>
  s.toLowerCase()
   .normalize("NFD").replace(/\p{Diacritic}/gu, "")
   .replace(/[^a-z0-9\s]/g, " ")
   .replace(/\s+/g, " ")
   .trim()

const STOP_WORDS = ["vapeur", "grille", "roti", "saute", "poele", "maison", "leger", "legere", "bio"]

export function simplifyIngredient(raw: string): string {
  const key = nn(raw)
  if (CANONICAL[key]) return CANONICAL[key]
  for (const [k, v] of Object.entries(CANONICAL)) {
    if (key.length > 6 && key === k) return v
    if (key.length > 12 && key.includes(k) && k.length > 8) return v
  }
  let clean = raw.replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim()
  if (clean.length > 30) clean = clean.split(/[,&+]/)[0].trim()
  const words = clean.split(" ").filter(w => !STOP_WORDS.includes(nn(w)) && w.length > 0)
  clean = words.join(" ").trim()
  return clean.charAt(0).toUpperCase() + clean.slice(1)
}

export function dedupeKey(raw: string): string {
  return nn(simplifyIngredient(raw))
}

// ─── CATÉGORIES POUR LA LISTE DE COURSES ────────────────────────────────────
// L'ordre définit la priorité (premier match gagne)
export const SHOPPING_CATEGORIES: Record<string, { icon: string; color: string; keywords: string[] }> = {
  "Protéines":            { icon: "🥩", color: "#f97316", keywords: ["poulet", "dinde", "veau", "boeuf", "agneau", "saumon", "truite", "sardine", "thon", "maquereau", "gambas", "crevette", "bar", "cabillaud", "merlu", "pintade", "lapin", "escalope", "volaille", "poisson"] },
  "Œufs & Laitiers":     { icon: "🥚", color: "#fbbf24", keywords: ["oeuf", "yaourt", "fromage", "feta", "chevre", "parmesan", "lait d amande", "lait de coco", "creme"] },
  "Légumineuses":         { icon: "🫘", color: "#38c4e8", keywords: ["lentille", "pois chiche", "haricot blanc", "pois casse", "flageolet", "edamame", "tempeh", "tofu"] },
  "Céréales & Féculents": { icon: "🌾", color: "#a78bfa", keywords: ["riz", "quinoa", "boulgour", "sarrasin", "millet", "avoine", "epeautre", "seigle", "pita", "galette", "patate douce", "pomme de terre", "pommes de terre"] },
  "Légumes":              { icon: "🥦", color: "#4cc9f0", keywords: ["poireau", "carotte", "brocoli", "courgette", "tomate", "salade", "epinard", "roquette", "mache", "chou", "celeri", "fenouil", "aubergine", "poivron", "concombre", "betterave", "haricot vert", "asperge", "champignon", "ail", "oignon"] },
  "Oléagineux & Graines": { icon: "🥜", color: "#10b981", keywords: ["amande", "noisette", "noix", "cajou", "pistache", "macadamia", "pecan", "bresil", "graine", "chia", "lin", "sesame", "tournesol", "chanvre"] },
  "Huiles & Condiments":  { icon: "🫒", color: "#84cc16", keywords: ["huile", "vinaigre", "moutarde", "tamari", "pesto", "tahini", "miso"] },
  "Herbes & Épices":      { icon: "🌿", color: "#6ee7b7", keywords: ["gingembre", "curcuma", "basilic", "persil", "coriandre", "menthe", "romarin", "thym", "cumin", "paprika", "cannelle", "cardamome", "safran", "vanille"] },
  "Superaliments":        { icon: "⚡", color: "#818cf8", keywords: ["spiruline", "chlorella", "maca", "pollen", "propolis", "moringa", "ashwagandha"] },
  "Boissons":             { icon: "🍵", color: "#7dd3fc", keywords: ["infusion", "the vert", "tisane", "eau de coco", "kombucha", "kefir", "bouillon", "smoothie"] },
  "Miel & Sucrants":      { icon: "🍯", color: "#fde68a", keywords: ["miel", "sirop", "sucre de coco", "compote"] },
  "Fruits frais":         { icon: "🍎", color: "#f59e0b", keywords: ["fruit", "pomme", "poire", "banane", "kiwi", "orange", "mandarine", "fraise", "myrtille", "framboise", "mangue", "avocat", "citron", "raisin", "abricot", "figue", "peche", "prune", "cerise", "melon", "papaye", "ananas", "grenade"] },
}

export function categorizeIngredient(rawItem: string): string {
  const simplified = simplifyIngredient(rawItem)
  const lower = simplified.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
  for (const [cat, { keywords }] of Object.entries(SHOPPING_CATEGORIES)) {
    if (keywords.some(k => lower.includes(k.normalize("NFD").replace(/\p{Diacritic}/gu, "")))) {
      return cat
    }
  }
  return "Divers"
}
