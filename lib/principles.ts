export type Principe = {
  icon: string
  title: string
  color: string
  shortDesc: string
  fullDesc: string
  rules: string[]
  impact: string
  data?: {
    label: string
    rows?: { col1: string; col2: string; col3?: string }[]
    list?: string[]
  }
}

export const VERISSIMO_PRINCIPES: Principe[] = [
  {
    icon: "🦷",
    title: "Mastication",
    color: "#f59e0b",
    shortDesc: "Mastiquer 20 à 30 fois par bouchée, poser les couverts entre chaque.",
    fullDesc: "La digestion commence dans la bouche. La salive contient l'amylase, une enzyme qui pré-digère les glucides avant même que les aliments atteignent l'estomac. En mastiquant lentement, vous découplez l'acte de manger du pilotage automatique et laissez au cerveau le temps de recevoir le signal de satiété — qui prend 20 minutes.",
    rules: [
      "Mastiquer 20 à 30 fois avant d'avaler.",
      "Poser les couverts entre chaque bouchée.",
      "Manger assis, sans écran, sans stress.",
      "S'arrêter à 80 % de satiété — Hara Hachi Bu.",
    ],
    impact: "Réduction des ballonnements, meilleure absorption des nutriments, diminution des quantités ingérées de 20 à 30 %, sensation de satiété plus précoce.",
  },
  {
    icon: "🔀",
    title: "Dissociation alimentaire",
    color: "#4cc9f0",
    shortDesc: "Ne jamais combiner protéines animales et glucides dans le même repas.",
    fullDesc: "Les protéines et les glucides complexes nécessitent des environnements digestifs différents — acide pour les protéines (pepsine gastrique), alcalin pour les glucides (amylase). Les consommer ensemble ralentit la digestion, favorise la fermentation intestinale et épuise l'énergie. La dissociation libère le système digestif et améliore l'énergie post-repas.",
    rules: [
      "Protéines animales (viande, poisson, œufs) → avec légumes uniquement.",
      "Glucides (riz, pâtes, pain, pommes de terre) → avec légumes uniquement.",
      "Légumes et crudités → compatibles avec tout.",
      "Fruits → à consommer seuls, loin des repas (20 min avant ou 2h après).",
    ],
    impact: "Fin des coups de fatigue post-prandial, digestion fluide, réduction des ballonnements, meilleure énergie dans les 2h suivant le repas.",
    data: {
      label: "Compatibilités",
      rows: [
        { col1: "Protéines animales", col2: "✅ Légumes", col3: "❌ Céréales, pommes de terre" },
        { col1: "Glucides complexes", col2: "✅ Légumes", col3: "❌ Viande, poisson, fromage" },
        { col1: "Légumes verts", col2: "✅ Tout", col3: "" },
        { col1: "Fruits", col2: "✅ Seuls", col3: "❌ En dessert ou avec protéines" },
      ],
    },
  },
  {
    icon: "⏳",
    title: "Temps de digestion",
    color: "#38c4e8",
    shortDesc: "Respecter les temps de transit pour éviter fermentation et putréfaction.",
    fullDesc: "Chaque aliment a un temps de transit gastrique différent. Consommer de nouveaux aliments avant la fin de la digestion du repas précédent crée des fermentations et putréfactions qui encrassent l'intestin, produisent des gaz et fatiguent le foie. Le jeûne nocturne de 12h minimum est une détox gratuite et puissante.",
    rules: [
      "Attendre 3 à 4h entre chaque repas (pas de grignotage).",
      "Dernier repas avant 20h, petit-déjeuner après 7h.",
      "Jeûne nocturne de 12h minimum (ex : 20h → 8h).",
      "Boire uniquement de l'eau entre les repas — pas de jus ni laits.",
    ],
    impact: "Nettoyage intestinal naturel, réduction de la charge hépatique, meilleur sommeil, énergie stable sans coups de pompe.",
    data: {
      label: "Temps de transit estimés",
      rows: [
        { col1: "Fruits frais", col2: "20 – 40 min" },
        { col1: "Légumes cuits", col2: "40 – 60 min" },
        { col1: "Glucides complexes", col2: "2 – 3h" },
        { col1: "Protéines végétales", col2: "2 – 3h" },
        { col1: "Protéines animales", col2: "3 – 5h" },
        { col1: "Graisses", col2: "4 – 5h" },
      ],
    },
  },
  {
    icon: "⚖️",
    title: "Équilibre acido-basique",
    color: "#818cf8",
    shortDesc: "80 % d'aliments alcalinisants pour maintenir le pH sanguin optimal (7,35–7,45).",
    fullDesc: "Le corps maintient un pH sanguin très précis (7,35–7,45). Un excès d'aliments acidifiants (sucres, viande rouge, alcool, café, céréales raffinées) force le corps à puiser dans ses réserves alcalines (calcium des os, magnésium des muscles) pour rééquilibrer. Sur le long terme : déminéralisation, fatigue chronique, inflammation. Le programme Backtoenergy vise 80 % d'aliments alcalinisants.",
    rules: [
      "80 % de l'assiette : légumes, fruits, oléagineux, herbes.",
      "20 % : protéines animales, céréales complètes.",
      "Éliminer : sucres raffinés, farines blanches, alcool, sodas.",
      "L'eau citronnée du matin alcalinise — malgré le goût acide du citron.",
    ],
    impact: "Réduction de l'inflammation, minéralisation osseuse préservée, énergie cellulaire améliorée, peau plus nette.",
    data: {
      label: "Aliments acides vs alcalins",
      rows: [
        { col1: "🔴 Très acidifiants", col2: "Alcool, sucre blanc, viande rouge, fromage, café, sodas" },
        { col1: "🟠 Acidifiants", col2: "Œufs, poisson, céréales, légumineuses, noix" },
        { col1: "🟡 Neutres", col2: "Huiles végétales, beurre, lait végétal" },
        { col1: "🟢 Alcalinisants", col2: "Légumes verts, citron, avocat, herbes fraîches, amandes" },
        { col1: "💚 Très alcalinisants", col2: "Épinards, brocolis, concombre, chlorophylle, eau citronnée" },
      ],
    },
  },
  {
    icon: "🌿",
    title: "Manger vivant",
    color: "#2dd4a0",
    shortDesc: "50 % de l'assiette en crudités ou légumes légèrement cuits pour préserver les enzymes.",
    fullDesc: "Les aliments crus contiennent des enzymes actives qui participent à leur propre digestion. La cuisson au-dessus de 42°C détruit ces enzymes. Un régime exclusivement cuit oblige le pancréas et l'intestin à produire 100 % des enzymes digestives, ce qui épuise progressivement le système. Les aliments vivants nourrissent aussi le microbiote et l'immunité.",
    rules: [
      "50 % minimum de l'assiette en cru (crudités, salades, graines germées).",
      "Cuire à basse température si possible (vapeur douce, wok rapide).",
      "Privilégier les cuissons < 110°C — éviter friture et grill à haute température.",
      "Consommer des fermentés quotidiennement : kéfir, kombucha, choucroute crue.",
    ],
    impact: "Apport enzymatique, microbiote diversifié, immunité renforcée, meilleure absorption des vitamines et minéraux.",
    data: {
      label: "Cuissons recommandées",
      rows: [
        { col1: "Vapeur douce < 95°C", col2: "✅ Préserve vitamines" },
        { col1: "Wok rapide (légumes al dente)", col2: "✅ Acceptable" },
        { col1: "Four < 180°C", col2: "⚠️ Acceptable" },
        { col1: "Friture ou grill fort", col2: "❌ Éviter" },
        { col1: "Micro-ondes", col2: "❌ Éviter" },
      ],
    },
  },
  {
    icon: "💧",
    title: "Hydratation",
    color: "#38bdf8",
    shortDesc: "1,5 à 2L d'eau pure par jour, hors repas de préférence.",
    fullDesc: "Le corps est composé à 60–70 % d'eau. Une déshydratation de seulement 2 % diminue les capacités cognitives de 20 % et la performance physique de 10 %. L'eau est le premier vecteur de transport des nutriments, d'élimination des toxines et de régulation thermique. Beaucoup de signaux de faim sont en réalité des signaux de soif.",
    rules: [
      "Boire 1,5 à 2L d'eau pure par jour.",
      "Boire hors des repas (30 min avant, 1h30 après) pour ne pas diluer les sucs gastriques.",
      "Eau citronnée à jeun chaque matin — alcalinise et active le foie.",
      "Éviter les boissons sucrées, sodas et jus industriels.",
    ],
    impact: "Énergie et concentration améliorées, peau hydratée, élimination rénale optimale, réduction des fausses faims.",
    data: {
      label: "Signaux de déshydratation",
      list: [
        "Urine foncée (jaune soutenu ou orange)",
        "Mal de tête en milieu de journée",
        "Fatigue inexpliquée avant 15h",
        "Sensation de faim 1h après un repas",
        "Difficultés de concentration",
        "Peau terne ou sèche",
      ],
    },
  },
  {
    icon: "😴",
    title: "Repos digestif",
    color: "#a78bfa",
    shortDesc: "7 à 9h de sommeil et jeûne nocturne de 12h minimum — détox naturelle gratuite.",
    fullDesc: "La nuit est le moment où le corps détoxifie, répare les cellules, consolide la mémoire et synthétise les hormones anabolisantes (GH, mélatonine, testostérone). Un repos digestif de 12h minimum (ex : dîner à 20h → petit-déjeuner à 8h) active l'autophagie — le mécanisme naturel de nettoyage cellulaire. Le manque de sommeil augmente le cortisol, dérègle la leptine et la ghréline (hormones de faim) et sabote tous les efforts alimentaires.",
    rules: [
      "7 à 9h de sommeil par nuit — non négociable.",
      "Coucher avant 23h pour maximiser les phases de réparation (22h–2h).",
      "Dernier repas 3h avant le coucher minimum.",
      "Déconnexion des écrans 1h avant de dormir (lumière bleue = suppression mélatonine).",
    ],
    impact: "Récupération musculaire et nerveuse, régulation hormonale, perte de poids facilitée, énergie matinale, clarté mentale.",
    data: {
      label: "Fenêtres de réparation nocturne",
      rows: [
        { col1: "22h – minuit", col2: "Pic de mélatonine, début réparation cellulaire" },
        { col1: "Minuit – 2h", col2: "Pic d'hormone de croissance (GH)" },
        { col1: "2h – 4h", col2: "Détox hépatique maximale" },
        { col1: "4h – 6h", col2: "Hausse du cortisol — préparation au réveil" },
      ],
    },
  },
]
