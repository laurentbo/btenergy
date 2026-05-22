# Back to Energy — Vue d'ensemble du projet

## Infrastructure

| Élément | Valeur |
|---|---|
| Domaine | backtoenergy.fr |
| Hébergement | Vercel — projet `btenergy` (scope `laurentbocle-4466s-projects`) |
| Base de données | Supabase — projet `kekjbovoeyveucjakkle` |
| Emails | Resend |
| Repo local | `/Users/apple/btenergy` |

## Stack technique

- **Framework** : Next.js 16.2.4 (App Router), React 19
- **Langage** : TypeScript 5
- **Styles** : Tailwind CSS 4
- **Auth / BDD** : Supabase (`@supabase/ssr` + `@supabase/supabase-js`)
- **Emails transactionnels** : Resend
- **Déploiement** : Vercel CLI intégré

---

## Architecture des pages

### Pages publiques
| Route | Fichier | Description |
|---|---|---|
| `/` | `app/page.tsx` | Accueil public — landing page |
| `/login` | `app/login/page.tsx` | Connexion collaborateur (magic link) |
| `/login/coach` | `app/login/coach/page.tsx` | Connexion coach (email + mot de passe) |
| `/auth/callback` | `app/auth/callback/` | Callback Supabase Auth |
| `/auth/reset-password` | `app/auth/reset-password/page.tsx` | Réinitialisation mot de passe |

### Parcours collaborateur
| Route | Fichier | Description |
|---|---|---|
| `/onboarding` | `app/onboarding/page.tsx` | Redirection post-inscription |
| `/welcome` | `app/welcome/page.tsx` | Écran d'accueil première connexion |
| `/dashboard` | `app/dashboard/page.tsx` | Dashboard principal (repas, journal, progression) |
| `/programme` | `app/programme/page.tsx` | Redirige vers `/dashboard` |
| `/programme/[jour]` | `app/programme/[jour]/page.tsx` | Détail d'un jour du programme |

### Espace coach
| Route | Fichier | Description |
|---|---|---|
| `/coach` | `app/coach/page.tsx` | Dashboard coach — liste des collaborateurs |
| `/coach/menus` | `app/coach/menus/page.tsx` | Éditeur de menus (meal_plans) |
| `/coach/preview/[id]` | `app/coach/preview/[id]/page.tsx` | Prévisualisation du programme d'un collab |
| `/admin/exclusions` | `app/admin/exclusions/page.tsx` | Gestion des exclusions alimentaires |

### Pages utilitaires
| Route | Description |
|---|---|
| `/email-preview` | Prévisualisation de tous les templates email |

---

## API Routes

| Endpoint | Méthode | Rôle |
|---|---|---|
| `/api/me` | GET | Renvoie le profil de l'utilisateur connecté |
| `/api/collabs` | GET | Liste les collaborateurs du coach connecté |
| `/api/collab/[id]` | GET/PATCH/DELETE | Détail / update / suppression d'un collaborateur |
| `/api/auth/welcome` | POST | Envoie l'email de bienvenue |
| `/api/send-reset-password` | POST | Envoie un email de réinitialisation |
| `/api/send-step-email` | POST | Envoie l'email de l'étape courante (J1, J8, J15) |
| `/api/coach/invite` | POST | Invite un collaborateur par email |
| `/api/admin/exclusions` | GET/POST | CRUD exclusions alimentaires globales |
| `/api/admin/file` | GET | Lecture de fichier (usage interne admin) |
| `/api/admin/info` | GET | Informations d'environnement admin |
| `/api/admin/preview` | GET | Prévisualisation admin |
| `/api/admin/templates` | GET | Templates disponibles |
| `/api/admin/tree` | GET | Arborescence fichiers admin |

---

## Base de données Supabase

### Tables

#### `profiles`
Extension de `auth.users`. Un profil par utilisateur.
| Colonne | Type | Notes |
|---|---|---|
| id | uuid | FK → auth.users |
| email | text | |
| prenom | text | |
| role | enum | `collaborateur` \| `coach` \| `admin` |
| genre | text | `homme` \| `femme` |
| age, taille, poids | int / numeric | Données biométriques |
| company_id | uuid | FK → companies |
| coach_id | uuid | FK → auth.users |
| current_day | int | Jour courant dans le programme (1–21) |
| program_start | date | Date de début du programme |

#### `companies`
| Colonne | Type | Notes |
|---|---|---|
| id | uuid | |
| name | text | Nom de l'entreprise |
| code | text | Code unique d'invitation (ex: `ACME2024`) |
| coach_id | uuid | Coach responsable |

#### `meal_plans`
Plan alimentaire de base sur 21 jours (éditable par le coach).
| Colonne | Type |
|---|---|
| jour, semaine | int |
| nom_jour, is_weekend | text / bool |
| petit_dejeuner, collation_matin, dejeuner, collation_apres_midi, diner | text |
| astuce_umami | text |
| updated_by | uuid |

#### `user_meal_overrides`
Personnalisations d'un repas spécifique pour un collaborateur.
| Colonne | Type |
|---|---|
| user_id | uuid |
| jour | int |
| field_name | enum (6 moments de repas) |
| override_value | text |
| reason | text |
| created_by | uuid |

#### `user_food_preferences`
Intolérances et dislikes alimentaires par utilisateur.
| Colonne | Type |
|---|---|
| ingredient | text |
| type | `dislike` \| `allergy` \| `intolerance` |

#### `journal_entries`
Bilan quotidien chiffré (legacy).
| Colonne | Type |
|---|---|
| energie, humeur, hydratation, sommeil | int (1–10) |
| note | text |

#### `journal`
Journal quotidien enrichi.
| Colonne | Type |
|---|---|
| jour | int |
| activite | text |
| rituel_fait | bool |
| energie | int |
| humeur | text |

#### `program_overrides`
Personnalisations coach par collaborateur/jour (tip, intention, repas).
| Colonne | Type |
|---|---|
| collaborateur_id | uuid |
| coach_id | uuid |
| day | int |
| coach_note, tip_override, intention_override | text |
| meal_overrides | jsonb |

#### `meal_logs`
Repas réellement consommés (saisi par le collaborateur).
| Colonne | Notes |
|---|---|
| moment | `matin` \| `midi` \| `après-midi` \| `soir` |
| items | text[] |

#### `email_logs`
Dédoublonnage des emails automatiques. Contrainte UNIQUE `(user_id, type)`.

#### `coach_settings`
Paramètres globaux du coach (exclusions d'ingrédients).

### Politiques RLS (Row Level Security)
- **Collaborateur** : accès en lecture/écriture uniquement à ses propres données
- **Coach** : lit les profils, journaux et repas de ses collaborateurs (via `coach_id`)
- **Admin** : accès étendu via `service_role` dans les API routes
- `email_logs` : écriture réservée au `service_role` (API only)

### Migrations
Dossier `supabase/migrations/` — appliquées dans l'ordre :
1. `20260430000000` — Fix RLS + écran de bienvenue
2. `20260430000001` — Table `email_logs`
3. `20260430000002` — Table `program_overrides` (ritual overrides)
4. `20260504000000` — Colonnes programme sur `profiles`
5. `20260506030453` — Table `coach_settings`
6. `20260506030520` — Table `journal`
7. `20260513` — Table `questions`
8. `20260514000000` — Tables `meal_plans`, `user_meal_overrides`, `user_food_preferences`

---

## Composants (`/components`)

| Composant | Rôle | Utilisé dans |
|---|---|---|
| `EnergyCheckin.tsx` | Check-in énergie quotidien | `/coach/preview/[id]` |
| `MealCard.tsx` | Carte repas (affichage d'un moment de repas) | `/coach/preview/[id]` |
| `PrincipesSection.tsx` | Affichage des principes Verissimo | `/coach/preview/[id]` |
| `ProgramEditor.tsx` | Éditeur de programme (vue coach) | `/coach` |
| `RitualCard.tsx` | Carte rituel du jour | `/coach/preview/[id]` |
| `Timeline21.tsx` | Timeline des 21 jours | `/coach/preview/[id]` |
| `VitalityScore.tsx` | Score de vitalité affiché | `/coach/preview/[id]` |

---

## Lib (`/lib`)

| Fichier | Rôle |
|---|---|
| `auth-context.tsx` | Provider React pour la session Supabase |
| `email-templates.ts` | Templates HTML des emails transactionnels |
| `menus.ts` | CRUD Supabase pour `meal_plans`, `user_meal_overrides`, food preferences |
| `principles.ts` | Les 7 principes Verissimo (données statiques) |
| `resend.ts` | Instance Resend partagée |
| `hooks/useDayMenu.ts` | Hook : résolution du menu du jour (plan + overrides) |
| `supabase/client.ts` | Client Supabase côté navigateur |
| `supabase/server.ts` | Client Supabase côté serveur (SSR) |
| `supabase/types.ts` | Types TypeScript de toute la base de données |

---

## Data (`/data`)

| Fichier | Contenu |
|---|---|
| `program.ts` | Programme 21 jours — structure des jours, thèmes des semaines, calcul du jour courant |
| `verissimo.ts` | Données du programme Verissimo (menus détaillés) |
| `equivalences.ts` | Équivalences alimentaires (substitutions) |

---

## Emails transactionnels (Resend)

| Template | Déclencheur |
|---|---|
| Magic link | Connexion collaborateur |
| Bienvenue | Première connexion post-inscription |
| Réinitialisation mot de passe | Demande de reset |
| Invitation | Coach invite un collaborateur |
| Étape J1 | Début du programme |
| Mi-parcours J8 / J15 | Jalons automatiques |
| Post-cure | Fin des 21 jours |

---

## Concept produit

**Back to Energy** est une application web B2B de bien-être pour entreprises. Un coach supervise des groupes de collaborateurs qui suivent un **programme détox de 21 jours** basé sur la méthode Verissimo.

### Les 3 semaines
| Semaine | Thème |
|---|---|
| S1 (J1–J7) | Détox & Purification |
| S2 (J8–J14) | Énergie & Vitalité |
| S3 (J15–J21) | Ancrage & Performance |

### Les 7 principes Verissimo
1. **La mastication** — mâcher 20–30 fois, digestion divisée par 2
2. **Dissociation alimentaire** — protéines + légumes, céréales + légumes, jamais mélangés
3. **Temps de digestion** — respecter les intervalles entre repas
4. **Équilibre acido-basique** — dîner 100 % végétalien
5. **Manger vivant** — crudités à chaque repas, huile d'olive à froid
6. **Hydratation** — 1,5–2L/j, eau citronnée à jeun, pas de boisson pendant les repas
7. **Repos digestif** — 3 repas max, 4h d'intervalle, 12h de jeûne nocturne

### Rôles utilisateurs
- **Collaborateur** : suit son programme jour par jour, saisit son journal, voit ses repas
- **Coach** : supervise ses collaborateurs, personnalise les menus et le programme, prévoit les exclusions alimentaires
- **Admin** : accès complet via `service_role`

### Authentification
- Collaborateurs : **magic link** (sans mot de passe)
- Coachs : email + mot de passe
- Inscription collaborateur : code entreprise (`companies.code`) + email → profil créé automatiquement par trigger Supabase

---

## Design system

Tokens définis dans `app/globals.css` (variables CSS, pas de Tailwind hardcodé).

**Palette dark** :
| Token | Valeur | Usage |
|---|---|---|
| `--bg` | `#15130E` | Fond principal |
| `--bg-lift` | `#1C1A14` | Fond légèrement relevé |
| `--bg-surface` | `#211E17` | Cards, surfaces |
| `--bg-elev` | `#27241C` | Éléments élevés |
| `--text` | `#ECE4D2` | Texte principal |
| `--text-dim` | `rgba(236,228,210,0.62)` | Texte secondaire |
| `--brand` | `#5CB551` | Vert logo / CTA |
| `--coach` | `#A8BBA5` | Voix du coach (sage) |
| `--line` | `rgba(247,234,205,0.07)` | Séparateurs |

**Typographie** : Geist (sans) + Instrument Serif (serif), via `--sans` et `--serif`.

**Emails** (crème, intentionnellement différent) : fond `#EEE7D6`, carte `#FBF6E8`, CTA `#2A2520`.

**Composants UI** : cartes avec `backdrop-filter: blur`, barre de navigation bottom fixe sur mobile, barre d'onglets top sur desktop.

---

## Variables d'environnement requises

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=https://backtoenergy.fr
```
