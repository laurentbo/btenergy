"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"
import { WEEK_THEMES } from "@/data/program"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type JournalEntry = Database["public"]["Tables"]["journal_entries"]["Row"]

type CollabWithJournal = Profile & {
  last_entry: JournalEntry | null
  avg_energie: number | null
}

export default function CoachDashboard() {
  const [collabs, setCollabs] = useState<CollabWithJournal[]>([])
  const [loading, setLoading] = useState(true)
  const [coachProfile, setCoachProfile] = useState<Profile | null>(null)
  const [filter, setFilter]   = useState<"tous" | "actifs" | "inactifs">("tous")
  const [selected, setSelected] = useState<CollabWithJournal | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: cp } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setCoachProfile(cp)

      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("coach_id", user.id)
        .eq("role", "collaborateur")
        .order("created_at", { ascending: false })

      if (!profiles) { setLoading(false); return }

      const enriched = await Promise.all(profiles.map(async p => {
        const { data: entries } = await supabase
          .from("journal_entries")
          .select("*")
          .eq("user_id", p.id)
          .order("created_at", { ascending: false })

        const last_entry = entries?.[0] ?? null
        const avg_energie = entries?.length
          ? Math.round(entries.reduce((s, e) => s + e.energie, 0) / entries.length * 10) / 10
          : null
        return { ...p, last_entry, avg_energie }
      }))

      setCollabs(enriched)
      setLoading(false)
    }
    load()
  }, []) // eslint-disable-line

  const filtered = collabs.filter(c => {
    if (filter === "actifs")   return c.current_day > 0
    if (filter === "inactifs") return c.current_day === 0
    return true
  })

  const avgEnergie = collabs.filter(c => c.avg_energie).length
    ? Math.round(collabs.reduce((s, c) => s + (c.avg_energie ?? 0), 0) / collabs.filter(c => c.avg_energie).length * 10) / 10
    : null

  const signOut = async () => { await supabase.auth.signOut(); window.location.href = "/login/coach" }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3"
        style={{ background: "rgba(7,13,15,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg, var(--green-dim), var(--blue-dim))", color: "#070d0f" }}>B</div>
            <div>
              <span className="font-black tracking-wider text-sm gradient-text">BTENERGY</span>
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
            { label: "En cours",       value: collabs.filter(c => c.current_day > 0 && c.current_day < 21).length.toString(), icon: "🔥", color: "var(--blue)" },
            { label: "Terminés",       value: collabs.filter(c => c.current_day >= 21).length.toString(), icon: "🎯", color: "#818cf8" },
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
              const week = c.current_day <= 7 ? 1 : c.current_day <= 14 ? 2 : 3
              const wInfo = WEEK_THEMES[week as 1 | 2 | 3]
              const progress = Math.min(100, Math.round((c.current_day / 21) * 100))
              const lastSeen = c.last_entry
                ? new Date(c.last_entry.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                : "Jamais"

              return (
                <button key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)}
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
                        <span className="tag flex-shrink-0">J{c.current_day}/21</span>
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
                        <div className="rounded-xl p-3" style={{ background: "rgba(45,228,164,0.05)", border: "1px solid rgba(45,228,164,0.15)" }}>
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
