"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

// ── Couleurs (miroir des tokens CSS) ────────────────────────────────────────
const C = {
  chassis: "#1C160C",
  bg:      "#EFE6CF",
  surface: "#FBF6EA",
  line:    "#E2D4B5",
  ink:     "#1E1B14",
  soft:    "#857A61",
  leaf:    "#4E7A3C",
  terra:   "#E8622A",
  amber:   "#F2B431",
} as const

const WK = ["#4E7A3C", "#E2A21E", "#C2552A"] as const

function rgba(hex: string, a: number) {
  const h = hex.replace("#", "")
  return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`
}

// ── Données ──────────────────────────────────────────────────────────────────
const WEEKS = [
  { num: "01", theme: "Détox & Purification",  word: "Nettoie",    accent: WK[0], desc: "Comme une vidange en douceur, le corps se nettoie. Maux de tête ou petit coup de mou ? Bon signe : c'est la détox qui opère." },
  { num: "02", theme: "Énergie & Vitalité",    word: "Ça remonte", accent: WK[1], desc: "L'énergie remonte, le sommeil s'allège — un vrai apaisement s'installe." },
  { num: "03", theme: "Ancrage & Performance", word: "Ancre",      accent: WK[2], desc: "Les bons réflexes deviennent les tiens : tu ressens enfin ta vitalité." },
]

const TABS = [
  { icon: "jour",     label: "Jour",     href: "/jour",     desc: "Tes 3 repas du jour, ce que tu vas ressentir, et le « pourquoi » de chaque assiette." },
  { icon: "courses",  label: "Courses",  href: "/courses",  desc: "À ta dispo : une liste de courses, avec un fond de placard." },
  { icon: "recettes", label: "Recettes", href: "/recettes", desc: "Le carnet des 21 jours, à parcourir et chercher quand tu veux." },
  { icon: "methode",  label: "Méthode",  href: "/methode",  desc: "La notion du jour en 2 min, pour comprendre ce que tu fais." },
  { icon: "coach",    label: "Coach",    href: "/coach",    desc: "Laurent, en vrai — il te répond personnellement." },
]

const PRINCIPLES = [
  { icon: "link",  t: "Les bonnes associations", d: "Protéine et féculent jamais ensemble, fruits toujours seuls : ça digère sans fermenter." },
  { icon: "leaf",  t: "Le vivant",               d: "Fruits, légumes, graines, jus — du cru plein d'énergie, un maximum en local et bio." },
  { icon: "aside", t: "Ce qu'on met de côté",    d: "Blé, sucre raffiné, laitages de vache : on les met de côté, en douceur." },
  { icon: "walk",  t: "Un temps à soi",          d: "30 min de marche, ou autre chose qui te fait du bien — un moment rien qu'à toi, chaque jour." },
]

// ── Icônes ────────────────────────────────────────────────────────────────────
function Ic({ name, col = C.ink, sw = 1.7, s = 22 }: { name: string; col?: string; sw?: number; s?: number }) {
  const p = { width: s, height: s, viewBox: "0 0 24 24", fill: "none" as const, stroke: col, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  switch (name) {
    case "jour":     return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/></svg>
    case "courses":  return <svg {...p}><path d="M5 8h14l-1.2 10.5a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M8.5 8a3.5 3.5 0 0 1 7 0"/></svg>
    case "recettes": return <svg {...p}><path d="M4 13a8 8 0 0 0 16 0z"/><path d="M12 5c-1.6 0-2.6 1-2.6 2.6M12 5c1.6 0 2.6 1 2.6 2.6"/></svg>
    case "methode":  return <svg {...p}><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v16H6.5A1.5 1.5 0 0 0 5 21z"/><path d="M18 4v16"/></svg>
    case "coach":    return <svg {...p}><path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v7A1.5 1.5 0 0 1 17.5 15H10l-4 3.5V15H6.5A1.5 1.5 0 0 1 5 13.5z"/></svg>
    case "chevron":  return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>
    case "arrow":    return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    case "check":    return <svg {...p}><path d="M5 12.5l4.5 4.5L19 7"/></svg>
    case "leaf":     return <svg {...p}><path d="M5 18c0-7 5-12 14-12 0 9-5 14-12 14-1 0-2-.5-2-2z"/><path d="M9 16c2-3 4-5 7-6"/></svg>
    case "spark":    return <svg {...p}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z"/></svg>
    case "link":     return <svg {...p}><path d="M9.5 14.5l5-5"/><path d="M11 7.5l1.6-1.6a3.4 3.4 0 0 1 4.8 4.8L15.8 12.3"/><path d="M13 16.5l-1.6 1.6a3.4 3.4 0 0 1-4.8-4.8L8.2 11.7"/></svg>
    case "aside":    return <svg {...p}><circle cx="12" cy="12" r="8.2"/><path d="M8.4 12h7.2"/></svg>
    case "walk":     return <svg {...p}><circle cx="13.5" cy="4.8" r="1.7"/><path d="M13.2 8.2l-1.7 4 2.3 2v5.6"/><path d="M13.8 11.6l3.1 1.6 1.6-1"/><path d="M11.5 12.2l-2.4 1.2-1.4 3.4"/></svg>
    default: return null
  }
}

// ── Atomes ────────────────────────────────────────────────────────────────────
function Wordmark({ s = 22 }: { s?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <span style={{ width: s + 10, height: s + 10, borderRadius: 999, background: C.leaf, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Ic name="leaf" col={C.bg} sw={1.9} s={s - 2} />
      </span>
      <span style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: s + 2, color: C.ink, letterSpacing: "-0.01em" }}>backtoenergy</span>
    </span>
  )
}

function Avatar({ s = 46, bg = C.amber, fg = C.ink }: { s?: number; bg?: string; fg?: string }) {
  return (
    <span style={{ flexShrink: 0, width: s, height: s, borderRadius: 999, background: bg, color: fg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--heading)", fontWeight: 600, fontSize: s * 0.46 }}>
      L
    </span>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--label)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.soft, fontWeight: 700, marginBottom: 14 }}>
      {children}
    </div>
  )
}

function PrimaryBtn({ children, href, onClick }: { children: React.ReactNode; href?: string; onClick?: () => void }) {
  const style: React.CSSProperties = {
    width: "100%", textDecoration: "none", cursor: "pointer", border: "none",
    background: C.terra, color: "#fff", fontFamily: "var(--label)", fontWeight: 700,
    fontSize: 15.5, letterSpacing: "0.01em", padding: "15px 18px", borderRadius: 999,
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9,
    whiteSpace: "nowrap" as const, boxShadow: `0 14px 26px -14px ${rgba(C.terra, 0.9)}`,
  }
  if (href) return <Link href={href} style={style}>{children}</Link>
  return <button onClick={onClick} style={style}>{children}</button>
}

// ── Utils ─────────────────────────────────────────────────────────────────────
function tomorrowLabel() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const s = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function useIsDesktop(bp = 880) {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const check = () => setDesktop(window.innerWidth >= bp)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [bp])
  return desktop
}

// ── Barre de nav basse ────────────────────────────────────────────────────────
function BottomNav() {
  return (
    <div style={{ position: "sticky", bottom: 0, background: C.bg, borderTop: `1px solid ${C.line}`, padding: "9px 8px 16px", display: "flex", justifyContent: "space-between" }}>
      {TABS.map((t) => (
        <Link key={t.label} href={t.href} style={{ flex: "1 1 0", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: t.label === "Jour" ? C.terra : C.soft }}>
          <Ic name={t.icon} col={t.label === "Jour" ? C.terra : C.soft} sw={t.label === "Jour" ? 2.1 : 1.7} s={23} />
          <span style={{ fontFamily: "var(--label)", fontSize: 10, fontWeight: t.label === "Jour" ? 700 : 500 }}>{t.label}</span>
        </Link>
      ))}
    </div>
  )
}

// ── Contenu mobile (J0Step) ───────────────────────────────────────────────────
function J0Mobile({ prenom }: { prenom: string }) {
  const start = tomorrowLabel()
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: C.bg, color: C.ink }}>
      <div style={{ flex: 1, padding: "24px 22px 30px" }}>

        {/* en-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "var(--label)", fontWeight: 700, fontSize: 12, color: C.bg, background: C.ink, padding: "5px 12px", borderRadius: 999 }}>
            JOUR 00<span style={{ color: C.amber }}> / 21</span>
          </span>
          <span style={{ fontFamily: "var(--label)", fontWeight: 700, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.leaf }}>La veille</span>
        </div>

        <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 36, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 16 }}>
          Bienvenue <span style={{ color: C.terra }}>{prenom}</span>
        </div>

        {/* bandeau terracotta */}
        <div style={{ background: C.terra, borderRadius: 14, padding: "14px 16px", marginBottom: 22, display: "flex", alignItems: "center", gap: 13 }}>
          <span style={{ flexShrink: 0 }}><Ic name="spark" col="#fff" sw={1.9} s={26} /></span>
          <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
          <div style={{ color: "#fff", fontSize: 13.5, fontWeight: 600, lineHeight: 1.35 }}>
            Salut {prenom} ! Voilà ton programme pour relancer le moteur — une cuisine gourmande, avec un max de bio : on désintoxique, pas question de se remplir de pesticides. Si tu es OK pour lancer demain, ça se passe tout en bas :)
          </div>
        </div>

        {/* parcours 3 semaines */}
        <Eyebrow>Ton parcours · 3 semaines</Eyebrow>
        <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 26, letterSpacing: "-0.01em", lineHeight: 1.05, marginBottom: 4 }}>21 jours, trois temps</div>
        <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 16 }}>
          {WEEKS.map((w) => (
            <div key={w.num} style={{ borderBottom: `1px solid ${C.line}`, padding: "15px 0", display: "flex", gap: 15, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "var(--heading)", fontWeight: 700, fontSize: 30, color: w.accent, lineHeight: 1, width: 36, flexShrink: 0 }}>{w.num}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 19, color: C.ink, lineHeight: 1.15, marginBottom: 1 }}>{w.word}</div>
                <div style={{ fontFamily: "var(--label)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: w.accent, marginBottom: 6 }}>{w.theme}</div>
                <div style={{ fontSize: 14, color: C.leaf, lineHeight: 1.45 }}>{w.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* cinq onglets */}
        <div style={{ marginTop: 26 }}>
          <Eyebrow>L'appli au quotidien</Eyebrow>
          <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 26, letterSpacing: "-0.01em", lineHeight: 1.05, marginBottom: 6 }}>Cinq onglets, un rituel</div>
          <div style={{ fontSize: 14.5, color: C.leaf, lineHeight: 1.45, marginBottom: 14 }}>
            Tous les matins, tu reçois une notif avec le lien de ta journée. Et dans tes onglets, tu trouves :
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {TABS.map((r) => (
              <div key={r.label} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 12, background: C.surface, border: `1.5px solid ${C.line}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic name={r.icon} col={C.ink} sw={1.8} s={22} />
                </span>
                <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
                  <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 17, color: C.ink, lineHeight: 1.1, marginBottom: 1 }}>{r.label}</div>
                  <div style={{ fontSize: 13, color: C.soft, lineHeight: 1.4 }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* quatre principes */}
        <div style={{ marginTop: 28 }}>
          <Eyebrow>Ce qui nous guide</Eyebrow>
          <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 26, letterSpacing: "-0.01em", lineHeight: 1.05, marginBottom: 14 }}>Quatre principes simples</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {PRINCIPLES.map((p) => (
              <div key={p.t} style={{ background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 14, padding: "13px 13px 12px" }}>
                <span style={{ display: "inline-flex", marginBottom: 9 }}><Ic name={p.icon} col={C.terra} sw={1.9} s={22} /></span>
                <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 15.5, color: C.ink, lineHeight: 1.12, marginBottom: 3 }}>{p.t}</div>
                <div style={{ fontSize: 12, color: C.soft, lineHeight: 1.4 }}>{p.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* prépare tes courses */}
        <Link href="/courses" style={{ display: "flex", alignItems: "center", gap: 13, textDecoration: "none", background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 16, padding: "15px 16px", marginTop: 24, marginBottom: 22 }}>
          <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, background: rgba(C.leaf, 0.14), display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Ic name="courses" col={C.leaf} sw={1.9} s={23} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 17, color: C.ink, lineHeight: 1.1 }}>Prépare tes courses ce soir</div>
            <div style={{ fontSize: 12.5, color: C.soft, lineHeight: 1.35, marginTop: 2 }}>Ta liste pour les premiers jours est déjà prête.</div>
          </div>
          <span style={{ flexShrink: 0, transform: "rotate(-90deg)" }}><Ic name="chevron" col={C.terra} sw={2.2} s={20} /></span>
        </Link>

        {/* mot de Laurent */}
        <div style={{ background: C.ink, borderRadius: 18, padding: "18px 18px 20px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar s={46} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontFamily: "var(--heading)", fontWeight: 700, fontSize: 18, color: C.bg, lineHeight: 1.2 }}>Laurent</span>
                <span style={{ flexShrink: 0, width: 17, height: 17, borderRadius: 999, background: C.amber, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic name="check" col={C.ink} sw={2.6} s={11} />
                </span>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.5, color: C.bg, marginTop: 13 }}>
            « À ta dispo tout au long du parcours — pour tes questions, et pour les ressentis que tu pourras avoir. »
          </div>
        </div>

        {/* CTA démarrage */}
        <div style={{ background: C.leaf, borderRadius: 20, padding: "22px 18px 18px", textAlign: "center", boxShadow: `0 22px 46px -26px ${rgba(C.leaf, 0.7)}` }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: C.amber, marginBottom: 11 }}>
            <Ic name="spark" col={C.amber} sw={2} s={15} /> On commence demain
          </div>
          <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 30, color: "#FBF6EA", letterSpacing: "-0.01em", lineHeight: 1.06, marginBottom: 6 }}>{start}</div>
          <div style={{ fontSize: 13.5, color: "rgba(251,246,234,0.85)", lineHeight: 1.5, marginBottom: 16 }}>
            Ton Jour 1 s'ouvre demain matin. D'ici là, profite de ta soirée — tu as déjà fait le plus important : dire oui.
          </div>
          <PrimaryBtn href="/jour">Découvrir mon Jour 1 <Ic name="arrow" col="#fff" sw={2.2} s={19} /></PrimaryBtn>
          <div style={{ marginTop: 11, fontFamily: "var(--label)", fontSize: 11, color: "rgba(251,246,234,0.6)" }}>Aperçu — le programme s'ouvre vraiment demain.</div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

// ── Contenu desktop ──────────────────────────────────────────────────────────
function J0Desktop({ prenom }: { prenom: string }) {
  const start = tomorrowLabel()
  const h2: React.CSSProperties = { fontFamily: "var(--heading)", fontWeight: 600, fontSize: 32, letterSpacing: "-0.015em", lineHeight: 1.05, marginBottom: 18 }
  const sec: React.CSSProperties = { marginBottom: 56 }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink }}>

      {/* nav haute sticky */}
      <div style={{ position: "sticky", top: 0, zIndex: 5, background: rgba(C.bg, 0.92), backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <Wordmark s={18} />
          <nav style={{ display: "flex", gap: 28 }}>
            {TABS.map((t) => (
              <Link key={t.label} href={t.href} style={{ textDecoration: "none", fontFamily: "var(--label)", fontWeight: t.label === "Jour" ? 700 : 500, fontSize: 13.5, letterSpacing: "0.02em", color: t.label === "Jour" ? C.terra : C.soft }}>
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "44px 40px 64px" }}>

        {/* hero */}
        <div style={{ display: "grid", gridTemplateColumns: "1.25fr 0.85fr", gap: 44, alignItems: "center", ...sec }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
              <span style={{ fontFamily: "var(--label)", fontWeight: 700, fontSize: 12, color: C.bg, background: C.ink, padding: "5px 12px", borderRadius: 999 }}>
                JOUR 00<span style={{ color: C.amber }}> / 21</span>
              </span>
              <span style={{ fontFamily: "var(--label)", fontWeight: 700, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: C.leaf }}>La veille</span>
            </div>
            <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 62, lineHeight: 0.98, letterSpacing: "-0.025em", marginBottom: 22 }}>
              Bienvenue <span style={{ color: C.terra }}>{prenom}</span>
            </div>
            <div style={{ background: C.terra, borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, maxWidth: 520 }}>
              <span style={{ flexShrink: 0 }}><Ic name="spark" col="#fff" sw={1.9} s={28} /></span>
              <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
              <div style={{ color: "#fff", fontSize: 14.5, fontWeight: 600, lineHeight: 1.35 }}>
                Salut {prenom} ! Voilà ton programme pour relancer le moteur — une cuisine gourmande, avec un max de bio : on désintoxique, pas question de se remplir de pesticides. Si tu es OK pour lancer demain, ça se passe tout en bas :)
              </div>
            </div>
          </div>
          {/* carte coach */}
          <div style={{ background: C.ink, borderRadius: 20, padding: "22px 22px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <Avatar s={52} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontFamily: "var(--heading)", fontWeight: 700, fontSize: 19, color: C.bg, lineHeight: 1.2 }}>Laurent</span>
                  <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: 999, background: C.amber, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <Ic name="check" col={C.ink} sw={2.6} s={12} />
                  </span>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 18, lineHeight: 1.5, color: C.bg, marginTop: 15 }}>
              « À ta dispo tout au long du parcours — pour tes questions, et pour les ressentis que tu pourras avoir. »
            </div>
          </div>
        </div>

        {/* 3 semaines — 3 colonnes */}
        <div style={sec}>
          <Eyebrow>Ton parcours · 3 semaines</Eyebrow>
          <div style={h2}>21 jours, trois temps</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {WEEKS.map((w) => (
              <div key={w.num} style={{ background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 16, padding: "20px 18px", borderTop: `4px solid ${w.accent}` }}>
                <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 36, color: w.accent, lineHeight: 0.9, marginBottom: 10 }}>{w.num}</div>
                <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 21, color: C.ink, lineHeight: 1.1, marginBottom: 4 }}>{w.word}</div>
                <div style={{ fontFamily: "var(--label)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: w.accent, marginBottom: 9 }}>{w.theme}</div>
                <div style={{ fontSize: 14.5, color: C.leaf, lineHeight: 1.4 }}>{w.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* appli + principes — 2 colonnes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, ...sec }}>
          <div>
            <Eyebrow>L'appli au quotidien</Eyebrow>
            <div style={h2}>Cinq onglets, un rituel</div>
            <div style={{ fontSize: 15, color: C.leaf, lineHeight: 1.45, marginBottom: 16 }}>
              Tous les matins, tu reçois une notif avec le lien de ta journée. Et dans tes onglets, tu trouves :
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {TABS.map((r) => (
                <div key={r.label} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, background: C.surface, border: `1.5px solid ${C.line}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <Ic name={r.icon} col={C.ink} sw={1.8} s={23} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 17.5, color: C.ink, lineHeight: 1.1, marginBottom: 1 }}>{r.label}</div>
                    <div style={{ fontSize: 13.5, color: C.soft, lineHeight: 1.42 }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Eyebrow>Ce qui nous guide</Eyebrow>
            <div style={h2}>Quatre principes simples</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {PRINCIPLES.map((p) => (
                <div key={p.t} style={{ background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 14, padding: "15px 15px 14px" }}>
                  <span style={{ display: "inline-flex", marginBottom: 10 }}><Ic name={p.icon} col={C.terra} sw={1.9} s={23} /></span>
                  <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 16, color: C.ink, lineHeight: 1.12, marginBottom: 4 }}>{p.t}</div>
                  <div style={{ fontSize: 12.5, color: C.soft, lineHeight: 1.42 }}>{p.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* courses + CTA départ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 24, alignItems: "stretch" }}>
          <Link href="/courses" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 18, padding: "20px" }}>
            <span style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 13, background: rgba(C.leaf, 0.14), display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Ic name="courses" col={C.leaf} sw={1.9} s={25} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 18.5, color: C.ink, lineHeight: 1.1 }}>Prépare tes courses ce soir</div>
              <div style={{ fontSize: 13.5, color: C.soft, lineHeight: 1.35, marginTop: 3 }}>Ta liste pour les premiers jours est déjà prête.</div>
            </div>
            <span style={{ flexShrink: 0, transform: "rotate(-90deg)" }}><Ic name="chevron" col={C.terra} sw={2.2} s={22} /></span>
          </Link>

          <div style={{ background: C.leaf, borderRadius: 20, padding: "26px 24px 22px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: `0 22px 46px -26px ${rgba(C.leaf, 0.7)}` }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: C.amber, marginBottom: 11 }}>
              <Ic name="spark" col={C.amber} sw={2} s={15} /> On commence demain
            </div>
            <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 32, color: "#FBF6EA", letterSpacing: "-0.01em", lineHeight: 1.06, marginBottom: 7 }}>{start}</div>
            <div style={{ fontSize: 14, color: "rgba(251,246,234,0.85)", lineHeight: 1.5, marginBottom: 18, maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>
              Ton Jour 1 s'ouvre demain matin. D'ici là, profite de ta soirée — tu as déjà fait le plus important : dire oui.
            </div>
            <div style={{ maxWidth: 320, width: "100%", marginLeft: "auto", marginRight: "auto" }}>
              <PrimaryBtn href="/jour">Découvrir mon Jour 1 <Ic name="arrow" col="#fff" sw={2.2} s={19} /></PrimaryBtn>
            </div>
            <div style={{ marginTop: 11, fontFamily: "var(--label)", fontSize: 11, color: "rgba(251,246,234,0.6)" }}>Aperçu — le programme s'ouvre vraiment demain.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BienvenuePage() {
  const router = useRouter()
  const [prenom, setPrenom] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const isDesktop = useIsDesktop()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/login"); return }
      const { data } = await supabase
        .from("profiles")
        .select("prenom")
        .eq("id", user.id)
        .maybeSingle()
      const p = data?.prenom ?? ""
      setPrenom(p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : "toi")
      setLoading(false)
    })
  }, []) // eslint-disable-line

  if (loading) return (
    <div style={{ minHeight: "100svh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2.5px solid ${C.terra}`, borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (isDesktop) return <J0Desktop prenom={prenom!} />

  return (
    <div style={{ minHeight: "100svh", background: C.chassis, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 440, minHeight: "100svh", background: C.bg, display: "flex", flexDirection: "column" }}>
        <J0Mobile prenom={prenom!} />
      </div>
    </div>
  )
}
