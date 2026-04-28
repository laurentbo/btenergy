"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type WeightEntry = { id: string; date: string; poids: number }

export default function WeightTracker({ initialWeight }: { initialWeight?: number }) {
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [newWeight, setNewWeight] = useState("")
  const [newDate, setNewDate]   = useState(new Date().toISOString().split("T")[0])
  const [saving, setSaving]     = useState(false)
  const [loading, setLoading]   = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from("weight_entries")
        .select("id, date, poids")
        .eq("user_id", user.id)
        .order("date", { ascending: true })
      setEntries((data ?? []) as WeightEntry[])
      setLoading(false)
    }
    load()
  }, []) // eslint-disable-line

  async function handleAdd() {
    if (!newWeight) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase
      .from("weight_entries")
      .upsert({ user_id: user.id, date: newDate, poids: parseFloat(newWeight) }, { onConflict: "user_id,date" })
      .select("id, date, poids")
      .single()
    if (!error && data) {
      setEntries(prev => {
        const filtered = prev.filter(e => e.date !== newDate)
        return [...filtered, data as WeightEntry].sort((a, b) => a.date.localeCompare(b.date))
      })
      setNewWeight("")
    }
    setSaving(false)
  }

  const first  = initialWeight ?? entries[0]?.poids
  const latest = entries[entries.length - 1]?.poids
  const diff   = first && latest ? Math.round((latest - first) * 10) / 10 : null
  const diffColor = diff === null ? "var(--text-muted)" : diff < 0 ? "var(--green)" : diff > 0 ? "#f87171" : "var(--text-muted)"

  // Mini graphique SVG
  const chartH = 80
  const chartW = 260
  const padX = 10
  const padY = 10
  const weights = entries.map(e => e.poids)
  const minW = weights.length ? Math.min(...weights) - 1 : 0
  const maxW = weights.length ? Math.max(...weights) + 1 : 100
  const toX = (i: number) => padX + (i / Math.max(1, weights.length - 1)) * (chartW - 2 * padX)
  const toY = (w: number) => chartH - padY - ((w - minW) / Math.max(1, maxW - minW)) * (chartH - 2 * padY)
  const pathD = weights.map((w, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(w)}`).join(" ")

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>⚖️ Suivi du poids</h3>
        {diff !== null && (
          <span className="text-sm font-black" style={{ color: diffColor }}>
            {diff > 0 ? "+" : ""}{diff} kg
          </span>
        )}
      </div>

      {/* Stats */}
      {entries.length > 0 && (
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Départ",  value: first  ? `${first} kg`  : "—" },
            { label: "Actuel",  value: latest ? `${latest} kg` : "—" },
            { label: "Évol.",   value: diff !== null ? `${diff > 0 ? "+" : ""}${diff} kg` : "—", color: diffColor },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl p-2" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
              <div className="text-sm font-black" style={{ color: color ?? "var(--text-primary)" }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Graphique */}
      {weights.length >= 2 && (
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none" style={{ display: "block" }}>
            {/* Ligne de fond */}
            <path d={`${pathD} L ${toX(weights.length - 1)} ${chartH} L ${toX(0)} ${chartH} Z`}
              fill="rgba(76,201,240,0.08)" />
            {/* Courbe */}
            <path d={pathD} fill="none" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Points */}
            {weights.map((w, i) => (
              <circle key={i} cx={toX(i)} cy={toY(w)} r="2.5" fill="var(--green)" />
            ))}
          </svg>
        </div>
      )}

      {/* Historique */}
      {entries.length > 0 && (
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {[...entries].reverse().map(e => (
            <div key={e.id} className="flex items-center justify-between px-3 py-1.5 rounded-lg"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {new Date(e.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{e.poids} kg</span>
            </div>
          ))}
        </div>
      )}

      {loading && <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>Chargement...</p>}

      {/* Saisie */}
      <div className="flex gap-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
        <input
          type="date"
          value={newDate}
          onChange={e => setNewDate(e.target.value)}
          className="rounded-xl px-3 py-2 text-xs outline-none"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", colorScheme: "dark", flex: "1" }}
        />
        <input
          type="number" step="0.1" min="30" max="300"
          placeholder="kg"
          value={newWeight}
          onChange={e => setNewWeight(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          className="rounded-xl px-3 py-2 text-xs outline-none w-20 text-center"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
        />
        <button
          onClick={handleAdd}
          disabled={!newWeight || saving}
          className="btn-primary text-xs px-4"
          style={{ opacity: !newWeight || saving ? 0.5 : 1, padding: "8px 14px" }}>
          {saving ? "…" : "+"}
        </button>
      </div>
    </div>
  )
}
