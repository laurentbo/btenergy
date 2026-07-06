// ─── Back to Energy — Email Templates ─────────────────────────────────────────
// Design : crème chaud, Instrument Serif, ton Camille, tutoiement strict.
// Toutes les variables {prenom}, {magic_link}, etc. sont injectées en TypeScript.
// En prod : NEXT_PUBLIC_LOGO_URL doit pointer vers l'URL absolue CDN du logo.

const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL ?? ""
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://backtoenergy.fr"

// ─── Chrome partagé ──────────────────────────────────────────────────────────

const DOCTYPE = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#EEE7D6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#2A2520;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EEE7D6;">
  <tr><td align="center" style="padding:56px 24px;">
    <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;">`

const CLOSE = `
    </table>
  </td></tr>
</table>
</body>
</html>`

function logoRow(): string {
  if (!LOGO_URL) return ""
  return `
      <tr><td style="padding-bottom:36px;">
        <img src="${LOGO_URL}" alt="Back to Energy" width="138" height="32" style="display:block;width:138px;height:32px;border:0;outline:none;">
      </td></tr>`
}

function card(content: string): string {
  return `
      <tr><td style="background:#FBF6E8;border:1px solid #E2D9C0;border-radius:14px;padding:44px 40px;">
${content}
      </td></tr>`
}

function cta(url: string, label: string): string {
  return `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;">
          <tr><td style="background:#2A2520;border-radius:999px;">
            <a href="${url}"
               style="display:inline-block;padding:13px 26px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#F5EFE2;text-decoration:none;letter-spacing:0.01em;">
              ${label}
            </a>
          </td></tr>
        </table>`
}

function signature(tagline?: string): string {
  return `
        <p style="margin:0 0 6px;font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-style:italic;font-size:17px;color:#7B8A78;line-height:1.5;">— Camille</p>
        <p style="margin:0;font-size:12.5px;color:#8A7E68;line-height:1.6;">${tagline ?? "Écris-moi quand tu veux."}</p>`
}

function footer(replyable = true): string {
  const lines = replyable
    ? "back to energy · backtoenergy.fr · Tu peux répondre à cet email."
    : "back to energy · backtoenergy.fr"
  return `
      <tr><td style="padding:24px 6px 0;">
        <p style="margin:0;font-size:11px;color:#A89E88;line-height:1.7;">${lines}</p>
      </td></tr>`
}

function eyebrow(text: string): string {
  return `<p style="margin:0 0 6px;font-size:11.5px;letter-spacing:0.16em;text-transform:uppercase;color:#A89E88;">${text}</p>`
}

// ─── BIENVENUE ───────────────────────────────────────────────────────────────

export function welcomeEmail(prenom: string, _appUrl: string = SITE): string {
  const nom = cap(prenom)
  return DOCTYPE + logoRow() + card(`
        ${eyebrow("une lettre · jour 0")}
        <p style="margin:0 0 24px;font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-size:30px;line-height:1.15;color:#2A2520;letter-spacing:-0.015em;">
          Bonjour <em style="font-style:italic;color:#7B8A78;">${nom}</em>.
        </p>

        <p style="margin:0 0 16px;font-size:15.5px;line-height:1.75;color:#3D362D;">
          Merci de me faire confiance pour ces trois semaines. On a tout le temps qu'il faut, et il n'y a rien d'autre à faire que d'y aller doucement.
        </p>
        <p style="margin:0 0 32px;font-size:15.5px;line-height:1.75;color:#3D362D;">
          Voilà ce qui t'attend.
        </p>

        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#A89E88;font-weight:500;">la méthode</p>
        <p style="margin:0 0 10px;font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-style:italic;font-size:22px;color:#2A2520;line-height:1.2;">Verissimo</p>
        <p style="margin:0 0 28px;font-size:14.5px;line-height:1.75;color:#3D362D;">
          Le programme s'appuie sur la méthode pensée par le naturopathe Jean-Pierre Verissimo. C'est une manière de manger qui respecte le rythme de la digestion — pas un régime, pas une cure. On enlève simplement ce qui charge le corps, et on laisse le reste faire son travail.
        </p>

        <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#A89E88;font-weight:500;">l'application</p>
        <p style="margin:0 0 12px;font-size:14.5px;line-height:1.75;color:#3D362D;">
          Tu y trouveras, chaque jour&nbsp;:
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
          <tr><td style="padding:9px 0;border-top:1px solid #EAE2CB;">
            <span style="font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-style:italic;font-size:14px;color:#A89E88;display:inline-block;width:80px;">au matin</span>
            <span style="font-size:14px;color:#3D362D;">un mot de moi pour la journée</span>
          </td></tr>
          <tr><td style="padding:9px 0;border-top:1px solid #EAE2CB;">
            <span style="font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-style:italic;font-size:14px;color:#A89E88;display:inline-block;width:80px;">les repas</span>
            <span style="font-size:14px;color:#3D362D;">composés selon le moment du parcours</span>
          </td></tr>
          <tr><td style="padding:9px 0;border-top:1px solid #EAE2CB;">
            <span style="font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-style:italic;font-size:14px;color:#A89E88;display:inline-block;width:80px;">le journal</span>
            <span style="font-size:14px;color:#3D362D;">qu'on remplit à deux (texte, photo, comme tu veux)</span>
          </td></tr>
          <tr><td style="padding:9px 0;border-top:1px solid #EAE2CB;">
            <span style="font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-style:italic;font-size:14px;color:#A89E88;display:inline-block;width:80px;">ton parcours</span>
            <span style="font-size:14px;color:#3D362D;">la ligne des 21 jours, sans score</span>
          </td></tr>
          <tr><td style="padding:9px 0;border-top:1px solid #EAE2CB;border-bottom:1px solid #EAE2CB;">
            <span style="font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-style:italic;font-size:14px;color:#A89E88;display:inline-block;width:80px;">les repères</span>
            <span style="font-size:14px;color:#3D362D;">de la méthode, à consulter quand tu veux</span>
          </td></tr>
        </table>

        <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#A89E88;font-weight:500;">le rythme</p>
        <p style="margin:0 0 14px;font-size:14.5px;line-height:1.75;color:#3D362D;">Trois semaines, trois chapitres.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;">
          <tr><td style="padding:9px 0;">
            <span style="font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-style:italic;font-size:16px;color:#7B8A78;">Détox</span>
            <span style="font-size:12.5px;color:#8A7E68;"> &nbsp;jours 1–7</span>
            <p style="margin:3px 0 0;font-size:13.5px;color:#4A4138;line-height:1.6;">On allège, on laisse le corps souffler.</p>
          </td></tr>
          <tr><td style="padding:9px 0;">
            <span style="font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-style:italic;font-size:16px;color:#7B8A78;">Énergie</span>
            <span style="font-size:12.5px;color:#8A7E68;"> &nbsp;jours 8–14</span>
            <p style="margin:3px 0 0;font-size:13.5px;color:#4A4138;line-height:1.6;">Il retrouve son rythme, on remet du jeu.</p>
          </td></tr>
          <tr><td style="padding:9px 0;">
            <span style="font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-style:italic;font-size:16px;color:#7B8A78;">Ancrage</span>
            <span style="font-size:12.5px;color:#8A7E68;"> &nbsp;jours 15–21</span>
            <p style="margin:3px 0 0;font-size:13.5px;color:#4A4138;line-height:1.6;">On installe ce qui restera après.</p>
          </td></tr>
        </table>

        ${cta(SITE, "Ouvrir l'application")}
        ${signature()}
`) + footer(true) + CLOSE
}

// ─── MAGIC LINK ──────────────────────────────────────────────────────────────

export function magicLinkEmail(prenom: string, url: string): string {
  const nom = cap(prenom)
  return DOCTYPE + logoRow() + card(`
        <p style="margin:0 0 22px;font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-size:22px;line-height:1.4;color:#2A2520;letter-spacing:-0.005em;">Bonjour ${nom},</p>

        <p style="margin:0 0 14px;font-size:15.5px;line-height:1.7;color:#4A4138;">
          Voilà ton accès à l'application. Tu peux y entrer sans mot de passe en passant par ce lien.
        </p>
        <p style="margin:0 0 32px;font-size:14px;line-height:1.7;color:#6A6157;">
          Il reste valable une heure, et fonctionne une seule fois.
        </p>

        ${cta(url, "Ouvrir l'application")}
        ${signature("Ta coach.")}
`) + `
      <tr><td style="padding:24px 6px 0;">
        <p style="margin:0 0 4px;font-size:11.5px;color:#8A7E68;line-height:1.7;">
          Tu n'as pas demandé ce lien ? Ignore simplement cet email, ton compte reste en sécurité.
        </p>
        <p style="margin:14px 0 0;font-size:11px;color:#A89E88;line-height:1.7;">
          back to energy · backtoenergy.fr
        </p>
      </td></tr>` + CLOSE
}

// ─── RESET PASSWORD (coach uniquement) ──────────────────────────────────────

export function resetPasswordEmail(_prenom: string, url: string): string {
  return DOCTYPE + logoRow() + card(`
        <p style="margin:0 0 22px;font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-size:22px;line-height:1.4;color:#2A2520;letter-spacing:-0.005em;">Bonjour,</p>

        <p style="margin:0 0 14px;font-size:15.5px;line-height:1.7;color:#4A4138;">
          Tu peux choisir un nouveau mot de passe en passant par ce lien.
        </p>
        <p style="margin:0 0 32px;font-size:14px;line-height:1.7;color:#6A6157;">
          Il reste valable une heure.
        </p>

        ${cta(url, "Choisir un nouveau mot de passe")}
        <p style="margin:0;font-size:13px;color:#6A6157;line-height:1.65;">
          Si tu n'as pas fait cette demande, tu peux ignorer cet email. Ton compte reste en sécurité.
        </p>
`) + footer(false) + CLOSE
}

// ─── JOUR 1 — premier matin, chapitre Détox ──────────────────────────────────
// Les repas sont issus de PROGRAM_NEW[0] pour garantir la cohérence avec l'app.

import { PROGRAM_NEW } from "@/data/program"

function mealRow(time: string, label: string, items: string): string {
  return `
          <tr>
            <td style="padding:11px 0;border-bottom:1px solid #EAE2CB;width:50px;vertical-align:top;font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-style:italic;font-size:14px;color:#A89E88;">${time}</td>
            <td style="padding:11px 0;border-bottom:1px solid #EAE2CB;">
              <div style="font-size:14.5px;color:#2A2520;margin-bottom:3px;">${label}</div>
              <div style="font-size:13px;color:#6A6157;line-height:1.55;">${items}</div>
            </td>
          </tr>`
}

export function chapter1Email(prenom: string, appUrl: string = SITE): string {
  const nom = cap(prenom)
  const day1 = PROGRAM_NEW[0]
  const mealsHtml = day1.meals
    .map(m => mealRow(m.time, m.label, m.items))
    .join("")

  return DOCTYPE + logoRow() + card(`
        ${eyebrow("premier matin · jour 1")}
        <p style="margin:0 0 26px;font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-size:28px;line-height:1.2;color:#2A2520;letter-spacing:-0.015em;">
          Premier matin avec <em style="font-style:italic;color:#7B8A78;">toi</em>.
        </p>

        <p style="margin:0 0 16px;font-size:15.5px;line-height:1.75;color:#3D362D;">
          Bonjour ${nom}. On y est.
        </p>
        <p style="margin:0 0 16px;font-size:15.5px;line-height:1.75;color:#3D362D;">
          Cette première semaine, on cherche juste à alléger un peu. Pas de jeûne, pas de privation — on enlève ce qui charge la digestion, et on laisse le corps faire le reste. Si tu as faim, tu manges. Si quelque chose ne te va pas, tu m'écris.
        </p>
        <p style="margin:0 0 28px;font-size:15.5px;line-height:1.75;color:#3D362D;">
          Petite chose pour ce matin : un grand verre d'eau tiède avec un peu de citron, à jeun. Si ça pique, dilue plus, ce n'est pas une règle.
        </p>

        <p style="margin:0 0 14px;font-size:11.5px;letter-spacing:0.16em;text-transform:uppercase;color:#A89E88;">ce qui est prévu aujourd'hui</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 30px;">
          ${mealsHtml}
        </table>

        ${cta(appUrl, "Ouvrir l'application")}
        ${signature()}
`) + footer(true) + CLOSE
}

// ─── JOUR 8 — ouverture chapitre Énergie ─────────────────────────────────────

export function chapter2Email(prenom: string, appUrl: string = SITE): string {
  const nom = cap(prenom)
  return DOCTYPE + logoRow() + card(`
        ${eyebrow("deuxième chapitre · jour 8")}
        <p style="margin:0 0 26px;font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-size:28px;line-height:1.2;color:#2A2520;letter-spacing:-0.015em;">
          Une <em style="font-style:italic;color:#7B8A78;">semaine</em>, déjà.
        </p>

        <p style="margin:0 0 16px;font-size:15.5px;line-height:1.75;color:#3D362D;">Bonjour ${nom}.</p>
        <p style="margin:0 0 16px;font-size:15.5px;line-height:1.75;color:#3D362D;">
          Tu as passé la première semaine. C'est la plus exigeante des trois — le corps lâche ce qu'il garde, c'est rarement confortable. Si tu t'es senti plus léger le matin, c'est exactement ce qu'on cherchait.
        </p>
        <p style="margin:0 0 16px;font-size:15.5px;line-height:1.75;color:#3D362D;">
          Cette semaine, on remet du jeu. Tu vas retrouver des aliments un peu plus riches dans l'app, et l'énergie qui va avec. Si tu sens un coup de fatigue en début de semaine, c'est normal — c'est le passage. Ça s'efface en deux ou trois jours.
        </p>
        <p style="margin:0 0 32px;font-size:15.5px;line-height:1.75;color:#3D362D;">
          On continue à se parler comme on l'a fait.
        </p>

        ${cta(appUrl, "Ouvrir l'application")}
        ${signature("Belle journée.")}
`) + footer(true) + CLOSE
}

// ─── JOUR 15 — ouverture chapitre Ancrage ────────────────────────────────────

export function chapter3Email(prenom: string, appUrl: string = SITE): string {
  const nom = cap(prenom)
  return DOCTYPE + logoRow() + card(`
        ${eyebrow("dernier chapitre · jour 15")}
        <p style="margin:0 0 26px;font-family:'Instrument Serif','Iowan Old Style',Georgia,serif;font-size:28px;line-height:1.2;color:#2A2520;letter-spacing:-0.015em;">
          Ce qui <em style="font-style:italic;color:#7B8A78;">restera</em>.
        </p>

        <p style="margin:0 0 16px;font-size:15.5px;line-height:1.75;color:#3D362D;">Bonjour ${nom}.</p>
        <p style="margin:0 0 16px;font-size:15.5px;line-height:1.75;color:#3D362D;">
          Tu entres dans la dernière semaine. Le plus dur est derrière toi. À partir de maintenant, on ne cherche plus à transformer quoi que ce soit — on installe ce qui peut tenir dans ta vie quand l'application ne sera plus là.
        </p>
        <p style="margin:0 0 16px;font-size:15.5px;line-height:1.75;color:#3D362D;">
          Une chose à la fois. Le matin avec son verre d'eau. Le dîner un peu plus tôt. La fourchette qu'on pose entre les bouchées. Pas tout, juste ce qui tient.
        </p>
        <p style="margin:0 0 32px;font-size:15.5px;line-height:1.75;color:#3D362D;">
          On se retrouve dans le journal cette semaine pour parler de la suite.
        </p>

        ${cta(appUrl, "Ouvrir l'application")}
        ${signature("Profite de ces sept jours.")}
`) + footer(true) + CLOSE
}

// ─── Aliases pour la compatibilité avec le code existant ─────────────────────

/** @deprecated use chapter1Email, chapter2Email, chapter3Email */
export function stepEmail(prenom: string, day: number, appUrl: string): string {
  if (day === 1)  return chapter1Email(prenom, appUrl)
  if (day === 8)  return chapter2Email(prenom, appUrl)
  if (day === 15) return chapter3Email(prenom, appUrl)
  // Jours sans email automatisé — retourne une chaîne vide (route le gère)
  return ""
}

/** @deprecated non utilisé dans le nouveau design */
export function midpointEmail(_prenom: string, _appUrl: string): string { return "" }

/** @deprecated non utilisé dans le nouveau design */
export function postCureEmail(_prenom: string, _appUrl: string): string { return "" }

export function invitationEmail(prenom: string | null, url: string, email = "", tempPassword = ""): string {
  const nom = cap(prenom ?? "")
  const displayPrenom = nom || "toi"
  return `<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>Ton programme t'attend — backtoenergy</title>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Space+Grotesk:wght@500;700&family=Hanken+Grotesk:wght@400;600;700&display=swap" rel="stylesheet" />
<style>
  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
  table { border-collapse: collapse; }
  img { border: 0; display: block; }
  a { text-decoration: none; }
  @media only screen and (max-width: 620px) {
    .bte-container { width: 100% !important; }
    .bte-card-pad { padding: 28px 22px 26px !important; }
  }
</style>
</head>
<body style="margin: 0; padding: 0; background-color: #EFE6CF;">
<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">Tes identifiants pour entrer dans ton programme — on commence bientôt.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #EFE6CF;">
<tr><td align="center" style="padding: 36px 16px 28px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="bte-container" style="width: 600px; max-width: 600px;">
    <tr><td align="center" style="padding: 0 0 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td width="30" height="30" align="center" valign="middle" style="background-color: #4E7A3C; border-radius: 999px; font-family: 'Baloo 2', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 15px; line-height: 30px; color: #EFE6CF;">b</td>
        <td style="padding-left: 10px; font-family: 'Baloo 2', 'Trebuchet MS', Arial, sans-serif; font-weight: 600; font-size: 22px; color: #1E1B14;">backtoenergy</td>
      </tr></table>
    </td></tr>
    <tr><td class="bte-card-pad" style="background-color: #FBF6EA; border: 1.5px solid #E2D4B5; border-radius: 18px; padding: 36px 40px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="font-family: 'Space Grotesk', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #4E7A3C; padding-bottom: 12px;">Ton accès est prêt</td></tr>
        <tr><td style="font-family: 'Baloo 2', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 34px; line-height: 1.05; color: #1E1B14; padding-bottom: 16px;">Bienvenue <span style="color: #E8622A;">${displayPrenom}</span></td></tr>
        <tr><td style="font-family: 'Hanken Grotesk', Helvetica, Arial, sans-serif; font-size: 15.5px; line-height: 1.6; color: #1E1B14; padding-bottom: 24px;">
          Ça y est, ton accès est prêt. Une fois connectée, je te présente en détail comment se déroule ton programme, et c'est toi qui choisis ta date de démarrage — tu commences quand tu es prête. Trois semaines pour nettoyer ton corps en profondeur : tu élimines ce qui t'encrasse, tu allèges ta digestion, et ton énergie revient… tout en te régalant.
          <br /><br />
          Tu es ma toute première testeuse officielle : c'est ton expérience qui me dira si tout fonctionne comme prévu. Le site a été construit avec de l'IA, alors si tu croises une boulette ou un truc qui cloche, dis-le-moi sans hésiter. Je suis là à chaque étape, tu m'écris quand tu veux.
        </td></tr>
        ${email || tempPassword ? `<tr><td style="padding-bottom: 26px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #E9E9D8; border: 1.5px solid #BECBAD; border-radius: 14px;">
            <tr><td style="padding: 20px 22px 18px;">
              <div style="font-family: 'Space Grotesk', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 10.5px; letter-spacing: 2px; text-transform: uppercase; color: #4E7A3C; padding-bottom: 12px;">Tes identifiants de connexion</div>
              ${email ? `<div style="font-family: 'Hanken Grotesk', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.5; color: #1E1B14; padding-bottom: 10px;"><b>Email&nbsp;:</b> ${email}</div>` : ""}
              ${tempPassword ? `<table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td style="font-family: 'Hanken Grotesk', Helvetica, Arial, sans-serif; font-size: 15px; color: #1E1B14; padding-right: 10px;"><b>Mot de passe temporaire&nbsp;:</b></td>
                <td style="background-color: #FBF6EA; border: 1.5px solid #BECBAD; border-radius: 8px; font-family: 'Courier New', Courier, monospace; font-weight: 700; font-size: 14px; color: #4E7A3C; padding: 5px 12px;">${tempPassword}</td>
              </tr></table>` : ""}
            </td></tr>
          </table>
        </td></tr>` : ""}
        <tr><td align="center" style="padding-bottom: 28px;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:50px;v-text-anchor:middle;width:206px;" arcsize="50%" fillcolor="#E8622A" stroke="f">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:'Trebuchet MS',Arial,sans-serif;font-size:15px;font-weight:bold;">Me connecter &rarr;</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <a href="${url}" style="display: inline-block; background-color: #E8622A; border-radius: 999px; font-family: 'Space Grotesk', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 15px; color: #ffffff; padding: 15px 34px; white-space: nowrap;">Me connecter&nbsp;&nbsp;&rarr;</a>
          <!--<![endif]-->
        </td></tr>
        <tr><td style="border-top: 1.5px solid #E2D4B5; font-size: 0; line-height: 0;">&nbsp;</td></tr>
        <tr><td style="font-family: 'Space Grotesk', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #857A61; padding: 22px 0 14px;">Ton parcours en 3 semaines</td></tr>
        <tr><td>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="30" style="padding: 0 0 12px;"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td width="28" height="28" align="center" valign="middle" style="background-color: #4E7A3C; border-radius: 999px; font-family: 'Baloo 2', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 14px; line-height: 28px; color: #ffffff;">1</td></tr></table></td>
              <td style="font-family: 'Hanken Grotesk', Helvetica, Arial, sans-serif; font-size: 14.5px; color: #1E1B14; padding: 0 0 12px 12px;"><b>Semaine 1</b> — Détox &amp; Purification</td>
            </tr>
            <tr>
              <td width="30" style="padding: 0 0 12px;"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td width="28" height="28" align="center" valign="middle" style="background-color: #E2A21E; border-radius: 999px; font-family: 'Baloo 2', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 14px; line-height: 28px; color: #ffffff;">2</td></tr></table></td>
              <td style="font-family: 'Hanken Grotesk', Helvetica, Arial, sans-serif; font-size: 14.5px; color: #1E1B14; padding: 0 0 12px 12px;"><b>Semaine 2</b> — Énergie &amp; Vitalité</td>
            </tr>
            <tr>
              <td width="30"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td width="28" height="28" align="center" valign="middle" style="background-color: #C2552A; border-radius: 999px; font-family: 'Baloo 2', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 14px; line-height: 28px; color: #ffffff;">3</td></tr></table></td>
              <td style="font-family: 'Hanken Grotesk', Helvetica, Arial, sans-serif; font-size: 14.5px; color: #1E1B14; padding-left: 12px;"><b>Semaine 3</b> — Ancrage &amp; Performance</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="font-family: 'Baloo 2', 'Trebuchet MS', Arial, sans-serif; font-weight: 600; font-size: 16px; color: #4E7A3C; padding-top: 26px;">À très vite — Laurent</td></tr>
      </table>
    </td></tr>
    <tr><td align="center" style="font-family: 'Space Grotesk', 'Trebuchet MS', Arial, sans-serif; font-size: 11px; letter-spacing: 1.2px; text-transform: uppercase; color: #857A61; padding: 22px 0 8px;">backtoenergy · programme 21 jours · backtoenergy.fr</td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`
}

// ─── EMAIL QUOTIDIEN — matin, chaque jour du programme (1 → 21) ─────────────
// Variation A « La carte du matin ». Voir design_handoff/email-templates/VARIABLES.md

export type DailyMeal = { slot: string; title: string }

export type DailyEmailPayload = {
  prenom: string
  jour: number               // 1–21, sans zéro
  semaineNum: 1 | 2 | 3
  semaineNom: string
  accent: string              // hex — couleur de semaine, jamais le CTA
  photoUrl?: string | null    // null/absent → en-tête typographique
  motDuJour: string           // sans guillemets, le gabarit les ajoute
  meals: DailyMeal[]          // Petit-déjeuner / Déjeuner / Dîner — titres seulement
  ajuste: boolean             // true → chip « Ajusté pour toi »
  urlApp: string
  urlPrefs: string
  preheader: string
}

export function dailyEmail(p: DailyEmailPayload): string {
  const nom = cap(p.prenom)
  const jourPad = String(p.jour).padStart(2, "0")
  const salutation = p.jour === 1 ? "Ça commence ce matin" : "Ta journée est prête"
  const salutationEmoji = p.jour === 1 ? "🙂" : ""

  const jourBadge = `<td style="background-color: ${p.accent}; border-radius: 999px; font-family: 'Space Grotesk', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 11.5px; color: #ffffff; padding: 5px 13px; white-space: nowrap;">JOUR ${jourPad}&nbsp;/&nbsp;21</td>`

  const heroOrFallback = p.photoUrl
    ? `<tr><td style="padding: 0;">
          <img src="${p.photoUrl}" alt="Le plat du jour" width="600" class="bte-hero" style="width: 100%; height: 240px; object-fit: cover; border-radius: 17px 17px 0 0;" />
        </td></tr>`
    : `<tr><td style="padding: 26px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td align="left" valign="middle">
              <table role="presentation" cellpadding="0" cellspacing="0"><tr>${jourBadge}</tr></table>
            </td>
            <td align="right" valign="middle" style="font-family: 'Baloo 2', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 42px; line-height: 0.9; color: ${p.accent};">${jourPad}</td>
          </tr></table>
        </td></tr>`

  const weekRow = p.photoUrl
    ? `${jourBadge}
        <td style="padding-left: 12px; font-family: 'Space Grotesk', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${p.accent}; white-space: nowrap;">Semaine ${p.semaineNum} · ${p.semaineNom}</td>`
    : `<td style="font-family: 'Space Grotesk', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${p.accent}; white-space: nowrap;">Semaine ${p.semaineNum} · ${p.semaineNom}</td>`

  const ajusteChip = p.ajuste
    ? `<td style="padding-left: 10px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="background-color: #E9E9D8; border: 1.5px solid #BECBAD; border-radius: 999px; font-family: 'Space Grotesk', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 9.5px; letter-spacing: 1.5px; text-transform: uppercase; color: #4E7A3C; padding: 3px 10px; white-space: nowrap;">Ajusté pour toi</td>
          </tr></table>
        </td>`
    : ""

  const mealsHtml = p.meals.map((m, i) => `
        <tr><td style="padding: 12px 0;${i < p.meals.length - 1 ? " border-bottom: 1px solid #E2D4B5;" : ""}">
          <div style="font-family: 'Space Grotesk', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 9.5px; letter-spacing: 1.8px; text-transform: uppercase; color: ${p.accent}; padding-bottom: 3px;">${m.slot}</div>
          <div style="font-family: 'Baloo 2', 'Trebuchet MS', Arial, sans-serif; font-weight: 600; font-size: 17.5px; line-height: 1.2; color: #1E1B14;">${m.title}</div>
        </td></tr>`).join("")

  return `<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>Jour ${p.jour} sur 21 — backtoenergy</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Space+Grotesk:wght@500;700&family=Hanken+Grotesk:wght@400;600;700&display=swap" rel="stylesheet" />
<style>
  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table { border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0; }
  img { border: 0; outline: none; line-height: 100%; -ms-interpolation-mode: bicubic; display: block; }
  a { text-decoration: none; }
  @media only screen and (max-width: 620px) {
    .bte-container { width: 100% !important; }
    .bte-card-pad { padding: 22px 20px 24px !important; }
    .bte-hero { height: 200px !important; }
  }
</style>
</head>
<body style="margin: 0; padding: 0; background-color: #EFE6CF;">

<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${p.preheader}</div>
<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #EFE6CF;">
<tr><td align="center" style="padding: 30px 16px 24px;">

  <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="bte-container" style="width: 600px; max-width: 600px;">

    <tr><td align="center" style="padding: 0 0 20px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td width="30" height="30" align="center" valign="middle" style="background-color: #4E7A3C; border-radius: 999px; font-family: 'Baloo 2', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 15px; line-height: 30px; color: #EFE6CF;">b</td>
        <td style="padding-left: 10px; font-family: 'Baloo 2', 'Trebuchet MS', Arial, sans-serif; font-weight: 600; font-size: 22px; color: #1E1B14;">backtoenergy</td>
      </tr></table>
    </td></tr>

    <tr><td style="background-color: #FBF6EA; border: 1.5px solid #E2D4B5; border-radius: 18px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

        ${heroOrFallback}

        <tr><td class="bte-card-pad" style="padding: 22px 28px 26px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

            <tr><td style="padding-bottom: 12px;">
              <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                ${weekRow}
                ${ajusteChip}
              </tr></table>
            </td></tr>

            <tr><td style="font-family: 'Baloo 2', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 28px; line-height: 1.08; color: #1E1B14; padding-bottom: 16px;">${salutation}, <span style="color: #E8622A;">${nom}</span>${salutationEmoji ? `&nbsp;${salutationEmoji}` : ""}</td></tr>

            <tr><td style="padding-bottom: 22px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1E1B14; border-radius: 14px;">
                <tr><td style="padding: 15px 16px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td width="36" valign="top">
                      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                        <td width="36" height="36" align="center" valign="middle" style="background-color: #F2B431; border-radius: 999px; font-family: 'Baloo 2', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 17px; line-height: 36px; color: #1E1B14;">L</td>
                      </tr></table>
                    </td>
                    <td style="padding-left: 12px;">
                      <div style="font-family: 'Space Grotesk', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 9.5px; letter-spacing: 2px; text-transform: uppercase; color: rgba(251,246,234,0.55); padding-bottom: 4px;">Le mot de Laurent</div>
                      <div style="font-family: 'Baloo 2', 'Trebuchet MS', Arial, sans-serif; font-weight: 600; font-size: 14.5px; line-height: 1.45; color: #FBF6EA;">«&nbsp;${p.motDuJour}&nbsp;»</div>
                    </td>
                  </tr></table>
                </td></tr>
              </table>
            </td></tr>

            <tr><td style="font-family: 'Space Grotesk', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #857A61; padding-bottom: 2px;">Au menu aujourd'hui</td></tr>
            <tr><td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${mealsHtml}
              </table>
            </td></tr>

            <tr><td align="center" style="padding: 20px 0 0;">
              <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${p.urlApp}" style="height:50px;v-text-anchor:middle;width:248px;" arcsize="50%" fillcolor="#E8622A" stroke="f">
                <w:anchorlock/>
                <center style="color:#ffffff;font-family:'Trebuchet MS',Arial,sans-serif;font-size:15px;font-weight:bold;">Ouvrir ma journée &rarr;</center>
              </v:roundrect>
              <![endif]-->
              <!--[if !mso]><!-->
              <a href="${p.urlApp}" style="display: inline-block; background-color: #E8622A; border-radius: 999px; font-family: 'Space Grotesk', 'Trebuchet MS', Arial, sans-serif; font-weight: 700; font-size: 15px; color: #ffffff; padding: 15px 34px; white-space: nowrap;">Ouvrir ma journée&nbsp;&nbsp;&rarr;</a>
              <!--<![endif]-->
            </td></tr>
            <tr><td align="center" style="font-family: 'Hanken Grotesk', Helvetica, Arial, sans-serif; font-size: 12.5px; line-height: 1.45; color: #857A61; padding-top: 12px;">Recettes, échanges possibles et le «&nbsp;pourquoi&nbsp;» de chaque assiette — tout est dans l'appli.</td></tr>

          </table>
        </td></tr>

      </table>
    </td></tr>

    <tr><td align="center" style="font-family: 'Space Grotesk', 'Trebuchet MS', Arial, sans-serif; font-size: 11px; letter-spacing: 1.2px; text-transform: uppercase; color: #857A61; padding: 20px 0 8px; line-height: 2;">
      backtoenergy · jour ${p.jour} sur 21<br />
      <a href="${p.urlPrefs}" style="color: #857A61; text-decoration: underline; text-underline-offset: 2px;">gérer mes emails</a>
    </td></tr>

  </table>

</td></tr>
</table>

</body>
</html>`
}

// ─── Utilitaire ──────────────────────────────────────────────────────────────

function cap(s: string): string {
  if (!s) return ""
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
