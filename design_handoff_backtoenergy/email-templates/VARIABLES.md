# Templates email — variables &amp; intégration

Livrables d'intégration pour Claude Code (repo `btenergy`). Deux templates **Handlebars** (placeholders `{{var}}`, conditions `{{#if}}`, boucle `{{#each}}`), bulletproofés Outlook (VML sur les boutons, ghost `OfficeDocumentSettings`, spacer de préheader).

| Fichier | Mail | Déclencheur |
|---|---|---|
| `email-quotidien.html` | Quotidien du matin (variation A « La carte du matin ») | cron ~6h Europe/Paris, chaque jour du programme |
| `email-invitation.html` | Invitation J-1 | à la création de l'accès cliente |

> Les fichiers `Email quotidien.html` / `Email invitation.html` à la racine du projet sont les **aperçus rendus** (données d'exemple) pour validation visuelle — pas les templates. La source d'intégration, c'est **ce dossier**.

Moteur non imposé : si tu n'utilises pas Handlebars, les `{{...}}` sont de simples interpolations et `{{#if}}` / `{{#each}}` se transposent en `if` / `.map()` TS. Isoler l'envoi derrière `sendDailyEmail(payload)` / `sendInviteEmail(payload)` (ESP pas encore tranché — Resend/Brevo).

---

## 1. Email quotidien — `email-quotidien.html`

### Variables

| Variable | Type | Notes |
|---|---|---|
| `preheader` | string | Le menu en une phrase (texte d'aperçu boîte de réception). |
| `prenom` | string | Prénom de la cliente. |
| `jour` | int 1–21 | Numéro du jour (sans zéro) — titre `<title>` + footer. |
| `jour_pad` | string | Numéro sur 2 chiffres (`"01"`…`"21"`) — badge + fallback. |
| `semaine_num` | 1 \| 2 \| 3 | |
| `semaine_nom` | string | `Détox & Purification` \| `Énergie & Vitalité` \| `Ancrage & Performance` |
| `accent` | hex | Accent de semaine — voir table ci-dessous. **Colore badge, eyebrow semaine, créneaux repas, numéro du fallback. JAMAIS le CTA.** |
| `salutation` | string | `Ça commence ce matin` (J1) \| `Ta journée est prête` (J2→J21). |
| `salutation_emoji` | string \| null | Emoji optionnel après le prénom (ex. J1 : `🙂`). Vide/absent → rien. |
| `photo_url` | string \| null | Photo du plat (~1200×480, ratio 5:2). **Null/absent → en-tête typographique** (bloc `{{else}}`). |
| `mot_du_jour` | string | Texte de Laurent, **sans** guillemets (le gabarit ajoute « … »). |
| `meals` | `[{slot,title}]` ×3 | `slot` = `Petit-déjeuner` \| `Déjeuner` \| `Dîner` ; `title` = intitulé du plat. Titres seulement, pas d'ingrédients. |
| `ajuste` | bool | `true` → chip « Ajusté pour toi » (jour personnalisé pour CETTE cliente). |
| `url_app` | string | Lien CTA vers `/jour`. |
| `url_prefs` | string | Lien « gérer mes emails » (désinscription, obligatoire). |

### Accent de semaine

| Semaine | `accent` |
|---|---|
| 1 — Détox &amp; Purification | `#4E7A3C` |
| 2 — Énergie &amp; Vitalité | `#E2A21E` |
| 3 — Ancrage &amp; Performance | `#C2552A` |

### Objet (à générer hors corps)

- **J1** : `Jour 1 sur 21 — on lance ta première journée`
- **défaut** : `Jour {{jour}} sur 21 — ta journée est prête`

### États (couverts par les conditions du template)

1. **Défaut** — `photo_url` présent, `ajuste:false` → photo en tête, badge sur la carte.
2. **Sans photo** — `photo_url:null` → en-tête typographique (badge + grand numéro à l'accent). Le mail reste impeccable.
3. **Personnalisé** — `ajuste:true` → chip « Ajusté pour toi » à côté de l'eyebrow semaine.

### Payload d'exemple (J1)

```json
{
  "preheader": "Fruits & oléagineux au réveil, buddha bowl à midi, dal coco le soir.",
  "prenom": "Cécile",
  "jour": 1,
  "jour_pad": "01",
  "semaine_num": 1,
  "semaine_nom": "Détox & Purification",
  "accent": "#4E7A3C",
  "salutation": "Ça commence ce matin",
  "salutation_emoji": "",
  "photo_url": "https://…/dejeuner-buddha.jpg",
  "mot_du_jour": "Premier matin ! Vas-y tranquille : tout est prévu, tu n'as qu'à suivre. Écris-moi ce soir pour me dire comment tu te sens.",
  "meals": [
    { "slot": "Petit-déjeuner", "title": "Fruits & oléagineux, miel-citron" },
    { "slot": "Déjeuner", "title": "Buddha bowl de printemps" },
    { "slot": "Dîner", "title": "Dal de lentilles corail au lait de coco" }
  ],
  "ajuste": false,
  "url_app": "https://backtoenergy.fr/jour",
  "url_prefs": "https://backtoenergy.fr/profil"
}
```

---

## 2. Email invitation — `email-invitation.html`

### Variables

| Variable | Type | Notes |
|---|---|---|
| `prenom` | string | Prénom de la cliente. |
| `email` | string | Email de connexion (= identifiant). |
| `mot_de_passe` | string | Mot de passe temporaire généré. |
| `url_connexion` | string | Lien CTA vers la page de connexion. |

Le reste (intro, parcours 3 semaines, signature « À très vite — Laurent ») est du **copy fixe** : ne pas templater.

### Objet / préheader

- **Objet** : `Ton accès backtoenergy est prêt`
- **Préheader** : `Tes identifiants pour entrer dans ton programme — on commence bientôt.`

### Payload d'exemple

```json
{
  "prenom": "Cécile",
  "email": "cecile.m@email.fr",
  "mot_de_passe": "76a901af",
  "url_connexion": "https://backtoenergy.fr"
}
```

---

## 3. Garde-fous (wording &amp; rendu)

- **Ton** : tutoiement partout, ami direct. Jamais le mot « cure » (dire « programme » / « tes 21 jours »). **Zéro chiffre corporel** (calories, poids, scores). Ni donneur de leçon, ni mièvre.
- **Aucune heure** affichée dans le mail (décision client) — l'heure d'envoi est un réglage d'ops.
- Servir des photos **pré-recadrées** au bon ratio (~5:2) : `object-fit: cover` dégrade proprement, mais une image au mauvais ratio se verra.
- Webfonts Google avec fallbacks `Trebuchet MS` / `Helvetica` (déjà dans les templates). Sous Outlook desktop, les coins arrondis des encarts sombres tombent en angles droits — voulu/acceptable.
- Désinscription `url_prefs` obligatoire dans le quotidien (page pause/arrêt sans quitter le programme).

Voir `../BACKOFFICE-EMAIL.md` pour le pipeline complet, le modèle de données et l'admin cockpit.
