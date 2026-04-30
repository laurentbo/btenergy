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
      style={{ background: "#07111e" }}
    >
      <div className="max-w-sm w-full text-center">
        {/* Logo */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-8"
          style={{
            background: "linear-gradient(135deg, #2dd4a0, #4cc9f0)",
            color: "#050e1a",
          }}
        >
          B
        </div>

        {/* Prénom */}
        {displayName && (
          <p
            className="font-black mb-4 leading-tight"
            style={{ fontSize: "38px", color: "#ffffff" }}
          >
            {displayName}
          </p>
        )}

        {/* Carte glassmorphism */}
        <div
          className="rounded-2xl p-7 mb-8 text-left"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(45,212,160,0.25)",
            backdropFilter: "blur(20px)",
          }}
        >
          <p
            className="font-black mb-3"
            style={{ fontSize: "20px", color: "#ffffff" }}
          >
            Bienvenue dans votre programme BacktoEnergy.
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              lineHeight: "1.75",
              fontSize: "15px",
            }}
          >
            Vous avez fait le premier pas vers une énergie durable.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl font-black text-base transition-all"
          style={{
            background: "linear-gradient(135deg, #2dd4a0, #4cc9f0)",
            color: "#050e1a",
            letterSpacing: "0.04em",
            fontSize: "16px",
          }}
        >
          Commencer mon programme →
        </button>
      </div>
    </div>
  )
}
