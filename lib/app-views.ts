const G = "#2dd4a0"
const B = "#4cc9f0"
const GRAD = `linear-gradient(135deg,${G},${B})`
const BG = "linear-gradient(160deg,#0b1e38 0%,#07111e 55%,#050e1a 100%)"

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{background:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#fff;min-height:100vh}
.grad{background:${GRAD};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.card{background:rgba(4,10,22,.72);border:1px solid rgba(255,255,255,.08);border-radius:20px}
.btn{display:block;width:100%;padding:16px;border-radius:16px;background:${GRAD};color:#050e1a;font-weight:900;font-size:15px;letter-spacing:.04em;border:none;text-align:center;cursor:pointer}
.sec{color:rgba(255,255,255,.65)}
.muted{color:rgba(255,255,255,.35)}
.tag{display:inline-block;padding:3px 9px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
input{width:100%;padding:12px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:12px;color:#fff;font-size:14px}
input::placeholder{color:rgba(255,255,255,.3)}
label{display:block;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:6px}
.progress{height:6px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden}
.progress-fill{height:100%;border-radius:99px}
`

const LOGO = `<div style="width:48px;height:48px;border-radius:16px;background:${GRAD};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#050e1a;margin:0 auto 16px">B</div>`

function wrap(body: string) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${CSS}</style></head><body>${body}</body></html>`
}

// ─── 1. LOGIN ────────────────────────────────────────────────────────────────

export function viewLogin() {
  return wrap(`
  <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px">
    ${LOGO}
    <p class="grad" style="font-size:22px;font-weight:900;letter-spacing:.01em;text-align:center;margin-bottom:32px">Backtoenergy</p>
    <div class="card" style="width:100%;max-width:380px;padding:28px">
      <h2 style="font-size:17px;font-weight:800;margin-bottom:4px">Accéder à mon programme</h2>
      <p class="sec" style="font-size:13px;margin-bottom:24px">Un lien de connexion sécurisé vous sera envoyé par email.</p>
      <div style="margin-bottom:16px"><label>Email</label><input placeholder="votre@email.com"></div>
      <div class="btn">Recevoir mon lien de connexion →</div>
    </div>
    <p class="muted" style="font-size:12px;margin-top:20px">Vous êtes coach ? →</p>
  </div>`)
}

// ─── 2. ONBOARDING NOUVEL UTILISATEUR ────────────────────────────────────────

export function viewOnboarding() {
  return wrap(`
  <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center">
    ${LOGO}
    <h1 class="grad" style="font-size:30px;font-weight:900;margin-bottom:16px">Bienvenue !</h1>
    <p class="sec" style="font-size:15px;line-height:1.7;margin-bottom:8px">Votre compte <strong style="color:#fff">Backtoenergy</strong> est activé.<br>Votre programme de 21 jours vous attend.</p>
    <p class="muted" style="font-size:13px;margin-bottom:24px">Redirection en cours…</p>
    <div style="width:24px;height:24px;border-radius:50%;border:2px solid ${B};border-top-color:transparent;animation:spin 1s linear infinite;margin:0 auto"></div>
  </div>
  <style>@keyframes spin{to{transform:rotate(360deg)}}</style>`)
}

// ─── 3. WELCOME SCREEN (première connexion) ──────────────────────────────────

export function viewWelcomeScreen() {
  return wrap(`
  <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:#07111e">
    <div style="width:100%;max-width:360px;text-align:center">
      ${LOGO}
      <p style="font-size:36px;font-weight:900;color:#fff;margin-bottom:28px">Laurent</p>
      <div style="background:rgba(255,255,255,.05);border:1px solid rgba(45,212,160,.25);border-radius:20px;padding:28px;text-align:left;margin-bottom:24px;backdrop-filter:blur(20px)">
        <p style="font-size:19px;font-weight:900;color:#fff;margin-bottom:10px">Bienvenue dans votre programme BacktoEnergy.</p>
        <p class="sec" style="font-size:14px;line-height:1.75">Vous avez fait le premier pas vers une énergie durable.</p>
      </div>
      <div class="btn">Commencer mon programme →</div>
    </div>
  </div>`)
}

// ─── 4. ONBOARDING JOUR 1 (règles d'or) ─────────────────────────────────────

export function viewJ1Onboarding() {
  const rules = [
    ["💧", "Eau citronnée à jeun chaque matin, 15 min avant de manger"],
    ["🍽️", "Protéines uniquement avec des légumes — jamais avec des céréales"],
    ["🌙", "Dîner avant 20h, jeûne nocturne de 12h minimum"],
  ]
  return wrap(`
  <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px">
    <div style="width:100%;max-width:360px;text-align:center">
      ${LOGO}
      <h1 class="grad" style="font-size:28px;font-weight:900;margin-bottom:28px">BacktoEnergy</h1>
      <div class="card" style="padding:24px;text-align:left;border-color:rgba(45,212,160,.25);margin-bottom:20px">
        <p style="font-size:15px;font-weight:700;margin-bottom:10px">Bienvenue, Laurent 🌿</p>
        <p class="sec" style="font-size:13px;line-height:1.75;margin-bottom:16px">Votre programme de 21 jours commence aujourd'hui. Voici les 3 règles d'or pour bien démarrer :</p>
        ${rules.map(([icon, text]) => `
          <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">
            <span style="font-size:15px;flex-shrink:0">${icon}</span>
            <p style="font-size:13px;color:rgba(255,255,255,.7);line-height:1.6">${text}</p>
          </div>`).join("")}
      </div>
      <div class="btn">Commencer le Jour 1 →</div>
    </div>
  </div>`)
}

// ─── 5. CONFIG PROFIL ────────────────────────────────────────────────────────

export function viewProfileSetup() {
  const fields = [["Prénom", "Laurent", "text"], ["Genre", "Homme", "text"], ["Âge", "38", "number"], ["Taille (cm)", "178", "number"], ["Poids (kg)", "82", "number"]]
  return wrap(`
  <div style="min-height:100vh;padding:32px 20px">
    <div style="max-width:440px;margin:0 auto">
      <div style="text-align:center;margin-bottom:28px">
        ${LOGO}
        <h1 class="grad" style="font-size:20px;font-weight:900">BacktoEnergy</h1>
      </div>
      <div class="card" style="padding:24px">
        <h2 style="font-size:15px;font-weight:700;margin-bottom:4px">Bienvenue 👋</h2>
        <p class="sec" style="font-size:13px;margin-bottom:20px">Renseignez votre profil pour personnaliser votre programme.</p>
        ${fields.map(([lbl, val]) => `
          <div style="margin-bottom:14px">
            <label>${lbl}</label>
            <input value="${val}" readonly>
          </div>`).join("")}
        <div class="btn" style="margin-top:8px">Démarrer mon programme →</div>
      </div>
      <p class="muted" style="text-align:center;font-size:12px;margin-top:12px">Passer cette étape →</p>
    </div>
  </div>`)
}

// ─── helpers dashboard ───────────────────────────────────────────────────────

function dashHeader(tab: string) {
  const tabs = ["Repas","Journal","Courses","Progrès","💡"]
  const keys = ["programme","journal","courses","progression","principes"]
  return `
  <header style="position:sticky;top:0;z-index:50;padding:12px 20px;background:rgba(5,14,26,.85);backdrop-filter:blur(28px);border-bottom:1px solid rgba(255,255,255,.07)">
    <div style="max-width:640px;margin:0 auto;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:32px;height:32px;border-radius:10px;background:${GRAD};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;color:#050e1a">B</div>
        <span class="grad" style="font-weight:900;font-size:13px">BacktoEnergy</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="tag" style="background:rgba(76,201,240,.1);color:${B};border:1px solid rgba(76,201,240,.25)">S1 · J3</span>
        <span style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.75);font-size:12px;padding:4px 10px;border-radius:10px">Moi ↗</span>
      </div>
    </div>
  </header>
  <div style="max-width:640px;margin:0 auto;padding:20px 16px 20px">
    <div style="display:flex;gap:4px;padding:6px;border-radius:18px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);margin-bottom:20px">
      ${tabs.map((t, i) => `<button style="flex:1;padding:10px;border-radius:12px;font-weight:600;font-size:13px;border:none;cursor:pointer;background:${keys[i]===tab?"rgba(255,255,255,.1)":"transparent"};color:${keys[i]===tab?"#fff":"rgba(255,255,255,.4)"};border-bottom:${keys[i]===tab?"2px solid "+B:"2px solid transparent"}">${t}</button>`).join("")}
    </div>`
}

function heroCard() {
  return `
  <div style="background:rgba(4,10,22,.72);border:1px solid rgba(76,201,240,.2);border-radius:26px;padding:24px;margin-bottom:16px;backdrop-filter:blur(28px)">
    <div style="display:flex;gap:8px;margin-bottom:18px">
      <span class="tag" style="background:rgba(76,201,240,.1);color:${B};border:1px solid rgba(76,201,240,.2)">Détox &amp; Purification</span>
      <span class="tag" style="background:rgba(255,255,255,.05);color:rgba(255,255,255,.4);border:1px solid rgba(255,255,255,.07)">Légèreté &amp; Reset</span>
    </div>
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px">
      <div>
        <h1 style="font-size:24px;font-weight:900;margin-bottom:8px">Bonjour, Laurent 👋</h1>
        <p style="font-size:13px;color:${B};opacity:.85;font-style:italic">"Chaque geste d'aujourd'hui est une graine pour demain."</p>
      </div>
      <div style="flex-shrink:0;width:64px;height:64px;border-radius:18px;background:rgba(76,201,240,.08);border:1px solid rgba(76,201,240,.18);display:flex;flex-direction:column;align-items:center;justify-content:center">
        <span class="grad" style="font-size:28px;font-weight:900;line-height:1">3</span>
        <span class="muted" style="font-size:11px">/ 21</span>
      </div>
    </div>
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span class="muted" style="font-size:12px">Progression du programme</span>
        <span style="font-size:12px;font-weight:700;color:${B}">14%</span>
      </div>
      <div class="progress"><div class="progress-fill" style="width:14%;background:linear-gradient(90deg,${B},${G})"></div></div>
    </div>
    <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:13px;color:rgba(255,255,255,.62)">💧 Eau citronnée à jeun, minimum 2L/jour</span>
        <span style="font-size:13px;font-weight:700;color:${B}">1.5L</span>
      </div>
      <div style="display:flex;gap:8px">
        ${["0.25","0.5","1"].map(v=>`<button style="flex:1;padding:6px;border-radius:8px;background:rgba(76,201,240,.1);border:1px solid rgba(76,201,240,.2);color:${B};font-size:12px;font-weight:600;cursor:pointer">+${v}L</button>`).join("")}
        <button style="padding:6px 10px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.35);font-size:12px;cursor:pointer">↺</button>
      </div>
    </div>
  </div>`
}

function bottomNav(active: string) {
  const items = [["🍽️","Repas","programme"],["📓","Journal","journal"],["🛒","Courses","courses"],["📈","Progrès","progression"],["💡","Principes","principes"]]
  return `
  <nav style="position:fixed;bottom:0;left:0;right:0;background:rgba(5,12,22,.95);backdrop-filter:blur(28px);border-top:1px solid rgba(255,255,255,.07);padding:4px 0">
    <div style="max-width:640px;margin:0 auto;display:flex;justify-content:space-around">
      ${items.map(([icon,label,key])=>`
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px;flex:1">
        <span style="font-size:20px;line-height:1;filter:${key===active?"drop-shadow(0 0 6px rgba(76,201,240,.6))":"none"}">${icon}</span>
        <span style="font-size:10px;font-weight:600;color:${key===active?B:"rgba(255,255,255,.4)"}">${label}</span>
        ${key===active?`<div style="width:16px;height:2px;border-radius:99px;background:${B}"></div>`:""}
      </div>`).join("")}
    </div>
  </nav>`
}

// ─── 6. DASHBOARD — PROGRAMME ────────────────────────────────────────────────

export function viewDashboardProgramme() {
  const meals = [
    ["🌅","Petit-déjeuner","7h – 9h","4 aliments"],
    ["🌞","Déjeuner","12h – 14h","6 aliments"],
    ["🌤","Collation","15h – 17h","3 aliments"],
    ["🌙","Dîner","18h – 20h","5 aliments"],
  ]
  return wrap(`
  ${dashHeader("programme")}
  ${heroCard()}
  <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px 18px;display:flex;align-items:flex-start;gap:14px;margin-bottom:16px">
    <div style="width:36px;height:36px;border-radius:10px;background:rgba(76,201,240,.1);border:1px solid rgba(76,201,240,.18);display:flex;align-items:center;justify-content:center;flex-shrink:0">✨</div>
    <p class="sec" style="font-size:13px;line-height:1.75">Commencez chaque journée par 30 secondes de respiration consciente — cela active le système nerveux parasympathique et prépare la digestion.</p>
  </div>
  <div style="margin-bottom:16px">
    <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:12px 16px;margin-bottom:12px">
      <button style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.8);font-size:16px;cursor:pointer">←</button>
      <div style="text-align:center">
        <div style="font-size:14px;font-weight:900">Jour 3 <span style="background:rgba(125,232,255,.15);color:${B};font-size:10px;padding:2px 6px;border-radius:99px">Aujourd'hui</span></div>
        <div class="muted" style="font-size:12px;margin-top:2px">Détox & Purification</div>
      </div>
      <button style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.8);font-size:16px;cursor:pointer">→</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${meals.map(([icon,label,horaire,count])=>`
      <div style="border:1px solid rgba(255,255,255,.08);background:rgba(4,10,22,.6);border-radius:16px;overflow:hidden">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:18px">${icon}</span>
            <div>
              <p style="font-size:13px;font-weight:700">${label}</p>
              <p class="muted" style="font-size:12px">${horaire}</p>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="background:rgba(255,255,255,.07);color:rgba(255,255,255,.4);font-size:11px;padding:2px 8px;border-radius:99px">${count}</span>
            <span class="muted" style="font-size:12px">▾</span>
          </div>
        </div>
      </div>`).join("")}
    </div>
  </div>
  <div style="background:rgba(4,10,22,.5);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:18px;margin-bottom:80px">
    <div style="display:flex;justify-content:space-between;margin-bottom:12px">
      <div><p class="muted" style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px">Rituels du jour</p></div>
    </div>
    <p class="sec" style="font-size:13px;line-height:1.6;margin-bottom:8px">🌅 <strong style="color:#fff">Matin :</strong> Eau citronnée + 5 minutes de stretching doux</p>
    <p class="sec" style="font-size:13px;line-height:1.6">🌙 <strong style="color:#fff">Soir :</strong> Tisane de camomille + journal de gratitude</p>
  </div>
  ${bottomNav("programme")}`)
}

// ─── 7. DASHBOARD — JOURNAL ──────────────────────────────────────────────────

export function viewDashboardJournal() {
  const sliders: [string, string, number][] = [["⚡","Énergie",7],["😊","Humeur",8],["💧","Hydratation",6],["😴","Sommeil",7]]
  return wrap(`
  ${dashHeader("journal")}
  <div style="padding-bottom:80px">
    <div class="card" style="padding:20px;margin-bottom:12px">
      <p style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:16px">Comment vous sentez-vous aujourd'hui ?</p>
      ${sliders.map(([icon,label,val])=>`
      <div style="margin-bottom:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-size:13px;font-weight:600">${icon} ${label}</span>
          <span style="font-size:18px;font-weight:900;color:${B}">${val}/10</span>
        </div>
        <div style="height:6px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${val*10}%;background:linear-gradient(90deg,${G},${B});border-radius:99px"></div>
        </div>
      </div>`).join("")}
    </div>
    <div class="card" style="padding:20px;margin-bottom:12px">
      <p style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:12px">Hydratation du jour</p>
      <div style="text-align:center;margin-bottom:10px">
        <span style="font-size:36px;font-weight:900;color:${B}">1.5L</span>
        <span class="muted" style="font-size:13px"> / 2.5L objectif</span>
      </div>
      <div style="display:flex;gap:8px">
        ${["0.25","0.5","1"].map(v=>`<button style="flex:1;padding:8px;border-radius:8px;background:rgba(76,201,240,.1);border:1px solid rgba(76,201,240,.2);color:${B};font-size:12px;font-weight:600;cursor:pointer">+${v}L</button>`).join("")}
      </div>
    </div>
    <div class="card" style="padding:20px;margin-bottom:12px">
      <p style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:10px">Note libre</p>
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px;min-height:80px">
        <p class="sec" style="font-size:13px;line-height:1.7">Je me sens plus léger ce matin, l'eau citronnée à jeun fait vraiment la différence…</p>
      </div>
    </div>
    <div class="btn">Enregistrer mon journal →</div>
  </div>
  ${bottomNav("journal")}`)
}

// ─── 8. DASHBOARD — PROGRESSION ─────────────────────────────────────────────

export function viewDashboardProgression() {
  const weeks = [
    [G,"Semaine 1","Détox & Purification","Libérer le corps de ce qui l'encombre",3,7],
    [B,"Semaine 2","Énergie & Vitalité","Relancer la machine, profondément",0,7],
    ["#818cf8","Semaine 3","Ancrage & Performance","Installer des habitudes qui durent",0,7],
  ]
  return wrap(`
  ${dashHeader("progression")}
  <div style="padding-bottom:80px">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px">
      ${[["🔥","2","Jours actifs"],["📅","S1","Semaine en cours"],["🎯","3j","Série actuelle"]].map(([icon,val,label])=>`
      <div class="card" style="padding:14px;text-align:center">
        <div style="font-size:18px;margin-bottom:4px">${icon}</div>
        <div class="grad" style="font-size:18px;font-weight:900;margin-bottom:2px">${val}</div>
        <div class="muted" style="font-size:11px">${label}</div>
      </div>`).join("")}
    </div>
    <div class="card" style="padding:18px;margin-bottom:12px">
      <p style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:12px">Poids</p>
      <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:4px">
        <span style="font-size:32px;font-weight:900;color:#fff">82</span>
        <span class="muted" style="font-size:14px">kg</span>
      </div>
      <div style="height:4px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:40%;background:${GRAD};border-radius:99px"></div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
      ${weeks.map(([color,week,title,desc,done,total])=>`
      <div class="card" style="padding:16px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div>
            <span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${color}">${week}</span>
            <p style="font-size:13px;font-weight:700;margin-top:2px">${title}</p>
            <p class="muted" style="font-size:12px;margin-top:1px">${desc}</p>
          </div>
          <span style="background:rgba(255,255,255,.07);color:rgba(255,255,255,.4);font-size:12px;padding:3px 8px;border-radius:6px">${done}/${total}</span>
        </div>
        <div class="progress"><div class="progress-fill" style="width:${Math.round(Number(done)/Number(total)*100)}%;background:${color}"></div></div>
      </div>`).join("")}
    </div>
    <div class="card" style="padding:18px">
      <p style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:12px">Score de vitalité</p>
      <div style="text-align:center">
        <span class="grad" style="font-size:52px;font-weight:900">72</span>
        <span class="muted" style="font-size:14px">/100</span>
        <p style="font-size:13px;color:${G};margin-top:4px">↑ En progression</p>
      </div>
    </div>
  </div>
  ${bottomNav("progression")}`)
}

// ─── 9. DASHBOARD — PROFIL ───────────────────────────────────────────────────

export function viewDashboardProfil() {
  const fields = [["Prénom","Laurent"],["Genre","Homme"],["Âge","38 ans"],["Taille","178 cm"],["Poids","82 kg"]]
  return wrap(`
  ${dashHeader("profil")}
  <div style="padding-bottom:80px">
    <div class="card" style="padding:20px;margin-bottom:12px">
      <p style="font-size:14px;font-weight:700;margin-bottom:16px">Mon Profil</p>
      ${fields.map(([lbl,val])=>`
      <div style="margin-bottom:12px"><label>${lbl}</label><input value="${val}" readonly></div>`).join("")}
      <div class="btn" style="margin-top:8px">Enregistrer →</div>
    </div>
    <div class="card" style="padding:20px">
      <p class="muted" style="font-size:12px;margin-bottom:12px">Se déconnecter ferme votre session sur cet appareil. Vos données sont sauvegardées.</p>
      <button style="width:100%;padding:10px;border-radius:10px;background:rgba(220,53,69,.15);color:#ff6b7a;border:1px solid rgba(220,53,69,.3);font-size:13px;font-weight:600;cursor:pointer">Se déconnecter</button>
    </div>
  </div>
  ${bottomNav("profil")}`)
}
