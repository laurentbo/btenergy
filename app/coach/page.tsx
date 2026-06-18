"use client"
import { useEffect, useState } from "react"
import type { Database } from "@/lib/supabase/types"
import { WEEK_THEMES, PROGRAM, calcCurrentDay } from "@/data/program"
import ProgramEditor from "@/components/ProgramEditor"
import { createClient } from "@/lib/supabase/client"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type CoachProfile = Pick<Profile, "id" | "prenom" | "role">
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
  const [coachProfile, setCoachProfile] = useState<CoachProfile | null>(null)
  const [filter, setFilter]   = useState<"tous" | "actifs" | "inactifs">("tous")
  const [selected, setSelected] = useState<CollabWithJournal | null>(null)
  const [editing, setEditing]   = useState<CollabWithJournal | null>(null)
  const [mealLogs, setMealLogs] = useState<Record<string, MealLog[]>>({})
  const [logsLoading, setLogsLoading] = useState(false)
  const supabase = createClient()

  // ── Invitation modal ──────────────────────────────────────────────────────
  const [showInvite, setShowInvite] = useState(false)
  const [invitePrenom, setInvitePrenom] = useState("")
  const [inviteEmail, setInviteEmail]   = useState("")
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteResult, setInviteResult]   = useState<{ ok: boolean; message: string } | null>(null)

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const deleteCollab = async (collabId: string) => {
    setDeleteLoading(true)
    const res = await fetch(`/api/coach/delete-collab?id=${collabId}`, { method: "DELETE" })
    setDeleteLoading(false)
    setDeleteConfirm(null)
    if (res.ok) {
      setCollabs(prev => prev.filter(c => c.id !== collabId))
      setSelected(null)
    }
  }

  const sendInvite = async () => {
    setInviteLoading(true)
    setInviteResult(null)
    const res = await fetch("/api/coach/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail, prenom: invitePrenom }),
    })
    const data = await res.json()
    setInviteLoading(false)
    if (!res.ok) {
      setInviteResult({ ok: false, message: data.error ?? "Erreur inconnue" })
    } else {
      setInviteResult({ ok: true, message: `✅ Invitation envoyée ! Un email a été envoyé à ${inviteEmail}.` })
      setInvitePrenom("")
      setInviteEmail("")
      // Re-fetch la liste
      const collabRes = await fetch("/api/collabs")
      if (collabRes.ok) setCollabs(await collabRes.json())
    }
  }

  const closeInvite = () => {
    setShowInvite(false)
    setInvitePrenom("")
    setInviteEmail("")
    setInviteResult(null)
  }

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/me")
      if (!meRes.ok) {
        window.location.href = "/login/coach"
        return
      }
      const me = await meRes.json()
      if (me.role !== "coach" && me.role !== "admin") {
        window.location.href = "/login/coach"
        return
      }
      setCoachProfile({ id: me.id, prenom: me.prenom, role: me.role })

      const collabRes = await fetch("/api/collabs")
      if (collabRes.ok) setCollabs(await collabRes.json())
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

      {/* Modal invitation */}
      {showInvite && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={e => { if (e.target === e.currentTarget) closeInvite() }}>
          <div className="card w-full p-6" style={{ maxWidth: 420 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-base" style={{ color: "var(--text-primary)" }}>
                ✉️ Inviter un collaborateur
              </h2>
              <button onClick={closeInvite}
                className="text-sm"
                style={{ color: "var(--text-muted)" }}>✕</button>
            </div>

            {inviteResult?.ok ? (
              <div>
                <p className="text-sm mb-4" style={{ color: "var(--green)" }}>{inviteResult.message}</p>
                <button onClick={closeInvite} className="btn-primary w-full text-sm">Fermer</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 font-semibold"
                    style={{ color: "var(--text-muted)" }}>Prénom</label>
                  <input
                    type="text"
                    value={invitePrenom}
                    onChange={e => setInvitePrenom(e.target.value)}
                    placeholder="Prénom du collaborateur"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 font-semibold"
                    style={{ color: "var(--text-muted)" }}>Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="adresse@exemple.com"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  />
                </div>

                {inviteResult && !inviteResult.ok && (
                  <p className="text-xs text-red-400">❌ Erreur : {inviteResult.message}</p>
                )}

                <button
                  onClick={sendInvite}
                  disabled={!invitePrenom || !inviteEmail || inviteLoading}
                  className="btn-primary w-full text-sm"
                  style={{ opacity: (!invitePrenom || !inviteEmail || inviteLoading) ? 0.5 : 1 }}>
                  {inviteLoading ? "Envoi en cours…" : "Envoyer l'invitation →"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3"
        style={{ background: "var(--bg-primary)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg, var(--green-dim), var(--blue-dim))", color: "var(--bg-primary)" }}>B</div>
            <div>
              <span className="font-black text-sm gradient-text">Back to Energy</span>
              <span className="text-xs ml-2" style={{ color: "var(--blue)" }}>Coach</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{coachProfile?.prenom}</span>
            <a href="/coach/menus" className="tag" style={{ textDecoration: "none", cursor: "pointer" }}>🍽 Menus</a>
            <a href="/admin/cockpit" className="tag" style={{ textDecoration: "none", cursor: "pointer" }}>Cockpit</a>
            <button onClick={signOut} className="tag cursor-pointer">Déconnexion</button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">

        {/* Stats globales */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
          {[
            { label: "Participants",   value: collabs.length.toString(), color: "var(--green)" },
            { label: "En cours",       value: collabs.filter(c => { const d = calcCurrentDay(c.program_start); return d > 0 && d < 21 }).length.toString(), color: "var(--blue)" },
            { label: "Terminés",       value: collabs.filter(c => calcCurrentDay(c.program_start) >= 21).length.toString(), color: "#818cf8" },
            { label: "Actifs ce mois", value: collabs.filter(c => c.program_start != null).length.toString(), color: "#f59e0b" },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4 text-center">
              <div className="text-xl font-black" style={{ color }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Filtres + bouton invitation */}
        <div className="flex gap-2 mb-4 flex-wrap">
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
          <button
            onClick={() => setShowInvite(true)}
            className="btn-primary text-xs flex items-center gap-1.5"
            style={{ padding: "6px 14px" }}>
            + Inviter
          </button>
        </div>

        {/* Liste participants */}
        {loading ? (
          <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Aucun participant</p>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Invite les participants pour qu&apos;ils rejoignent le programme.
            </p>
            <button onClick={() => setShowInvite(true)} className="btn-primary text-sm">
              + Inviter
            </button>
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
                      {(c.prenom ?? c.email)?.charAt(0).toUpperCase() ?? "?"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-semibold text-sm block truncate" style={{ color: "var(--text-primary)" }}>
                            {c.prenom ?? "—"}
                          </span>
                          <span className="text-xs truncate block" style={{ color: "var(--text-muted)" }}>{c.email}</span>
                        </div>
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
                          { label: "Dernier journal", value: lastSeen },
                          { label: "Genre", value: c.genre ?? "—" },
                        ].map(({ label, value }) => (
                          <div key={label} className="rounded-xl p-3"
                            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                            <div className="flex items-center gap-1.5 mb-1">
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
                                <div className="font-black text-sm gradient-text">
                                  {v == null ? "—" : v <= 3 ? "Bas" : v <= 6 ? "Moyen" : v <= 8 ? "Bien" : "Top"}
                                </div>
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

                      {/* Suppression */}
                      <div className="mt-2">
                        {deleteConfirm === c.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={e => { e.stopPropagation(); deleteCollab(c.id) }}
                              disabled={deleteLoading}
                              className="flex-1 text-xs rounded-xl font-semibold"
                              style={{ padding: "8px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171" }}>
                              {deleteLoading ? "Suppression…" : "Confirmer la suppression"}
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); setDeleteConfirm(null) }}
                              className="text-xs rounded-xl font-semibold px-3"
                              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={e => { e.stopPropagation(); setDeleteConfirm(c.id) }}
                            className="w-full text-xs rounded-xl font-semibold transition-all"
                            style={{ padding: "8px", background: "transparent", border: "1px solid rgba(239,68,68,0.25)", color: "rgba(239,68,68,0.7)" }}>
                            🗑 Supprimer ce profil
                          </button>
                        )}
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
