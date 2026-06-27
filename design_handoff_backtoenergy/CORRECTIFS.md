# CORRECTIFS — retours de prod (backtoenergy.fr)

Deux problèmes constatés en production. Référence absolue : les fichiers HTML dans `reference/` — chaque écran de prod doit être visuellement indistinguable de son proto.

## 1. 404 sur le CTA « Découvrir mon Jour 1 » (depuis le Jour 0)

- Constat : sur `https://backtoenergy.fr` (page `/bienvenue`, état « On commence demain »), le CTA **« Découvrir mon Jour 1 »** pointe vers `https://backtoenergy.fr/jour` → **404**.
- Attendu : ce CTA doit mener à l'écran **Jour** (le README §5 prévoit la route `/jour`).
- À faire : vérifier la route réellement déployée pour l'écran Jour. Soit la page `/jour` n'existe pas dans l'App Router (créer `app/jour/page.tsx`), soit elle existe sous un autre chemin (ex. `/aujourdhui`, `/app/jour`) et c'est le `href` du CTA du Jour 0 qu'il faut corriger. **Aligner toutes les routes sur le tableau du README §5** (Connexion `/`, Jour 0 `/bienvenue`, Profil `/profil`, Jour `/jour`, Courses `/courses`, Recettes `/recettes`, Méthode `/methode`, Coach `/coach`) — et vérifier les 5 onglets de la nav basse + tous les CTA inter-écrans pendant qu'on y est.

## 2. Recettes & Méthode : rendu KO / qualité insuffisante

- Constat : les écrans **Recettes** et **Méthode** en prod ne ressemblent pas aux protos (mise en forme cassée ou dégradée).
- Référence : `reference/Recettes.html` (+ `recipes-screen.jsx`) et `reference/Méthode.html` (+ `methode-screen.jsx`). Ouvrir ces fichiers dans un navigateur et comparer côte à côte avec la prod.
- Points de fidélité non négociables (voir README §3–4 et §6) :
  - Polices chargées et appliquées : **Baloo 2** (titres), **Space Grotesk** (labels uppercase), **Hanken Grotesk** (texte). Si les titres tombent en sans-serif système, c'est que `next/font` n'est pas branché.
  - Couleurs exactes : fond `#EFE6CF`, cartes `#FBF6EA`, bordures `1.5px solid #E2D4B5`, encre `#1E1B14`, texte doux `#857A61`.
  - Rayons : cartes `16–18px`, encarts `12–16px`, boutons pill `999px`.
  - Recettes : filtres par type de protéine avec les couleurs du README (jus `#4E7A3C`, poisson `#2F7E90`, viande maigre `#C2552A`, végé `#6E8F28`) ; cartes recette avec photo pleine largeur en haut.
  - Méthode : arc 3 semaines avec les accents semaine (`#4E7A3C` / `#E2A21E` / `#C2552A`), piliers en grille 2×2, « Les piliers de la méthode » (jamais le mot « cure »).
  - Échelle mobile : conteneur `max-width ~440px` centré, padding `22px 18px 96px`, nav basse 5 onglets, onglet actif terracotta `#E8622A`.
- Méthode de travail : ne pas réinterpréter — **copier les valeurs depuis les `.jsx` de `reference/`** (ce sont des styles inline, faciles à transposer en Tailwind ou CSS).

## 3. Réalignement prod ↔ spec (écarts constatés sur le snapshot `preview-screens.html`)

Le snapshot de production a **divergé des protos figés**. À corriger dans `btenergy` pour revenir à la spec (réf. README §3–6 + `CLAUDE.md`) :

| Sujet | En prod (constaté) | Attendu (spec figée) |
|---|---|---|
| **Libellés nav basse** | `Aujourd'hui · Coach · Repas · Parcours · Principes` | **`Jour · Courses · Recettes · Méthode · Coach`** (réf. protos — seul `/bienvenue` était correct) |
| **Page d'accueil `/`** | Une landing marketing | **Login seul** (`Connexion.html`). Toute la pédago au Jour 0 `/bienvenue`. Pas de landing. |
| **Vocabulaire** | « Collaborateur » | Ton « comme à un ami » — jamais ce mot. Tutoiement partout. Le mot « cure » **banni** (dire « programme » / « tes 21 jours »). |
| **Cockpit coach** | Stat « Énergie moy. 7,4/10 » + emojis (👥🔥🎯) | **Zéro chiffre** d'humeur affiché + **zéro emoji** (hors périmètre des 5 écrans user, mais à nettoyer). |
| **Modèle petit-déj** | « kiwi + orange + 2 œufs » | **Fruits de saison seuls + oléagineux** (+ miel optionnel). **Jamais d'œufs/protéine au petit-déj** (fruits jamais avec une protéine). |

La **source de menus** de référence (`reference/jour-data.jsx`) est conforme : s'appuyer dessus, pas sur d'anciennes données de prod.

### Correction menus appliquée (audit Verissimo)
Les 3 petits-déj qui étaient des **porridges de céréale + fruit** (J8, J13, J17 — fruit cuit dans du sarrasin, hors modèle « fruits + oléagineux » et combinaison fruit+féculent) ont été remplacés par des options **fruits tiédis + oléagineux**, conformes :
- **J8** : Pommes fondantes à la cannelle & noix
- **J13** : Poire pochée, noisettes & vanille
- **J17** : Bananes tièdes, amandes & cannelle

Le reste des 21 jours a été audité : pas de protéine animale + féculent, pas de double protéine animale, pas de laitage de vache, sans blé/gluten ni sucre raffiné, fruits toujours seuls le matin. **Conforme.**

---

## Prompt suggéré pour Claude Code

> Dans le repo btenergy : 1) corrige le 404 du CTA « Découvrir mon Jour 1 » (page /bienvenue) — aligne toutes les routes et liens internes sur le tableau §5 de design_handoff_backtoenergy/README.md ; 2) reprends les écrans Recettes et Méthode pour qu'ils soient visuellement identiques à reference/Recettes.html et reference/Méthode.html (polices, couleurs, rayons, espacements — copie les valeurs des .jsx de référence) ; 3) réaligne la prod sur la spec (CORRECTIFS §3) : libellés de nav `Jour · Courses · Recettes · Méthode · Coach`, page `/` = login seul (pas de landing), retire le mot « Collaborateur » et tout « cure », retire les chiffres d'humeur et emojis du cockpit coach, et cale les menus sur reference/jour-data.jsx (petit-déj = fruits + oléagineux, jamais d'œufs). Vérifie ensuite chaque lien de la nav basse et chaque CTA inter-écrans.
