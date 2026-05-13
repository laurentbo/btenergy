"use client"
import { createClient } from "@/lib/supabase/client"

interface Props {
  prenom: string | null
  onDone: () => void
}

export default function WelcomeScreen({ prenom, onDone }: Props) {
  const supabase = createClient()

  const handleStart = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from("profiles")
        .update({ welcome_seen_at: new Date().toISOString() })
        .eq("id", user.id)
    }
    onDone()
  }

  const displayName = prenom
    ? prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase()
    : null

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#f7f4ef" }}
    >
      <div className="max-w-sm w-full text-center">

        {/* Logo texte */}
        <div className="mb-8">
          <p style={{ fontWeight: 900, fontSize: "28px", letterSpacing: "-0.5px", lineHeight: 1 }}>
            <span style={{ color: "#16a34a" }}>Backt</span>
            <span style={{ color: "#1e293b" }}>o</span>
            <span style={{ color: "#16a34a" }}>energy</span>
          </p>
          <div style={{ width: "40px", height: "3px", background: "#16a34a", borderRadius: "2px", margin: "8px auto 0" }} />
        </div>

        {/* Prénom */}
        {displayName && (
          <p
            className="font-black mb-6 leading-tight"
            style={{ fontSize: "36px", color: "#0f172a" }}
          >
            Bonjour {displayName} 👋
          </p>
        )}

        {/* Carte */}
        <div
          className="rounded-2xl p-7 mb-8 text-left"
          style={{
            background: "#ffffff",
            border: "1px solid #e8e0d4",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <p
            className="font-black mb-3"
            style={{ fontSize: "18px", color: "#0f172a", lineHeight: 1.35 }}
          >
            Bienvenue dans votre programme Backtoenergy.
          </p>
          <p
            style={{
              color: "#64748b",
              lineHeight: "1.75",
              fontSize: "15px",
            }}
          >
            Vous avez fait le premier pas vers une énergie durable. 21 jours pour transformer votre rapport à l&apos;alimentation.
          </p>

          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { icon: "🌿", text: "Sans gluten · sans lactose · sans sucre raffiné" },
              { icon: "💧", text: "Eau citronnée à jeun chaque matin" },
              { icon: "🌙", text: "Dîner avant 20h, jeûne nocturne de 12h" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
                <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl font-black text-base transition-all"
          style={{
            background: "#16a34a",
            color: "#ffffff",
            letterSpacing: "0.02em",
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
          }}
        >
          Commencer mon programme →
        </button>

        <p style={{ marginTop: "14px", fontSize: "12px", color: "#94a3b8" }}>
          Programme de 21 jours · Backtoenergy
        </p>
      </div>
    </div>
  )
}
