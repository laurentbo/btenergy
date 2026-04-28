import { PROGRAM, WEEK_THEMES } from "@/data/program"

const BASE = `
  <!DOCTYPE html><html lang="fr">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
  <body style="margin:0;padding:0;background:#070d0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070d0f;">
  <tr><td align="center" style="padding:40px 20px;">
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
`
const CLOSE = `
  </table></td></tr></table>
  </body></html>
`

function header() {
  return `
  <tr><td align="center" style="padding-bottom:28px;">
    <table cellpadding="0" cellspacing="0">
      <tr><td align="center" style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#2dd4a0,#4cc9f0);text-align:center;vertical-align:middle;">
        <span style="font-size:22px;font-weight:900;color:#070d0f;line-height:48px;">B</span>
      </td></tr>
      <tr><td align="center" style="padding-top:8px;font-size:13px;font-weight:700;letter-spacing:0.2em;color:#ffffff;">BTENERGY</td></tr>
    </table>
  </td></tr>
  `
}

function card(content: string) {
  return `
  <tr><td style="background:#0d1f2d;border:1px solid rgba(76,201,240,0.18);border-radius:20px;padding:36px;">
    ${content}
  </td></tr>
  `
}

function footer() {
  return `
  <tr><td align="center" style="padding-top:28px;">
    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);line-height:1.8;">
      BTENERGY · backtoenergy.fr<br>
      Ce message est automatique, merci de ne pas y répondre.
    </p>
  </td></tr>
  `
}

function btn(url: string, label: string) {
  return `
  <table cellpadding="0" cellspacing="0" style="margin:28px auto 0;">
    <tr><td align="center" style="border-radius:12px;background:linear-gradient(135deg,#2dd4a0,#4cc9f0);">
      <a href="${url}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#070d0f;text-decoration:none;letter-spacing:0.02em;">${label}</a>
    </td></tr>
  </table>
  `
}

// ─── MAGIC LINK ─────────────────────────────────────────────────────────────

export function magicLinkEmail(prenom: string, url: string): string {
  const nom = prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase()
  return BASE + header() + card(`
    <p style="margin:0 0 6px;font-size:13px;font-weight:600;letter-spacing:0.12em;color:#4cc9f0;text-transform:uppercase;">Connexion sécurisée</p>
    <h1 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#ffffff;line-height:1.2;">Bonjour ${nom} 👋</h1>
    <p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.65);line-height:1.7;">
      Cliquez sur le bouton ci-dessous pour accéder à votre programme BTENERGY.<br>
      Ce lien est valable <strong style="color:#ffffff;">1 heure</strong> et ne peut être utilisé qu'une seule fois.
    </p>
    ${btn(url, "Accéder à mon programme →")}
    <p style="margin:24px 0 0;font-size:12px;color:rgba(255,255,255,0.35);text-align:center;">
      Si vous n'avez pas demandé ce lien, ignorez cet email.
    </p>
  `) + footer() + CLOSE
}

// ─── BIENVENUE ───────────────────────────────────────────────────────────────

export function welcomeEmail(prenom: string, appUrl: string): string {
  const nom = prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase()
  return BASE + header() + card(`
    <p style="margin:0 0 6px;font-size:13px;font-weight:600;letter-spacing:0.12em;color:#2dd4a0;text-transform:uppercase;">Accès confirmé</p>
    <h1 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#ffffff;line-height:1.2;">Bienvenue ${nom} 🌱</h1>
    <p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.65);line-height:1.7;">
      Votre accès au programme <strong style="color:#ffffff;">BTENERGY 21 Jours</strong> est activé.<br>
      Votre parcours Détox &amp; Énergie commence maintenant.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${["🌅 Semaine 1 — Détox &amp; Purification", "⚡ Semaine 2 — Énergie &amp; Vitalité", "🏔️ Semaine 3 — Ancrage &amp; Performance"].map(s => `
        <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
          <span style="font-size:14px;color:rgba(255,255,255,0.7);">${s}</span>
        </td></tr>
      `).join("")}
    </table>
    ${btn(appUrl, "Démarrer mon programme →")}
  `) + footer() + CLOSE
}

// ─── RESET PASSWORD ──────────────────────────────────────────────────────────

export function resetPasswordEmail(prenom: string, url: string): string {
  const nom = prenom ? prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase() : "Coach"
  return BASE + header() + card(`
    <p style="margin:0 0 6px;font-size:13px;font-weight:600;letter-spacing:0.12em;color:#f87171;text-transform:uppercase;">Sécurité</p>
    <h1 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#ffffff;line-height:1.2;">Réinitialisation<br>du mot de passe</h1>
    <p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.65);line-height:1.7;">
      Bonjour ${nom},<br><br>
      Une demande de réinitialisation de mot de passe a été effectuée pour votre compte coach BTENERGY.<br>
      Ce lien est valable <strong style="color:#ffffff;">1 heure</strong>.
    </p>
    ${btn(url, "Réinitialiser mon mot de passe →")}
    <p style="margin:24px 0 0;font-size:12px;color:rgba(255,255,255,0.35);text-align:center;">
      Si vous n'avez pas fait cette demande, ignorez cet email — votre mot de passe reste inchangé.
    </p>
  `) + footer() + CLOSE
}

// ─── STEP EMAIL ──────────────────────────────────────────────────────────────

const WEEK_COLORS: Record<number, string> = { 1: "#4cc9f0", 2: "#2dd4a0", 3: "#818cf8" }

export function stepEmail(prenom: string, day: number, appUrl: string): string {
  const nom = prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase()
  const prog = PROGRAM[day - 1]
  const weekInfo = WEEK_THEMES[prog.week]
  const color = WEEK_COLORS[prog.week] ?? "#4cc9f0"

  const meals = prog.meals.map(m => {
    const label = { matin: "Petit-déjeuner", midi: "Déjeuner", "après-midi": "Collation", soir: "Dîner" }[m.moment] ?? m.moment
    return `
      <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.1em;color:${color};text-transform:uppercase;">${label}</p>
        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;">${m.items.slice(0, 4).join(" · ")}${m.items.length > 4 ? " ···" : ""}</p>
      </td></tr>
    `
  }).join("")

  return BASE + header() + card(`
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td>
          <span style="display:inline-block;padding:4px 10px;border-radius:6px;background:rgba(76,201,240,0.1);border:1px solid ${color}30;font-size:11px;font-weight:700;letter-spacing:0.1em;color:${color};text-transform:uppercase;">${weekInfo.title}</span>
        </td>
        <td align="right">
          <span style="display:inline-block;width:52px;height:52px;border-radius:14px;background:${color}12;border:1px solid ${color}25;text-align:center;line-height:52px;font-size:26px;font-weight:900;color:#ffffff;">
            ${day}
          </span>
        </td>
      </tr>
    </table>
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:900;color:#ffffff;line-height:1.2;">Jour ${day} — ${prog.theme}</h1>
    <p style="margin:0 0 24px;font-size:14px;font-style:italic;color:${color};opacity:0.85;line-height:1.6;">"${prog.intention}"</p>

    <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.1em;color:rgba(255,255,255,0.4);text-transform:uppercase;">Au menu aujourd'hui</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">${meals}</table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;margin-bottom:20px;">
      <tr><td style="padding:0 16px 12px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.1em;color:rgba(255,255,255,0.4);text-transform:uppercase;">Rituels du jour</p>
        <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.6;">🌅 <strong style="color:#ffffff;">Matin :</strong> ${prog.ritual.matin}</p>
        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.6;">🌙 <strong style="color:#ffffff;">Soir :</strong> ${prog.ritual.soir}</p>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:${color}0e;border:1px solid ${color}20;border-radius:12px;margin-bottom:4px;">
      <tr><td style="padding:14px 16px;">
        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.75);line-height:1.65;">✨ <strong style="color:#ffffff;">Conseil du jour :</strong> ${prog.tip}</p>
      </td></tr>
    </table>

    ${btn(`${appUrl}`, "Voir mon programme du jour →")}
    <p style="margin:20px 0 0;text-align:center;font-size:12px;color:rgba(255,255,255,0.3);">
      ${nom}, vous êtes au jour ${day}/21. Continuez 💪
    </p>
  `) + footer() + CLOSE
}
