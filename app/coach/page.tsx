"use client"
import { useEffect, useState } from "react"
import type { Database } from "@/lib/supabase/types"
import { WEEK_THEMES, PROGRAM, calcCurrentDay } from "@/data/program"
import ProgramEditor from "@/components/ProgramEditor"
import { createClient } from "@/lib/supabase/client"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type JournalEntry = Database["public"]["Tables"]["journal_entries"]["Row"]

type CollabWithJournal = Profile & {
  last_entry: JournalEntry | null
  avg_energie: number | null
}

type MealLog = { day: number; moment: string; items: string[]; created_at: string }

const MOMENT_LABEL: Record<string, string> = {
  matin: "Petit-déjeuner", midi: "Déjeuner", "après-midi": "Collation", soir: "Dîner"
}

export default function CoachDashboard() {
  const [collabs, setCollabs] = useState<CollabWithJournal[]>([])
  const [loading, setLoading] = useState(true)
  const [coachProfile, setCoachProfile] = useState<Profile | null>(null)
  const [filter, setFilter]   = useState<"tous" | "actifs" | "inactifs">("tous")
  const [selected, setSelected] = useState<CollabWithJournal | null>(null)
  const [editing, setEditing]   = useState<CollabWithJournal | null>(null)
  const [mealLogs, setMealLogs] = useState<Record<string, MealLog[]>>({})
  const [logsLoading, setLogsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      // Profil coach via API sécurisée
      const meRes = await fetch("/api/me")
      if (!meRes.ok) return
      const me = await meRes.json()
      setCoachProfile({ id: me.id, prenom: me.prenom, role: me.role } as any)

      // Collaborateurs via API sécurisée (service_role, bypass RLS)
      const collabRes = await fetch("/api/collabs")
      if (collabRes.ok) {
        const data = await collabRes.json()
        setCollabs(data as CollabWithJournal[])
      }
      setLoading(false)
    }
    load()
  }, []) // eslint-disable-line

  const filtered = collabs.filter(c => {
    const day = calcCurrentDay(c.program_start)
    if (filter === "actifs")   return day > 0 && day <= 21
    if (filter === "inactifs") return !c.program_start
    return true
  })

  const avgEnergie = collabs.filter(c => c.avg_energie).length
    ? Math.round(collabs.reduce((s, c) => s + (c.avg_energie ?? 0), 0) / collabs.filter(c => c.avg_energie).length * 10) / 10
    : null

  const selectCollab = async (c: CollabWithJournal) => {
    const isDeselect = selected?.id === c.id
    setSelected(isDeselect ? null : c)
    if (isDeselect || mealLogs[c.id]) return
    setLogsLoading(true)
    const { data } = await supabase
      .from("meal_logs")
      .select("day, moment, items, created_at")
      .eq("user_id", c.id)
      .order("day", { ascending: true })
    setMealLogs(prev => ({ ...prev, [c.id]: (data ?? []) as MealLog[] }))
    setLogsLoading(false)
  }

  const signOut = async () => {
    const { createClient } = await import("@/lib/supabase/client")
    await createClient().auth.signOut()
    window.location.href = "/login/coach"
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>

      {/* Éditeur programme plein écran */}
      {editing && (
        <ProgramEditor
          collaborateurId={editing.id}
          collaborateurPrenom={editing.prenom ?? "Collaborateur"}
          coachId={coachProfile?.id ?? ""}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3"
        style={{ background: "rgba(7,13,15,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg, var(--green-dim), var(--blue-dim))", color: "#070d0f" }}>B</div>
            <div>
              <span className="font-black text-sm gradient-text">BACKToENERGY</span>
              <span className="text-xs ml-2" style={{ color: "var(--blue)" }}>Coach</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{coachProfile?.prenom}</span>
            <button onClick={signOut} className="tag cursor-pointer">Déconnexion</button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">

        {/* Stats globales */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
          {[
            { label: "Collaborateurs", value: collabs.length.toString(), icon: "👥", color: "var(--green)" },
            { label: "En cours",       value: collabs.filter(c => { const d = calcCurrentDay(c.program_start); return d > 0 && d < 21 }).length.toString(), icon: "🔥", color: "var(--blue)" },
            { label: "Terminés",       value: collabs.filter(c => calcCurrentDay(c.program_start) >= 21).length.toString(), icon: "🎯", color: "#818cf8" },
            { label: "Énergie moy.",   value: avgEnergie ? `${avgEnergie}/10` : "—", icon: "⚡", color: "#f59e0b" },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="card p-4 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-xl font-black" style={{ color }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-4">
          {(["tous", "actifs", "inactifs"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
              style={{
                background: filter === f ? "linear-gradient(135deg, var(--green-dim), var(--blue-dim))" : "var(--bg-card)",
                border: `1px solid ${filter === f ? "transparent" : "var(--border)"}`,
                color: filter === f ? "#070d0f" : "var(--text-secondary)",
              }}>
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs self-center" style={{ color: "var(--text-muted)" }}>
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Liste collaborateurs */}
        {loading ? (
          <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-lg mb-2">👥</p>
            <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Aucun collaborateur</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Partagez votre code entreprise pour inviter des collaborateurs.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(c => {
              const day = calcCurrentDay(c.program_start)
              const week = day <= 7 ? 1 : day <= 14 ? 2 : 3
              const wInfo = WEEK_THEMES[week as 1 | 2 | 3]
              const progress = Math.min(100, Math.round((day / 21) * 100))
              const lastSeen = c.last_entry
                ? new Date(c.last_entry.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                : "Jamais"

              return (
                <button key={c.id} onClick={() => selectCollab(c)}
                  className="card w-full p-4 text-left transition-all"
                  style={{ borderColor: selected?.id === c.id ? wInfo.color + "50" : undefined }}>
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: `${wInfo.color}18`, border: `1px solid ${wInfo.color}40`, color: wInfo.color }}>
                      {c.prenom?.charAt(0).toUpperCase() ?? "?"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{c.prenom}</span>
                        <span className="tag flex-shrink-0">J{day}/21</span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: wInfo.color }}>{wInfo.title}</p>
                      <div className="progress-bar mt-2">
                        <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${wInfo.color}, ${wInfo.color}88)` }} />
                      </div>
                    </div>
                  </div>

                  {/* Détail déplié */}
                  {selected?.id === c.id && (
                    <div className="mt-4 pt-4 space-y-3 fade-up" style={{ borderTop: "1px solid var(--border)" }}>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Dernier journal", value: lastSeen, icon: "📓" },
                          { label: "Énergie moy.", value: c.avg_energie ? `${c.avg_energie}/10` : "—", icon: "⚡" },
                          { label: "Genre", value: c.genre ?? "—", icon: "👤" },
                          { label: "Âge / Poids", value: c.age && c.poids ? `${c.age} ans · ${c.poids} kg` : "—", icon: "📋" },
                        ].map(({ label, value, icon }) => (
                          <div key={label} className="rounded-xl p-3"
                            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-sm">{icon}</span>
                              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
                            </div>
                            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{value}</p>
                          </div>
                        ))}
                      </div>

                      {c.last_entry && (
                        <div className="rounded-xl p-3" style={{ background: "rgba(76,201,240,0.05)", border: "1px solid rgba(76,201,240,0.15)" }}>
                          <p className="text-xs mb-2 font-semibold" style={{ color: "var(--green)" }}>Dernier journal ({lastSeen})</p>
                          <div className="grid grid-cols-4 gap-2 text-center">
                            {[
                              { l: "Énergie", v: c.last_entry.energie },
                              { l: "Humeur",  v: c.last_entry.humeur },
                              { l: "Hydrat.", v: c.last_entry.hydratation },
                              { l: "Sommeil", v: c.last_entry.sommeil },
                            ].map(({ l, v }) => (
                              <div key={l}>
                                <div className="font-black text-sm gradient-text">{v}/10</div>
                                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{l}</div>
                              </div>
                            ))}
                          </div>
                          {c.last_entry.note && (
                            <p className="text-xs mt-2 italic" style={{ color: "var(--text-secondary)" }}>
                              &ldquo;{c.last_entry.note}&rdquo;
                            </p>
                          )}
                        </div>
                      )}

                      {/* Modifications repas */}
                      {(() => {
                        const logs = mealLogs[c.id]
                        if (logsLoading && !logs) return (
                          <p className="text-xs text-center py-2" style={{ color: "var(--text-muted)" }}>Chargement des repas…</p>
                        )
                        if (!logs || logs.length === 0) return null
                        return (
                          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(167,139,250,0.2)" }}>
                            <div className="px-3 py-2.5 flex items-center gap-2"
                              style={{ background: "rgba(167,139,250,0.08)", borderBottom: "1px solid rgba(167,139,250,0.15)" }}>
                              <span style={{ fontSize: "13px" }}>✎</span>
                              <p className="text-xs font-bold" style={{ color: "#a78bfa" }}>
                                Modifications repas — {logs.length} entrée{logs.length > 1 ? "s" : ""}
                              </p>
                            </div>
                            <div className="divide-y divide-white/5">
                              {logs.map((log, i) => {
                                const planned = PROGRAM[log.day - 1]?.meals.find(m => m.moment === log.moment)
                                return (
                                  <div key={i} className="px-3 py-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-semibold" style={{ color: "#a78bfa" }}>
                                        J{log.day} · {MOMENT_LABEL[log.moment] ?? log.moment}
                                      </span>
                                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                        {new Date(log.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <p className="text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>Prévu</p>
                                        <ul className="space-y-0.5">
                                          {planned?.items.map((it, j) => (
                                            <li key={j} className="text-xs" style={{ color: "rgba(240,246,255,0.45)" }}>· {it}</li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <p className="text-xs mb-1.5" style={{ color: "#a78bfa" }}>Mangé</p>
                                        <ul className="space-y-0.5">
                                          {log.items.map((it, j) => (
                                            <li key={j} className="text-xs" style={{ color: "rgba(240,246,255,0.8)" }}>· {it}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })()}

                      {/* Boutons actions */}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <button
                          onClick={e => { e.stopPropagation(); setEditing(c) }}
                          className="btn-primary text-xs"
                          style={{ padding: "8px" }}>
                          ✏️ Personnaliser
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); window.open(`/coach/preview/${c.id}`, "_blank") }}
                          className="text-xs rounded-xl font-semibold transition-all"
                          style={{ padding: "8px", background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                          👁 Voir l&apos;espace
                        </button>
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
