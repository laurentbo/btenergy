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
  meals: Meal[]
  ritual: { matin: string; soir: string }
  hydration: string
  tip: string
}

export type UserProfile = {
  prenom: string
  genre: "homme" | "femme"
  age: number
  taille: number   // cm
  poids: number    // kg
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
    color: "#2de4a4",
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

// ─── WEEK 1 : DÉTOX & PURIFICATION ────────────────────────────────────────────
const WEEK1: DayProgram[] = [
  {
    day: 1, week: 1,
    theme: "Éveil & Purification",
    intention: "Nettoyer, alléger, recommencer.",
    meals: [
      { moment: "matin", items: ["Fruits de saison", "Oléagineux (amandes, noix)", "Miel brut", "Eau citronnée tiède"], conseil: "Commencez par l'eau citronnée à jeun — 15 min avant de manger." },
      { moment: "midi", items: ["Crudités variées", "Pommes de terre vapeur", "Œufs mollets", "Café"], conseil: "Mastiquez lentement. Le calme digestif commence par la lenteur." },
      { moment: "après-midi", items: ["Un fruit (pomme, poire ou agrume)"], conseil: "Attendez 30 min après votre café." },
      { moment: "soir", items: ["Crudités en salade", "Volaille grillée", "Riz complet", "Courgettes vapeur"], conseil: "Dîner léger, avant 20h si possible." },
    ],
    ritual: { matin: "3 grandes respirations dès le réveil. Buvez votre eau citronnée en pleine conscience.", soir: "5 min d'étirements doux. Notez 1 chose positive de la journée." },
    hydration: "1,5 à 2L d'eau pure tout au long de la journée",
    tip: "Évitez les sucres raffinés et les produits transformés aujourd'hui.",
  },
  {
    day: 2, week: 1,
    theme: "Ancrage & Énergie Durable",
    intention: "Construire un socle solide pour la journée.",
    meals: [
      { moment: "matin", items: ["Fruits rouges", "Amandes & noisettes", "Miel de fleurs", "Eau citronnée + gingembre"], conseil: "Ajoutez une tranche de gingembre frais dans votre eau." },
      { moment: "midi", items: ["Carottes râpées", "Betterave crue", "Lentilles tièdes", "Huile d'olive & citron"], conseil: "Les légumineuses nourrissent le microbiote — à intégrer régulièrement." },
      { moment: "après-midi", items: ["Kiwi ou orange"] },
      { moment: "soir", items: ["Soupe de légumes maison", "Quinoa", "Saumon vapeur"], conseil: "Les oméga-3 du poisson gras soutiennent le cerveau et l'énergie." },
    ],
    ritual: { matin: "Marche de 10 min à l'air libre avant ou après le petit-déjeuner.", soir: "Journaling : notez votre niveau d'énergie sur 10 et ce qui l'a influencé." },
    hydration: "Infusion ortie ou pissenlit en complément",
    tip: "Limitez le café à 1 tasse. Préférez une infusion verte en milieu d'après-midi.",
  },
  {
    day: 3, week: 1,
    theme: "Légèreté & Clarté Mentale",
    intention: "Alléger le corps pour clarifier l'esprit.",
    meals: [
      { moment: "matin", items: ["Papaye ou ananas frais", "Noix du Brésil (3 max)", "Miel + curcuma", "Eau citronnée"], conseil: "Papaye et ananas contiennent des enzymes digestives naturelles." },
      { moment: "midi", items: ["Salade verte", "Avocat", "Œufs durs", "Tomates cerises", "Graines de courge"] },
      { moment: "après-midi", items: ["Pomme verte"] },
      { moment: "soir", items: ["Velouté de brocolis", "Riz basmati", "Blanc de poulet grillé aux herbes"] },
    ],
    ritual: { matin: "5 min de cohérence cardiaque (app ou YouTube).", soir: "Déconnexion des écrans 1h avant le coucher." },
    hydration: "Eau + infusion verveine le soir",
    tip: "Le brocoli est un détoxifiant hépatique puissant — à consommer au moins 3x/semaine.",
  },
  {
    day: 4, week: 1,
    theme: "Douceur & Régénération",
    intention: "Nourrir sans alourdir.",
    meals: [
      { moment: "matin", items: ["Banane", "Noix de cajou", "Miel + cannelle", "Eau citronnée"], conseil: "La banane apporte du tryptophane — précurseur de la sérotonine." },
      { moment: "midi", items: ["Taboulé de quinoa aux légumes crus", "Sardines à l'huile d'olive", "Roquette"], conseil: "Rincez le quinoa pour enlever la saponine amère." },
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
    meals: [
      { moment: "matin", items: ["Myrtilles & framboises", "Amandes grillées", "Miel de châtaignier", "Eau chaude + citron + gingembre"] },
      { moment: "midi", items: ["Salade de chou rouge râpé", "Pois chiches rôtis", "Tomates & concombre", "Huile de noix"], conseil: "Le chou rouge est riche en anthocyanes — puissants antioxydants." },
      { moment: "après-midi", items: ["Abricots frais ou secs (3)"] },
      { moment: "soir", items: ["Wok de légumes (brocolis, carottes, champignons)", "Riz thaï", "Blanc de poisson au citron"] },
    ],
    ritual: { matin: "Automassage du ventre circulaire 3 min — stimule le transit et le nerf vague.", soir: "Lecture 20 min (papier) — le cerveau se régénère hors écran." },
    hydration: "Infusion fenouil + anis étoilé — anti-ballonnements",
    tip: "Si vous ressentez une légère fatigue, c'est normal — le corps détoxifie activement.",
  },
  {
    day: 6, week: 1,
    theme: "Équilibre & Sérénité",
    intention: "Trouver le calme dans la constance.",
    meals: [
      { moment: "matin", items: ["Mangue ou melon", "Noix de macadamia", "Miel brut + pollen", "Eau citronnée"], conseil: "Le pollen est un superaliment complet — énergie, immunité, vitalité." },
      { moment: "midi", items: ["Gaspacho maison (tomates, poivrons, concombre)", "Riz complet", "Œufs pochés"] },
      { moment: "après-midi", items: ["Figues fraîches ou kakis"] },
      { moment: "soir", items: ["Velouté de courge butternut", "Quinoa soufflé", "Gambas poêlées à l'ail"], conseil: "La courge est riche en bêta-carotène — beauté de la peau et immunité." },
    ],
    ritual: { matin: "5 min de marche lente + respiration 4-4-4 (inspire 4s / retiens 4s / expire 4s).", soir: "Préparez vos repas du lendemain — l'anticipation nourrit la régularité." },
    hydration: "Eau + tranche de concombre + feuilles de menthe",
    tip: "Avant-dernier jour de la semaine 1 — faites le point : qu'est-ce qui a changé ?",
  },
  {
    day: 7, week: 1,
    theme: "Bilan & Célébration",
    intention: "Une semaine de transformé — honorer le chemin parcouru.",
    meals: [
      { moment: "matin", items: ["Smoothie détox (épinards, banane, pomme verte, gingembre, eau de coco)"], conseil: "Consommez le smoothie immédiatement après préparation pour préserver les enzymes." },
      { moment: "midi", items: ["Grande salade composée (quinoa, avocat, tomates, graines)", "Filet de truite vapeur"] },
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
    meals: [
      { moment: "matin", items: ["Œufs brouillés aux herbes", "Pain de seigle grillé", "Avocat", "Eau citronnée + curcuma"], conseil: "Les protéines au petit-déjeuner stabilisent la glycémie jusqu'à midi." },
      { moment: "midi", items: ["Salade niçoise (thon, œufs, haricots verts, olives)", "Pommes de terre vapeur"] },
      { moment: "après-midi", items: ["Poignée d'amandes + carré de chocolat noir 85%"], conseil: "Le chocolat noir > 85% est riche en magnésium — anti-stress et anti-fatigue." },
      { moment: "soir", items: ["Risotto d'épeautre aux champignons", "Escalope de veau grillée"] },
    ],
    ritual: { matin: "10 min de yoga ou stretching dynamique — réveille les fascias et la circulation.", soir: "Visualisation positive 5 min avant de dormir — programmez votre énergie du lendemain." },
    hydration: "Eau + jus de citron vert + menthe fraîche",
    tip: "Semaine 2 : on introduit plus de protéines de qualité pour soutenir l'énergie physique.",
  },
  {
    day: 9, week: 2,
    theme: "Concentration & Acuité",
    intention: "Nourrir le cerveau pour performer.",
    meals: [
      { moment: "matin", items: ["Noix (cerneaux)", "Myrtilles fraîches", "Miel de forêt", "Thé vert sencha"], conseil: "Les noix sont la nourriture du cerveau — riches en oméga-3 ALA." },
      { moment: "midi", items: ["Sardines fraîches grillées", "Tabulé de boulgour aux herbes fraîches", "Salade de roquette"] },
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
    meals: [
      { moment: "matin", items: ["Porridge d'avoine aux fruits rouges", "Graines de chia", "Miel + noix"], conseil: "L'avoine libère son énergie progressivement — idéal pour une matinée active." },
      { moment: "midi", items: ["Poulet rôti aux herbes de Provence", "Patate douce", "Haricots verts vapeur"] },
      { moment: "après-midi", items: ["Banane + amandes"] },
      { moment: "soir", items: ["Velouté de lentilles blondes", "Pain de seigle", "Fromage de chèvre frais"], conseil: "Repas doux et réconfortant — récupération musculaire et nerveux." },
    ],
    ritual: { matin: "20 min de marche rapide ou vélo — activez le métabolisme de base.", soir: "Auto-massage des jambes et pieds 10 min — drainage et récupération." },
    hydration: "Eau + électrolytes naturels (eau de coco ou bouillon)",
    tip: "Si vous faites du sport, mangez votre collation 30 min avant l'effort.",
  },
  {
    day: 11, week: 2,
    theme: "Immunité & Protection",
    intention: "Le corps sain se défend naturellement.",
    meals: [
      { moment: "matin", items: ["Jus frais (orange, carotte, gingembre, citron)", "Graines de tournesol", "Miel + propolis"], conseil: "La propolis est un antibiotique naturel — en cure 21 jours, effets puissants." },
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
    meals: [
      { moment: "matin", items: ["Avocat sur pain de seigle grillé", "Graines de lin moulues", "Jus de grenade", "Eau citronnée"], conseil: "Les graines de lin sont riches en oméga-3 et en fibres — mixez-les pour les assimiler." },
      { moment: "midi", items: ["Saumon gravlax", "Salade de fenouil & orange", "Riz sauvage"] },
      { moment: "après-midi", items: ["Gelée d'aloe vera + fruits rouges"] },
      { moment: "soir", items: ["Velouté de patate douce au gingembre", "Blanc de pintade", "Asperges vapeur"], conseil: "Les asperges sont diurétiques — favorisent l'élimination rénale." },
    ],
    ritual: { matin: "Brossage à sec du corps de bas en haut — stimule la lymphe et éclat cutané.", soir: "Application d'huile de jojoba ou d'argan sur le corps après la douche." },
    hydration: "Eau + collagène marin (ou bouillon d'os) — régénération cutanée",
    tip: "La peau reflète l'état du foie et de l'intestin. Votre teint change à partir du jour 10.",
  },
  {
    day: 13, week: 2,
    theme: "Équilibre Hormonal",
    intention: "Les hormones guident l'énergie — nourrissez-les.",
    meals: [
      { moment: "matin", items: ["Œufs au plat", "Saumon fumé", "Avocat", "Eau citronnée + ashwagandha en poudre"], conseil: "L'ashwagandha réduit le cortisol et soutient la thyroïde. Dosage : 1/2 c. à café." },
      { moment: "midi", items: ["Salade de mâche & noix", "Betterave rôtie", "Feta", "Graines de sésame"] },
      { moment: "après-midi", items: ["Chocolat noir 85% (2 carrés) + noix du Brésil (2)"] },
      { moment: "soir", items: ["Filet de cabillaud en papillote (citron, herbes)", "Riz complet", "Brocolis vapeur"] },
    ],
    ritual: { matin: "Exposition à la lumière naturelle 10 min — régule la mélatonine et le cortisol.", soir: "Tisane de sauge ou de framboisier (régulation hormonale féminine)." },
    hydration: "Infusion maca ou fenugrec — adaptogènes hormonaux",
    tip: "Les graisses saines (avocat, noix, olive) sont indispensables à la production hormonale.",
  },
  {
    day: 14, week: 2,
    theme: "Mi-Parcours — Puissance",
    intention: "14 jours. La moitié du chemin. Déjà transformé.",
    meals: [
      { moment: "matin", items: ["Bowl complet : granola maison, fruits, yaourt de coco, miel"], conseil: "Granola maison = flocons d'avoine + noix + miel + huile de coco, toasté au four." },
      { moment: "midi", items: ["Pièce de bœuf grass-fed", "Salade verte", "Pommes de terre grenaille rôties", "Sauce chimichurri"] },
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
    meals: [
      { moment: "matin", items: ["Graines germées (alfalfa, brocoli)", "Fruits secs", "Tahini + miel", "Eau citronnée"], conseil: "Les graines germées sont parmi les aliments les plus vivants — énergie concentrée." },
      { moment: "midi", items: ["Soupe de haricots blancs au romarin", "Filet de merlu", "Salade de mâche"] },
      { moment: "après-midi", items: ["Poignée de noix mélangées + dattes (2)"] },
      { moment: "soir", items: ["Gratin de légumes (courgettes, aubergines, tomates)", "Poulet fermier", "Herbes de Provence"] },
    ],
    ritual: { matin: "Ancrage par les pieds : marche pieds nus sur l'herbe ou le carrelage 5 min.", soir: "Écriture libre 10 min — ce que vous ressentez sans filtre." },
    hydration: "Eau + chlorophylle liquide — alcalinisante et énergisante",
    tip: "La semaine 3 consolide tout — maintenez la constance même si vous vous sentez mieux.",
  },
  {
    day: 16, week: 3,
    theme: "Performance Mentale",
    intention: "Un corps nourri est un esprit affûté.",
    meals: [
      { moment: "matin", items: ["Smoothie vert (épinards, avocat, pomme, spiruline, citron)"], conseil: "La spiruline est une algue complète : protéines, fer, vitamines B12." },
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
    meals: [
      { moment: "matin", items: ["Crêpes au sarrasin", "Fruits frais", "Sirop d'agave"], conseil: "Le sarrasin est sans gluten, riche en protéines complètes et en antioxydants." },
      { moment: "midi", items: ["Paëlla végétarienne (riz, poivrons, artichauts, safran)", "Crevettes"] },
      { moment: "après-midi", items: ["Tarte aux fruits frais maison (base amande)"] },
      { moment: "soir", items: ["Salade caesar légère (romaine, parmesan, croûtons seigle, anchois)", "Filet de poulet"], conseil: "Moment plaisir contrôlé — manger avec gratitude amplifie la digestion." },
    ],
    ritual: { matin: "Gratitude rituelle : 5 choses pour lesquelles vous êtes reconnaissant.", soir: "Partagez un repas en conscience — sans téléphone, avec pleine présence." },
    hydration: "Eau pétillante + rondelles de citron et concombre",
    tip: "La joie dans l'assiette est aussi une nutrition. Plaisir et santé ne s'opposent pas.",
  },
  {
    day: 18, week: 3,
    theme: "Régénération Profonde",
    intention: "Le repos est une forme d'action.",
    meals: [
      { moment: "matin", items: ["Bouillie de millet aux pommes", "Cannelle + vanille", "Lait d'amande"], conseil: "Le millet est le plus digeste des céréales — idéal les jours de fatigue." },
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
    meals: [
      { moment: "matin", items: ["Jus de légumes frais (betterave, carotte, gingembre, citron, pomme)"], conseil: "La betterave rouge augmente les performances physiques via les nitrates naturels." },
      { moment: "midi", items: ["Taboulé libanais (boulgour, persil, tomate, oignon, citron, huile d'olive)", "Brochettes d'agneau grillées"] },
      { moment: "après-midi", items: ["Grenade fraîche ou mangue"] },
      { moment: "soir", items: ["Harira légère (soupe marocaine aux légumineuses)", "Pain pita grillé"], conseil: "Le persil est l'herbe la plus riche en vitamine C et en fer biodisponible." },
    ],
    ritual: { matin: "Listez 5 habitudes acquises en 19 jours que vous souhaitez conserver.", soir: "Vision à 3 mois : comment souhaitez-vous vous sentir ?" },
    hydration: "Eau + graines de basilic (subja) — reminéralisante et rassasiante",
    tip: "Chaque repas sain est un vote pour la personne que vous devenez.",
  },
  {
    day: 20, week: 3,
    theme: "Puissance & Gratitude",
    intention: "Ressentir la force de ce qui a été construit.",
    meals: [
      { moment: "matin", items: ["Œufs bénédicte maison (pain seigle, épinards, œuf poché, sauce hollandaise légère)"], conseil: "Protéines complètes le matin = énergie stable, concentration maximale." },
      { moment: "midi", items: ["Côte de veau grillée", "Gratin dauphinois allégé", "Salade de mâche aux noix"] },
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
    meals: [
      { moment: "matin", items: ["Grand smoothie cérémoniel (banane, cacao cru, datte, lait d'amande, maca)"], conseil: "Le cacao cru est l'aliment le plus riche en magnésium et en antioxydants de la planète." },
      { moment: "midi", items: ["Repas festif sain : plateau de fruits de mer", "Salade verte à l'huile d'olive & citron", "Pain de seigle au levain"] },
      { moment: "après-midi", items: ["Fruits exotiques (fruits de la passion, litchi, papaye)"] },
      { moment: "soir", items: ["Filet mignon en croûte d'herbes", "Légumes rôtis multicolores", "Riz sauvage"], conseil: "Célébrez avec conscience — vous méritez ce repas." },
    ],
    ritual: { matin: "Méditation de 15 min — pleine présence dans ce moment d'accomplissement.", soir: "Bilan complet : corps, énergie, clarté mentale, émotions. Partagez avec votre coach." },
    hydration: "Champagne… ou eau pétillante avec fleurs comestibles 🌸",
    tip: "21 jours accomplis. Ce n'est pas une fin — c'est une fondation. Continuez.",
  },
]

export const PROGRAM: DayProgram[] = [...WEEK1, ...WEEK2, ...WEEK3]

export const WEEK_THEMES: Record<1 | 2 | 3, { title: string; color: string; desc: string }> = {
  1: { title: "Détox & Purification", color: "#2de4a4", desc: "Nettoyer le corps, libérer les toxines, retrouver la légèreté." },
  2: { title: "Énergie & Vitalité", color: "#38c4e8", desc: "Nourrir l'énergie, soutenir le cerveau, performer." },
  3: { title: "Ancrage & Performance", color: "#818cf8", desc: "Consolider les acquis, ancrer les nouvelles habitudes." },
}

// ─── CALCULS PROFIL ────────────────────────────────────────────────────────────
export function calcIMC(poids: number, taille: number): number {
  return Math.round((poids / Math.pow(taille / 100, 2)) * 10) / 10
}

export function imcLabel(imc: number): { label: string; color: string } {
  if (imc < 18.5) return { label: "Insuffisance pondérale", color: "#f59e0b" }
  if (imc < 25)   return { label: "Poids santé", color: "#2de4a4" }
  if (imc < 30)   return { label: "Surpoids", color: "#f97316" }
  return              { label: "Obésité", color: "#ef4444" }
}

export function calcBesoinsBase(p: UserProfile): number {
  // Mifflin-St Jeor
  if (p.genre === "homme") return Math.round(10 * p.poids + 6.25 * p.taille - 5 * p.age + 5)
  return Math.round(10 * p.poids + 6.25 * p.taille - 5 * p.age - 161)
}

export function portionMultiplier(p: UserProfile): number {
  const base = p.genre === "homme" ? 75 : 60
  return Math.round((p.poids / base) * 10) / 10
}
