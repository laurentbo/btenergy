export type Meal = {
  moment: "matin" | "midi" | "après-midi" | "soir"
  items: string[]
  conseil?: string
}

export type DayProgram = {
  day: number
  week: 1 | 2 | 3
  theme: string
  intention: string
  coachWord: string
  morningRitual: string
  meals: Meal[]
  ritual: { matin: string; soir: string }
  hydration: string
  tip: string
}

export type UserProfile = {
  prenom: string
  age?: number
  genre?: "homme" | "femme" | "autre"
  taille?: number   // cm
  poids?: number    // kg
  start_date?: string  // ISO date YYYY-MM-DD
}

export function calcCurrentDay(startDate: string | null | undefined): number {
  if (!startDate) return 1
  const start = new Date(startDate)
  const today = new Date()
  start.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return Math.min(21, Math.max(1, diff + 1))
}

// Comme calcCurrentDay mais sans plafonner à 21 — utilisé pour l'envoi de l'email post-cure (j22)
export function calcRawDay(startDate: string | null | undefined): number {
  if (!startDate) return 1
  const start = new Date(startDate)
  const today = new Date()
  start.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(1, diff + 1)
}

export type ConseilBienEtre = {
  icon: string
  titre: string
  texte: string
}

export const CONSEILS_BIEN_ETRE: ConseilBienEtre[] = [
  { icon: "🫁", titre: "Respiration avant repas", texte: "3 respirations profondes avant de manger — inspire 4s, retiens 4s, expire 6s. Active le système parasympathique et prépare la digestion." },
  { icon: "🦷", titre: "Mastication consciente", texte: "Mâche chaque bouchée 20 à 30 fois avant d'avaler. La digestion commence dans la bouche — les enzymes salivaires pré-digèrent les glucides." },
  { icon: "🚶", titre: "Marche digestive", texte: "10 à 15 min de marche légère après le déjeuner. Stimule le péristaltisme, régule la glycémie post-prandiale et active le transit." },
  { icon: "🧘", titre: "Cohérence cardiaque", texte: "5 min le matin : inspire 5s, expire 5s, répète. Régule le cortisol, diminue le stress et prépare le système nerveux à la journée." },
  { icon: "🌡️", titre: "Température des repas", texte: "Évite les boissons froides pendant les repas — elles ralentissent les enzymes digestives. Privilégie l'eau à température ambiante ou légèrement tiède." },
  { icon: "⏱️", titre: "Fenêtre sans écran", texte: "Les 5 premières minutes du repas sans téléphone ni écran. Le cerveau met 20 min pour enregistrer la satiété — la présence consciente accélère ce signal." },
  { icon: "🌿", titre: "Pleine conscience à table", texte: "Pose tes couverts entre chaque bouchée. Observe les saveurs, textures et arômes. Manger lentement réduit les quantités ingérées naturellement." },
]

export function getConseilDuJour(day: number): ConseilBienEtre {
  return CONSEILS_BIEN_ETRE[(day - 1) % CONSEILS_BIEN_ETRE.length]
}

export type PrincipalKey = {
  icon: string
  title: string
  body: string
  color: string
}

export const PRINCIPES: PrincipalKey[] = [
  {
    icon: "🌅",
    title: "L'eau citronnée à jeun",
    body: "Chaque matin, avant tout aliment : un grand verre d'eau tiède avec le jus d'un demi-citron. Active le foie, stimule la bile, alcalinise le sang. Puis 5 à 10 min d'étirements ou de marche.",
    color: "#f59e0b",
  },
  {
    icon: "🍽️",
    title: "Cinq moments de repas",
    body: "Petit-déjeuner · collation si faim · déjeuner · collation si faim · dîner. Les collations ne sont pas obligatoires — écoute ta faim. Respecte 4 à 5 heures entre chaque repas principal.",
    color: "#9fd76d",
  },
  {
    icon: "🍎",
    title: "Les fruits seuls",
    body: "Les fruits se consomment toujours à jeun ou entre les repas — jamais en fin de repas. Seuls, ils se digèrent en 20-30 min. Mélangés aux autres aliments, ils fermentent et gonflent.",
    color: "#38c4e8",
  },
  {
    icon: "🌿",
    title: "Commencer par le cru",
    body: "Chaque dîner commence par des crudités. Les enzymes des aliments crus activent la digestion et préparent l'intestin à absorber le cuit. Ne jamais commencer par quelque chose de chaud.",
    color: "#4cc9f0",
  },
  {
    icon: "🚫",
    title: "Zéro gluten, zéro lactose, zéro sucre raffiné",
    body: "Pendant 21 jours : pas de blé, pas de produits laitiers animaux, pas de sucre blanc. Céréales autorisées : riz, quinoa, millet, sarrasin. Sucrants : miel brut, dattes, fruits entiers uniquement.",
    color: "#f87171",
  },
  {
    icon: "⏱️",
    title: "Respecter les fenêtres",
    body: "Dîner avant 20h. Jeûne nocturne de 12h minimum. Le corps détoxifie, répare et synthétise ses hormones la nuit — à condition d'arrêter de manger assez tôt.",
    color: "#818cf8",
  },
  {
    icon: "🐓",
    title: "Volaille bio en semaine 3 seulement",
    body: "Les semaines 1 et 2 sont 100% végétaliennes. À partir du jour 16, la volaille bio (poulet, canard, pintade) peut être introduite au dîner — 2 à 3 fois max sur la semaine 3. Qualité label rouge ou bio.",
    color: "#a78bfa",
  },
]

// ─── PHASE DE PRÉPARATION (J-3 → J0) ──────────────────────────────────────────
export const preparationPhase = {
  title: "Prépare ton terrain",
  subtitle: "3 jours avant le démarrage",
  description: "La cure Verissimo commence avant le J1. Ces 3 jours préparent ton organisme et garantissent des résultats optimaux dès le premier jour.",
  days: [
    {
      offset: -3,
      label: "J-3",
      title: "Descente en douceur",
      objective: "Réduire les toxiques pour ne pas être en manque brutal au J1",
      actions: [
        "Café : maximum 1 tasse le matin, plus rien après",
        "Alcool : zéro aujourd'hui et jusqu'à la fin de la cure",
        "Viande rouge et charcuterie : dernière fois ce soir si besoin",
        "Sucre raffiné et produits industriels : commencer à les écarter",
        "Augmente ton eau : vise 1,5 L minimum aujourd'hui",
      ],
      shoppingList: {
        title: "Liste de courses semaine 1 (à faire aujourd'hui ou demain)",
        note: "Privilégie le bio pour les huiles, céréales, condiments et légumineuses. Pour les fruits et légumes frais, un bon primeur suffit.",
        categories: [
          {
            name: "Fruits frais",
            items: [
              "Pommes bio (2 kg — dont pour la purge)",
              "Citrons (6)",
              "Bananes (1 régime)",
              "Fruits de saison mûrs pour monodiète J-1 (1,5 kg)",
            ],
          },
          {
            name: "Légumes",
            items: [
              "Courgettes (4)",
              "Carottes (1 kg)",
              "Fenouil (2)",
              "Poireaux (4)",
              "Épinards (500g)",
              "Tomates (1 kg)",
              "Concombres (2)",
              "Betteraves crues (2)",
              "Céleri branche (1 botte)",
            ],
          },
          {
            name: "Céréales & légumineuses",
            items: [
              "Riz thaï bio (1 kg)",
              "Lentilles vertes bio (500g)",
              "Quinoa bio (500g)",
              "Flocons d'avoine bio (500g)",
            ],
          },
          {
            name: "Oléagineux",
            items: [
              "Amandes entières (200g)",
              "Noix de cajou (150g)",
              "Graines de sésame (100g)",
              "Graines de courge (100g)",
              "Huile d'olive bio première pression (1 bouteille)",
            ],
          },
          {
            name: "Condiments & herbes",
            items: [
              "Tamari (sauce soja sans blé — petite bouteille)",
              "Gomazio (sésame grillé salé)",
              "Curry doux",
              "Cumin",
              "Coriandre fraîche",
              "Basilic frais",
              "Ail (1 tête)",
              "Gingembre frais",
            ],
          },
          {
            name: "Pour la purge (J-1 soir)",
            items: [
              "Chlorure de magnésium (1 sachet de 20g en pharmacie)",
              "Jus de pomme bio non filtré (1 litre — pas de jus industriel)",
            ],
          },
        ],
      },
      coachNote:
        "Ces 3 jours ne sont pas une contrainte — c'est le début de ta transformation. Chaque choix que tu fais maintenant prépare ton corps à recevoir le programme dans les meilleures conditions.",
    },
    {
      offset: -2,
      label: "J-2",
      title: "Légèreté croissante",
      objective: "Nettoyer les derniers repas lourds, passer en mode végétal",
      actions: [
        "Aujourd'hui : alimentation végétale uniquement (légumes, céréales, fruits)",
        "Café : supprimé si possible, sinon café vert ou thé vert seulement",
        "Pas de protéines animales aujourd'hui",
        "Repas du soir : soupe de légumes simple ou salade + céréale",
        "Eau : 1,5 à 2 L dans la journée",
        "Vérifier que ta liste de courses est complète",
      ],
      coachNote:
        "Ton foie et ton intestin commencent déjà à souffler. La légèreté que tu ressens ce soir est le signe que ton corps est prêt.",
    },
    {
      offset: -1,
      label: "J-1",
      title: "Journée fruits & purge",
      objective: "Vider le colon, reconstituer la flore intestinale, préparer l'assimilation",
      actions: [
        "Toute la journée : fruits mûrs et juteux uniquement (pommes, raisins, poires, agrumes, bananes)",
        "Eau pure entre les prises de fruits",
        "Pas de protéines, pas de céréales, pas de légumes cuits",
        "À partir de 19h : prépare la purge au chlorure de magnésium",
        "Purge 19h : dissous le sachet de chlorure de magnésium dans un verre d'eau chaude, laisse refroidir, bois en alternant avec le jus de pomme",
        "Bois ensuite 1 litre d'eau minimum",
        "À 21h : recommence le protocole (purge + jus de pomme)",
        "Reste à la maison ce soir — la purge agit pendant plusieurs heures",
        "La première nuit peut être agitée : c'est normal, c'est l'élimination",
      ],
      warning:
        "La purge au chlorure de magnésium est essentielle pour la réussite de ta cure. Elle vide le colon et permet dès J1 une assimilation maximale des nutriments.",
      coachNote:
        "Demain matin, tu te lèveras différent. Le corps se souvient de ce qu'on lui donne quand on lui en laisse l'opportunité.",
    },
    {
      offset: 0,
      label: "J0",
      title: "C'est demain",
      objective: "Confirmation, motivation, agenda du premier jour",
      actions: [
        "Confirme que ta liste de courses est prête",
        "Prépare ta gourde pour demain matin",
        "Dors tôt — la cure commence avec ton réveil",
        "Demain : jus de citron dans eau tiède au réveil, puis le programme de la Semaine 1 s'ouvre",
      ],
      coachNote:
        "Tu as fait le plus dur : tu as décidé. Le reste, c'est un pas après l'autre.",
    },
  ],
}

// ─── SEMAINE 1 : FONDATIONS ────────────────────────────────────────────────────
const WEEK1: DayProgram[] = [
  {
    day: 1, week: 1,
    theme: "Fondations",
    intention: "Poser les bases alimentaires, ressentir l'effet des premières heures sans excitants",
    coachWord: "Commence la journée avec un grand verre d'eau tiède et le jus d'½ citron — c'est ton rituel quotidien pendant 21 jours. La première journée est souvent la plus mentale.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["2 kiwis", "1 orange", "Poignée de noix", "1 c.c. miel brut", "1 pruneau", "Pincée de cannelle"], conseil: "Collation si faim vers 10h : 1 pomme" },
      { moment: "midi", items: ["Quinoa cuit", "Concombre, avocat, jeunes pousses d'épinard", "Graines de sésame + sel fumé + huile d'olive"] },
      { moment: "après-midi", items: ["1 banane + 3 amandes (si faim)"] },
      { moment: "soir", items: ["Poêlée courgettes, poireaux, champignons de Paris", "Riz basmati + tamari", "Crudités : carotte râpée"], conseil: "Commencer par les crudités — les enzymes vivantes préparent la digestion" },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Tamari (sauce soja sans gluten) apporte un umami profond",
  },
  {
    day: 2, week: 1,
    theme: "Fondations",
    intention: "Stabiliser le rythme alimentaire, espacer naturellement les repas de 4-5h",
    coachWord: "Si la faim se fait sentir entre les repas, bois d'abord un grand verre d'eau. Souvent, c'est de la soif que ton corps interprète comme de la faim.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["1 mangue", "1 poire", "Noisettes concassées", "1 c.c. miel brut", "Filet de citron"], conseil: "Collation si faim : 1 clémentine" },
      { moment: "midi", items: ["Velouté froid concombre-avocat", "Menthe + graines de courges", "Levure maltée"] },
      { moment: "après-midi", items: ["1 poignée de raisins (si faim)"] },
      { moment: "soir", items: ["Purée patate douce", "Chou-fleur rôti au curcuma + gomasio", "Huile sésame grillé", "Crudités : fenouil râpé"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Levure maltée = goût fromagé sans lactose",
  },
  {
    day: 3, week: 1,
    theme: "Fondations",
    intention: "Découvrir les saveurs umami naturelles, s'approprier les nouvelles combinaisons",
    coachWord: "Le miso et la levure maltée sont tes nouveaux alliés saveur. Utilise-les sans hésiter — ils remplacent avantageusement sel et fromage.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["Bol fruits rouges", "1 figue sèche", "Noix de pécan", "1 c.c. miel brut", "2 dattes"], conseil: "Collation si faim : 1 orange" },
      { moment: "midi", items: ["Salade tiède lentilles corail", "Fenouil cru râpé, dés d'avocat, persil", "Vinaigrette huile d'olive, vinaigre cidre, miso"] },
      { moment: "après-midi", items: ["1 kiwi (si faim)"] },
      { moment: "soir", items: ["Poireaux vapeur", "Purée céleri-rave lait de coco + poudre shiitake + ciboulette", "Crudités : roquette"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Poudre de shiitake = umami intense",
  },
  {
    day: 4, week: 1,
    theme: "Fondations",
    intention: "Renforcer l'alcalinité, nourrir les cellules en profondeur",
    coachWord: "Le gaspacho vert se prépare à l'avance et se conserve 24h. Anticiper tes repas facilite l'engagement.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["Oranges, pamplemousse, grenade", "Amandes", "1 c.c. miel brut", "Pincée de cannelle"], conseil: "Collation si faim : 1 poire" },
      { moment: "midi", items: ["Gaspacho vert : concombre, poivron, coriandre, avocat, citron, huile d'olive", "Olives noires"] },
      { moment: "après-midi", items: ["1 banane + noix de cajou (si faim)"] },
      { moment: "soir", items: ["Poêlée tempeh ou pois chiches (curcuma, paprika fumé)", "Courgettes et shiitake", "Riz complet", "Crudités : chou rouge râpé"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Olives noires = umami salé naturel",
  },
  {
    day: 5, week: 1,
    theme: "Fondations",
    intention: "Maintenir le cap à mi-semaine, ancrer le rythme des 5 repas",
    coachWord: "Tu es à mi-semaine 1 — le plus dur est souvent là. Chaque repas que tu prépares est un acte de confiance envers toi-même.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["2 clémentines", "1 pomme", "Noisettes", "1 c.c. miel brut", "1 pruneau", "1 abricot sec"], conseil: "Collation si faim : 1 orange" },
      { moment: "midi", items: ["Wrap galette de riz", "Houmous, carotte râpée, betterave râpée", "Jeunes pousses, graines de sésame"] },
      { moment: "après-midi", items: ["1 poignée cerises (si faim)"] },
      { moment: "soir", items: ["Sauté brocoli, chou-fleur, carottes au tamari + gingembre", "Sarrasin cuit", "Crudités : mâche"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Tamari + gingembre frais réveille les légumes",
  },
  {
    day: 6, week: 1,
    theme: "Fondations",
    intention: "Consolider les acquis, observer les premiers changements dans le corps",
    coachWord: "Prends 5 minutes ce soir pour noter ce que tu ressens dans ton corps. Ton journal d'observation est un outil puissant.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["Compote pomme-canneberge sans sucre", "Cerneaux de noix", "1 c.c. miel brut"], conseil: "Collation si faim : 1 kiwi" },
      { moment: "midi", items: ["Salade épinard frais, avocat, pamplemousse", "Graines de tournesol", "Vinaigrette miso"] },
      { moment: "après-midi", items: ["1 poignée myrtilles (si faim)"] },
      { moment: "soir", items: ["Purée de panais et carottes", "Champignons portobello grillés (tamari-thym)", "Crudités : fenouil en lamelles"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Le miso transforme la vinaigrette en condiment presque magique",
  },
  {
    day: 7, week: 1,
    theme: "Fondations",
    intention: "Clôturer la première semaine, préparer mentalement la deuxième",
    coachWord: "7 jours sans gluten, sans lactose, sans sucre raffiné. Ton système digestif a bénéficié d'un vrai repos. La semaine 2 va approfondir ce travail.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["1 mangue en cubes", "Noix de pécan", "1 c.c. miel brut", "Filet de citron", "Pincée de cannelle"], conseil: "Collation si faim : 1 pomme" },
      { moment: "midi", items: ["Curry végétal : lait coco, patate douce, pois chiches, épinards, curry doux", "Quinoa"] },
      { moment: "après-midi", items: ["1 orange (si faim)"] },
      { moment: "soir", items: ["Zoodles courgettes spiralées poêlées", "Sauce tomates séchées + noix de cajou + levure maltée", "Crudités : radis noir râpé"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Tomates séchées mixées = sauce umami crémeuse sans lactose",
  },
]

// ─── SEMAINE 2 : ÉQUILIBRE ─────────────────────────────────────────────────────
const WEEK2: DayProgram[] = [
  {
    day: 8, week: 2,
    theme: "Équilibre",
    intention: "Approfondir la détox, intégrer davantage de cru dans les repas",
    coachWord: "Commence chaque repas par le cru — les enzymes vivantes des crudités préparent la digestion et maximisent l'absorption des nutriments.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["Fruits rouges (surgelés)", "1 figue fraîche", "Amandes", "1 c.c. miel brut"], conseil: "Collation si faim : 1 poire" },
      { moment: "midi", items: ["Tabboulé de sarrasin : sarrasin cuit, persil, menthe", "Oignon rouge, citron, huile d'olive, sel fumé", "Variante sans tomate : ajouter concombre"] },
      { moment: "après-midi", items: ["1 banane + noisettes (si faim)"] },
      { moment: "soir", items: ["Poêlée aubergines, poivrons, oignons rouges au tamari + vinaigre balsamique", "Riz sauvage", "Crudités : carotte râpée"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Sel fumé donne de la profondeur aux légumes",
  },
  {
    day: 9, week: 2,
    theme: "Équilibre",
    intention: "Renforcer les éliminations, soutenir le foie et les reins",
    coachWord: "La betterave crue est l'un des aliments les plus détoxifiants de la cure. Râpée en crudité ou mixée en soupe — profites-en.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["2 clémentines", "Grenade (graines)", "Noix de Grenoble", "1 c.c. miel brut"], conseil: "Collation si faim : 1 kiwi" },
      { moment: "midi", items: ["Soupe froide betterave-noix de cajou", "Betterave crue, noix de cajou trempées, citron, sel"] },
      { moment: "après-midi", items: ["1 pomme (si faim)"] },
      { moment: "soir", items: ["Rösti patate douce-carotte (huile coco)", "Compotée oignons-champignons au tamari", "Crudités : brocoli cru en fleurettes"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Quelques gouttes d'huile de sésame grillé sur le rösti",
  },
  {
    day: 10, week: 2,
    theme: "Équilibre",
    intention: "Célébrer les 10 premiers jours, consolider les nouvelles habitudes",
    coachWord: "10 jours sans les anciens schémas alimentaires. Ton corps a commencé à puiser dans ses réserves et à reconstruire. C'est profond.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["1 mangue", "1 banane", "Noix de macadamia", "1 c.c. miel brut", "Filet de citron", "Pincée de cannelle"], conseil: "Collation si faim : 1 orange" },
      { moment: "midi", items: ["Salade kale massé (huile d'olive, citron)", "Avocat, graines de chanvre, radis noir", "Vinaigrette tahini-citron"] },
      { moment: "après-midi", items: ["1 poignée raisins secs (si faim)"] },
      { moment: "soir", items: ["Crumble légumes (courgettes, poireaux) — flocons sarrasin, poudre amande, levure maltée", "Crudités : fenouil râpé"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Levure maltée dans le crumble donne un goût toasté irrésistible",
  },
  {
    day: 11, week: 2,
    theme: "Équilibre",
    intention: "Nourrir les cellules en profondeur, soutenir le microbiote",
    coachWord: "Le velouté de potimarron au lait de coco est ultra-nourrissant. Il apporte des fibres, des antioxydants et de bons acides gras.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["Myrtilles", "1 figue séchée", "Noisettes", "1 c.c. miel brut"], conseil: "Collation si faim : 1 clémentine" },
      { moment: "midi", items: ["Velouté potimarron lait coco-gingembre", "Dés d'avocat en garniture"] },
      { moment: "après-midi", items: ["1 banane (si faim)"] },
      { moment: "soir", items: ["Poivrons farcis : riz basmati, lentilles vertes, oignons, cumin, paprika", "Sauce tamari légère", "Crudités : mâche"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Ajouter shiitake haché dans la farce pour intensifier la saveur",
  },
  {
    day: 12, week: 2,
    theme: "Équilibre",
    intention: "Consolider les résultats, maintenir la vigilance alimentaire",
    coachWord: "Le caviar d'aubergine avec les crudités, c'est un dîner complet et savoureux. Fais-en plus pour le lendemain.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["2 kiwis", "1 poire", "Amandes", "1 c.c. miel brut", "1 pruneau"], conseil: "Collation si faim : 1 pomme" },
      { moment: "midi", items: ["Salade riz noir : riz cuit, concombre, avocat, grenade, coriandre", "Vinaigrette huile sésame grillé + citron + gingembre"] },
      { moment: "après-midi", items: ["1 orange (si faim)"] },
      { moment: "soir", items: ["Caviar d'aubergine : aubergine rôtie, tahini, citron, tamari", "Bâtonnets de légumes crus (carotte, concombre, fenouil)"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Tamari dans le caviar d'aubergine — un trait suffit",
  },
  {
    day: 13, week: 2,
    theme: "Équilibre",
    intention: "Approfondir le confort digestif, préparer la transition vers la semaine 3",
    coachWord: "La purée céleri-rave à la levure maltée est fondante et savoureuse. Une belle façon d'aborder la dernière ligne droite.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["1 mangue", "1 banane", "Noix de cajou", "1 c.c. miel brut", "Pincée de cannelle"], conseil: "Collation si faim : 1 kiwi" },
      { moment: "midi", items: ["Wok légumes verts (brocoli, haricots plats, petits pois) au tamari, gingembre", "Pois chiches ou tofu émietté", "Riz complet"] },
      { moment: "après-midi", items: ["1 poignée cerises (si faim)"] },
      { moment: "soir", items: ["Purée céleri-rave + patate douce à la levure maltée", "Crudités : chou rouge râpé"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Levure maltée généreuse — goût fromagé profond",
  },
  {
    day: 14, week: 2,
    theme: "Équilibre",
    intention: "Clôturer la phase d'équilibre, préparer mentalement la semaine d'ancrage",
    coachWord: "Deux semaines passées. La semaine 3 introduit en douceur la volaille bio — une réintroduction contrôlée pour ancrer un nouvel équilibre.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["Compote poire-pêche sans sucre", "Noix de pécan", "1 c.c. miel brut"], conseil: "Collation si faim : 1 pomme" },
      { moment: "midi", items: ["Tarte salée sans gluten (pâte sarrasin/riz)", "Poireaux confits, tofu soyeux mixé, curry doux", "Salade verte"] },
      { moment: "après-midi", items: ["1 orange (si faim)"] },
      { moment: "soir", items: ["Poêlée chou rouge à la pomme (cannelle, anis étoilé)", "Millet cuit", "Crudités : carotte râpée"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Un trait de tamari dans le chou rouge pour équilibrer le sucré",
  },
]

// ─── SEMAINE 3 : ANCRAGE ───────────────────────────────────────────────────────
const WEEK3: DayProgram[] = [
  {
    day: 15, week: 3,
    theme: "Ancrage",
    intention: "Entrer dans la phase d'ancrage, consolider les bases végétales avant la réintroduction",
    coachWord: "Les falafels maison se congèlent très bien — prépare-en une grande quantité pendant que tu y es.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["2 clémentines", "Grenade", "Noisettes", "1 c.c. miel brut", "Filet de citron"], conseil: "Collation si faim : 1 poire" },
      { moment: "midi", items: ["Falafels maison (pois chiches, persil, coriandre, cumin) cuits au four", "Sauce yaourt coco-citron-ciboulette", "Salade de crudités"] },
      { moment: "après-midi", items: ["1 banane (si faim)"] },
      { moment: "soir", items: ["Courge butternut rôtie au thym, huile d'olive", "Graines de courge torréfiées", "Crudités : fenouil râpé"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Rôtir la courge jusqu'à caramélisation = umami naturel sans aucun ajout",
  },
  {
    day: 16, week: 3,
    theme: "Ancrage",
    intention: "Réintroduire la volaille bio en douceur, observer la réaction du corps",
    coachWord: "Choisis un poulet de qualité — label rouge ou bio. La qualité de la protéine compte autant que la méthode de cuisson.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["1 bol framboises", "1 figue fraîche", "Amandes", "1 c.c. miel brut", "Pincée de cannelle"], conseil: "Collation si faim : 1 kiwi" },
      { moment: "midi", items: ["Salade pâtes de riz ou soba sarrasin", "Carotte, concombre, radis, coriandre, cacahuètes concassées", "Sauce sésame, tamari, citron vert, gingembre"] },
      { moment: "après-midi", items: ["1 pomme (si faim)"] },
      { moment: "soir", items: ["🐓 Blanc de poulet bio poêlé au citron et câpres", "Purée de céleri-rave", "Haricots verts vapeur", "Crudités : roquette"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Câpres + citron relèvent le poulet et remplacent avantageusement le beurre",
  },
  {
    day: 17, week: 3,
    theme: "Ancrage",
    intention: "Consolider la réintroduction, maintenir la légèreté des deux premières semaines",
    coachWord: "Cuisson douce à 180° pour le poulet — il reste moelleux et garde ses nutriments. Évite la friture.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["1 mangue en dés", "Noix de macadamia", "1 c.c. miel brut", "Filet de citron"], conseil: "Collation si faim : 1 orange" },
      { moment: "midi", items: ["Soupe miso (bouillon kombu, miso hors ébullition)", "Tofu ferme, shiitake, poireau, carotte"] },
      { moment: "après-midi", items: ["1 poignée raisins secs (si faim)"] },
      { moment: "soir", items: ["🐓 Cuisses de poulet rôties au thym", "Poireaux fondants, chiffonnade de bettes", "Crudités : betterave crue râpée"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Thym et rôtissage concentrent les saveurs — pas besoin d'autre assaisonnement",
  },
  {
    day: 18, week: 3,
    theme: "Ancrage",
    intention: "Explorer les combinaisons sucré-salé, ancrer le plaisir dans l'alimentation saine",
    coachWord: "L'association poire-cannelle sur la volaille est une découverte — note-la dans ton carnet de recettes pour après la cure.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["2 kiwis", "1 banane", "Noisettes", "1 c.c. miel brut", "1 pruneau"], conseil: "Collation si faim : 1 clémentine" },
      { moment: "midi", items: ["Galettes de sarrasin", "Ratatouille maison (courgette, aubergine, poivron)", "Sauce levure maltée", "Salade verte"] },
      { moment: "après-midi", items: ["1 poire (si faim)"] },
      { moment: "soir", items: ["🐓 Aiguillettes canard ou poulet fumé bio, poêlées à la poire et cannelle", "Écrasé de patates douces", "Crudités : fenouil en fines lamelles"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Le sucré-salé (poire/cannelle) sur la volaille est un délice — ajouter une pincée de sel fumé",
  },
  {
    day: 19, week: 3,
    theme: "Ancrage",
    intention: "Ancrer les nouvelles habitudes alimentaires, préparer la sortie de cure",
    coachWord: "La marinade tamari-citron-gingembre peut s'utiliser sur toutes les viandes blanches. Garde-la dans tes réflexes.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["Myrtilles", "1 orange", "Noix de Grenoble", "1 c.c. miel brut", "Pincée de cannelle"], conseil: "Collation si faim : 1 kiwi" },
      { moment: "midi", items: ["Houmous de betterave (pois chiches, betterave cuite, tahini, citron)", "Bâtonnets de légumes crus", "Crackers de sarrasin"] },
      { moment: "après-midi", items: ["1 banane (si faim)"] },
      { moment: "soir", items: ["🐓 Brochettes de poulet marinées citron confit et gingembre", "Courgettes et aubergines grillées", "Crudités : chou kale émincé"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Marinade : jus citron, gingembre râpé, tamari, huile d'olive — 30 min minimum",
  },
  {
    day: 20, week: 3,
    theme: "Ancrage",
    intention: "Célébrer les 20 jours accomplis, ancrer les recettes de l'après-cure",
    coachWord: "La sauce crème de champignons-cajou est une base versatile pour l'après-cure. Retiens la recette.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["2 clémentines", "1 pomme", "Amandes effilées", "1 c.c. miel brut", "Filet de citron"], conseil: "Collation si faim : 1 orange" },
      { moment: "midi", items: ["Salade lentilles vertes au curry doux", "Mangue fraîche, coriandre, ciboulette", "Huile d'olive, citron vert"] },
      { moment: "après-midi", items: ["1 poignée de cerises (si faim)"] },
      { moment: "soir", items: ["🐓 Suprême de volaille sauce crème de champignons et noix de cajou", "Lit d'épinards frais", "Crudités : radis noir râpé"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Sauce : mixer champignons cuits + noix de cajou trempées + un peu de lait de coco",
  },
  {
    day: 21, week: 3,
    theme: "Ancrage",
    intention: "Clôturer les 21 jours avec conscience, ancrer un rapport différent à l'alimentation",
    coachWord: "Ce n'est pas la fin d'un régime — c'est le début d'une nouvelle façon de te nourrir. Les règles d'or peuvent devenir ta boussole permanente.",
    morningRitual: "Eau tiède + jus d'½ citron · étirements doux 5-10 min",
    meals: [
      { moment: "matin", items: ["1 mangue râpée", "Banane écrasée", "Noix de pécan", "1 c.c. miel brut", "Filet de citron", "Pincée de cannelle"], conseil: "Collation si faim : 1 pomme" },
      { moment: "midi", items: ["Assiette composée : jeunes pousses, avocat, betterave crue râpée", "Pamplemousse, graines de tournesol", "Vinaigrette huile de noix + tamari"] },
      { moment: "après-midi", items: ["1 kiwi (si faim)"] },
      { moment: "soir", items: ["Soupe crémeuse potimarron lait coco-curcuma", "Salade fenouil-orange", "Crudités : fenouil râpé"] },
    ],
    ritual: { matin: "Eau tiède + jus d'½ citron · étirements 5-10 min", soir: "Crudités en premier · dîner avant 20h" },
    hydration: "Eau à volonté (1,5 L min.), eau citronnée, tisanes sans théine",
    tip: "Quelques gouttes d'huile de sésame grillé sur la soupe — finition parfaite",
  },
]

export const PROGRAM: DayProgram[] = [...WEEK1, ...WEEK2, ...WEEK3]

export const WEEK_THEMES: Record<1 | 2 | 3, { title: string; color: string; desc: string }> = {
  1: { title: "Fondations", color: "#9fd76d", desc: "Poser les bases, adopter le nouveau rythme alimentaire, sans gluten, sans lactose, sans sucre raffiné." },
  2: { title: "Équilibre", color: "#26c5ce", desc: "Approfondir la détox, explorer les saveurs umami, renforcer le microbiote." },
  3: { title: "Ancrage", color: "#BF7D2C", desc: "Consolider les acquis, réintroduire la volaille bio, ancrer les nouvelles habitudes." },
}

// calcIMC, calcBesoinsBase, portionMultiplier supprimés (voir ÉTAPE 7 évolutions)

// ─── PROGRAMME V2 — structure handoff design (app.jsx) ───────────────────────
// Utilisé par le nouveau dashboard et les emails de chapitre.

export type MealV2 = {
  time: string      // "7h" | "12h" | "19h"
  label: string     // "Petit-déjeuner" | "Déjeuner" | "Dîner"
  items: string
  alts?: string[]
  note?: string
}

export type DayProgramV2 = {
  day: number
  meals: MealV2[]
}

export type ChapterInfo = {
  name: string
  key: "detox" | "energie" | "ancrage"
  sub: string
}

export function CHAPTER_FOR_DAY(d: number): ChapterInfo {
  if (d <= 7)  return { name: "Détox",   key: "detox",   sub: "Détox & Purification" }
  if (d <= 14) return { name: "Énergie", key: "energie", sub: "Énergie & Vitalité" }
  return             { name: "Ancrage", key: "ancrage", sub: "Ancrage & Performance" }
}

export const PROGRAM_NEW: DayProgramV2[] = [
  // ─── Semaine 1 — Détox & Purification ────────────────────────────────────
  { day: 1, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Salade de fruits : banane, pomme, fraises, amandes, noisettes, citron, miel." },
    { time: "12h", label: "Déjeuner",       items: "Salade de chou, sésame noir, graines, avocat, œuf mollet. Café ou thé.",
      alts: ["Pas d'œuf ? Sardines à l'huile d'olive."] },
    { time: "19h", label: "Dîner",          items: "Poêlée courgettes-poireaux au curry, riz thaï aux aromates. Crudités en entrée.",
      alts: ["Pas de riz ? Quinoa."] },
  ]},
  { day: 2, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus pomme-poire-kiwi. Figues séchées, oléagineux." },
    { time: "12h", label: "Déjeuner",       items: "Crudités (carotte râpée, chou, graines). Lentilles tièdes, avocat, vinaigrette tamari-citron.",
      alts: ["Pas de lentilles ? Pois chiches."] },
    { time: "19h", label: "Dîner",          items: "Légumes vapeur (courgette, brocoli, haricots verts), lentilles vertes, vinaigrette citron-huile d'olive.",
      alts: ["Pas de brocoli ? Chou-fleur."] },
  ]},
  { day: 3, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus pomme-citron-mangue. Banane, amandes." },
    { time: "12h", label: "Déjeuner",       items: "Crudités (concombre, avocat, basilic, vinaigrette).",
      alts: ["Pas d'avocat ? Houmous."] },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Dal de lentilles corail au curry-gingembre, riz basmati.",
      alts: ["Pas de lentilles corail ? Lentilles vertes.", "Pas de riz ? Quinoa."],
      note: "Dal + riz : association tolérée, tout végétal." },
  ]},
  { day: 4, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus ananas-poire-fraises. Oléagineux." },
    { time: "12h", label: "Déjeuner",       items: "Navet râpé, chou rouge, champignons, carottes, graines germées, vinaigrette.",
      alts: ["Pas de navet ? Céleri râpé."] },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Pois chiches à l'indienne, riz au cumin, coriandre.",
      alts: ["Pas de pois chiches ? Haricots rouges."] },
  ]},
  { day: 5, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Banane, fruits de saison, figues séchées, amandes-noisettes. Jus de pomme." },
    { time: "12h", label: "Déjeuner",       items: "Concombre, tomates, roquette, avocat, graines de courge, vinaigrette citron vert.",
      alts: ["Pas de roquette ? Mâche."] },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Légumes vapeur, poulet fermier grillé, herbes, citron.",
      alts: ["Pas de poulet ? Dinde ou lapin."],
      note: "Fruits 2h après." },
  ]},
  { day: 6, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus pomme-carotte-betterave-gingembre. Oléagineux." },
    { time: "12h", label: "Déjeuner",       items: "Tomates, mâche, avocat, graines germées, vinaigrette. Tartare de bœuf bio.",
      alts: ["Pas de bœuf ? Tartare de saumon."] },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Roquette, figues fraîches, avocat, noix. Jambon cru.",
      alts: ["Pas de jambon cru ? Tranche de saumon fumé."],
      note: "Fruits 2h après." },
  ]},
  { day: 7, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus pomme-citron-poire-kaki. Fruits frais." },
    { time: "12h", label: "Déjeuner",       items: "Mesclun, tomates, olives, avocat. Thon mi-cuit, vinaigrette citron.",
      alts: ["Pas de thon ? Maquereau."] },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Concombre, fenouil, betterave râpée. Saumon gravlax, aneth, citron vert.",
      alts: ["Pas de saumon ? Truite fumée."],
      note: "Fruits 2h après." },
  ]},
  // ─── Semaine 2 — Énergie & Vitalité ──────────────────────────────────────
  { day: 8, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus pomme-poire-kiwi. Fruits frais, oléagineux." },
    { time: "12h", label: "Déjeuner",       items: "Crudités (carotte, concombre, chou rouge, graines germées, vinaigrette)." },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Pommes de terre vapeur, lentilles bio au curry-cumin-tamari.",
      alts: ["Pas de lentilles ? Pois chiches."] },
  ]},
  { day: 9, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus pomme-citron-mangue. Salade de fruits." },
    { time: "12h", label: "Déjeuner",       items: "Asperges snackées à l'huile d'olive, curry, tamari. Mesclun, avocat.",
      alts: ["Pas d'asperges ? Haricots verts."] },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Pâtes de riz, courgettes, tomates cerises, basilic, ail.",
      alts: ["Pas de pâtes de riz ? Riz complet."] },
  ]},
  { day: 10, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus ananas-poire-fraises. Oléagineux." },
    { time: "12h", label: "Déjeuner",       items: "Roquette, avocat, concombre, graines germées, vinaigrette." },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Haricots verts, courgettes, brocoli vapeur. Filet de truite au four, citron, aneth.",
      alts: ["Pas de truite ? Saumon ou dorade."],
      note: "Fruits 2h après." },
  ]},
  { day: 11, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus pomme-carotte-betterave-gingembre. Fruits secs." },
    { time: "12h", label: "Déjeuner",       items: "Carottes, navets, champignons en lamelles, gomasio, graines de courge.",
      alts: ["Pas de navets ? Céleri."] },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Cœurs d'artichaut poêlés au tamari. Poulet bio grillé, herbes.",
      alts: ["Pas d'artichaut ? Champignons poêlés."],
      note: "Fruits 2h après." },
  ]},
  { day: 12, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus pomme-citron-poire-kaki. Banane, oléagineux." },
    { time: "12h", label: "Déjeuner",       items: "Betteraves, champignons, avocat, ciboulette, gomasio, vinaigrette.",
      alts: ["Pas de betterave ? Carotte râpée."] },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Poireaux vapeur à la vinaigrette moutarde-citron. Pavé de saumon vapeur.",
      alts: ["Pas de saumon ? Cabillaud."],
      note: "Fruits 2h après." },
  ]},
  { day: 13, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus pomme-carotte-citron. Banane, oléagineux." },
    { time: "12h", label: "Déjeuner",       items: "Mesclun, tomates, concombre, avocat, graines de chanvre, vinaigrette." },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Purée de patate douce, châtaignes, huile de coco.",
      alts: ["Pas de châtaignes ? Pois chiches."] },
  ]},
  { day: 14, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Mangue, papaye, fruits rouges. Noix, amandes." },
    { time: "12h", label: "Déjeuner",       items: "Mâche, radis, concombre, graines germées, vinaigrette." },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Aubergine, poivron, courgette rôtis. Maquereau au four, citron, herbes.",
      alts: ["Pas de maquereau ? Sardines fraîches."],
      note: "Fruits 2h après." },
  ]},
  // ─── Semaine 3 — Ancrage & Performance ───────────────────────────────────
  { day: 15, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus pomme-ananas-épinards-gingembre. Fruits frais." },
    { time: "12h", label: "Déjeuner",       items: "Mesclun, tomates, olives, avocat, vinaigrette citron.",
      alts: ["Pas d'olives ? Câpres."] },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Ratatouille (courgette, aubergine, tomate). Émincé de dinde bio grillé.",
      alts: ["Pas de dinde ? Poulet."],
      note: "Fruits 2h après." },
  ]},
  { day: 16, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Mangue, ananas, kiwi, amandes." },
    { time: "12h", label: "Déjeuner",       items: "Concombre, fenouil, betterave crue, graines germées, vinaigrette." },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Mesclun, avocat, herbes fraîches. Tartare de daurade citron vert-aneth.",
      alts: ["Pas de daurade ? Tartare de saumon."],
      note: "Fruits 2h après." },
  ]},
  { day: 17, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus pomme-épinard-concombre-citron. Banane, oléagineux." },
    { time: "12h", label: "Déjeuner",       items: "Betterave, mâche, noix, gomasio, vinaigrette.",
      alts: ["Pas de betterave ? Carotte râpée."] },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Brocoli, haricots verts vapeur. Crevettes sautées ail-citron-persil.",
      alts: ["Pas de crevettes ? Noix de Saint-Jacques."],
      note: "Fruits 2h après." },
  ]},
  { day: 18, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Fruits de saison, figues fraîches, noix, amandes. Jus d'orange pressé." },
    { time: "12h", label: "Déjeuner",       items: "Poivron rouge, chou rouge, carotte, persil, graines de courge, vinaigrette.",
      alts: ["Pas de poivron ? Tomates cerises."] },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Épinards sautés à l'ail. Filet de sole vapeur, citron.",
      alts: ["Pas de sole ? Cabillaud ou limande."],
      note: "Fruits 2h après." },
  ]},
  { day: 19, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus pomme-carotte-betterave-gingembre. Banane, oléagineux." },
    { time: "12h", label: "Déjeuner",       items: "Fenouil, chou-fleur, carottes, roquette, avocat, vinaigrette.",
      alts: ["Pas de fenouil ? Céleri."] },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Roquette, câpres, huile d'olive. Carpaccio de bœuf bio, poivre.",
      alts: ["Pas de bœuf ? Carpaccio de saumon."],
      note: "Fruits 2h après." },
  ]},
  { day: 20, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Papaye, mangue, ananas, citron vert, noix de cajou." },
    { time: "12h", label: "Déjeuner",       items: "Mesclun, concombre, tomates, avocat, graines germées, vinaigrette." },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Poivrons, courgettes, aubergines rôtis au thym. Côtelettes d'agneau bio grillées.",
      alts: ["Pas d'agneau ? Veau ou poulet."],
      note: "Fruits 2h après." },
  ]},
  { day: 21, meals: [
    { time: "7h",  label: "Petit-déjeuner", items: "Jus pomme-ananas-Green Magma. Fruits frais, oléagineux." },
    { time: "12h", label: "Déjeuner",       items: "Mesclun, avocat, betterave, graines de chanvre, vinaigrette citron-aneth." },
    { time: "19h", label: "Dîner",          items: "Crudités en entrée. Asperges vertes, brocoli vapeur. Coquilles Saint-Jacques poêlées à l'huile de coco.",
      alts: ["Pas de Saint-Jacques ? Crevettes ou gambas."],
      note: "Fruits 2h après." },
  ]},
]

// ─── Principes Verissimo (nouveau design) ─────────────────────────────────────

export type PrincipleV2 = {
  n: number
  title: string
  body: string
}

export const PRINCIPLES_V2: PrincipleV2[] = [
  { n: 1, title: "Associer les aliments",
    body: "Le repère qui change le plus la digestion. Les protéines vont bien avec les légumes, les céréales aussi — mais pas les trois ensemble. Le corps fatigue moins, l'énergie reste haute après les repas." },
  { n: 2, title: "La mastication",
    body: "Mâcher prend du temps, et c'est ce qu'on cherche. Le corps a besoin de cette lenteur pour reconnaître ce qu'il reçoit, doser ce qu'il digère, et sentir quand c'est suffisant." },
  { n: 3, title: "Le temps entre les choses",
    body: "Les fruits se digèrent à part — plutôt 30 minutes avant un repas, ou 2 heures après. Entre le dîner et le petit-déjeuner du lendemain, on laisse douze heures. C'est un petit jeûne de nuit, le corps s'en sert pour faire le ménage." },
  { n: 4, title: "Manger vivant",
    body: "Quelque chose de cru à chaque repas — crudités, fruits frais, jeunes pousses, graines germées. La cuisson tue une partie des enzymes, le cru les apporte. C'est là qu'est la vitalité du végétal." },
  { n: 5, title: "Ce qu'on met de côté",
    body: "Pendant les trois semaines : pas de sucre raffiné, pas de lait de vache, pas de blé. Pas pour toujours, juste le temps de laisser le corps respirer sans eux. Beaucoup de choses bougent à ce moment-là." },
  { n: 6, title: "L'eau",
    body: "Un grand verre au réveil. 1,5 à 2 litres répartis dans la journée. Pas pendant les repas si tu peux — ça dilue ce qui doit digérer." },
  { n: 7, title: "Bouger, trente minutes",
    body: "Pas du sport, juste du mouvement quotidien : marche rapide, vélo doux, escaliers. Le corps a autant besoin de bouger que de manger juste. C'est là que l'énergie circule." },
]

export type PrincipleGroup = {
  name: string
  hint: string
  principleIds: number[]
}

export const PRINCIPLE_GROUPS: PrincipleGroup[] = [
  { name: "Comment manger",    hint: "Le geste, le rythme, le temps.",           principleIds: [1, 2, 3] },
  { name: "Ce qu'on mange",    hint: "Le vivant d'abord, et ce qu'on retire.",   principleIds: [4, 5] },
  { name: "Ce qui accompagne", hint: "L'eau et le mouvement, autour des repas.", principleIds: [6, 7] },
]

