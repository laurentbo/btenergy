"use client"
import { useState } from "react"

const THEMES = {
  D: {
    name: "D — Soleil levant ☀️",
    bg: "#fffbf0",
    card: "#ffffff",
    cardBorder: "#fde68a",
    headerBg: "rgba(255,251,240,0.95)",
    logoGreen: "#16a34a",
    logoDark: "#1c1917",
    heroPhraseBg: "#fef9c3",
    heroPhraseText: "#b45309",
    heroBadgeBg: "#fef3c7",
    heroBadgeText: "#92400e",
    heroBadgeBorder: "#fcd34d",
    progressBg: "#fde68a",
    progressFill: "#d97706",
    coachBg: "#f0fdf4",
    coachBorder: "#86efac",
    coachLabel: "#15803d",
    coachText: "#14532d",
    conseilBg: "#fff7ed",
    conseilBorder: "#fdba74",
    conseilLabel: "#c2410c",
    conseilTitle: "#9a3412",
    conseilText: "#7c2d12",
    rituelBorder: "#16a34a",
    tabActive: "#d97706",
    mealCard: "#ffffff",
    mealCardBorder: "#fde68a",
    mealItemDot: "#d97706",
    navBg: "rgba(255,255,255,0.97)",
    navActive: "#d97706",
    navInactive: "#a8a29e",
    textPrimary: "#1c1917",
    textSecondary: "#57534e",
    textMuted: "#a8a29e",
    avatarBg: "#d97706",
    highlight: "#d97706",
  },
  E: {
    name: "E — Terra 🌄",
    bg: "#fdf4ee",
    card: "#ffffff",
    cardBorder: "#f5c9aa",
    headerBg: "rgba(253,244,238,0.95)",
    logoGreen: "#15803d",
    logoDark: "#1c0a00",
    heroPhraseBg: "#fdebd0",
    heroPhraseText: "#c2410c",
    heroBadgeBg: "#fef0e6",
    heroBadgeText: "#9a3412",
    heroBadgeBorder: "#f5c9aa",
    progressBg: "#f5c9aa",
    progressFill: "#c2410c",
    coachBg: "#f0fdf4",
    coachBorder: "#86efac",
    coachLabel: "#15803d",
    coachText: "#14532d",
    conseilBg: "#fffbeb",
    conseilBorder: "#fbbf24",
    conseilLabel: "#b45309",
    conseilTitle: "#92400e",
    conseilText: "#78350f",
    rituelBorder: "#15803d",
    tabActive: "#c2410c",
    mealCard: "#ffffff",
    mealCardBorder: "#f5c9aa",
    mealItemDot: "#c2410c",
    navBg: "rgba(255,255,255,0.97)",
    navActive: "#c2410c",
    navInactive: "#a8a29e",
    textPrimary: "#1c0a00",
    textSecondary: "#5c3317",
    textMuted: "#a8a29e",
    avatarBg: "#c2410c",
    highlight: "#c2410c",
  },
  F: {
    name: "F — Miel & Forêt 🍯",
    bg: "#faf7f0",
    card: "#ffffff",
    cardBorder: "#e8d5b0",
    headerBg: "rgba(250,247,240,0.95)",
    logoGreen: "#166534",
    logoDark: "#1a0e00",
    heroPhraseBg: "#fef3c7",
    heroPhraseText: "#92400e",
    heroBadgeBg: "#fefce8",
    heroBadgeText: "#713f12",
    heroBadgeBorder: "#fde68a",
    progressBg: "#e8d5b0",
    progressFill: "#b45309",
    coachBg: "#f0fdf4",
    coachBorder: "#86efac",
    coachLabel: "#166534",
    coachText: "#14532d",
    conseilBg: "#fff7ed",
    conseilBorder: "#fed7aa",
    conseilLabel: "#c2410c",
    conseilTitle: "#9a3412",
    conseilText: "#7c2d12",
    rituelBorder: "#166534",
    tabActive: "#b45309",
    mealCard: "#ffffff",
    mealCardBorder: "#e8d5b0",
    mealItemDot: "#b45309",
    navBg: "rgba(255,255,255,0.97)",
    navActive: "#b45309",
    navInactive: "#a8a29e",
    textPrimary: "#1a0e00",
    textSecondary: "#5c4020",
    textMuted: "#a8a29e",
    avatarBg: "#b45309",
    highlight: "#b45309",
  },
}

type ThemeKey = "D" | "E" | "F"

function ThemePreview({ t }: { t: typeof THEMES.D }) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ background: t.bg, borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>

      {/* Header */}
      <div style={{ background: t.headerBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${t.cardBorder}`, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 900, fontSize: "11px" }}>
          <span style={{ color: t.logoGreen }}>Backt</span>
          <span style={{ color: t.logoDark }}>o</span>
          <span style={{ color: t.logoGreen }}>energy</span>
        </span>
        <span style={{ fontSize: "11px", fontWeight: 700, color: t.textPrimary }}>Hello Laurent 👋</span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: t.avatarBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <span style={{ fontSize: "7px", fontWeight: 700, color: t.logoGreen }}>Mes repères</span>
        </div>
      </div>

      <div style={{ padding: "12px" }}>

        {/* Hero */}
        <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: "16px", padding: "14px", marginBottom: "8px" }}>
          <div style={{ display: "inline-flex", background: t.heroBadgeBg, color: t.heroBadgeText, border: `1px solid ${t.heroBadgeBorder}`, borderRadius: "20px", padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "10px" }}>
            S2 · ÉQUILIBRE
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ fontSize: "11px", fontStyle: "italic", color: t.heroPhraseText }}>&ldquo;Équilibre&rdquo;</p>
            <div style={{ width: 44, height: 44, borderRadius: "12px", background: t.heroBadgeBg, border: `1px solid ${t.heroBadgeBorder}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "18px", fontWeight: 900, color: t.heroBadgeText, lineHeight: 1 }}>8</span>
              <span style={{ fontSize: "8px", color: t.textMuted }}>/ 21</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "9px", color: t.textMuted }}>Progression</span>
            <span style={{ fontSize: "9px", fontWeight: 700, color: t.heroBadgeText }}>38%</span>
          </div>
          <div style={{ height: "4px", background: t.progressBg, borderRadius: "2px" }}>
            <div style={{ height: "100%", width: "38%", background: t.progressFill, borderRadius: "2px" }} />
          </div>
        </div>

        {/* Coach */}
        <div style={{ background: t.coachBg, border: `1px solid ${t.coachBorder}`, borderRadius: "12px", padding: "10px 12px", marginBottom: "8px" }}>
          <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.1em", color: t.coachLabel, marginBottom: "3px" }}>MOT DU COACH</p>
          <p style={{ fontSize: "10px", color: t.coachText, lineHeight: 1.6 }}>Tu as passé la première semaine. Le corps s&apos;adapte, continue.</p>
        </div>

        {/* Conseil */}
        <div style={{ background: t.conseilBg, border: `1px solid ${t.conseilBorder}`, borderRadius: "12px", padding: "10px 12px", marginBottom: "8px", borderLeft: `3px solid ${t.conseilBorder}` }}>
          <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.1em", color: t.conseilLabel, marginBottom: "2px" }}>🫁 CONSEIL DU JOUR</p>
          <p style={{ fontSize: "9px", fontWeight: 700, color: t.conseilTitle, marginBottom: "2px" }}>Respiration avant repas</p>
          <p style={{ fontSize: "9px", color: t.conseilText, lineHeight: 1.5 }}>3 respirations profondes avant de manger.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${t.cardBorder}`, marginBottom: "8px" }}>
          {["Aliments", "Journal", "Poids", "Principes"].map(tab => (
            <button key={tab}
              style={{ flex: 1, padding: "6px 2px", fontSize: "9px", fontWeight: 600, background: "none", border: "none", cursor: "pointer", color: tab === "Aliments" ? t.tabActive : t.textMuted, borderBottom: tab === "Aliments" ? `2px solid ${t.tabActive}` : "2px solid transparent" }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Meal card */}
        <div style={{ background: t.mealCard, border: `1px solid ${t.mealCardBorder}`, borderRadius: "12px", overflow: "hidden", borderLeft: `3px solid #f59e0b` }}>
          <button onClick={() => setOpen(o => !o)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: open ? t.heroPhraseBg : t.mealCard, border: "none", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px" }}>🌅</span>
              <div style={{ textAlign: "left" }}>
                <p style={{ fontWeight: 700, fontSize: "11px", color: t.textPrimary, margin: 0 }}>Petit-déjeuner</p>
                <p style={{ fontSize: "9px", color: t.textMuted, margin: 0 }}>7h – 9h</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ background: t.progressBg, borderRadius: "20px", padding: "2px 8px", fontSize: "9px", fontWeight: 600, color: t.textSecondary }}>4 aliments</span>
              <span style={{ color: t.textMuted, fontSize: "10px", display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
            </div>
          </button>
          {open && (
            <div style={{ padding: "0 12px 10px", borderTop: `1px solid ${t.cardBorder}` }}>
              {["2 kiwis", "1 orange", "Poignée d'amandes", "Option : miel brut"].map((item, k) => (
                <div key={k} style={{ display: "flex", gap: "6px", padding: "2px 0" }}>
                  <span style={{ color: t.mealItemDot, fontSize: "12px", lineHeight: 1.2 }}>·</span>
                  <span style={{ fontSize: "10px", color: t.textSecondary, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
              <p style={{ fontSize: "9px", color: t.logoGreen, marginTop: "6px", fontStyle: "italic" }}>💡 Collation si faim vers 10h : 1 pomme</p>
            </div>
          )}
        </div>

      </div>

      {/* Nav */}
      <div style={{ background: t.navBg, borderTop: `1px solid ${t.cardBorder}`, display: "flex", justifyContent: "space-around", padding: "6px 0 4px" }}>
        {[{ icon: "🍽️", label: "Aliments", active: true }, { icon: "📓", label: "Journal", active: false }, { icon: "⚖️", label: "Poids", active: false }, { icon: "💡", label: "Principes", active: false }].map(({ icon, label, active }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px", color: active ? t.navActive : t.navInactive }}>
            <span style={{ fontSize: "16px", lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: "8px", fontWeight: 600 }}>{label}</span>
            {active && <div style={{ width: "12px", height: "1.5px", background: t.navActive, borderRadius: "1px" }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PreviewThemes() {
  const [selected, setSelected] = useState<ThemeKey | null>(null)

  return (
    <div style={{ background: "#1a1a1a", minHeight: "100vh", padding: "24px 16px" }}>
      <p style={{ color: "#fff", fontWeight: 700, fontSize: "14px", textAlign: "center", marginBottom: "4px" }}>Choix du thème — chaud & dynamique</p>
      <p style={{ color: "#888", fontSize: "12px", textAlign: "center", marginBottom: "24px" }}>Appuie sur une option pour la sélectionner</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "400px", margin: "0 auto" }}>
        {(Object.entries(THEMES) as [ThemeKey, typeof THEMES.D][]).map(([key, t]) => (
          <div key={key} onClick={() => setSelected(k => k === key ? null : key)}
            style={{ cursor: "pointer", transition: "transform 0.15s", transform: selected === key ? "scale(1.01)" : "scale(1)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <p style={{ color: selected === key ? "#fff" : "#aaa", fontWeight: 700, fontSize: "12px" }}>{t.name}</p>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selected === key ? "#fff" : "#555"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {selected === key && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff" }} />}
              </div>
            </div>
            <ThemePreview t={t} />
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: THEMES[selected].avatarBg, padding: "16px 24px", textAlign: "center" }}>
          <p style={{ color: "#fff", fontWeight: 900, fontSize: "14px" }}>Option {selected} sélectionnée ✓</p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", marginTop: "2px" }}>Dis-le moi pour que j&apos;applique ce thème</p>
        </div>
      )}
    </div>
  )
}
