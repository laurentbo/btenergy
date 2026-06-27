# Handoff — backtoenergy

Application web **mobile-first** pour un programme alimentaire de 21 jours (méthode Verissimo : aliments vivants, jus, naturopathie). L'app est un **compagnon de rituel chaleureux** qu'on ouvre chaque jour — pas un tracker clinique. Le plaisir et la sensation passent avant la donnée.

---

## 1. À propos des fichiers de ce bundle

Les fichiers du dossier `reference/` sont des **références de design réalisées en HTML/JSX** : des prototypes qui montrent l'allure et le comportement voulus, **pas du code de production à copier tel quel**.

Chaque écran est un fichier `.html` minimal (polices Google + montage React) qui charge un fichier `.jsx` transpilé par Babel **dans le navigateur**. C'est parfait pour prototyper, mais **inadapté à la production**. La tâche consiste à **recréer ces écrans dans le vrai environnement** :

- **Stack cible** : Next.js App Router + TypeScript + Tailwind + Supabase + Vercel (repo `btenergy`). Suivre les conventions du codebase existant (tokens, composants, routing) plutôt que de reproduire les styles inline.
- Remplacer `image-slot.js` (placeholder drag-and-drop) et `tweaks-panel.jsx` (panneau de réglages du proto) par de vrais composants — ce sont des outils de prototypage uniquement. Le tweak « Ambiance du fond » (10 palettes) est un outil d'exploration : **en production, une seule palette, celle des tokens §7**.
- Remplacer le state local + `localStorage` par un vrai state management + API/backend.
- L'écran **Jour** lit aujourd'hui depuis `data/verissimo.ts` (statique) ; le **backoffice coach** écrit dans Supabase `meal_plans`. **Ces deux sources ne sont pas encore unifiées — c'est intentionnel, ne pas les fusionner.**
- ⚠️ **Les menus vont encore être retravaillés** : prévoir côté backoffice coach la **modification des menus** (repas du programme) sans redéploiement — voir `CLAUDE.md`.

## 2. Fidélité

**Haute fidélité (hi-fi).** Couleurs, typographie, espacements, rayons, ombres et interactions sont définitifs. Recréer l'UI au pixel près. Les valeurs exactes sont en §7 (Design tokens). Quand une mesure manque ici, la lire directement dans le `.jsx` correspondant.

---

## 3. Principes produit (à garder en tête en codant)

- **La sensation avant la donnée.** Zéro chiffre visible côté utilisateur : pas de calories, macros, scores, poids. L'amincissement peut être évoqué comme bénéfice sur un ton léger — jamais de chiffres ni de langage culpabilisant.
- **Minimalisme** : l'essentiel devant, la profondeur en option (accordéons, bottom-sheets « Pourquoi »).
- **Pédagogie en deux couches** : *cuisiner* (le geste) / *comprendre* (le pourquoi).
- **Honnêteté et non-privation** : jamais de liste d'interdits moralisatrice. Le café reste autorisé dès J1. Pas d'injonctions d'horaires — préférer « si tu peux… ».
- **Ton d'écriture, partout** : comme à un ami — tutoiement, chaleureux, direct, zéro jargon. Jamais donneur de leçon ni mièvre. **Respecter le wording exact des prototypes.**
- **Humeur : une fois par jour** (pas par repas), 4 niveaux qualitatifs — *Vaseux / Ça va / Léger / Plein d'énergie*. Stockés 1–4 en interne, **jamais affichés en chiffres**. L'horodatage de la saisie est transmis au coach (côté backend).
- **Repas : 3 par jour** (Petit-déjeuner, Déjeuner, Dîner) + une note d'encas optionnelle (`snack_note`). Pas de modèle 5 repas.
- **Coach : 100 % humain** (Laurent répond personnellement). Pas de bot, pas de faux typing, pas de réponse auto. La promesse affichée : « écris-moi, je te réponds rapidement ».

### Règles alimentaires (méthode Verissimo) — logique métier à encoder
- **Pas** de protéine animale + féculent dans le même repas.
- **Pas** de double protéine animale dans un repas.
- **Pas** de laitages de vache.
- **Pas** de blé / gluten, ni de sucre raffiné.
- Les **fruits toujours seuls** (jamais en fin de repas / dessert).

Présenter ces règles **sans moraliser**. Le bloc « Pourquoi cette association ? » de chaque repas explique la règle appliquée à ce plat.

---

## 4. Direction visuelle : « Édito tonique » (papier sable)

Base **papier sable doré**, esprit éditorial chaleureux — un carnet de cuisine, pas une app médicale. Encre presque noire, titres ronds **Baloo 2**, labels uppercase **Space Grotesk**, corps **Hanken Grotesk**. Les accents sont **profonds** (vert feuille, terracotta, ambre pop) : ils portent du **blanc en aplat** et restent lisibles en texte sur sable. Cartes papier crème à bordure visible (`1.5px`), photos de plats pleine largeur en haut des cartes. **À éviter** : médical froid, SaaS corporate, néon criard, gris neutre sans âme.

Cette direction couvre **tous les écrans**, J0 compris (c'est lui qui l'a inaugurée). L'ancienne direction « Nuit verte » est archivée hors bundle (`_archive_nuitverte/` du projet de design).

---

## 5. Architecture & navigation

- **Conteneur mobile** : chaque écran est centré, `max-width: 440px`, châssis extérieur `#1C160C`, fond app `#EFE6CF`.
- **Barre de navigation basse**, fixe (`position: sticky; bottom: 0`), **5 onglets** identiques sur tous les écrans :

  `Jour` · `Courses` · `Recettes` · `Méthode` · `Coach`

  Onglet actif en **terracotta `#E8622A`** (trait d'icône `2.1`, label Space Grotesk `700`) ; inactifs en texte doux `#857A61` (trait `1.7`, label `500`).

- **Routing cible** : `/jour` (défaut), `/courses`, `/recettes`, `/methode`, `/coach` + une route d'entrée pour J0 (ex. `/bienvenue`, accessible avant le démarrage du programme).

| Écran | Fichier proto | Composant source | Route cible |
|---|---|---|---|
| **Connexion (racine publique)** | `Connexion.html` | `connexion-screen.jsx` (+ `accueil-shared.jsx`) | `/` (et `/login`) |
| Jour 0 (la veille) | `J0.html` | `j0-screen.jsx` | `/bienvenue` |
| **Profil** | `Profil.html` | `profil-screen.jsx` (+ `accueil-shared.jsx`) | `/profil` |
| Jour | `Aujourd'hui.html` | `jour-screen.jsx` + `jour-data.jsx` | `/jour` |
| Courses | `Courses.html` | `courses-screen.jsx` | `/courses` |
| Recettes | `Recettes.html` | `recipes-screen.jsx` | `/recettes` |
| Méthode | `Méthode.html` | `methode-screen.jsx` | `/methode` |
| Coach | `Coach.html` | `coach-screen.jsx` | `/coach` |

---

## 6. Les écrans en détail

> Cartes : fond `#FBF6EA`, bordure `1.5px solid #E2D4B5`, rayon `16–18px`. Encarts internes `12–16px`, boutons **pill** (`999px`). Padding contenu standard : `22px 18px 96px` (le `96px` bas laisse la place à la nav).

### 6.−1 — Connexion (`connexion-screen.jsx`) — racine publique du site

**But** : la page d'accueil du site est **volontairement une simple page de connexion** — pas de landing marketing (décision client). Toute la pédagogie du programme vit au **Jour 0** (`/bienvenue`), après connexion.

**Flux d'entrée réel** : le coach crée l'accès depuis le **back office** → l'utilisateur reçoit le **mail d'invitation** (email + **mot de passe temporaire**) → il se connecte ici → il arrive sur le **Jour 0**. Le changement de mot de passe se fera plus tard dans un écran profil (hors périmètre actuel) — pas d'écran dédié dans ce parcours.

**Layout** : colonne centrée `max-width: 410px`. De haut en bas :
1. **Wordmark** centré (pastille verte feuille + « backtoenergy » Baloo 2 600).
2. Titre « Content de te **retrouver.** » (Baloo 2, 38px, 700 — « retrouver. » en terracotta `#E8622A`) + sous-titre : « Tes identifiants sont dans le mail d'invitation de Laurent. »
3. **Champ email** puis **champ mot de passe** : label eyebrow uppercase (Space Grotesk 700, 10.5px, `0.16em`) ; input fond crème `#FBF6EA`, **bordure `2px solid #1E1B14`**, rayon 12, icône terracotta à gauche (mail / cadenas), check vert à droite quand le champ est valide.
4. **CTA** « Me connecter → » : pill terracotta pleine largeur (opacité 0.55 tant que le formulaire est incomplet).
5. **Pied** (au-dessus d'un filet `1.5px`, discret) : « Première fois ici ? Quelqu'un t'a donné ce lien ? Tu n'arrives pas à te connecter ? **Envoie-moi un mail** (lien vert `mailto:`), je m'occupe de toi. — Laurent » — porte d'entrée des nouveaux sans invitation **et** filet de secours connexion.
6. Sous la carte : ligne discrète uppercase « backtoenergy · programme 21 jours · **Espace coach** » — le lien vers `/login/coach` vit ici, discret (le cockpit coach garde son thème sombre séparé, hors périmètre).

**Responsive** : en mobile (< 880px), la colonne posée directement sur le fond sable `#EFE6CF`, plein écran. En desktop (≥ 880px), **carte sable** (rayon 26, bordure `1.5px #E2D4B5`, ombre douce) centrée sur le châssis `#1C160C`.

**Production** : brancher sur Supabase Auth (email + mot de passe). États à ajouter : identifiants incorrects (message doux, sans culpabiliser — « ça ne correspond pas — revérifie le mail d'invitation de Laurent »), erreur réseau, soumission en cours. « Écris-lui » pointe vers un `mailto:` ou le canal coach.

### 6.−0bis — Mail d'invitation (`Email invitation.html`) — template email

**But** : le mail envoyé depuis le back office quand le coach crée un accès. Remplace l'ancien template (teal + emojis + titre monospace) par l'Édito tonique. **HTML email** : tables, styles inline, largeur 600px, responsive simple — à brancher sur l'expéditeur existant.

Structure : préheader invisible · wordmark · carte papier crème (bordure `1.5px #E2D4B5`, rayon 18) avec eyebrow vert « TON ACCÈS EST PRÊT », titre « Bienvenue {prénom} » (prénom en terracotta), intro de Laurent, **encart identifiants** (fond `#E9E9D8`, bordure `#BECBAD` — dérivés opaques du vert sur papier, email-safe) avec email + mot de passe temporaire en code, **CTA pill terracotta « Me connecter → »** (lien vers la racine du site), note « pense à changer ton mot de passe… », filet, parcours 3 semaines (pastilles numérotées aux accents semaine `#4E7A3C` / `#E2A21E` / `#C2552A`), signature « À très vite — Laurent » · footer uppercase.

**Variables à templater** : prénom, email, mot de passe temporaire, URL du CTA. Polices Google avec fallbacks (`Trebuchet MS` / `Helvetica`) — les clients sans webfonts dégradent proprement. **Zéro emoji.** Tutoiement, ton chaleureux direct — reprendre le wording exact du template.

### 6.−0bis·2 — Mail quotidien du matin (`Email quotidien.html`) — template email

**But** : chaque matin du programme, un mail par cliente avec sa journée (envoi prévu **vers 6h**, Europe/Paris — **aucune heure affichée dans le mail**). Variation « La carte du matin » validée par le client. Même technique que l'invitation : HTML email, tables + styles inline, 600px.

Structure : préheader invisible · wordmark · carte papier crème avec **photo du plat du jour en tête** (ou **en-tête typographique** — badge + grand numéro du jour — si aucune photo : bloc `[SANS-PHOTO]` du template) · badge « JOUR X / 21 » + eyebrow semaine (**accent de la semaine** `#4E7A3C` / `#E2A21E` / `#C2552A`) · titre « Ta journée est prête, {prénom} » (J1 : « C'est le grand matin, {prénom} ») · **encart encre « LE MOT DE LAURENT »** (texte du jour, modifiable dans le cockpit) · « AU MENU AUJOURD'HUI » : les 3 repas en **titres seulement** (créneau à l'accent semaine, pas d'ingrédients) · chip conditionnelle « AJUSTÉ POUR TOI » si le jour a été personnalisé pour cette cliente · CTA pill terracotta « Ouvrir ma journée → » vers `/jour` · note « tout est dans l'appli » · footer + lien « gérer mes emails ».

**Objets / préheaders (générés)** : objet « Jour X sur 21 — {teaser} » (J1 : « on lance ta première journée » ; défaut : « ta journée est prête ») ; préheader = le menu en une phrase. L'accent semaine colore badge, eyebrow, créneaux et numéro du fallback — **jamais le CTA ni les surfaces**. Variables et blocs conditionnels documentés en tête du fichier. **Pipeline d'envoi, modèle de données et écran cockpit : voir `BACKOFFICE-EMAIL.md` (racine du bundle).**

### 6.−0ter — Profil (`profil-screen.jsx`)

**But** : l'écran personnel du coaché. Pas un 6e onglet — la nav reste à 5. **Accès suggéré** : un petit avatar dans l'en-tête de l'écran Jour (à ajouter côté prod ; le proto Jour ne l'a pas encore).

**Layout** (même conteneur mobile que les autres écrans) :
1. **Top bar** : bouton rond retour (→ écran Jour) + eyebrow « TON PROFIL ».
2. **Identité** : avatar initiale (terracotta, 64px), prénom (Baloo 2, 27px). Lecture seule — pas d'email affiché (elle le connaît).
3. **Carte « Note à moi-même »** : intro « Si tu veux noter un truc, un objectif, ce que tu veux ;) » + textarea libre (« Écris-la avec tes mots… », bordure `2px` encre, rayon 12) ; dès qu'il y a du texte, mention discrète « Gardée ici, sur ton téléphone. » avec check vert. **Privée** : stockée localement (proto : localStorage) — jamais transmise au coach. Pas de badge, pas de bouton — ça s'enregistre tout seul.
4. **Carte « L'évolution de ton poids » + badge ambre « SI TU VEUX »** : journal **strictement optionnel** — « Note-le quand ça te dit, c'est tout. » Liste sobre des entrées (puce verte · « Jour X · date — NN kg », filets `1.5px` entre lignes), puis champ portant **la date du jour** en placeholder (ex. « 12 juin… », `toLocaleDateString fr-FR`) + bouton pill vert « Noter » ; chaque entrée enregistrée est datée du jour réel. **Pas de courbe, pas de delta, pas de % — jamais** : une liste plate, c'est tout. **Ces valeurs ne sont visibles que sur cet écran et côté coach** (la règle « zéro chiffre visible » s'applique à tout le reste du parcours : jamais de poids/courbes/IMC sur Jour, Méthode, etc.).
5. En bas : **« Me déconnecter »** (pill fantôme, bordure encre) → retour Connexion.

**Tweaks (proto uniquement)** : `Profil.html` embarque un panneau Tweaks (`tweaks-panel.jsx`) pour arbitrer — carte Note à moi-même on/off + position (avant/après le poids), journal du poids on/off. **Défauts retenus** : note affichée, avant le poids, journal affiché. Ne pas porter le panneau en prod.

**Volontairement absent** : l'âge (retiré — décision client) ; changement de mot de passe (reporté — décision client « pas à ce stade » : l'utilisateur garde le mot de passe temporaire du mail, et écrit à Laurent en cas de souci) ; courbes, deltas, IMC, objectifs chiffrés — le profil n'est pas un tableau de bord, le poids est une **saisie pour le coach**, pas du tracking gamifié. **Production** : entrées d'évolution (`weight_logs` : valeur + date) à stocker côté Supabase (visibles dans le cockpit coach, avec horodatage), déconnexion = `signOut` + redirect `/`. Les entrées d'exemple du proto (Jour 1 / Jour 8) sont des données de démo.

### 6.0 — Jour 0 (`j0-screen.jsx`) — parcours d'entrée

**But** : la veille du démarrage. Parcours mail → connexion → page d'accueil éditoriale. Contenu : hero « Bienvenue {prénom} » ; bandeau d'intro terracotta ; parcours 3 semaines ; les 5 onglets expliqués ; 4 principes ; carte coach ; CTA final avec la date de demain et « Découvrir mon Jour 1 ». Desktop ≥ 880px : layout éditorial large (nav haute, grilles 2–3 colonnes). C'est l'écran d'origine de la direction — s'y référer pour le desktop.

### 6.1 — Jour (`jour-screen.jsx` + `jour-data.jsx`) — écran d'accueil

**But** : l'utilisateur ouvre l'app le matin et voit sa journée. C'est l'écran le plus important. Les repas des 21 jours sont dans `jour-data.jsx` (`window.BTE_DAYS`).

**Layout (de haut en bas)** :
1. **En-tête** : badge pill « JOUR X / 21 » (Space Grotesk, **texte blanc sur accent de la semaine**) ; titre `Bonjour {prénom}` (Baloo 2, 30px, 600) ; sous-titre de semaine en vert ; à droite, **anneau de progression SVG** (54×54, trait 5) dans l'accent semaine avec le % au centre.
2. **Sélecteur de jour** (proto) : rangée scrollable J1–J21, case active remplie de l'accent de sa semaine (texte blanc) ; libellé de semaine uppercase dessous. *En production, le jour courant vient du backend — le sélecteur est un outil de démo, à garder éventuellement en debug.*
3. **Note du jour** (conditionnelle) : J1 → note de démarrage verte (`StartNote`) ; sinon encart **ambre pop** (`rgba(#F2B431, .14)`, bordure `.5`, encre `#A9742A`) « Ce qui peut arriver » selon les « passages types » (`PASSAGES`). Beaucoup de jours n'ont **aucune** note — c'est voulu. Les passages `exit: true` ajoutent un lien Coach (« Si ça persiste ou t'inquiète, parle-m'en »).
4. **Bandeau « racheter tes légumes frais »** : encart ambre cliquable → Courses. Affiché en milieu de semaine (`jour % 7 === 4` : J4, J11, J18).
5. **Liste des 3 repas** (« TES REPAS DU JOUR »), chaque repas en **carte accordéon** (rayon 18) :
   - **Fermée** : vignette photo 60×60 (rayon 14), label de créneau uppercase, titre du plat (Baloo 2, 18px), chevron.
   - **Dépliée** (une seule à la fois) : photo pleine largeur 180px + badge créneau **ambre pop** + bouton repli ; titre 24px ; **bloc « Ce que tu vas ressentir »** (fond `rgba(vert, .1)`, le cœur émotionnel) ; **ingrédients** (liste bordée, puces vertes) ; **alternatives** (« Pas envie ? Échange », icône terracotta) ; **CTA « Cuisiner ce plat »** (aplat terracotta `#E8622A`, texte blanc) + bouton rond `(i)` vert.
6. **Note d'encas** (bordure pointillée) : `snack_note` — « Un petit creux ? Une poignée d'amandes ou un fruit seul… ».
7. **MoodPicker « Et toi, là, maintenant ? »** — **en fin de page, une fois par jour** (« En fin de journée — juste pour toi, rien à réussir »). 4 visages SVG : *Vaseux / Ça va / Léger / Plein d'énergie*. Après sélection : « Noté — transmis à Laurent. »
8. **Bottom-sheets** : `CookSheet` (« On cuisine » — ingrédients en chips + étapes numérotées, pastilles vertes, pas de minuteur) et `WhySheet` (« Pourquoi cette association ? » — le texte `why` du repas).

### 6.2 — Courses (`courses-screen.jsx`)

**But** : liste de courses auto-déduite des menus, rangée par rayon. **Un pense-bête, pas une corvée : rien à cocher** (pas de checkboxes, pas de compteur, pas de barre de progression — décision client).

**Layout** :
1. **En-tête, même patron que l'écran Jour** : badge pill « SEMAINE 1 » (blanc sur accent semaine), titre « Tes courses » (30px), sous-titre « Ta liste, déduite de tes menus — rien à cocher, juste ton pense-bête. ».
2. **Toggle portions** : segmented pill « Pour 1 / Pour 2 » (actif : aplat vert `#4E7A3C` texte blanc). Les items `scale: false` (épicerie, secs) ne doublent pas — voir `fmtQty`.
3. **Bandeau « Le rythme des courses »** : 2 étapes — ① *Le gros plein* (pastille verte) ② *Le frais* (pastille ambre, « En milieu de semaine · Tu rachètes tes fruits & légumes vers le jour 4… »).
4. **Liste par rayon** (`GROUPS`, tons dans `TONES`) : Fruits & légumes (vert) / Protéines (terracotta, note « Une seule protéine animale par repas… ») / Épicerie & secs (ambre) / **Boissons (vert — inclut le Café**, sous-titre « à garder sous la main · café toujours autorisé »). Chaque ligne : puce verte 6px, nom, tags `frais` (ambre) / `bio` (vert), quantité Space Grotesk.
5. **Pied bio & local** : « Bio & local, quand tu peux… ».

### 6.3 — Recettes (`recipes-screen.jsx`)

**But** : carnet des 21 jours, feuilletable, avec recherche et filtres par type de protéine.

1. **En-tête** : « LE CARNET · 21 JOURS » + titre « Recettes ».
2. **Barre de recherche** (carte crème) : filtre sur titre **et** ingrédients.
3. **Chips de filtre** (scroll-x) : Tout / Jus / Poisson / Viande maigre / Végé. Chip active remplie de la couleur du type, **texte blanc**.
4. **Compteur** + badge « Toutes conformes » (bouclier vert).
5. **Cartes recette** : vignette 92×92 (`image-slot` en proto), pastille de type, tags, titre, alternative, chevron.
6. **Détail recette** (plein écran, slide-in `bteSlide`) : top-bar, visuel 220px, tags, titre, ingrédients, alternatives, CTA + `(i)` → bottom-sheet « Pourquoi ». **Pas** de bloc sensation/humeur ici (réservés à l'écran Jour).

**Types de protéine** (`TYPES`, accents profonds — blanc en aplat) : `jus` `#4E7A3C` · `poisson` `#2F7E90` · `viande` `#C2552A` · `vege` `#6E8F28`. 13 recettes dans `RECIPES` (~21 sur le programme complet).

### 6.4 — Méthode (`methode-screen.jsx`)

**But** : donner du sens au voyage. Pédagogie, pas de tracking.

1. **En-tête essence** : « LA MÉTHODE » + grand titre « Nettoyer, réveiller, durer » (34px).
2. **Arc des 3 semaines** (`WeekArc`) — **c'est ici que les accents semaine s'expriment** : nœud de la semaine courante **rempli** de son accent (texte blanc), badge « tu es ici · JX » et barre de progression assortis, carte teintée à 10 % ; semaines à venir : nœud **cerclé** de leur accent, carte crème neutre.
3. **Notion du jour** : carte **vert feuille `#4E7A3C`** (texte blanc), icône étincelle, teaser, **bouton blanc « Lire · 2 min »** → `NotionSheet` (bottom-sheet scrollable, texte long + encadré conseil vert).
4. **Les 4 piliers** (grille 2×2, accordéons +/−) : jus alcalins / bonnes associations / repos digestif / le vivant.
5. **« Ce qu'on met de côté »** : liste en pause (blé & gluten, laitages de vache, protéine + féculent, deux protéines/repas, fruits en fin de repas) avec raison en italique. Intro : « Rien de définitif… ».

### 6.5 — Coach (`coach-screen.jsx`)

**But** : chat **humain** avec Laurent, pas un bot.

Layout pleine hauteur (header / fil / saisie / nav). En-tête : avatar « L » vert, « Laurent », statut « Ton coach · écris-moi, je te réponds rapidement » (icône horloge verte). Fil : note d'intro verte (« Ici c'est moi, Laurent — pas un robot. Écris-moi comme à un ami. »), séparateurs de date uppercase, bulles reçues (papier crème, bordure, coin bas-gauche carré) / envoyées (vert `#4E7A3C` plein, texte blanc, coin bas-droit carré). Après envoi : « Envoyé · Laurent te répond rapidement » — **jamais de faux typing ni de réponse auto**. Saisie : textarea pill (fond crème, bordure) + bouton rond d'envoi vert (désactivé si vide ; Entrée envoie, Shift+Entrée = saut de ligne).

---

## 7. Design tokens (« Édito tonique »)

### Couleurs
| Rôle | Hex |
|---|---|
| Châssis (hors carte mobile) | `#1C160C` |
| Fond (base app, papier sable) | `#EFE6CF` |
| Surface / cartes (papier crème) | `#FBF6EA` |
| Bordures / lignes | `#E2D4B5` |
| Encre (texte principal) | `#1E1B14` |
| Texte doux | `#857A61` |
| Vert feuille (encarts sensation, toggles, bulles coach, notion) | `#4E7A3C` |
| Terracotta (CTA « Cuisiner », onglet actif, échanges) | `#E8622A` |
| Ambre pop (encarts « ce qui peut arriver », badges créneau, tags frais) | `#F2B431` |
| Encre ambre (texte/icône sur fond ambre) | `#A9742A` |
| Encre terracotta (notes protéines) | `#C2552A` |
| Semaine 1 — Détox & Purification | `#4E7A3C` |
| Semaine 2 — Énergie & Vitalité | `#E2A21E` |
| Semaine 3 — Ancrage & Performance | `#C2552A` |
| Recettes — jus / poisson / viande / végé | `#4E7A3C` / `#2F7E90` / `#C2552A` / `#6E8F28` |

**Logique d'usage** : les accents profonds **portent du blanc en aplat** (badges semaine, CTA, bulles envoyées, pastilles d'étapes) ; sur fond sable, on les utilise directement comme couleur de texte/icône (sauf l'ambre pop `#F2B431`, trop clair : son encre est `#A9742A`). Les accents semaine colorent **uniquement** les éléments de progression/contexte (badge « JOUR X / 21 », anneau, sélecteur de jour, nœuds d'arc Méthode) — jamais les surfaces ni les CTA.

**Teintes dérivées** : helper `rgba(hex, alpha)`. Conventions : fond d'icône `rgba(accent, 0.14–0.22)` ; encart vert `rgba(#4E7A3C, 0.10)` bordure `0.30–0.40` ; encart ambre `rgba(#F2B431, 0.14)` bordure `0.50` ; note terracotta `rgba(#E8622A, 0.10)` bordure `0.30`.

### Typographie
- **Titres** : **Baloo 2**, poids 500/600/700, `letter-spacing: -0.01em`.
- **Labels / eyebrows / boutons / quantités** : **Space Grotesk** 700, uppercase pour les eyebrows, `letter-spacing: 0.06–0.14em`.
- **Texte** : **Hanken Grotesk**, poids 400/500/600/700/800.
- Import : `family=Baloo+2:wght@500;600;700&family=Space+Grotesk:wght@400;500;700&family=Hanken+Grotesk:wght@400;500;600;700;800` (tous les écrans).
- **Échelle (px)** : grands titres écran 30–34 ; titre repas déplié 24–27 ; titre carte 15.5–18 ; corps 14–15.5 ; secondaire 12.5–13.5 ; labels/eyebrow 10–11.5 (uppercase).

### Rayons
Cartes `16–18px` · encarts internes / inputs `12–16px` · vignettes `14px` · fonds d'icônes `9–12px` · pills/boutons `999px` · bottom-sheets `26px 26px 0 0`.

### Bordures & ombres (sur papier sable)
- Bordures de cartes et encarts : `1.5px solid` (la matière vient des bordures, pas des ombres).
- CTA terracotta : `0 12px 24px -12px rgba(232,98,42,0.9)`.
- Carte notion (Méthode) : `0 18px 36px -20px rgba(78,122,60,0.8)`.
- Bulle envoyée (Coach) : `0 10px 20px -14px rgba(78,122,60,0.8)`.

### Icônes
Linéaires arrondies, **trait `1.7`** (actif `2.1`), `stroke-linecap/linejoin: round`, `fill: none`, viewBox `0 0 24 24`, SVG inline (composant `Ic` de chaque écran — à extraire en librairie partagée). Visages d'humeur : SVG paramétrique `Face` (viewBox `0 0 32 32`, trait `1.9`), 4 états.

---

## 8. Interactions & animations

- **Accordéons** repas / piliers : un seul repas ouvert à la fois.
- **Bottom-sheets** (Cuisiner / Pourquoi / Notion) : overlay `rgba(#1E1B14, 0.55)`, panneau `@keyframes bteUp` (~0.26s `cubic-bezier(.2,.8,.2,1)`) + fade. Fermeture au clic overlay ou croix.
- **Détail recette** : slide-in plein écran (`bteSlide`).
- **Transitions** : sélections/chips/toggles `all .15s` ; barres de progression `width .25s`.
- **`prefers-reduced-motion`** : non géré dans le proto — à ajouter en production.

## 9. State & données

State local du proto, persisté en `localStorage` (à remplacer par un vrai backend) :

| Clé | Écran | Contenu |
|---|---|---|
| `bte-day` | Jour | jour affiché (sélecteur de démo — en prod : jour courant du programme) |
| `bte-mood-j{n}` | Jour | humeur du jour n (1 saisie / jour) |
| `bte-portions` | Courses | 1 ou 2 |

**Modèles de données à concevoir côté backend** :
- **Jour** : numéro, total (21), libellé semaine + accent, repas du jour, passage-type éventuel, `snack_note`.
- **Repas** : créneau, titre, photo, texte « sensation », ingrédients `[nom, quantité]`, alternatives, texte « why », étapes de cuisine.
- **Humeur** : 1 entrée / jour / utilisateur, valeur 1–4 (jamais affichée en chiffre), horodatage (visible côté coach).
- **Recette** : type (jus/poisson/viande/vege), semaine, durée, titre, ingrédients, alternatives, why.
- **Article de courses** : nom, rayon, quantité (n + unité), `scale`, flags `frais`/`bio`.
- **Méthode** : 3 semaines (+ accents), 4 piliers, notion du jour (débloquée jour par jour), liste « ce qu'on met de côté ».
- **Coach** : thread de messages (humain ↔ utilisateur), pas de bot.
- **Mail quotidien** : envoyé vers 6h (Europe/Paris), contenu = défauts du programme ⊕ surcharges cockpit (`daily_email_overrides` : mot du jour, photo, menu — globales ou par cliente) ; journal d'envoi idempotent. Détail complet dans `BACKOFFICE-EMAIL.md`.
- **⚠️ Menus modifiables** : les menus seront retravaillés en continu par le coach — le modèle doit permettre l'édition des repas (et leur versionnement simple) depuis le backoffice (`meal_plans`), les écrans utilisateur suivront plus tard.

## 10. Assets / images

Six vraies photos dans `reference/images/` : smoothie vert, salade quinoa-concombre, velouté de courgette (J1) + petit-déj fruits, buddha bowl, dal (visuels de secours par créneau — voir `BTE_PHOTOS` en fin de `jour-data.jsx`). Sur Recettes, `image-slot.js` sert de **placeholder de proto**. En production : `<img>` + pipeline responsive (webp/avif, lazy-loading, ratio fixe), filtre léger `saturate(1.05) brightness(1.02)`. Direction photo : **macro de plats** (jus, vapeur, gouttes, texture), pleine largeur en haut des cartes.

## 11. Fichiers de référence (dossier `reference/`)

| Fichier | Rôle |
|---|---|
| `Connexion.html` + `connexion-screen.jsx` + `accueil-shared.jsx` | **Connexion (racine publique)** — mobile et desktop. `accueil-shared.jsx` fournit tokens + icônes + wordmark (n'en porter que ce que la page utilise) |
| `Email invitation.html` | **Template du mail d'invitation** (HTML email, tables + styles inline) — à templater (prénom, identifiants, URL) |
| `Email quotidien.html` | **Template du mail quotidien du matin** (HTML email) — variation A retenue ; variables + blocs conditionnels en tête du fichier ; intégration & back-office dans `../BACKOFFICE-EMAIL.md` |
| `Profil.html` + `profil-screen.jsx` (+ `tweaks-panel.jsx`, proto) | **Écran Profil** — note à moi-même, évolution du poids (optionnelle), déconnexion |
| `J0.html` + `j0-screen.jsx` | Parcours d'entrée (la veille) — layout mobile **et** desktop (880px) |
| `Aujourd'hui.html` + `jour-screen.jsx` + `jour-data.jsx` | Écran Jour (les 21 jours de repas sont dans `jour-data.jsx`) |
| `Courses.html` + `courses-screen.jsx` | Écran Courses |
| `Recettes.html` + `recipes-screen.jsx` | Écran Recettes |
| `Méthode.html` + `methode-screen.jsx` | Écran Méthode |
| `Coach.html` + `coach-screen.jsx` | Écran Coach |
| `image-slot.js`, `tweaks-panel.jsx` | Outils de proto uniquement — ne pas porter en production |
| `images/` | Photos de plats utilisées par l'écran Jour |
| `CLAUDE.md` | Direction visuelle figée + règles méthode (source de vérité) |

> **`../screenshots/`** — aperçus PNG des 8 écrans utilisateur (`00-J0` → `07-Profil`), à jour avec les protos `reference/`. Pratique pour se repérer ; la vérité reste les `.html`/`.jsx`. Les deux mails se prévisualisent en ouvrant `reference/Email invitation.html` et `reference/Email quotidien.html`.

Ouvrir n'importe quel `.html` dans un navigateur pour voir l'écran interactif. Le contenu textuel exact (copy) et toutes les valeurs de style précises sont dans les `.jsx` — **s'y référer pour les détails non couverts ici**.
