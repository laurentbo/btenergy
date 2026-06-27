# Intégration back-office — le mail quotidien du matin

> Périmètre : le **mail quotidien** (template `reference/Email quotidien.html`, variation A « La carte du matin », validée) et son **administration depuis le cockpit coach**. À lire avec le `README.md` du bundle (§6.−0bis·2) et `reference/CLAUDE.md`.

> **Templates intégrables (Handlebars, bulletproofés Outlook) → `email-templates/`** :
> `email-quotidien.html` · `email-invitation.html` · manifeste des variables + payloads d'exemple dans `email-templates/VARIABLES.md`. Les fichiers `Email *.html` à la racine du projet sont les **aperçus rendus** (données d'exemple) ; les templates de `email-templates/` sont la **source d'intégration**.

---

## 1. Vue d'ensemble du pipeline

Chaque matin (**cron vers 6h, Europe/Paris** — Vercel Cron), pour chaque cliente avec un programme actif :

1. Calculer son **jour courant** (1–21) à partir de sa date de démarrage.
2. Composer le contenu : **défauts du programme** ⊕ **surcharges du cockpit** (voir §3).
3. Rendre le template avec les variables (liste en tête de `Email quotidien.html`).
4. Envoyer — puis journaliser (voir §5).

L'ESP n'est **pas encore choisi** (Resend / Brevo envisagés) : isoler l'envoi derrière une petite interface (`sendDailyEmail(payload)`) pour pouvoir trancher plus tard sans toucher au reste.

**Aucune heure n'est affichée dans le mail** (décision client). L'heure d'envoi est un réglage d'ops, pas un contenu.

## 2. Le contenu du mail (rappel)

| Zone | Source | Obligatoire |
|---|---|---|
| Objet + préheader | pattern « Jour X sur 21 — {teaser} » + menu en une phrase | oui (générés) |
| Photo du plat du jour | photo du programme, ou photo uploadée dans le cockpit | **non** → fallback typographique (bloc `[SANS-PHOTO]`) |
| Badge « JOUR X / 21 » + semaine | jour courant ; accent S1 `#4E7A3C` / S2 `#E2A21E` / S3 `#C2552A` | oui |
| Titre | « Ta journée est prête, {prénom} » (J1 : « C'est le grand matin, {prénom} ») | oui |
| Le mot de Laurent | défaut du jour, **modifiable dans le cockpit** | oui (fallback générique : « Belle journée — écris-moi si tu as besoin. ») |
| Menu : 3 repas | titres seulement (pas d'ingrédients) — défauts du programme ou menus édités | oui |
| Chip « AJUSTÉ POUR TOI » | affichée si une surcharge **propre à cette cliente** existe (menu, photo ou mot) | conditionnel |
| CTA « Ouvrir ma journée → » | lien vers `/jour` | oui |
| « gérer mes emails » | page de préférences email (obligation légale de désinscription) | oui |

L'accent de semaine colore **uniquement** badge, eyebrow semaine, créneaux des repas et numéro du fallback — **jamais** le CTA (terracotta) ni les surfaces.

## 3. Sources de contenu — ⚠️ respecter la non-unification

Rappel d'architecture (intentionnel, **ne pas fusionner**) : l'écran Jour lit le programme statique (`data/verissimo.ts`) ; le backoffice écrit dans Supabase (`meal_plans`).

Le **renderer email compose à la volée**, sans unifier les sources :

```
contenu(jour, cliente) =
  défauts du programme statique (titres des 3 repas, photo du jour si fournie)
  ⊕ menus édités globalement par le coach (meal_plans, s'ils existent pour ce jour)
  ⊕ surcharges propres à la cliente (daily_email_overrides, §4)
```

Priorité croissante de gauche à droite. Si aucune surcharge n'existe : le mail part tout seul avec les défauts — **le coach n'a rien à faire**.

## 4. Modèle de données proposé

Nouvelle table Supabase `daily_email_overrides` :

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid pk | |
| `client_id` | uuid **nullable** | `null` = surcharge **globale** (tous) ; sinon propre à la cliente |
| `day` | int 1–21 | unique avec `client_id` |
| `mot_du_jour` | text nullable | remplace le mot par défaut |
| `photo_url` | text nullable | upload coach (Supabase Storage), pré-recadrée ~1200×480 |
| `meals` | jsonb nullable | `[{slot, title}]` ×3 — sinon menus de `meal_plans` / du programme |
| `updated_at` | timestamptz | |

- Les **mots du jour par défaut** (21 textes) sont du contenu à rédiger avec Laurent — stockés comme surcharges globales (`client_id = null`) pour être éditables sans redéploiement.
- Règle de la chip « AJUSTÉ POUR TOI » : affichée **uniquement** si une ligne avec `client_id = <cliente>` existe pour ce jour. Une édition globale n'affiche pas la chip.

## 5. Envoi & ops

- **Idempotence** : table `daily_email_log` (`client_id` × `day` uniques, statut, horodatage) — jamais deux envois du même jour, même si le cron rejoue.
- **Fuseau** : jour courant et heure d'envoi calculés en `Europe/Paris`.
- **Désinscription** : « gérer mes emails » → page de préférences (pause / arrêt des mails quotidiens sans quitter le programme). Le programme continue dans l'appli.
- **Test coach** : bouton « M'envoyer un test » dans le cockpit (rend le mail du jour sélectionné vers l'email du coach).
- Webfonts Google avec fallbacks `Trebuchet MS` / `Helvetica` (déjà dans le template) ; `object-fit` de la photo dégrade proprement — servir des images **pré-recadrées** au bon ratio.

## 6. Écran cockpit « Mail du matin » (thème sombre `.theme-coach`)

> Le cockpit garde son thème sombre (`#0f1117`, lime `#dce03d`, menthe `#62ce9d`, cyan `#26c5ce`). **Ne jamais** y importer le thème clair « Édito tonique ». Suivre les patterns de l'admin existant (repo `btenergy`) — pas de maquette dédiée dans ce bundle.

Fonctionnel attendu :

1. **Vue programme** : les 21 jours en liste, avec statut par jour — `Défaut` / `Édité` (global) / badge par cliente si surcharge individuelle.
2. **Éditeur d'un jour** :
   - **Mot du jour** : textarea pré-rempli avec le défaut ; compteur souple (~220 caractères conseillés) ;
   - **Photo** : upload + recadrage au ratio du bandeau (~5:2) ; état « aucune photo » montré comme légitime (le mail a son fallback) ;
   - **Menu** : les 3 titres (repris de `meal_plans` — l'édition des repas reste dans l'éditeur de menus existant, ne pas dupliquer) ;
   - **Portée** : « pour tout le monde » / « pour {cliente} » (crée la ligne `client_id` correspondante) ;
   - **Revenir au défaut** : supprime la surcharge ;
   - **Aperçu live** du mail rendu (iframe du template) + « M'envoyer un test ».
3. **Garde-fous wording** (à afficher en hint dans l'éditeur) : tutoiement, jamais le mot « cure », pas de chiffres corporels, ton ami direct — ni donneur de leçon ni mièvre.

## 7. Hors périmètre (décisions du 12/06)

- Pas de mails de jalons (J8/J15), de clôture J21, de rappel courses fraîches ni de relance d'inactivité — **seul le quotidien du matin** est retenu pour l'instant.
- Pas de personnalisation de l'heure d'envoi par cliente.
- L'invitation J-1 existe déjà (template `email-templates/email-invitation.html`, aperçu `Email invitation.html`) et garde son circuit (envoyée à la création de l'accès).
