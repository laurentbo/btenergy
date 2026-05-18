"use client"
// Temporary preview route — delete after review
import { useState } from "react"

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10.5, fontWeight: 500, letterSpacing: "0.16em",
      textTransform: "uppercase" as const, color: "var(--text-mute)",
    }}>{children}</div>
  )
}

const OPTS: Record<string, { val: number; label: string }[]> = {
  energie: [{ val: 1, label: "À plat" }, { val: 3, label: "Correct" }, { val: 5, label: "Au top" }],
  humeur:  [{ val: 1, label: "Difficile" }, { val: 3, label: "Ça va" }, { val: 5, label: "Légère" }],
  sommeil: [{ val: 1, label: "Agité" }, { val: 3, label: "Correct" }, { val: 5, label: "Profond" }],
}

function label(key: string, val: number | null) {
  return OPTS[key]?.find(o => o.val === val)?.label ?? "—"
}

function TriRow({ dim, value, onChange }: { dim: string; value: number | null; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "var(--text-mute)", marginBottom: 8 }}>{dim}</div>
      <div style={{ display: "flex", gap: 8 }}>
        {OPTS[dim].map(o => {
          const active = value === o.val
          return (
            <button key={o.val} onClick={() => onChange(o.val)} style={{
              flex: 1, height: 44, borderRadius: 12, cursor: "pointer",
              background: active ? "var(--brand-soft)" : "var(--bg-lift)",
              border: `1px solid ${active ? "rgba(92,181,81,0.45)" : "var(--line)"}`,
              color: active ? "var(--brand)" : "var(--text-dim)",
              fontFamily: "var(--sans)", fontSize: 13, fontWeight: active ? 500 : 400,
              transition: "all .15s ease",
            }}>{o.label}</button>
          )
        })}
      </div>
    </div>
  )
}

export default function PreviewCheckin() {
  const [kg, setKg]           = useState("72,4")
  const [energie, setEnergie] = useState<number | null>(3)
  const [humeur, setHumeur]   = useState<number | null>(null)
  const [sommeil, setSommeil] = useState<number | null>(5)
  const [saved, setSaved]     = useState(false)

  const done = energie || humeur || sommeil

  return (
    <div style={{
      background: "var(--bg)", minHeight: "100vh", fontFamily: "var(--sans)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "40px 20px", gap: 40,
    }}>

      {/* ── Carte sur l'écran Aujourd'hui ── */}
      <div style={{ maxWidth: 420, width: "100%" }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "var(--text-faint)", marginBottom: 12 }}>
          Carte — écran Aujourd'hui
        </div>
        <div style={{
          padding: "16px 18px", background: "var(--bg-lift)",
          border: "1px solid var(--line)", borderRadius: 14,
          cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <Eyebrow>{done ? "ce matin · enregistré" : "comment tu te ressens ?"}</Eyebrow>
            {done ? (
              <div style={{ marginTop: 8, display: "flex", gap: 18, flexWrap: "wrap" as const }}>
                {[{ k: "Énergie", key: "energie", v: energie }, { k: "Humeur", key: "humeur", v: humeur }, { k: "Sommeil", key: "sommeil", v: sommeil }]
                  .filter(x => x.v)
                  .map(x => (
                    <div key={x.k}>
                      <div style={{ fontSize: 9.5, color: "var(--text-faint)", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{x.k}</div>
                      <div style={{ fontSize: 14, fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--text)", marginTop: 3 }}>
                        {label(x.key, x.v)}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--text-mute)" }}>Poids · énergie · humeur · sommeil</p>
            )}
          </div>
          <span style={{ color: "var(--text-faint)", fontSize: 16, flexShrink: 0 }}>→</span>
        </div>
      </div>

      {/* ── Modal ── */}
      <div style={{ maxWidth: 420, width: "100%" }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "var(--text-faint)", marginBottom: 12 }}>
          Modal (bottom sheet en vrai)
        </div>
        <div style={{
          background: "var(--bg-surface)", border: "1px solid var(--line)",
          borderRadius: 20, padding: "28px 24px",
        }}>
          <div style={{ width: 36, height: 3, borderRadius: 2, background: "var(--line)", margin: "0 auto 24px" }} />

          <Eyebrow>lundi 18 mai</Eyebrow>
          <h3 style={{
            margin: "8px 0 26px", fontFamily: "var(--serif)",
            fontWeight: 400, fontSize: 26, lineHeight: 1.1,
            letterSpacing: "-0.015em", color: "var(--text)",
          }}>
            Comment tu te <em style={{ fontStyle: "italic", color: "var(--brand)" }}>ressens</em> ?
          </h3>

          {/* Poids */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "var(--text-mute)", marginBottom: 8 }}>poids</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="text" value={kg} onChange={e => setKg(e.target.value)}
                style={{
                  width: 96, height: 44, borderRadius: 10,
                  background: "var(--bg-lift)", border: "1px solid var(--line)",
                  color: "var(--text)", fontFamily: "var(--sans)", fontSize: 20,
                  textAlign: "center", outline: "none",
                }}
              />
              <span style={{ fontSize: 13, color: "var(--text-mute)" }}>kg</span>
              <span style={{ fontSize: 12, color: "var(--text-faint)" }}>hier · 72,7 kg</span>
            </div>
          </div>

          <TriRow dim="energie" value={energie} onChange={setEnergie} />
          <TriRow dim="humeur"  value={humeur}  onChange={setHumeur}  />
          <TriRow dim="sommeil" value={sommeil} onChange={setSommeil} />

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button style={{
              flex: 1, height: 46, borderRadius: 999,
              background: "transparent", border: "1px solid var(--line)",
              color: "var(--text-dim)", fontSize: 14, fontFamily: "var(--sans)", cursor: "pointer",
            }}>Annuler</button>
            <button
              onClick={() => setSaved(true)}
              style={{
                flex: 2, height: 46, borderRadius: 999, border: "none",
                background: done ? "var(--brand)" : "var(--bg-lift)",
                color: done ? "#fff" : "var(--text-faint)",
                fontSize: 14, fontFamily: "var(--sans)", fontWeight: 500,
                cursor: done ? "pointer" : "default", transition: "background .2s",
              }}
            >{saved ? "Enregistré" : "Enregistrer"}</button>
          </div>
        </div>
      </div>

    </div>
  )
}
