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

export type PrincipalKey = {
  icon: string
  title: string
  body: string
  color: string
}

export const PRINCIPES: PrincipalKey[] = [
  {
    icon: "🌅",
    title: "Commencer par l'eau",
    body: "Chaque matin, à jeun : un grand verre d'eau tiède avec le jus d'un demi-citron. Active le foie, stimule la digestion, alcalinise le corps.",
    color: "#f59e0b",
  },
  {
    icon: "🌿",
    title: "Manger vivant",
    body: "50 % de l'assiette en crudités ou légumes légèrement cuits. Les enzymes vivantes nourrissent les cellules et soutiennent l'immunité.",
    color: "#4cc9f0",
  },
  {
    icon: "⏱️",
    title: "Respecter les fenêtres",
    body: "Petit-déjeuner entre 7h et 9h, dîner avant 20h. Le jeûne nocturne de 12h minimum est une détox naturelle gratuite.",
    color: "#38c4e8",
  },
  {
    icon: "🚫",
    title: "Éviter les perturbateurs",
    body: "Sucres raffinés, farines blanches, alcool et produits ultra-transformés sont bannis sur 21 jours. Ils encrassent le foie et épuisent l'énergie.",
    color: "#f87171",
  },
  {
    icon: "💧",
    title: "Hydrater en profondeur",
    body: "1,5 à 2L d'eau pure par jour, hors repas de préférence. L'hydratation est le premier levier d'énergie et de concentration.",
    color: "#38bdf8",
  },
  {
    icon: "🧘",
    title: "Rituel corps-esprit",
    body: "2 rituels quotidiens (matin + soir) de 5 minutes minimum. La régularité crée la transformation — pas l'intensité.",
    color: "#818cf8",
  },
  {
    icon: "😴",
    title: "Dormir pour régénérer",
    body: "7 à 9h de sommeil est non-négociable. Le corps détoxifie, répare et synthétise les hormones d'énergie la nuit.",
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

// ─── WEEK 1 : DÉTOX & PURIFICATION ────────────────────────────────────────────
const WEEK1: DayProgram[] = [
  {
    day: 1, week: 1,
    theme: "Éveil & Purification",
    intention: "Nettoyer, alléger, recommencer.",
    coachWord: "Aujourd'hui, tu poses le premier pas. C'est le plus courageux de tous.",
    morningRitual: "Au réveil : verre d'eau tiède avec le jus d'un demi-citron. Attends 20 minutes avant de manger.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Amandes & noix", "Abricots secs & raisins", "Miel brut", "Jus de citron"], conseil: "Commencez par le jus de citron à jeun — 15 min avant de manger." },
      { moment: "midi", items: ["Crudités variées", "Pommes de terre vapeur", "Œufs mollets", "Café"], conseil: "Mastiquez lentement. Le calme digestif commence par la lenteur." },
      { moment: "après-midi", items: ["Un fruit (pomme, poire ou agrume)"], conseil: "Attendez 30 min après votre café." },
      { moment: "soir", items: ["Crudités en salade", "Volaille grillée", "Courgettes vapeur"], conseil: "Dîner léger, avant 20h si possible." },
    ],
    ritual: { matin: "3 grandes respirations dès le réveil. Buvez votre eau citronnée en pleine conscience.", soir: "5 min d'étirements doux. Notez 1 chose positive de la journée." },
    hydration: "1,5 à 2L d'eau pure tout au long de la journée",
    tip: "Évitez les sucres raffinés et les produits transformés aujourd'hui.",
  },
  {
    day: 2, week: 1,
    theme: "Ancrage & Énergie Durable",
    intention: "Construire un socle solide pour la journée.",
    coachWord: "Le deuxième jour confirme ce que le premier a commencé. Tu tiens.",
    morningRitual: "Eau citronnée, puis 10 minutes de marche à l'air libre avant le petit-déjeuner.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Noisettes & amandes", "Dattes & figues sèches", "Miel de fleurs", "Jus de citron"], conseil: "Faites tremper les fruits secs la veille pour une meilleure assimilation." },
      { moment: "midi", items: ["Carottes râpées", "Betterave crue", "Lentilles tièdes", "Huile d'olive & citron"], conseil: "Les légumineuses nourrissent le microbiote — à intégrer régulièrement." },
      { moment: "après-midi", items: ["Kiwi ou orange"] },
      { moment: "soir", items: ["Soupe de légumes maison", "Saumon vapeur"], conseil: "Les oméga-3 du poisson gras soutiennent le cerveau et l'énergie." },
    ],
    ritual: { matin: "Marche de 10 min à l'air libre avant ou après le petit-déjeuner.", soir: "Journaling : notez votre niveau d'énergie sur 10 et ce qui l'a influencé." },
    hydration: "Infusion ortie ou pissenlit en complément",
    tip: "Limitez le café à 1 tasse. Préférez une infusion verte en milieu d'après-midi.",
  },
  {
    day: 3, week: 1,
    theme: "Légèreté & Clarté Mentale",
    intention: "Alléger le corps pour clarifier l'esprit.",
    coachWord: "Trois jours sans toxiques — ton foie commence à souffler.",
    morningRitual: "5 minutes de cohérence cardiaque au réveil. Eau citronnée ensuite.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Noix du Brésil (3 max)", "Pruneaux & raisins secs", "Miel + cannelle", "Jus de citron"], conseil: "La cannelle régule la glycémie — saupoudrez généreusement." },
      { moment: "midi", items: ["Salade verte", "Avocat", "Œufs durs", "Tomates cerises", "Graines de courge"] },
      { moment: "après-midi", items: ["Pomme verte"] },
      { moment: "soir", items: ["Velouté de brocolis", "Blanc de poulet grillé aux herbes"] },
    ],
    ritual: { matin: "5 min de cohérence cardiaque (app ou YouTube).", soir: "Déconnexion des écrans 1h avant le coucher." },
    hydration: "Eau + infusion verveine le soir",
    tip: "Le brocoli est un détoxifiant hépatique puissant — à consommer au moins 3x/semaine.",
  },
  {
    day: 4, week: 1,
    theme: "Douceur & Régénération",
    intention: "Nourrir sans alourdir.",
    coachWord: "Le corps détoxifie — bois beaucoup, repose-toi bien.",
    morningRitual: "Eau citronnée. Note 3 intentions pour ta journée — des états à atteindre, pas des tâches.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Noix de cajou", "Dattes Medjool & abricots secs", "Miel", "Copeaux de noix de coco", "Jus de citron"], conseil: "Les dattes Medjool apportent du magnésium et du potassium — énergie immédiate." },
      { moment: "midi", items: ["Crudités de légumes variés (tomates, concombre, radis)", "Sardines à l'huile d'olive", "Roquette"] },
      { moment: "après-midi", items: ["Poire ou raisin frais"] },
      { moment: "soir", items: ["Potage de poireaux", "Patate douce rôtie", "Dinde en escalope"], conseil: "La patate douce a un IG modéré et rassasie durablement." },
    ],
    ritual: { matin: "Notez 3 intentions pour la journée — pas des tâches, des états à atteindre.", soir: "Bain de pieds chaud 10 min : favorise la détox et le sommeil." },
    hydration: "Bouillon de légumes non salé en soirée",
    tip: "Jour 4 : le corps commence à libérer les toxines — buvez plus que d'habitude.",
  },
  {
    day: 5, week: 1,
    theme: "Force Tranquille",
    intention: "L'énergie vient de l'intérieur.",
    coachWord: "La légère fatigue que tu ressens est une bonne nouvelle. Le corps travaille.",
    morningRitual: "Automassage du ventre circulaire 3 minutes. Eau citronnée ensuite.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Amandes effilées", "Figues sèches & abricots", "Miel de châtaignier", "Jus de citron"], conseil: "Les amandes effilées sont plus faciles à digérer — idéal en milieu de semaine." },
      { moment: "midi", items: ["Salade de chou rouge râpé", "Pois chiches rôtis", "Tomates & concombre", "Huile de noix"], conseil: "Le chou rouge est riche en anthocyanes — puissants antioxydants." },
      { moment: "après-midi", items: ["Abricots frais ou secs (3)"] },
      { moment: "soir", items: ["Wok de légumes (brocolis, carottes, champignons)", "Blanc de poisson au citron"] },
    ],
    ritual: { matin: "Automassage du ventre circulaire 3 min — stimule le transit et le nerf vague.", soir: "Lecture 20 min (papier) — le cerveau se régénère hors écran." },
    hydration: "Infusion fenouil + anis étoilé — anti-ballonnements",
    tip: "Si vous ressentez une légère fatigue, c'est normal — le corps détoxifie activement.",
  },
  {
    day: 6, week: 1,
    theme: "Équilibre & Sérénité",
    intention: "Trouver le calme dans la constance.",
    coachWord: "Avant-dernier jour de semaine 1. Tu n'es déjà plus la même personne.",
    morningRitual: "5 minutes de marche lente en respiration 4-4-4 (inspire 4s / retiens 4s / expire 4s). Eau citronnée.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Fruits exotiques (mangue, papaye…)", "Pistaches & noix de macadamia", "Raisins secs & dattes", "Miel brut", "Cannelle", "Jus de citron"], conseil: "Les pistaches sont riches en protéines végétales — satiété durable jusqu'à midi." },
      { moment: "midi", items: ["Gaspacho maison (tomates, poivrons, concombre)", "Œufs pochés"] },
      { moment: "après-midi", items: ["Figues fraîches ou kakis"] },
      { moment: "soir", items: ["Velouté de courge butternut", "Gambas poêlées à l'ail"], conseil: "La courge est riche en bêta-carotène — beauté de la peau et immunité." },
    ],
    ritual: { matin: "5 min de marche lente + respiration 4-4-4 (inspire 4s / retiens 4s / expire 4s).", soir: "Préparez vos repas du lendemain — l'anticipation nourrit la régularité." },
    hydration: "Eau + tranche de concombre + feuilles de menthe",
    tip: "Avant-dernier jour de la semaine 1 — faites le point : qu'est-ce qui a changé ?",
  },
  {
    day: 7, week: 1,
    theme: "Bilan & Célébration",
    intention: "Une semaine de transformé — honorer le chemin parcouru.",
    coachWord: "Tu as tenu une semaine complète. Ce n'est pas rien.",
    morningRitual: "Bilan de la semaine : corps, énergie, humeur. Note 3 victoires, même petites. Eau citronnée au réveil.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Mélange oléagineux (amandes, noix, cajou)", "Fruits secs variés (abricots, figues, dattes)", "Miel", "Copeaux de noix de coco", "Jus de citron"], conseil: "Fin de semaine 1 — prenez le temps de préparer ce bol avec soin, c'est votre récompense." },
      { moment: "midi", items: ["Grande salade composée (avocat, tomates, concombre, graines)", "Filet de truite vapeur"] },
      { moment: "après-midi", items: ["Compote de pommes sans sucre + noix"] },
      { moment: "soir", items: ["Soupe miso légère", "Galettes de riz", "Légumes sautés au sésame"], conseil: "Repas léger pour une nuit réparatrice — transition vers la semaine 2." },
    ],
    ritual: { matin: "Bilan de la semaine : corps, énergie, humeur. Notez 3 victoires, même petites.", soir: "Bain chaud avec sel de mer — détox cutanée. Coucher avant 22h." },
    hydration: "Jus de citron + eau de coco tout au long de la journée",
    tip: "Bravo — 7 jours accomplis. La semaine 2 monte en puissance : Énergie & Vitalité.",
  },
]

// ─── WEEK 2 : ÉNERGIE & VITALITÉ ──────────────────────────────────────────────
const WEEK2: DayProgram[] = [
  {
    day: 8, week: 2,
    theme: "Réveil de l'Énergie",
    intention: "Alimenter la machine avec précision.",
    coachWord: "Semaine 2 — l'énergie change de nature. Tu vas le sentir.",
    morningRitual: "10 minutes de yoga ou stretching dynamique. Eau citronnée au réveil.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Noix de cajou", "Dattes & figues sèches", "Miel", "Jus de citron"], conseil: "Les agrumes activent le foie le matin — parfaits pour bien démarrer la semaine 2." },
      { moment: "midi", items: ["Salade niçoise (thon, œufs, haricots verts, olives)"] },
      { moment: "après-midi", items: ["Poignée d'amandes + carré de chocolat noir 85%"], conseil: "Le chocolat noir > 85% est riche en magnésium — anti-stress et anti-fatigue." },
      { moment: "soir", items: ["Risotto de riz aux champignons", "Légumes vapeur variés"] },
    ],
    ritual: { matin: "10 min de yoga ou stretching dynamique — réveille les fascias et la circulation.", soir: "Visualisation positive 5 min avant de dormir — programmez votre énergie du lendemain." },
    hydration: "Eau + jus de citron vert + menthe fraîche",
    tip: "Semaine 2 : on introduit plus de protéines de qualité pour soutenir l'énergie physique.",
  },
  {
    day: 9, week: 2,
    theme: "Concentration & Acuité",
    intention: "Nourrir le cerveau pour performer.",
    coachWord: "Nourrir le cerveau, c'est nourrir chaque décision de ta journée.",
    morningRitual: "5 minutes de méditation pleine conscience. Observe sans juger. Eau citronnée ensuite.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Cerneaux de noix", "Raisins secs & abricots", "Miel de forêt", "Cannelle", "Jus de citron"], conseil: "Les cerneaux de noix nourrissent le cerveau — riches en oméga-3 ALA et en vitamine E." },
      { moment: "midi", items: ["Sardines fraîches grillées", "Crudités d'herbes fraîches (persil, menthe, tomates, concombre)", "Salade de roquette"] },
      { moment: "après-midi", items: ["Kiwi + noix de cajou"] },
      { moment: "soir", items: ["Lentilles corail au lait de coco", "Riz basmati", "Épinards sautés à l'ail"] },
    ],
    ritual: { matin: "5 min de méditation de pleine conscience — observez sans juger.", soir: "Journaling cognitif : 3 choses apprises aujourd'hui." },
    hydration: "Infusion ginkgo biloba ou romarin — stimulants cognitifs",
    tip: "Réduisez les sucres rapides à midi — ils provoquent le coup de pompe de 14h.",
  },
  {
    day: 10, week: 2,
    theme: "Endurance & Récupération",
    intention: "Le corps entraîné nourrit l'esprit.",
    coachWord: "10 jours. Le corps s'adapte, les habitudes se posent.",
    morningRitual: "20 minutes de marche ou vélo. Eau citronnée avant de partir.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Amandes & noisettes", "Pruneaux", "Miel", "Copeaux de noix de coco", "Jus de citron"], conseil: "Variez les fruits selon la saison — ils apportent chacun leurs minéraux spécifiques." },
      { moment: "midi", items: ["Poulet rôti aux herbes de Provence", "Patate douce", "Haricots verts vapeur"] },
      { moment: "après-midi", items: ["Banane + amandes"] },
      { moment: "soir", items: ["Velouté de lentilles blondes", "Pain de seigle"], conseil: "Repas doux et réconfortant — récupération musculaire et nerveux." },
    ],
    ritual: { matin: "20 min de marche rapide ou vélo — activez le métabolisme de base.", soir: "Auto-massage des jambes et pieds 10 min — drainage et récupération." },
    hydration: "Eau + électrolytes naturels (eau de coco ou bouillon)",
    tip: "Si vous faites du sport, mangez votre collation 30 min avant l'effort.",
  },
  {
    day: 11, week: 2,
    theme: "Immunité & Protection",
    intention: "Le corps sain se défend naturellement.",
    coachWord: "L'immunité se construit jour après jour. Tu investis dans ta santé.",
    morningRitual: "Gargarisme à l'huile de coco 5 minutes (oil pulling). Eau citronnée ensuite.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Fruits exotiques (ananas, mangue…)", "Noix du Brésil & amandes", "Dattes & raisins secs", "Miel", "Cannelle", "Jus de citron"], conseil: "L'ananas et la papaye contiennent des enzymes digestives naturelles — privilégiez-les frais." },
      { moment: "midi", items: ["Soupe de légumes anciens (panais, navet, céleri-rave)", "Poulet fermier", "Quinoa"] },
      { moment: "après-midi", items: ["2 mandarines + noisettes"] },
      { moment: "soir", items: ["Curry léger de pois chiches", "Riz complet", "Coriandre fraîche"], conseil: "Le curcuma + poivre noir = absorption x20 des propriétés anti-inflammatoires." },
    ],
    ritual: { matin: "Gargarisme à l'huile de coco 5 min (oil pulling) — détox buccal et immunité.", soir: "Diffusion d'huile essentielle d'eucalyptus ou de ravintsara." },
    hydration: "Décoction de thym + miel — antiseptique naturel",
    tip: "Zinc, vitamine C et D3 sont vos alliés immunitaires. Exposez-vous à la lumière du jour.",
  },
  {
    day: 12, week: 2,
    theme: "Beauté & Régénération Cellulaire",
    intention: "Ce que vous mangez se voit sur votre peau.",
    coachWord: "Ce que tu manges se voit — ton teint change, tu le sais.",
    morningRitual: "Brossage à sec du corps de bas en haut — stimule la lymphe et éclat cutané. Eau citronnée.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Noix de cajou & pistaches", "Figues sèches & abricots", "Miel brut", "Jus de citron"], conseil: "Les fruits de saison sont les plus riches en nutriments — achetez-les mûrs." },
      { moment: "midi", items: ["Saumon gravlax", "Salade de fenouil & orange"] },
      { moment: "après-midi", items: ["Gelée d'aloe vera + fruits rouges"] },
      { moment: "soir", items: ["Velouté de patate douce au gingembre", "Pois chiches épicés", "Asperges vapeur"], conseil: "Les asperges sont diurétiques — favorisent l'élimination rénale." },
    ],
    ritual: { matin: "Brossage à sec du corps de bas en haut — stimule la lymphe et éclat cutané.", soir: "Application d'huile de jojoba ou d'argan sur le corps après la douche." },
    hydration: "Eau + collagène marin (ou bouillon d'os) — régénération cutanée",
    tip: "La peau reflète l'état du foie et de l'intestin. Votre teint change à partir du jour 10.",
  },
  {
    day: 13, week: 2,
    theme: "Équilibre Hormonal",
    intention: "Les hormones guident l'énergie — nourrissez-les.",
    coachWord: "Les hormones se rééquilibrent. Chaque repas est une contribution.",
    morningRitual: "Exposition à la lumière naturelle 10 minutes. Régule la mélatonine et le cortisol. Eau citronnée.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Amandes & cerneaux de noix", "Dattes & raisins blonds", "Miel + cannelle", "Jus de citron"], conseil: "Les fruits rouges et la grenade sont parmi les antioxydants les plus puissants." },
      { moment: "midi", items: ["Salade de mâche & noix", "Betterave rôtie", "Graines de sésame"] },
      { moment: "après-midi", items: ["Chocolat noir 85% (2 carrés) + noix du Brésil (2)"] },
      { moment: "soir", items: ["Filet de cabillaud en papillote (citron, herbes)", "Brocolis vapeur"] },
    ],
    ritual: { matin: "Exposition à la lumière naturelle 10 min — régule la mélatonine et le cortisol.", soir: "Tisane de sauge ou de framboisier (régulation hormonale féminine)." },
    hydration: "Infusion maca ou fenugrec — adaptogènes hormonaux",
    tip: "Les graisses saines (avocat, noix, olive) sont indispensables à la production hormonale.",
  },
  {
    day: 14, week: 2,
    theme: "Mi-Parcours — Puissance",
    intention: "14 jours. La moitié du chemin. Déjà transformé.",
    coachWord: "La moitié est derrière toi. La meilleure partie commence.",
    morningRitual: "Bilan des 14 jours : prends tes mesures, note ton énergie sur 10. Eau citronnée.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Fruits exotiques (mangue, papaye…)", "Noix de cajou & macadamia", "Figues & abricots secs", "Miel", "Copeaux de noix de coco", "Jus de citron"], conseil: "Mi-parcours — ce petit-déjeuner festif célèbre vos 14 premiers jours." },
      { moment: "midi", items: ["Pièce de bœuf grass-fed", "Salade verte", "Sauce chimichurri"] },
      { moment: "après-midi", items: ["Fruits secs mélangés (raisins, abricots, figues)"] },
      { moment: "soir", items: ["Bouillon de légumes enrichi", "Nouilles soba", "Tempeh sauté aux légumes"], conseil: "Le tempeh est fermenté — excellent pour le microbiote et la digestion." },
    ],
    ritual: { matin: "Bilan des 14 jours : corps, énergie, humeur, peau. Mesurez-vous.", soir: "Célébration : prenez un moment pour vous — bain, lecture, musique." },
    hydration: "Kombucha (si disponible) ou kéfir — probiotiques naturels",
    tip: "14 jours accomplis. La semaine 3 est celle de l'ancrage — solidifier les acquis.",
  },
]

// ─── WEEK 3 : ANCRAGE & PERFORMANCE ───────────────────────────────────────────
const WEEK3: DayProgram[] = [
  {
    day: 15, week: 3,
    theme: "Ancrage & Stabilité",
    intention: "Ce qui s'ancre ne peut plus être arraché.",
    coachWord: "Ce qui s'ancre ne peut plus être arraché. Semaine 3 — tu construis du solide.",
    morningRitual: "Ancrage par les pieds : marche pieds nus sur l'herbe ou le carrelage 5 minutes. Eau citronnée.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Amandes & noix mélangées", "Dattes & pruneaux", "Miel brut", "Cannelle", "Jus de citron"], conseil: "Semaine 3 — même rituel solide, vous le préparez désormais instinctivement." },
      { moment: "midi", items: ["Soupe de haricots blancs au romarin", "Filet de merlu", "Salade de mâche"] },
      { moment: "après-midi", items: ["Poignée de noix mélangées + dattes (2)"] },
      { moment: "soir", items: ["Gratin de légumes (courgettes, aubergines, tomates)", "Herbes de Provence"] },
    ],
    ritual: { matin: "Ancrage par les pieds : marche pieds nus sur l'herbe ou le carrelage 5 min.", soir: "Écriture libre 10 min — ce que vous ressentez sans filtre." },
    hydration: "Eau + chlorophylle liquide — alcalinisante et énergisante",
    tip: "La semaine 3 consolide tout — maintenez la constance même si vous vous sentez mieux.",
  },
  {
    day: 16, week: 3,
    theme: "Performance Mentale",
    intention: "Un corps nourri est un esprit affûté.",
    coachWord: "Un corps bien nourri produit des idées claires. Tu le remarques.",
    morningRitual: "Technique Pomodoro : 25 minutes de focus dès le matin. Eau citronnée avant.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Noisettes", "Abricots & figues sèches", "Miel de fleurs", "Jus de citron"], conseil: "Les cerises et fruits rouges sont riches en mélatonine naturelle — favorisent le sommeil." },
      { moment: "midi", items: ["Bowl de riz brun, edamame, avocat, carotte, sésame, sauce tamari"] },
      { moment: "après-midi", items: ["Cerises ou prunes fraîches"] },
      { moment: "soir", items: ["Filet de bar en croûte d'herbes", "Fenouil rôti", "Purée de céleri"], conseil: "Le céleri-rave est riche en vitamine K et phosphore — mémoire et concentration." },
    ],
    ritual: { matin: "Technique Pomodoro adaptée : 25 min de focus / 5 min de mouvement.", soir: "Préparation mentale du lendemain : 3 priorités notées la veille au soir." },
    hydration: "Thé vert matcha — caféine douce + L-théanine = focus sans stress",
    tip: "Le magnésium est le premier minéral épuisé par le stress. Chocolat noir et légumes verts.",
  },
  {
    day: 17, week: 3,
    theme: "Joie & Légèreté",
    intention: "Manger avec plaisir est aussi un acte de santé.",
    coachWord: "Manger avec plaisir est un acte de santé. Savoure.",
    morningRitual: "Gratitude rituelle : 5 choses pour lesquelles tu es reconnaissant. Eau citronnée.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Fruits exotiques (ananas, kiwi…)", "Amandes effilées & pistaches", "Raisins secs & dattes", "Miel", "Cannelle", "Copeaux de noix de coco", "Jus de citron"], conseil: "Manger avec plaisir est aussi un acte de santé — savourez chaque bouchée." },
      { moment: "midi", items: ["Paëlla végétarienne (riz, poivrons, artichauts, safran)"] },
      { moment: "après-midi", items: ["Tarte aux fruits frais maison (base amande)"] },
      { moment: "soir", items: ["Salade romaine aux herbes fraîches (citron, huile d'olive, olives)", "Filet de poulet"], conseil: "Moment plaisir contrôlé — manger avec gratitude amplifie la digestion." },
    ],
    ritual: { matin: "Gratitude rituelle : 5 choses pour lesquelles vous êtes reconnaissant.", soir: "Partagez un repas en conscience — sans téléphone, avec pleine présence." },
    hydration: "Eau pétillante + rondelles de citron et concombre",
    tip: "La joie dans l'assiette est aussi une nutrition. Plaisir et santé ne s'opposent pas.",
  },
  {
    day: 18, week: 3,
    theme: "Régénération Profonde",
    intention: "Le repos est une forme d'action.",
    coachWord: "Le repos est une forme d'action. Régénère-toi sans culpabilité.",
    morningRitual: "Lève-toi lentement. Étire-toi 3 minutes avant de te lever. Eau citronnée au réveil.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Noix de cajou", "Figues, abricots & pruneaux", "Miel", "Jus de citron"], conseil: "Jour de régénération — mangez lentement, en silence si possible." },
      { moment: "midi", items: ["Pot-au-feu léger (bœuf maigre, carottes, navet, poireau)", "Bouillon chaud"] },
      { moment: "après-midi", items: ["Compote de coings + amandes effilées"] },
      { moment: "soir", items: ["Risotto de riz complet aux champignons shitaké", "Poireaux fondants"], conseil: "Les champignons shitaké contiennent du lentinane — immunostimulant naturel." },
    ],
    ritual: { matin: "Sieste de 20 min si possible — récupération active.", soir: "Bain chaud au sel d'Epsom (sulfate de magnésium) — détox + relaxation musculaire." },
    hydration: "Bouillon d'os maison ou acheté bio — collagène et minéraux",
    tip: "Ne confondez pas repos et passivité. Régénérer c'est performer demain.",
  },
  {
    day: 19, week: 3,
    theme: "Clarté & Intentions",
    intention: "La fin approche — que souhaitez-vous garder ?",
    coachWord: "La fin approche. Qu'est-ce que tu gardes de tout ça ?",
    morningRitual: "Liste de 5 habitudes acquises que tu veux conserver. Eau citronnée.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Fruits exotiques (mangue, papaye…)", "Amandes & noix du Brésil", "Dattes & abricots secs", "Miel + cannelle", "Copeaux de noix de coco", "Jus de citron"], conseil: "Nourrissez-vous avec pleine conscience — chaque bouchée compte." },
      { moment: "midi", items: ["Salade de persil, tomates, oignon, citron et huile d'olive", "Brochettes d'agneau grillées"] },
      { moment: "après-midi", items: ["Grenade fraîche ou mangue"] },
      { moment: "soir", items: ["Harira légère (soupe marocaine aux légumineuses)"], conseil: "Le persil est l'herbe la plus riche en vitamine C et en fer biodisponible." },
    ],
    ritual: { matin: "Listez 5 habitudes acquises en 19 jours que vous souhaitez conserver.", soir: "Vision à 3 mois : comment souhaitez-vous vous sentir ?" },
    hydration: "Eau + graines de basilic (subja) — reminéralisante et rassasiante",
    tip: "Chaque repas sain est un vote pour la personne que vous devenez.",
  },
  {
    day: 20, week: 3,
    theme: "Puissance & Gratitude",
    intention: "Ressentir la force de ce qui a été construit.",
    coachWord: "Avant-dernier jour. Mesure où tu en es — compare au Jour 1.",
    morningRitual: "Pesée et mesures. Note ton énergie sur 10 et compare au Jour 1. Eau citronnée.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Cerneaux de noix", "Pruneaux & raisins secs", "Miel brut", "Cannelle", "Jus de citron"], conseil: "Avant-dernier jour — mesurez votre énergie ce matin et comparez au Jour 1." },
      { moment: "midi", items: ["Côte de veau grillée", "Légumes rôtis au four", "Salade de mâche aux noix"] },
      { moment: "après-midi", items: ["Tarte tatin à la pomme maison (pâte au sarrasin)"] },
      { moment: "soir", items: ["Bouillon thaï (lemongrass, galanga, champignons)", "Tofu soyeux", "Nouilles de riz"], conseil: "Repas léger avant-dernier soir — préparez votre journée finale." },
    ],
    ritual: { matin: "Mesurez-vous : poids, tour de taille, énergie, humeur — comparez au Jour 1.", soir: "Lettre à vous-même du Jour 1 — ce que vous vouliez changer, ce qui a changé." },
    hydration: "Eau de coco fraîche + infusion de tulsi",
    tip: "Vous n'êtes plus la même personne qu'au Jour 1. Le corps s'en souvient.",
  },
  {
    day: 21, week: 3,
    theme: "Renaissance & Nouveau Départ",
    intention: "21 jours. Une nouvelle version de vous.",
    coachWord: "21 jours. Tu n'es plus la même personne qu'au Jour 1.",
    morningRitual: "15 minutes de méditation. Pleine présence dans ce moment d'accomplissement. Eau citronnée.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Fruits exotiques au choix (mangue, ananas, papaye…)", "Mélange oléagineux (amandes, noix, cajou, macadamia)", "Fruits secs (figues, dattes, abricots)", "Miel brut", "Copeaux de noix de coco", "Jus de citron"], conseil: "Jour 21 — ce rituel est désormais le vôtre. Célébrez-le." },
      { moment: "midi", items: ["Repas festif sain : plateau de fruits de mer", "Salade verte à l'huile d'olive & citron", "Pain de seigle au levain"] },
      { moment: "après-midi", items: ["Fruits exotiques (fruits de la passion, litchi, papaye)"] },
      { moment: "soir", items: ["Filet mignon en croûte d'herbes", "Légumes rôtis multicolores"], conseil: "Célébrez avec conscience — vous méritez ce repas." },
    ],
    ritual: { matin: "Méditation de 15 min — pleine présence dans ce moment d'accomplissement.", soir: "Bilan complet : corps, énergie, clarté mentale, émotions. Partagez avec votre coach." },
    hydration: "Champagne… ou eau pétillante avec fleurs comestibles 🌸",
    tip: "21 jours accomplis. Ce n'est pas une fin — c'est une fondation. Continuez.",
  },
]

export const PROGRAM: DayProgram[] = [...WEEK1, ...WEEK2, ...WEEK3]

export const WEEK_THEMES: Record<1 | 2 | 3, { title: string; color: string; desc: string }> = {
  1: { title: "Détox & Purification", color: "#7de8ff", desc: "Nettoyer le corps, libérer les toxines, retrouver la légèreté." },
  2: { title: "Énergie & Vitalité", color: "#7de8ff", desc: "Nourrir l'énergie, soutenir le cerveau, performer." },
  3: { title: "Ancrage & Performance", color: "#818cf8", desc: "Consolider les acquis, ancrer les nouvelles habitudes." },
}

// calcIMC, calcBesoinsBase, portionMultiplier supprimés (voir ÉTAPE 7 évolutions)

