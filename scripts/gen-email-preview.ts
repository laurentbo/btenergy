import { magicLinkEmail, welcomeEmail, resetPasswordEmail, stepEmail } from "../lib/email-templates"
import { writeFileSync } from "fs"

const emails = [
  { name: "magic-link", html: magicLinkEmail("Laurent", "https://backtoenergy.fr/auth/callback?token=xxx") },
  { name: "bienvenue", html: welcomeEmail("Laurent", "https://backtoenergy.fr") },
  { name: "reset-password", html: resetPasswordEmail("Laurent", "https://backtoenergy.fr/auth/reset-password?token=xxx") },
  { name: "jour-1", html: stepEmail("Laurent", 1, "https://backtoenergy.fr") },
  { name: "jour-8", html: stepEmail("Laurent", 8, "https://backtoenergy.fr") },
  { name: "jour-15", html: stepEmail("Laurent", 15, "https://backtoenergy.fr") },
]

const index = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>body{margin:0;background:#111;font-family:sans-serif;padding:32px}
h1{color:#fff;margin-bottom:8px}p{color:#888;margin-bottom:40px;font-size:14px}
.label{color:#4cc9f0;font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-size:12px;margin-bottom:12px}
.frame{border:1px solid rgba(76,201,240,.2);border-radius:12px;overflow:hidden;margin-bottom:64px}
iframe{width:100%;height:620px;border:none;display:block}
</style></head><body>
<h1>Email Preview — Backtoenergy</h1>
<p>6 templates · données de test</p>
${emails.map(e => `<div class="label">${e.name}</div><div class="frame"><iframe src="${e.name}.html"></iframe></div>`).join("")}
</body></html>`

writeFileSync("public/email-preview/index.html", index)
emails.forEach(e => writeFileSync(`public/email-preview/${e.name}.html`, e.html))
console.log("✓ Generated", emails.length, "email previews in public/email-preview/")
