"use client"

import { useState, useMemo } from "react"
import type { CockpitData, ProfileData, EntryData, MoodItem } from "./page"

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Status = "pending" | "active" | "at-risk" | "completed"

function getStatus(p: ProfileData, atRiskSet: Set<string>): Status {
  if (p.current_day === 0) return "pending"
  if (p.current_day >= 21) return "completed"
  if (atRiskSet.has(p.id)) return "at-risk"
  return "active"
}

function getWeek(day: number): string {
  if (day <= 0) return "—"
  if (day <= 7)  return "S1"
  if (day <= 14) return "S2"
  return "S3"
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "2-digit",
  })
}

function fmtDatetime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  })
}

function hoursAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 36e5)
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const BG       = "#15130E"
const CARD     = "#1C1A14"
const SURFACE  = "#211E17"
const LINE     = "rgba(247,234,205,0.07)"
const TEXT     = "#ECE4D2"
const MUTE     = "rgba(236,228,210,0.34)"
const FAINT    = "rgba(236,228,210,0.18)"
const BRAND    = "#5CB551"
const S1_COLOR = "#dce03d"
const S2_COLOR = "#62ce9d"
const S3_COLOR = "#26c5ce"

const STATUS_CFG: Record<Status, { bg: string; color: string; label: string }> = {
  active:    { bg: "rgba(76,175,120,0.14)",   color: "#4CAF78",  label: "Actif"        },
  completed: { bg: "rgba(98,206,157,0.14)",   color: S2_COLOR,   label: "Terminé"      },
  "at-risk": { bg: "rgba(232,160,144,0.14)",  color: "#E8A090",  label: "À risque"     },
  pending:   { bg: "rgba(236,228,210,0.06)",  color: MUTE,       label: "Non démarré"  },
}

const WEEK_CFG = {
  S1: { color: S1_COLOR, bg: "rgba(220,224,61,0.08)",  label: "Semaine 1", range: "J1–J7"   },
  S2: { color: S2_COLOR, bg: "rgba(98,206,157,0.08)",  label: "Semaine 2", range: "J8–J14"  },
  S3: { color: S3_COLOR, bg: "rgba(38,197,206,0.08)",  label: "Semaine 3", range: "J15–J21" },
}

const ENERGIE_CFG = [
  { range: "0–39",   color: "#E8A090", label: "Faible"    },
  { range: "40–59",  color: S1_COLOR,  label: "Modéré"    },
  { range: "60–79",  color: S2_COLOR,  label: "Bon"       },
  { range: "80–100", color: S3_COLOR,  label: "Excellent" },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function KPICard({
  label, value, sub, accent, warn,
}: {
  label: string; value: number | string; sub?: string; accent?: string; warn?: boolean
}) {
  return (
    <div style={{
      background: warn ? "rgba(232,160,144,0.08)" : CARD,
      border: `1px solid ${warn ? "rgba(232,160,144,0.25)" : LINE}`,
      borderRadius: 14, padding: "18px 20px",
    }}>
      <p style={{ fontSize: 10, fontWeight: 600, color: MUTE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
        {label}
      </p>
      <p style={{ fontSize: 32, fontWeight: 600, color: accent ?? TEXT, lineHeight: 1, marginBottom: sub ? 6 : 0 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: 11, color: MUTE }}>{sub}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CFG[status]
  return (
    <span style={{
      display: "inline-block",
      background: cfg.bg, color: cfg.color,
      fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
    }}>
      {cfg.label}
    </span>
  )
}

function ScorePill({ value }: { value: number | undefined }) {
  if (value === undefined) return <span style={{ color: FAINT }}>—</span>
  const color = value >= 80 ? S3_COLOR : value >= 60 ? S2_COLOR : value >= 40 ? S1_COLOR : "#E8A090"
  return (
    <span style={{ color, fontWeight: 600 }}>{value}</span>
  )
}

function Histogram({ histogram }: { histogram: { day: number; count: number }[] }) {
  const maxCount = Math.max(...histogram.map(d => d.count), 1)
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80, paddingBottom: 16, position: "relative" }}>
      {histogram.map(({ day, count }) => {
        const color = day <= 7 ? S1_COLOR : day <= 14 ? S2_COLOR : S3_COLOR
        const h = count > 0 ? Math.max(4, (count / maxCount) * 64) : 2
        const showLabel = day === 1 || day === 8 || day === 15 || day === 21
        return (
          <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            <div
              style={{
                width: "100%", height: h,
                background: count > 0 ? color : "rgba(236,228,210,0.06)",
                borderRadius: "2px 2px 0 0",
                opacity: count > 0 ? 1 : 0.5,
              }}
              title={`J${day} : ${count} participant${count !== 1 ? "s" : ""}`}
            />
            {showLabel && (
              <span style={{
                position: "absolute", bottom: -14,
                fontSize: 8, color: FAINT, fontFamily: "monospace", whiteSpace: "nowrap",
              }}>
                J{day}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function HBar({ count, total, color }: { count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div style={{ flex: 1, height: 6, background: "rgba(236,228,210,0.07)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.4s" }} />
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 600, color: MUTE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
      {children}
    </p>
  )
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div style={{ padding: "40px 0", textAlign: "center", color: FAINT, fontSize: 13 }}>
      {msg}
    </div>
  )
}

// ─── Tab type ─────────────────────────────────────────────────────────────────

type Tab = "overview" | "participants" | "checkins" | "activity"
type ParticipantFilter = "all" | "active" | "completed" | "at-risk"

// ─── Main component ───────────────────────────────────────────────────────────

export function CockpitClient({ data }: { data: CockpitData }) {
  const [tab, setTab] = useState<Tab>("overview")
  const [filter, setFilter] = useState<ParticipantFilter>("all")

  const atRiskSet   = useMemo(() => new Set(data.atRiskProfileIds), [data.atRiskProfileIds])
  const alertSet    = useMemo(() => new Set(data.alertProfileIds),  [data.alertProfileIds])

  const filteredProfiles = useMemo(() => {
    return data.profiles.filter(p => {
      if (filter === "all") return true
      const s = getStatus(p, atRiskSet)
      return s === filter
    })
  }, [data.profiles, atRiskSet, filter])

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview",      label: "Vue globale"  },
    { id: "participants",  label: "Participants" },
    { id: "checkins",      label: "Check-ins"    },
    { id: "activity",      label: "Activité"     },
  ]

  const FILTER_BTNS: { id: ParticipantFilter; label: string }[] = [
    { id: "all",       label: `Tous (${data.totalUsers})`         },
    { id: "active",    label: `Actifs (${data.activeUsers})`      },
    { id: "completed", label: `Terminés (${data.completedUsers})` },
    { id: "at-risk",   label: `À risque (${data.atRiskUsers})`    },
  ]

  // ── Styles ────────────────────────────────────────────────────────────────

  const page: React.CSSProperties  = { minHeight: "100vh", background: BG, padding: "32px 20px 60px", fontFamily: "'Geist', system-ui, sans-serif", color: TEXT }
  const wrap: React.CSSProperties  = { maxWidth: 960, margin: "0 auto" }
  const card: React.CSSProperties  = { background: CARD, border: `1px solid ${LINE}`, borderRadius: 14, padding: "18px 20px", marginBottom: 12 }
  const th: React.CSSProperties    = { padding: "8px 12px", textAlign: "left", fontSize: 10, fontWeight: 600, color: MUTE, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: `1px solid ${LINE}`, whiteSpace: "nowrap" }
  const td: React.CSSProperties    = { padding: "10px 12px", fontSize: 12, color: TEXT, borderBottom: `1px solid rgba(247,234,205,0.04)`, verticalAlign: "middle" }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={page}>
      <div style={wrap}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 400, fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", color: TEXT, marginBottom: 4 }}>
              Cockpit participants
            </h1>
            <p style={{ fontSize: 11, color: MUTE }}>
              backtoenergy.fr · {data.totalUsers} collaborateur{data.totalUsers !== 1 ? "s" : ""} · données en direct
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {data.atRiskUsers > 0 && (
              <span style={{ background: "rgba(232,160,144,0.14)", color: "#E8A090", fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 20 }}>
                ⚠ {data.atRiskUsers} à risque
              </span>
            )}
            <span style={{ background: "rgba(92,181,81,0.12)", color: BRAND, fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 20 }}>
              ● live
            </span>
            <button
              onClick={() => window.location.reload()}
              style={{ background: "transparent", border: `1px solid ${LINE}`, borderRadius: 8, padding: "5px 12px", fontSize: 11, color: MUTE, cursor: "pointer", fontFamily: "inherit" }}
            >
              ↻ Rafraîchir
            </button>
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 2, marginBottom: 24, borderBottom: `1px solid ${LINE}` }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                padding: "9px 18px", fontSize: 12, fontWeight: 500, fontFamily: "inherit",
                color: tab === t.id ? TEXT : MUTE,
                borderBottom: `2px solid ${tab === t.id ? BRAND : "transparent"}`,
                marginBottom: -1, transition: "color 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* TAB 1 — Vue globale                                           */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {tab === "overview" && (
          <div>
            {/* KPI grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
              <KPICard label="Total inscrits"  value={data.totalUsers}                        accent={TEXT}     />
              <KPICard label="En cours"        value={data.activeUsers}   sub="jours 1–20"    accent={BRAND}    />
              <KPICard label="Terminés"        value={data.completedUsers} sub="jour 21+"     accent={S2_COLOR} />
              <KPICard label="À risque"        value={data.atRiskUsers}   sub="sans check-in > 3j" accent="#E8A090" warn={data.atRiskUsers > 0} />
            </div>

            {/* Jour moyen + histogram */}
            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <SectionTitle>Répartition par jour (J1–J21)</SectionTitle>
                <span style={{ fontSize: 11, color: MUTE }}>
                  Jour moyen des actifs : <strong style={{ color: TEXT }}>{data.avgDay > 0 ? `J${data.avgDay}` : "—"}</strong>
                </span>
              </div>
              <Histogram histogram={data.dayHistogram} />

              {/* Legend */}
              <div style={{ display: "flex", gap: 20, marginTop: 20, paddingTop: 12, borderTop: `1px solid ${LINE}` }}>
                {(["S1", "S2", "S3"] as const).map(s => {
                  const cfg = WEEK_CFG[s]
                  return (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: cfg.color }} />
                      <span style={{ fontSize: 11, color: MUTE }}>{cfg.label} · {cfg.range}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Semaine cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {(["S1", "S2", "S3"] as const).map(s => {
                const cfg = WEEK_CFG[s]
                const count = data.weekDistribution[s]
                return (
                  <div key={s} style={{ background: cfg.bg, border: `1px solid ${cfg.color}22`, borderRadius: 14, padding: "18px 20px" }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                      {cfg.label} · {cfg.range}
                    </p>
                    <p style={{ fontSize: 36, fontWeight: 700, color: cfg.color, lineHeight: 1 }}>{count}</p>
                    <p style={{ fontSize: 11, color: MUTE, marginTop: 4 }}>
                      participant{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Score vitalité moyen */}
            {data.avgEnergie !== null && (
              <div style={{ ...card, marginTop: 12, display: "flex", alignItems: "center", gap: 16 }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 600, color: MUTE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                    Score énergie moyen (tous check-ins)
                  </p>
                  <p style={{ fontSize: 28, fontWeight: 600, color: data.avgEnergie >= 60 ? S2_COLOR : data.avgEnergie >= 40 ? S1_COLOR : "#E8A090", lineHeight: 1 }}>
                    {data.avgEnergie}<span style={{ fontSize: 14, color: MUTE }}>/100</span>
                  </p>
                </div>
                <div style={{ flex: 1, height: 8, background: "rgba(236,228,210,0.07)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    width: `${data.avgEnergie}%`, height: "100%", borderRadius: 4,
                    background: data.avgEnergie >= 60 ? S2_COLOR : data.avgEnergie >= 40 ? S1_COLOR : "#E8A090",
                    transition: "width 0.5s",
                  }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* TAB 2 — Participants                                          */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {tab === "participants" && (
          <div>
            {/* Filter buttons */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {FILTER_BTNS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    background: filter === f.id ? "rgba(92,181,81,0.12)" : "transparent",
                    border: `1px solid ${filter === f.id ? "rgba(92,181,81,0.35)" : LINE}`,
                    borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 500,
                    color: filter === f.id ? BRAND : MUTE, cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 14, overflow: "hidden" }}>
              {filteredProfiles.length === 0 ? (
                <EmptyState msg="Aucun participant dans cette catégorie" />
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: SURFACE }}>
                      <tr>
                        <th style={th}>Prénom</th>
                        <th style={th}>Email</th>
                        <th style={{ ...th, textAlign: "center" }}>Jour</th>
                        <th style={{ ...th, textAlign: "center" }}>Semaine</th>
                        <th style={{ ...th, textAlign: "center" }}>Énergie</th>
                        <th style={{ ...th, textAlign: "center" }}>Statut</th>
                        <th style={th}>Inscrit le</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProfiles.map(p => {
                        const status = getStatus(p, atRiskSet)
                        const score  = data.userEnergieAvg[p.id]
                        return (
                          <tr key={p.id} style={{ transition: "background 0.1s" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(236,228,210,0.03)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                          >
                            <td style={td}>
                              <span style={{ fontWeight: 500 }}>{p.prenom || "—"}</span>
                            </td>
                            <td style={td}>
                              <span style={{ color: MUTE, fontSize: 11, fontFamily: "monospace" }}>{p.email}</span>
                            </td>
                            <td style={{ ...td, textAlign: "center" }}>
                              {p.current_day > 0
                                ? <span style={{ fontWeight: 600 }}>J{p.current_day}</span>
                                : <span style={{ color: FAINT }}>—</span>}
                            </td>
                            <td style={{ ...td, textAlign: "center" }}>
                              {p.current_day > 0 ? (
                                <span style={{
                                  fontWeight: 600, fontSize: 11,
                                  color: p.current_day <= 7 ? S1_COLOR : p.current_day <= 14 ? S2_COLOR : S3_COLOR,
                                }}>
                                  {getWeek(p.current_day)}
                                </span>
                              ) : <span style={{ color: FAINT }}>—</span>}
                            </td>
                            <td style={{ ...td, textAlign: "center" }}>
                              <ScorePill value={score} />
                            </td>
                            <td style={{ ...td, textAlign: "center" }}>
                              <StatusBadge status={status} />
                            </td>
                            <td style={td}>
                              <span style={{ color: MUTE, fontSize: 11 }}>{fmtDate(p.created_at)}</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <p style={{ fontSize: 11, color: FAINT, marginTop: 8, textAlign: "right" }}>
              {filteredProfiles.length} résultat{filteredProfiles.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* TAB 3 — Check-ins                                             */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {tab === "checkins" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>

              {/* Mood distribution */}
              <div style={card}>
                <SectionTitle>Distribution des humeurs</SectionTitle>
                {data.moodDistribution.length === 0 ? (
                  <EmptyState msg="Pas encore de données" />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {(() => {
                      const totalMood = data.moodDistribution.reduce((s, m) => s + m.count, 0)
                      return data.moodDistribution.map((m: MoodItem) => (
                        <div key={m.score} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 16, lineHeight: 1, minWidth: 24 }}>{m.emoji}</span>
                          <div style={{ minWidth: 80 }}>
                            <span style={{ fontSize: 11, color: TEXT }}>{m.label}</span>
                          </div>
                          <HBar
                            count={m.count}
                            total={totalMood}
                            color={m.score <= 3 ? "#E8A090" : m.score <= 6 ? S1_COLOR : m.score <= 8 ? S2_COLOR : S3_COLOR}
                          />
                          <span style={{ fontSize: 11, color: MUTE, minWidth: 30, textAlign: "right" }}>
                            {m.count}
                          </span>
                        </div>
                      ))
                    })()}
                  </div>
                )}
              </div>

              {/* Energie distribution */}
              <div style={card}>
                <SectionTitle>Distribution des scores vitalité</SectionTitle>
                {data.energieDistribution.every(d => d.count === 0) ? (
                  <EmptyState msg="Pas encore de données" />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {(() => {
                      const totalE = data.energieDistribution.reduce((s, d) => s + d.count, 0)
                      return data.energieDistribution.map((d, i) => {
                        const cfg = ENERGIE_CFG[i]
                        const pct = totalE > 0 ? Math.round((d.count / totalE) * 100) : 0
                        return (
                          <div key={d.range}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>
                                {cfg.label} <span style={{ color: FAINT, fontWeight: 400 }}>({d.range})</span>
                              </span>
                              <span style={{ fontSize: 11, color: MUTE }}>
                                {d.count} · {pct}%
                              </span>
                            </div>
                            <div style={{ height: 6, background: "rgba(236,228,210,0.07)", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ width: `${pct}%`, height: "100%", background: cfg.color, borderRadius: 3, transition: "width 0.4s" }} />
                            </div>
                          </div>
                        )
                      })
                    })()}
                    {data.avgEnergie !== null && (
                      <p style={{ fontSize: 11, color: MUTE, borderTop: `1px solid ${LINE}`, paddingTop: 10, marginTop: 4 }}>
                        Moyenne : <strong style={{ color: TEXT }}>{data.avgEnergie}/100</strong>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Recent check-ins table */}
            <div style={card}>
              <SectionTitle>10 derniers check-ins</SectionTitle>
              {data.recentEntries.length === 0 ? (
                <EmptyState msg="Aucun check-in enregistré" />
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={th}>Participant</th>
                        <th style={{ ...th, textAlign: "center" }}>Jour</th>
                        <th style={{ ...th, textAlign: "center" }}>Énergie</th>
                        <th style={{ ...th, textAlign: "center" }}>Humeur</th>
                        <th style={{ ...th, textAlign: "center" }}>Hydratation</th>
                        <th style={{ ...th, textAlign: "center" }}>Sommeil</th>
                        <th style={th}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentEntries.slice(0, 10).map((e: EntryData, i: number) => {
                        const profile = data.profileMap[e.user_id]
                        return (
                          <tr key={i}>
                            <td style={td}>
                              <div>
                                <span style={{ fontWeight: 500 }}>{profile?.prenom ?? "—"}</span>
                                <span style={{ fontSize: 10, color: FAINT, display: "block", fontFamily: "monospace" }}>
                                  {profile?.email ?? e.user_id.slice(0, 8) + "…"}
                                </span>
                              </div>
                            </td>
                            <td style={{ ...td, textAlign: "center" }}>
                              <span style={{ fontWeight: 600 }}>J{e.day}</span>
                            </td>
                            <td style={{ ...td, textAlign: "center" }}>
                              <ScorePill value={e.energie * 10} />
                            </td>
                            <td style={{ ...td, textAlign: "center", fontSize: 13 }}>
                              {e.humeur}
                              <span style={{ fontSize: 9, color: FAINT, display: "block" }}>/10</span>
                            </td>
                            <td style={{ ...td, textAlign: "center" }}>
                              <span style={{ color: MUTE }}>{e.hydratation}/10</span>
                            </td>
                            <td style={{ ...td, textAlign: "center" }}>
                              <span style={{ color: MUTE }}>{e.sommeil}/10</span>
                            </td>
                            <td style={td}>
                              <span style={{ fontSize: 11, color: MUTE }}>{fmtDatetime(e.created_at)}</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* TAB 4 — Activité                                              */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {tab === "activity" && (
          <div>
            {/* 48h alert banner */}
            {data.alertProfileIds.length > 0 && (
              <div style={{
                background: "rgba(232,160,144,0.10)", border: "1px solid rgba(232,160,144,0.3)",
                borderRadius: 12, padding: "14px 18px", marginBottom: 16,
                display: "flex", gap: 12, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 18, lineHeight: 1, marginTop: 1 }}>⚠️</span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#E8A090", marginBottom: 4 }}>
                    {data.alertProfileIds.length} participant{data.alertProfileIds.length !== 1 ? "s" : ""} sans activité depuis plus de 48h
                  </p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {data.alertProfileIds.map(id => {
                      const p = data.profileMap[id]
                      return p ? (
                        <span key={id} style={{
                          background: "rgba(232,160,144,0.12)", color: "#E8A090",
                          fontSize: 11, padding: "2px 8px", borderRadius: 20,
                        }}>
                          {p.prenom || p.email}
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline des 20 dernières entrées */}
            <div style={card}>
              <SectionTitle>20 derniers check-ins</SectionTitle>
              {data.recentEntries.length === 0 ? (
                <EmptyState msg="Aucune activité enregistrée" />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {data.recentEntries.map((e: EntryData, i: number) => {
                    const profile = data.profileMap[e.user_id]
                    const h = hoursAgo(e.created_at)
                    const isRecent = h < 6
                    const isOld    = h > 48
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "9px 10px", borderRadius: 9,
                          background: isOld ? "rgba(232,160,144,0.06)" : isRecent ? "rgba(92,181,81,0.05)" : "transparent",
                          border: `1px solid ${isOld ? "rgba(232,160,144,0.15)" : isRecent ? "rgba(92,181,81,0.1)" : "transparent"}`,
                        }}
                      >
                        {/* Dot */}
                        <div style={{
                          width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                          background: isOld ? "#E8A090" : isRecent ? BRAND : MUTE,
                        }} />

                        {/* Participant */}
                        <div style={{ minWidth: 120 }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: TEXT }}>
                            {profile?.prenom ?? "—"}
                          </span>
                          <span style={{ fontSize: 10, color: FAINT, display: "block" }}>
                            {profile?.email ?? e.user_id.slice(0, 12) + "…"}
                          </span>
                        </div>

                        {/* Jour */}
                        <span style={{ fontSize: 11, color: MUTE, minWidth: 36 }}>J{e.day}</span>

                        {/* Scores pills */}
                        <div style={{ display: "flex", gap: 6, flex: 1 }}>
                          <span style={{ fontSize: 10, color: MUTE, background: "rgba(236,228,210,0.05)", padding: "2px 7px", borderRadius: 20 }}>
                            ⚡ {e.energie * 10}
                          </span>
                          <span style={{ fontSize: 10, color: MUTE, background: "rgba(236,228,210,0.05)", padding: "2px 7px", borderRadius: 20 }}>
                            😊 {e.humeur}/10
                          </span>
                          <span style={{ fontSize: 10, color: MUTE, background: "rgba(236,228,210,0.05)", padding: "2px 7px", borderRadius: 20 }}>
                            💧 {e.hydratation}/10
                          </span>
                          <span style={{ fontSize: 10, color: MUTE, background: "rgba(236,228,210,0.05)", padding: "2px 7px", borderRadius: 20 }}>
                            🌙 {e.sommeil}/10
                          </span>
                        </div>

                        {/* Time */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <span style={{ fontSize: 11, color: isOld ? "#E8A090" : MUTE }}>
                            {h < 1 ? "< 1h" : h < 24 ? `${h}h` : `${Math.floor(h / 24)}j`} ago
                          </span>
                          <span style={{ fontSize: 10, color: FAINT, display: "block" }}>
                            {fmtDatetime(e.created_at)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Summary footer */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
              <div style={{ ...card, marginBottom: 0, textAlign: "center" }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: MUTE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Actifs 48h</p>
                <p style={{ fontSize: 24, fontWeight: 600, color: BRAND }}>
                  {data.activeUsers - data.alertProfileIds.length}
                </p>
                <p style={{ fontSize: 11, color: MUTE }}>ont check-iné</p>
              </div>
              <div style={{ ...card, marginBottom: 0, textAlign: "center" }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: MUTE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Inactifs 48h</p>
                <p style={{ fontSize: 24, fontWeight: 600, color: data.alertProfileIds.length > 0 ? "#E8A090" : MUTE }}>
                  {data.alertProfileIds.length}
                </p>
                <p style={{ fontSize: 11, color: MUTE }}>silencieux</p>
              </div>
              <div style={{ ...card, marginBottom: 0, textAlign: "center" }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: MUTE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Total check-ins</p>
                <p style={{ fontSize: 24, fontWeight: 600, color: TEXT }}>
                  {data.recentEntries.length === 20 ? "20+" : data.recentEntries.length}
                </p>
                <p style={{ fontSize: 11, color: MUTE }}>entrées récentes</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
