export const CADRES = {
  cure_s1: {
    label: "Semaine 1 · Détox & Purification",
    jus: [
      {
        moment: "Matin · Jus 1", icon: "🌅",
        famille: "Jus de fruits frais",
        note: "Base pomme obligatoire — elle stabilise la glycémie",
        exemples: ["Pomme","Poire","Kiwi","Fraise","Mangue","Citron","Ananas"],
        conseil: "1 fruit base + 1–2 fruits de saison au choix",
      },
      {
        moment: "Midi · Jus 2 · Fixe", icon: "☀️",
        famille: "Jus Very Green",
        note: "Ce jus ne change pas — chlorophylle quotidienne essentielle",
        exemples: ["Pommes","Ananas","Green Magma (1 c. à café)"],
        conseil: "Toujours le même, tous les jours de cure",
      },
      {
        moment: "16h · Jus 3", icon: "🍃",
        famille: "Jus de fruits doux",
        note: "Plus léger que le matin — fruits à faible acidité",
        exemples: ["Pomme + Poire","Pomme + Kaki","Pomme + Fraises","Pomme + Abricots"],
        conseil: "30 min minimum avant le repas du soir",
      },
    ],
    jus_raisin: "Jus de raisin dilué — 33 cl pour 1 L d'eau, environ 2 L/jour. Effet coupe-faim et drainant. S'arrêter 30 min avant le dîner.",
    diner: {
      entree: {
        famille: "Légumes crus de saison",
        note: "Toujours commencer par du cru — les enzymes vivantes préparent la digestion",
        exemples: ["Carotte râpée","Fenouil émincé","Concombre","Chou rouge","Champignons","Avocat","Radis noir","Navet râpé"],
        assaisonnement: "Huile d'olive · tamari · citron · coriandre ou gomasio · graines (courge, tournesol...)",
      },
      plat: {
        famille: "Céréale sans gluten + légumes cuits",
        note: "Une céréale + des légumes poêlés à l'huile d'olive",
        cereales: ["Riz thaï","Quinoa","Pâtes de riz","Millet"],
        legumes: ["Courgette","Poireaux","Brocoli","Carottes","Champignons","Épinards"],
        cuisson: "Poêler · curry doux · glaçage tamari · ciboulette/coriandre",
      },
      dessert: {
        famille: "Fruits ou compote maison",
        note: "Toujours 90 min après le repas",
        exemples: ["Compote pomme","Compote poire","Compote abricot","Salade de fruits","Mangue fraîche","Ananas"],
      },
    },
  },
  cure_s2: {
    label: "Semaine 2 · Énergie & Vitalité",
    jus: [
      {
        moment: "Matin · Jus 1", icon: "🌅",
        famille: "Jus fruits + légumes racines",
        note: "On ajoute les légumes racines — plus détoxifiant en profondeur",
        exemples: ["Pomme + Carotte","Pomme + Betterave","Pomme + Gingembre","Ananas + Poire","Pomme + Citron + Betterave"],
        conseil: "Pomme toujours en base — elle adoucit les légumes forts",
      },
      {
        moment: "Midi · Jus 2 · Fixe", icon: "☀️",
        famille: "Jus Very Green",
        note: "Identique à la semaine 1 — incontournable",
        exemples: ["Pommes","Ananas","Green Magma (1 c. à café)"],
        conseil: "Toujours le même, tous les jours de cure",
      },
      {
        moment: "16h · Jus 3", icon: "🍃",
        famille: "Jus fruité léger",
        note: "Fruits doux ou légèrement acidulés",
        exemples: ["Pomme + Kaki","Pomme + Framboises","Pomme + Poire + Citron","Pomme + Abricots"],
        conseil: "30 min minimum avant le repas du soir",
      },
    ],
    jus_raisin: "Jus de raisin dilué — 33 cl pour 1 L d'eau, environ 2 L/jour. Toujours en cours de journée, arrêter 30 min avant le dîner.",
    diner: {
      entree: {
        famille: "Crudités + avocat ou graines germées",
        note: "Plus de texture et de nutriments qu'en semaine 1",
        exemples: ["Carotte + Concombre + Chou rouge","Mesclun + Roquette + Avocat","Betterave + Champignons","Asperges poêlées","Émincé de navet + carottes"],
        assaisonnement: "Vinaigrette tamari · huile d'olive · citron · graines germées · gomasio",
      },
      plat: {
        famille: "Légumineuses ou légumes racines",
        note: "On passe des céréales aux légumineuses — plus de fibres, microbiote renforcé",
        legumineuses: ["Lentilles","Pois chiches","Haricots blancs","Pois cassés"],
        legumes_racines: ["Patates douces","Pommes de terre","Carottes","Panais","Artichaut"],
        cuisson: "Cuire à la vapeur ou poêler · curry · cumin · tamari · coriandre",
      },
      dessert: {
        famille: "Fruits ou compote maison",
        note: "Toujours 90 min après le repas",
        exemples: ["Compote pêche-abricot","Ananas frais","Salade de fruits","Compote pomme","Mangue"],
      },
    },
  },
  off: {
    label: "Journée libre",
    familles: [
      { icon: "🥦", label: "Légumes", exemples: ["Tous les légumes cuits ou crus","Salades","Soupes","Poêlées"] },
      { icon: "🫘", label: "Légumineuses", exemples: ["Lentilles","Pois chiches","Haricots","Fèves"] },
      { icon: "🌰", label: "Oléagineux", exemples: ["Noix","Noisettes","Amandes","Graines de courge"] },
      { icon: "🍎", label: "Fruits", exemples: ["Tous les fruits frais","À consommer seuls ou entre les repas"] },
    ],
    note: "Reste dans l'esprit de la cure — ton corps continue d'éliminer même le week-end.",
  },
  reprise: [
    {
      jours: [15], titre: "Journée fruits",
      familles: [
        { icon: "🍎", label: "Fruits mûrs et juteux", exemples: ["Pomme","Mangue","Pruneaux","Poire","Raisin","Pêche"], note: "À volonté, toute la journée, selon ta faim" },
      ],
      note: "Une seule famille aujourd'hui. Ton système digestif redémarre doucement.",
    },
    {
      jours: [16], titre: "Journée jus de pomme",
      familles: [
        { icon: "🍏", label: "Jus de pomme bio non filtré", exemples: ["Jus de pomme pur, non sucré, non filtré"], note: "À volonté toute la journée" },
        { icon: "🍶", label: "Compote maison · soir seulement", exemples: ["Compote de pommes","Compote de poires","Compote abricot-pêche"], note: "Un seul repas solide, le soir" },
      ],
      note: "L'acidité naturelle de la pomme reconstitue la flore intestinale.",
    },
    {
      jours: [17, 18], titre: "Crudités et oléagineux",
      familles: [
        { icon: "🌅", label: "Matin", exemples: ["Banane écrasée","Citron pressé","Fruits secs (figues, abricots)","Oléagineux (noisettes, amandes)"], note: "Nourrissant, tient plusieurs heures — mâche bien" },
        { icon: "🥗", label: "Midi & soir · Crudités à volonté", exemples: ["Concombre","Tomates","Carotte","Chou rouge","Roquette","Avocat","Graines de courge"], note: "Vinaigrette : huile d'olive + vinaigre de cidre + tamari" },
      ],
      note: "Les enzymes des aliments crus régénèrent la muqueuse intestinale.",
    },
    {
      jours: [19, 20, 21], titre: "Réintroduction des protéines",
      familles: [
        { icon: "🥗", label: "Base · crudités en entrée", exemples: ["Toutes crudités de saison","Vinaigrette simple","Avocat"], note: "Le cru avant le cuit — toujours" },
        { icon: "🐟", label: "Protéines animales crues ou végétales", exemples: ["Saumon cru","Carpaccio","Tartare","Tofu","Seitan","Algues","Graines germées"], note: "Au déjeuner ou au dîner — pas les deux" },
        { icon: "⚠️", label: "Règle de dissociation", exemples: ["Protéines animales SANS céréales","Protéines animales SANS féculents"], note: "Jamais de riz ou pâtes dans le même repas que la protéine animale" },
      ],
      note: "Commence par de petites portions.",
    },
  ],
} as const

export const PROGRAM = [
  { jour:1,  s:1, phase:"Détox & Purification",  type:"cure_s1" as const, titre:"Premier pas",             objectif:"Lancer la détoxification, repos digestif complet",           conseil:"Au réveil, un grand verre d'eau tiède avant tout. Ton foie a travaillé toute la nuit — il a besoin d'être hydraté avant même le premier jus.", ressenti:"Légère fatigue ou petits maux de tête possibles. C'est ton corps qui commence à éliminer — c'est un bon signe, pas un problème." },
  { jour:2,  s:1, phase:"Détox & Purification",  type:"cure_s1" as const, titre:"Le silence intérieur",    objectif:"Approfondir le repos digestif, observer les premiers signaux",  conseil:"Si tu ressens une fringale, bois d'abord un verre de jus de raisin dilué. Neuf fois sur dix, c'est de la soif. Ton corps apprend à distinguer les deux.", ressenti:"Les fringales peuvent être plus fortes aujourd'hui. C'est normal — ton corps cherche ses repères. Ça passe." },
  { jour:3,  s:1, phase:"Détox & Purification",  type:"cure_s1" as const, titre:"La clarté commence",      objectif:"Stabiliser le rythme, écouter les premiers changements d'énergie", conseil:"Prends 5 minutes pour noter comment est ton énergie par rapport à hier. Pas de pression — juste observer.", ressenti:"Beaucoup de personnes notent un léger mieux à partir du jour 3. D'autres ressentent encore de la fatigue. Les deux sont normaux." },
  { jour:4,  s:1, phase:"Détox & Purification",  type:"cure_s1" as const, titre:"L'ancrage alcalin",       objectif:"Renforcer l'équilibre acido-basique, alimenter les éliminations", conseil:"Ce soir, si tu choisis des légumineuses, mange doucement et mâche bien — elles demandent une digestion active.", ressenti:"Ton système digestif est plus au calme. Tu peux remarquer ton ventre plus léger, moins ballonné." },
  { jour:5,  s:1, phase:"Détox & Purification",  type:"cure_s1" as const, titre:"Fin de semaine",          objectif:"Clôturer la première semaine, préparer le week-end",            conseil:"Ce soir, prends un moment pour noter 3 choses que tu as observées dans ton corps depuis lundi. Cette semaine compte déjà.", ressenti:"La fierté d'avoir tenu 5 jours est normale. Le week-end off est fait pour te ressourcer." },
  { jour:6,  s:1, phase:"Détox & Purification",  type:"off"     as const, titre:"Week-end vivant",         objectif:"Laisser le corps souffler, maintenir une alimentation alcaline libre", conseil:"Mange selon ta faim, avec des aliments proches de la cure. Profite-en pour cuisiner quelque chose que tu aimes.", ressenti:"Le corps continue d'éliminer même le week-end. Écoute tes signaux." },
  { jour:7,  s:1, phase:"Détox & Purification",  type:"off"     as const, titre:"Dernier souffle",         objectif:"Préparer mentalement et physiquement la deuxième semaine",     conseil:"Ce soir, prépare tes jus du lendemain si possible. La semaine 2 sera plus facile — ton corps connaît déjà le rythme.", ressenti:"Beaucoup de personnes notent une amélioration nette après le premier week-end." },
  { jour:8,  s:2, phase:"Énergie & Vitalité",    type:"cure_s2" as const, titre:"Le second souffle",       objectif:"Approfondir la détox, bénéficier des acquis de la semaine 1",  conseil:"Tu recommences les jus, mais ton corps y réagit mieux. Tu remarqueras qu'ils te tiennent plus longtemps.", ressenti:"La deuxième semaine est souvent plus facile. L'énergie est plus stable, les fringales moins présentes." },
  { jour:9,  s:2, phase:"Énergie & Vitalité",    type:"cure_s2" as const, titre:"L'élan retrouvé",         objectif:"Stabiliser l'énergie, ressentir les premiers bénéfices profonds", conseil:"Si tu choisis des asperges ou des légumes racines ce soir — ils ont des vertus drainantes naturelles.", ressenti:"Beaucoup de personnes commencent à dormir mieux vers le jour 9." },
  { jour:10, s:2, phase:"Énergie & Vitalité",    type:"cure_s2" as const, titre:"Mi-parcours",             objectif:"Célébrer les 10 premiers jours, consolider les habitudes",     conseil:"10 jours. Ton foie a éliminé, ton intestin s'est reposé, ton sang s'est allégé. Tu ne vois pas encore tout — mais ça s'est passé.", ressenti:"Le cap des 10 jours est souvent un tournant. L'énergie peut faire un bond." },
  { jour:11, s:2, phase:"Énergie & Vitalité",    type:"cure_s2" as const, titre:"L'énergie profonde",      objectif:"Entrer dans la phase de performance cellulaire",               conseil:"Si tu choisis des artichauts — ils soutiennent directement ton foie. L'un des aliments les plus bénéfiques de la cure.", ressenti:"Certains ressentent une légèreté presque inhabituelle. D'autres ont encore des hauts et des bas. Les deux sont normaux." },
  { jour:12, s:2, phase:"Énergie & Vitalité",    type:"cure_s2" as const, titre:"La ligne d'arrivée",      objectif:"Clôturer la phase de cure, préparer la transition",            conseil:"Ce soir, mange consciemment, lentement. C'est le dernier repas de la cure intensive — savoure-le.", ressenti:"La fierté d'avoir tenu les 12 jours est légitime." },
  { jour:13, s:2, phase:"Énergie & Vitalité",    type:"off"     as const, titre:"Transition en douceur",   objectif:"Réintroduire progressivement des repas solides",               conseil:"Après 12 jours de jus et repas légers, ton système digestif est sensible. Mange doucement, mâche bien.", ressenti:"Certains ressentent de la fatigue, d'autres une euphorie. Les deux sont normaux." },
  { jour:14, s:2, phase:"Énergie & Vitalité",    type:"off"     as const, titre:"Consolider avant la reprise", objectif:"Stabiliser les acquis avant la phase d'ancrage",          conseil:"C'est le bon moment pour noter ce qui a changé dans ton corps, ton énergie, ton sommeil.", ressenti:"Le corps cherche ses nouveaux repères." },
  { jour:15, s:3, phase:"Ancrage & Performance", type:"reprise" as const, reprise_idx:0, titre:"Renaissance",          objectif:"Démarrer le protocole de reprise, réveiller le système digestif", conseil:"Aujourd'hui uniquement des fruits mûrs. Mange quand tu as faim, sans te forcer.", ressenti:"Une journée fruits peut sembler légère. C'est voulu." },
  { jour:16, s:3, phase:"Ancrage & Performance", type:"reprise" as const, reprise_idx:1, titre:"Le jeûne doux",         objectif:"Régénérer la flore intestinale, nettoyer les dernières toxines", conseil:"L'acidité naturelle de la pomme crée un environnement favorable aux bonnes bactéries.", ressenti:"Tu peux ressentir un pic de clarté mentale." },
  { jour:17, s:3, phase:"Ancrage & Performance", type:"reprise" as const, reprise_idx:2, titre:"Les bons fondamentaux", objectif:"Réintroduire le cru, reconnecter avec les enzymes vivantes",    conseil:"Le petit-déjeuner banane-oléagineux tient plusieurs heures. Mâche bien.", ressenti:"Ton intestin reprend son rythme progressivement." },
  { jour:18, s:3, phase:"Ancrage & Performance", type:"reprise" as const, reprise_idx:2, titre:"L'enzyme vivante",      objectif:"Consolider la réalimentation crue, préparer la réintroduction", conseil:"Deux jours de crudités consécutifs. Les enzymes des aliments crus régénèrent ta muqueuse intestinale.", ressenti:"Certains ressentent une envie de 'manger normalement'. C'est le moment de rester conscient." },
  { jour:19, s:3, phase:"Ancrage & Performance", type:"reprise" as const, reprise_idx:3, titre:"Le retour des protéines", objectif:"Réintroduire les protéines en respectant la dissociation",    conseil:"Commence par une petite portion. Pas de céréales au même repas que la protéine animale.", ressenti:"Commence doucement — ton système digestif n'est plus habitué." },
  { jour:20, s:3, phase:"Ancrage & Performance", type:"reprise" as const, reprise_idx:3, titre:"L'équilibre durable",    objectif:"Ancrer les nouvelles habitudes, continuer la réintégration",   conseil:"Ce n'est pas la fin d'un régime — c'est le début d'une nouvelle façon de manger.", ressenti:"Une légèreté inattendue. C'est ce que ressent souvent le corps après une cure réussie." },
  { jour:21, s:3, phase:"Ancrage & Performance", type:"reprise" as const, reprise_idx:3, titre:"Le nouveau départ",      objectif:"Clôturer le parcours, intégrer les 7 principes pour la vie",   conseil:"Les vrais résultats se construisent dans les semaines qui suivent. Garde les 7 principes comme boussole.", ressenti:"La fierté d'être arrivé jusqu'ici est méritée. Tu as les outils." },
]

export type JourData = typeof PROGRAM[number]
