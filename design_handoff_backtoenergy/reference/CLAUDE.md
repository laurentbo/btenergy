# backtoenergy — direction visuelle figée

App web mobile-first pour un programme alimentaire de 21 jours (méthode Verissimo : aliments vivants, jus, naturopathie). Un **compagnon de rituel chaleureux** qu'on ouvre chaque jour — pas un tracker clinique.

## Principes
- Le plaisir et la sensation avant la donnée.
- Minimalisme : l'essentiel devant, la profondeur en option.
- Pédagogie en deux couches : **cuisiner** / **comprendre**.
- Honnêteté et non-privation.

## Ton d'écriture (partout)
Comme à un ami : tutoiement, chaleureux, direct, zéro jargon. Le mot « cure » est banni partout côté utilisateur (UI, emails) — dire « programme » ou « tes 21 jours ». **Jamais** donneur de leçon ni mièvre/neuneu. Tutoiement partout (UI **et** emails) — jamais de vouvoiement.

## Règles produit verrouillées (décisions, pas esthétique)
- **Zéro chiffre visible côté utilisateur.** Pas de calories, macros, scores, poids affiché. Plaisir et sensation avant la donnée. L'amincissement peut être évoqué comme **bénéfice/horizon** sur un ton léger (décision client) — mais **jamais** de chiffres, de résultat chiffré « garanti » ni de langage culpabilisant.
- **Repas : 3 par jour** — Petit-déjeuner, Déjeuner, Dîner — **+ une note d'encas optionnel (`snack_note`)**. Pas de modèle 5 repas.
- **MoodPicker : 4 niveaux QUALITATIFS** — *Vaseux / Ça va / Léger / Plein d'énergie*. Stockés 1–4 en interne mais **jamais affichés en chiffres**. **Saisi une fois par jour** (pas par repas). Aucun slider chiffré.
- **Onglet Coach : 100 % humain** (Laurent répond personnellement). Pas de bot ni chatbot.
- **Café autorisé dès J1** et tout le programme (cadrage non-déprivation).

## Règles alimentaires (méthode Verissimo) — à respecter dans tous les repas/recettes
- **Pas** de protéine animale + féculent dans le même repas.
- **Pas** de double protéine animale dans un repas.
- **Pas** de laitages de vache.
- **Pas** de blé / gluten, ni de sucre raffiné.
- Les **fruits toujours seuls** (jamais en fin de repas / en dessert).
Présenter ces règles sans moraliser : c'est un cadre bienveillant, pas une liste d'interdits.

## Direction retenue : « Édito tonique » (papier sable) + Baloo 2
Base **papier sable doré**, esprit éditorial chaleureux (carnet de cuisine, pas une app médicale). Encre presque noire, titres ronds Baloo 2, labels uppercase Space Grotesk, accents profonds (vert feuille, terracotta, ambre pop) qui **portent du blanc en aplat** et restent lisibles en texte sur sable. Photos de plats pleine largeur en haut des cartes. Évite : médical froid, SaaS corporate, néon criard, gris neutre sans âme.

### Couleurs (app utilisateur — Édito tonique)
| Rôle | Hex |
|---|---|
| Châssis (hors carte mobile) | `#1C160C` |
| Fond (base app) | `#EFE6CF` |
| Surface / cartes (papier crème) | `#FBF6EA` |
| Bordures / lignes | `#E2D4B5` |
| Encre (texte principal) | `#1E1B14` |
| Texte doux | `#857A61` |
| Vert feuille (CTA secondaires, encarts sensation, puces) | `#4E7A3C` _(texte blanc en aplat)_ |
| Terracotta (CTA « Cuisiner », onglet actif, échanges) | `#E8622A` _(texte blanc en aplat)_ |
| Ambre pop (encarts « ce qui peut arriver », badge créneau) | `#F2B431` _(texte encre)_ |
| Encre ambre (texte/icône sur encart ambre) | `#A9742A` |
| Encre terracotta (notes protéines) | `#C2552A` |

_Teintes dérivées via `rgba(hex, a)` : fond d'icône `rgba(accent, 0.14–0.22)`, encart vert `rgba(#4E7A3C, 0.10)` bordure `0.30–0.40`, encart ambre `rgba(#F2B431, 0.14)` bordure `0.50`. Le fond est **tweakable** (10 palettes « Ambiance » dans le proto) — la palette par défaut ci-dessus est la référence._

### Thèmes par semaine (accents profonds)
Chaque semaine porte un accent qui colore les éléments de **progression/contexte** (badge « JOUR X / 21 », anneau de progression, sélecteur de jour, nœuds d'arc Méthode) — **pas** les surfaces ni les CTA. Sur ces accents, le texte est **blanc**.
| Semaine | Thème | Accent |
|---|---|---|
| 1 — Détox & Purification | vert feuille | `#4E7A3C` |
| 2 — Énergie & Vitalité | ambre doré | `#E2A21E` |
| 3 — Ancrage & Performance | terracotta | `#C2552A` |

Types de protéine (Recettes) : jus `#4E7A3C` · poisson `#2F7E90` · viande maigre `#C2552A` · végé `#6E8F28`.

### Typographie
- **Titres :** Baloo 2 (rond, charpenté, chaleureux). Poids 600/700. `letter-spacing: -0.01em`.
- **Labels / eyebrows / boutons :** Space Grotesk 700, uppercase, `letter-spacing: 0.06–0.14em`.
- **Texte :** Hanken Grotesk. Poids 400/500/600/700.
- Google Fonts : `Baloo+2:wght@500;600;700` + `Space+Grotesk:wght@400;500;700` + `Hanken+Grotesk:wght@400;500;600;700;800`.

### Formes & matière
- Coins arrondis : cartes `16–18px`, conteneurs internes/encarts `12–16px`, boutons **pill** (`999px`), bottom-sheets `26px 26px 0 0`.
- Bordures visibles `1.5px` sur les cartes (esprit papier), aplats nets, peu d'ombres (réservées aux CTA et bulles).

### Imagerie
Grandes **photos macro** de plats (jus, vapeur, gouttes, texture), **pleine largeur en haut des cartes**. Filtre léger `saturate(1.05) brightness(1.02)`.

### Icônes
Linéaires arrondies, trait `1.7` (actif `2.1`), `stroke-linecap/linejoin: round`.

### Navigation
Barre basse, **5 onglets** : Jour · Courses · Recettes · Méthode · Coach. Onglet actif en **terracotta `#E8622A`**, inactifs en texte doux.

## Cockpit admin coach (thème SOMBRE — ne pas mélanger)
Le backoffice coach est un périmètre séparé, en thème sombre, isolé via le namespace `.theme-coach` : fond `#0f1117`, lime `#dce03d`, menthe `#62ce9d`, cyan `#26c5ce`. **Ne jamais** appliquer le thème clair « Plein jour » au cockpit, ni le thème sombre à l'app utilisateur. Hors périmètre des 5 écrans utilisateur ; n'y toucher que sur demande explicite.

## Architecture cible (ne pas réécrire)
- Stack : Next.js App Router + TypeScript + Tailwind + Supabase + Vercel.
- L'écran **Jour** (utilisateur) lit depuis `data/verissimo.ts` (statique).
- Le **backoffice coach** écrit dans Supabase `meal_plans`.
- **Ces deux sources ne sont pas encore unifiées — c'est intentionnel. Ne pas les fusionner.**

## Méthode de travail
- **Scope écran par écran** : on retouche l'écran nommé, pas l'app entière.
- Quand un écran est validé → préparer le **bundle de handoff pour Claude Code** (lui intègre dans le repo `btenergy`).

### Directions écartées (en repère)
- « Nuit verte » (cosy) — fond vert nuit `#14271B`, accents lumineux. **Écartée** au profit d'Édito tonique ; sources archivées dans `_archive_nuitverte/`.
- « Plein jour » — base claire et lumineuse (matin de marché), fond `#FBFCF7`, encre verte `#1E2A22` ; sources archivées dans `_archive_pleinjour/`.
- « Table d'amis » — papier crème éditorial.

## Fichiers
- `Directions visuelles.html` — exploration des planches de style.
- `Email quotidien — planche.html` (`email-quotidien-planche.jsx`) — planche du mail quotidien du matin : variation A retenue + états pilotés par le back-office (défaut / sans photo / personnalisé) ; variation B écartée en bas. Envoi prévu vers 6h, aucune heure affichée dans le mail.
- `Email quotidien.html` — template HTML email intégrable du mail quotidien (J1 en exemple, variables et blocs conditionnels en tête de fichier).
- `Écran du jour — directions.html` — l'écran du Jour décliné en 3 directions.
- `style-tiles.jsx`, `day-screen.jsx` — sources des explorations.
- `design_handoff_backtoenergy/` — bundle de handoff pour Claude Code (README + références à jour).

## Les écrans (prototype, mobile-first, nav reliée)
- `J0.html` (`j0-screen.jsx`) — parcours d'entrée la veille du programme (mail → connexion → page Jour 0), layout mobile **et** desktop (breakpoint 880px).
- `Aujourd'hui.html` (`jour-screen.jsx` + `jour-data.jsx`) — onglet **Jour** : en-tête J/21 + anneau, sélecteur de jour J1–J21, note du jour (passages types), bandeau frais (J4/J11/J18), 3 repas en accordéon (sensation → ingrédients → échanges → Cuisiner + « pourquoi »), note d'encas, MoodPicker en fin de page.
- `Courses.html` (`courses-screen.jsx`) — liste par rayon, toggle Pour 1/Pour 2, **rien à cocher** (pense-bête), rythme 2 temps, ligne café, note bio.
- `Recettes.html` (`recipes-screen.jsx`) — carnet 21 jours, recherche + filtres par type de protéine, détail recette (sans bloc sensation/humeur).
- `Méthode.html` (`methode-screen.jsx`) — arc 3 semaines, notion du jour (lecture 2 min), 4 piliers, « ce qu'on met de côté ».
- `Coach.html` (`coach-screen.jsx`) — chat humain avec Laurent (« écris-moi, je te réponds rapidement »), pas de bot.
