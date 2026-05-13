"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const PHASES = [
  {
    num: "S1",
    bg: "rgba(220,224,61,0.18)",
    color: "#7a7f00",
    titre: "Détox & Purification",
    why: "Libérer l'organisme et les incompatibilités alimentaires.",
  },
  {
    num: "S2",
    bg: "rgba(98,206,157,0.18)",
    color: "#1a7a52",
    titre: "Énergie & Vitalité",
    why: "Nourrir les cellules en profondeur et retrouver une énergie naturelle.",
  },
  {
    num: "S3",
    bg: "rgba(38,197,206,0.18)",
    color: "#0d6e7a",
    titre: "Ancrage & Performance",
    why: "Installer durablement les nouveaux réflexes pour un poids stable et une énergie durable.",
  },
]

export default function WelcomePage() {
  const router = useRouter()
  const [prenom, setPrenom] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/login"); return }
      const { data } = await supabase
        .from("profiles")
        .select("prenom")
        .eq("id", user.id)
        .maybeSingle()
      setPrenom(data?.prenom ?? null)
      setLoading(false)
    })
  }, []) // eslint-disable-line

  if (loading) return (
    <div style={{ minHeight: "100svh", background: "#f5f3ef", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2.5px solid #dce03d", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const displayName = prenom
    ? prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase()
    : null

  return (
    <div style={{ minHeight: "100svh", background: "#f5f3ef", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 430 }}>

        {/* Header */}
        <div style={{ background: "#0f1117", padding: "32px 20px 28px", textAlign: "center" }}>

          {/* Logo */}
          <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 20 }}>
            <span style={{ color: "#dce03d" }}>Back</span>
            <span style={{ color: "#ffffff" }}>to</span>
            <span style={{ color: "#9fd76d" }}>energy</span>
          </div>

          {/* Prénom */}
          <p style={{ fontSize: 24, fontWeight: 700, color: "#ffffff", marginBottom: 16, margin: "0 0 16px" }}>
            {displayName ? `Bonjour ${displayName}` : "Bonjour"}
          </p>

          {/* Sous-titre */}
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            Bienvenue au programme 21 jours
          </p>
        </div>

        {/* Card 3 phases */}
        <div style={{
          background: "#ffffff",
          borderRadius: 14,
          border: "0.5px solid rgba(0,0,0,0.07)",
          margin: 16,
          padding: "6px 0",
          overflow: "hidden",
        }}>
          {PHASES.map((phase, i) => (
            <div key={phase.num} style={{
              padding: "14px 16px",
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              borderTop: i > 0 ? "0.5px solid rgba(0,0,0,0.06)" : "none",
            }}>
              {/* Badge */}
              <div style={{
                flexShrink: 0,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: phase.bg,
                color: phase.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.03em",
              }}>
                {phase.num}
              </div>

              {/* Texte */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1117", margin: "0 0 3px" }}>
                  {phase.titre}
                </p>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.55 }}>
                  {phase.why}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ margin: "0 16px 10px" }}>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              width: "100%",
              padding: 15,
              borderRadius: 12,
              border: "none",
              background: "#0f1117",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}>
            Démarrer aujourd'hui
            <span style={{ color: "#dce03d", fontSize: 16 }}>→</span>
          </button>
        </div>

        {/* Footer */}
        <p style={{ fontSize: 11, color: "#bbb", textAlign: "center", marginBottom: 16 }}>
          Programme de 21 jours · Backtoenergy
        </p>

      </div>
    </div>
  )
}
