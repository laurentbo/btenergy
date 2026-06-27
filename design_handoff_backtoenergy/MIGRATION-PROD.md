# MIGRATION-PROD — aligner le repo `btenergy` sur le design figé

> Établi après lecture du repo **github.com/Laurentbo/btenergy@main**. Référence visuelle/contenu absolue : les protos dans `design_handoff_backtoenergy/reference/` + `CLAUDE.md` (design system « Édito tonique »). Ce doc dit **quel fichier du repo** changer et **comment**.

## TL;DR — où on en est vraiment

La migration vers « Édito tonique » est **à moitié faite** :

- ✅ **`app/globals.css` est déjà migré** : tokens exacts (`--bg #EFE6CF`, `--bg-surface #FBF6EA`, `--leaf #4E7A3C`, `--terra #E8622A`, `--amber #F2B431`, accents semaine `--week1/2/3`, types recette, fonts Baloo 2 / Hanken / Space Grotesk), + thème `.theme-coach`. **Ne pas y toucher** sauf besoin précis.
- ✅ Les **routes cibles existent** en dossiers : `app/bienvenue`, `app/jour`, `app/courses`, `app/recettes`, `app/methode`, `app/chat`, `app/profil`, `app/coach`, `app/login`.
- ⚠️ **Écarts confirmés à corriger** (voir tableau).
- 🗑️ **`OVERVIEW.md` et `EVOLUTIONS.md` sont périmés** : ils décrivent encore l'ancien « design charbon chaud » (dark `#15130E`, Instrument Serif + Geist) et une home « landing ». À réécrire en fin de migration.

## Écarts confirmés (lecture des fichiers)

| # | Fichier repo | Constat | Attendu (spec figée) |
|---|---|---|---|
| 1 | `app/page.tsx` (`/`) | Ancienne **landing marketing** : hero « Retrouver ton énergie naturelle », sections Méthode / principes / coach. Rend désormais sur fond clair (tokens migrés) mais structure + ton anciens. Contient du **donneur de leçon** (« Bouger chaque jour — **pas négociable** »). | **Login seul** (décision client). `/` = la page de connexion (cf. `reference/Connexion.html`), ou redirige vers `/login`. **Pas de landing.** Toute la pédagogie au Jour 0 (`/bienvenue`). |
| 2 | `app/jour/page.tsx` | **Stub** : `export { default } from "../dashboard/page"` → sert l'**ancien `dashboard`** (63 Ko, dark, journal chiffré). | Le **nouvel écran Jour** : porter `reference/jour-screen.jsx` + `reference/jour-data.jsx` (J/21, anneau, sélecteur de jour, 3 repas en accordéon, MoodPicker 4 niveaux qualitatifs, note d'encas). |
| 3 | `app/dashboard/`, `app/programme/`, `app/welcome/`, `app/onboarding/` | Anciens écrans B2B (dark, « collaborateur », chiffres). | **Hors spec.** Retirer des routes utilisateur ou rediriger vers les nouvelles (`/jour`, `/bienvenue`). Ne pas les laisser accessibles. |
| 4 | `OVERVIEW.md` §Design system | Palette **dark** `#15130E`, Geist + Instrument Serif. | Périmé : la vraie palette est dans `globals.css` (Édito tonique). Réécrire la section. |
| 5 | `EVOLUTIONS.md` §Fait | « Nouveau design charbon chaud », « Page d'accueil refonte design charbon ». | Périmé. L'item ouvert « Page d'accueil — affiner le wording hero » est **caduc** (home = login seul). |
| 6 | Vocabulaire (global) | « collaborateur », « entreprise », B2B. | Côté utilisateur : ton « comme à un ami », tutoiement. Mot « **cure** » banni (« programme » / « tes 21 jours »). « collaborateur » → éviter dans l'UI user. |
| 7 | Modèle données / journal | `journal_entries` & co. : `energie, humeur 1–10` (chiffré). | **Zéro chiffre affiché** côté user. Humeur = **4 niveaux qualitatifs** (Vaseux / Ça va / Léger / Plein d'énergie), **1×/jour**. Stock 1–4 interne OK, jamais affiché en chiffre. |
| 8 | `app/coach/page.tsx` (cockpit) | Cf. snapshot prod : stat « énergie moy. 7,4/10 » + emojis. | Thème `.theme-coach` (sombre séparé). **Pas de chiffre d'humeur**, **pas d'emoji**. (Périmètre coach — corriger mais ne pas mélanger avec le thème user.) |

## À vérifier route par route (comparer à `reference/`)

Ces routes existent mais leur contenu n'a pas été lu en entier — **ouvrir chaque proto de `reference/` et comparer** ; aligner si écart (polices, couleurs, rayons, espacements, wording exact) :

- `app/bienvenue/` ↔ `reference/J0.html` (`j0-screen.jsx`)
- `app/courses/` ↔ `reference/Courses.html` (`courses-screen.jsx`)
- `app/recettes/` ↔ `reference/Recettes.html` (`recipes-screen.jsx`)
- `app/methode/` ↔ `reference/Méthode.html` (`methode-screen.jsx`) — titre « Les piliers **du programme** », jamais « cure »
- `app/chat/` ↔ `reference/Coach.html` (`coach-screen.jsx`) — chat 100 % humain, pas de bot/typing/réponse auto
- `app/profil/` ↔ `reference/Profil.html` (`profil-screen.jsx` + `accueil-shared.jsx`)
- `app/login/` ↔ `reference/Connexion.html` (`connexion-screen.jsx`)

## Nav basse (les 5 onglets) — à vérifier partout
Libellés exacts : **Jour · Courses · Recettes · Méthode · Coach**. Onglet actif **terracotta `#E8622A`**, inactifs en texte doux. Vérifier les `href` : `/jour`, `/courses`, `/recettes`, `/methode`, `/chat` (Coach). Pas de « Aujourd'hui / Repas / Parcours / Principes ».

## Menus (data)
La source de référence est **`reference/jour-data.jsx`** (21 jours, audit Verissimo OK — voir CORRECTIFS §3). Le repo lit les menus via `data/verissimo.ts` / `data/program.ts` (statique) et le back-office coach écrit dans Supabase `meal_plans` — **ces deux sources restent volontairement non unifiées** (cf. CLAUDE.md). Caler le contenu statique `data/verissimo.ts` sur `reference/jour-data.jsx` (notamment : **petit-déj = fruits + oléagineux, jamais d'œufs** ; J8/J13/J17 corrigés).

## Ordre d'exécution suggéré
1. **Home** : remplacer `app/page.tsx` par la connexion (login seul) ou un redirect `/` → `/login`.
2. **Jour** : remplacer le stub `app/jour/page.tsx` par le vrai écran (porter `reference/jour-screen.jsx` + `jour-data.jsx`).
3. **Retirer/rediriger** `dashboard`, `programme`, `welcome`, `onboarding`.
4. **Vérifier** bienvenue / courses / recettes / methode / chat / profil / login vs `reference/`, corriger les écarts.
5. **Nav + CTA** : libellés, onglet actif terracotta, tous les `href` (corrige aussi le 404 « Découvrir mon Jour 1 » — CORRECTIFS §1).
6. **Nettoyage** : retirer « cure » / « collaborateur » de l'UI user, chiffres d'humeur, emojis cockpit. Caler `data/verissimo.ts`.
7. **Docs** : réécrire `OVERVIEW.md` §Design system + `EVOLUTIONS.md` (l'ancien « charbon » n'est plus la vérité).

## Prompt suggéré pour Claude Code (dans le repo)

> Le design figé est dans `design_handoff_backtoenergy/` (protos dans `reference/`, règles dans `CLAUDE.md` + `CORRECTIFS.md` + `MIGRATION-PROD.md`). `globals.css` est déjà en Édito tonique — ne pas y toucher. Tâches, dans l'ordre : 1) `app/page.tsx` → connexion seule (pas de landing), aligne sur `reference/Connexion.html` ; 2) `app/jour/page.tsx` (actuellement un re-export de `dashboard`) → vrai écran Jour porté depuis `reference/jour-screen.jsx` + `reference/jour-data.jsx` ; 3) retire/redirige `dashboard`, `programme`, `welcome`, `onboarding` ; 4) compare bienvenue/courses/recettes/methode/chat/profil/login à leur proto de `reference/` et corrige les écarts (polices, couleurs, rayons, wording exact) ; 5) nav basse `Jour · Courses · Recettes · Méthode · Coach`, onglet actif `#E8622A`, vérifie tous les href (corrige le 404 « Découvrir mon Jour 1 ») ; 6) retire de l'UI user le mot « cure », « collaborateur », les chiffres d'humeur et les emojis du cockpit coach ; cale `data/verissimo.ts` sur `reference/jour-data.jsx` (petit-déj = fruits + oléagineux, jamais d'œufs) ; 7) réécris la section Design system d'`OVERVIEW.md` et nettoie `EVOLUTIONS.md`. Utilise d'abord les outils code-review-graph (MCP) pour repérer les usages avant d'éditer.
