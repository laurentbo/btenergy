"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => router.replace("/"), 3000)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg, #0b1e38 0%, #07111e 55%, #050e1a 100%)" }}
    >
      <div className="max-w-sm w-full text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, #2dd4a0, #4cc9f0)", color: "#050e1a" }}
        >
          B
        </div>

        <h1
          className="text-3xl font-black mb-4"
          style={{
            background: "linear-gradient(135deg, #2dd4a0, #4cc9f0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Bienvenue !
        </h1>

        <p className="text-base mb-2" style={{ color: "rgba(255,255,255,0.65)", lineHeight: "1.7" }}>
          Votre compte <strong style={{ color: "#ffffff" }}>Backtoenergy</strong> est activé.
          <br />
          Votre programme de 21 jours vous attend.
        </p>

        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
          Redirection en cours…
        </p>

        <div
          className="w-6 h-6 rounded-full border-2 animate-spin mx-auto"
          style={{ borderColor: "#4cc9f0", borderTopColor: "transparent" }}
        />
      </div>
    </div>
  )
}
