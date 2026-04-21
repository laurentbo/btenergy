export type Meal = {
  moment: "matin" | "midi" | "après-midi" | "soir"
  items: string[]
  conseil?: string
}

export type DayProgram = {
  day: number
  theme: string
  intention: string
  meals: Meal[]
  ritual: { matin: string; soir: string }
  hydration: string
  tip: string
}

export const PROGRAM: DayProgram[] = [
  {
    day: 1,
    theme: "Éveil & Purification",
    intention: "Nettoyer, alléger, recommencer.",
    meals: [
      {
        moment: "matin",
        items: ["Fruits de saison", "Oléagineux (amandes, noix)", "Miel brut", "Eau citronnée tiède"],
        conseil: "Commencez par l'eau citronnée à jeun — 15 min avant de manger.",
      },
      {
        moment: "midi",
        items: ["Crudités variées", "Pommes de terre vapeur", "Œufs mollets", "Café"],
        conseil: "Mastiquez lentement. Le calme digestif commence par la lenteur.",
      },
      {
        moment: "après-midi",
        items: ["Un fruit (pomme, poire ou agrume)"],
        conseil: "Attendez 30 min après votre café.",
      },
      {
        moment: "soir",
        items: ["Crudités en salade", "Volaille grillée", "Riz complet", "Courgettes vapeur"],
        conseil: "Dîner léger, avant 20h si possible.",
      },
    ],
    ritual: {
      matin: "3 grandes respirations dès le réveil. Buvez votre eau citronnée en pleine conscience.",
      soir: "5 min d'étirements doux. Notez 1 chose positive de la journée.",
    },
    hydration: "1,5 à 2L d'eau pure tout au long de la journée",
    tip: "Évitez les sucres raffinés et les produits transformés aujourd'hui.",
  },
  {
    day: 2,
    theme: "Ancrage & Énergie Durable",
    intention: "Construire un socle solide pour la journée.",
    meals: [
      {
        moment: "matin",
        items: ["Fruits rouges", "Amandes & noisettes", "Miel de fleurs", "Eau citronnée + gingembre"],
        conseil: "Ajoutez une tranche de gingembre frais dans votre eau.",
      },
      {
        moment: "midi",
        items: ["Carottes râpées", "Betterave crue", "Lentilles tièdes", "Huile d'olive & citron"],
        conseil: "Les légumineuses nourrissent le microbiote — à intégrer régulièrement.",
      },
      {
        moment: "après-midi",
        items: ["Kiwi ou orange"],
      },
      {
        moment: "soir",
        items: ["Soupe de légumes maison", "Quinoa", "Saumon vapeur ou sardines"],
        conseil: "Les oméga-3 du poisson gras soutiennent le cerveau et l'énergie.",
      },
    ],
    ritual: {
      matin: "Marche de 10 min à l'air libre avant ou après le petit-déjeuner.",
      soir: "Journaling : notez votre niveau d'énergie sur 10 et ce qui l'a influencé.",
    },
    hydration: "Infusion ortie ou pissenlit en complément",
    tip: "Limitez le café à 1 tasse. Préférez une infusion verte en milieu d'après-midi.",
  },
  {
    day: 3,
    theme: "Légèreté & Clarté Mentale",
    intention: "Alléger le corps pour clarifier l'esprit.",
    meals: [
      {
        moment: "matin",
        items: ["Papaye ou ananas frais", "Noix du Brésil (3 max)", "Miel + curcuma", "Eau citronnée"],
        conseil: "Papaye et ananas contiennent des enzymes digestives naturelles.",
      },
      {
        moment: "midi",
        items: ["Salade verte", "Avocat", "Œufs durs", "Tomates cerises", "Graines de courge"],
      },
      {
        moment: "après-midi",
        items: ["Pomme verte"],
      },
      {
        moment: "soir",
        items: ["Velouté de brocolis", "Riz basmati", "Blanc de poulet grillé aux herbes"],
      },
    ],
    ritual: {
      matin: "5 min de cohérence cardiaque (app ou YouTube).",
      soir: "Déconnexion des écrans 1h avant le coucher.",
    },
    hydration: "Eau + infusion verveine le soir",
    tip: "Le brocoli est un détoxifiant hépatique puissant — en manger au moins 3x/semaine.",
  },
]

export const getMealIcon = (moment: Meal["moment"]) => {
  const icons: Record<Meal["moment"], string> = {
    matin: "🌅",
    midi: "☀️",
    "après-midi": "🍃",
    soir: "🌙",
  }
  return icons[moment]
}
