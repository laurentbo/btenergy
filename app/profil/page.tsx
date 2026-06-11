"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { C, rgba, Ic } from "@/components/bte-ui"
import Link from "next/link"

export default function ProfilPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [prenom, setPrenom]     = useState("")
  const [email, setEmail]       = useState("")
  const [age, setAge]           = useState("")
  const [poids, setPoids]       = useState("")
  const [userId, setUserId]     = useState<string | null>(null)
  const [saved, setSaved]       = useState(false)
  const [ready, setReady]       = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/login"); return }
      setUserId(user.id)
      setEmail(user.email ?? "")
      const { data } = await supabase.from("profiles").select("prenom, age, poids").eq("id", user.id).maybeSingle()
      if (data) {
        setPrenom(data.prenom ?? "")
        if (data.age   != null) setAge(String(data.age))
        if (data.poids != null) setPoids(String(data.poids))
      }
      setReady(true)
    })
  }, []) // eslint-disable-line

  const infosReady = age.trim() !== "" && poids.trim() !== ""

  async function handleSave() {
    if (!infosReady || !userId) return
    await supabase.from("profiles").update({
      age:   parseInt(age),
      poids: parseFloat(poids),
    }).eq("id", userId)
    setSaved(true)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.replace("/login")
  }

  if (!ready) return <div style={{ minHeight: "100svh", background: C.bg }} />

  const initial = prenom ? prenom[0].toUpperCase() : "?"

  return (
    <div style={{ minHeight: "100svh", background: C.chassis, display: "flex", justifyContent: "center", fontFamily: "var(--sans)" }}>
      <div style={{ width: "100%", maxWidth: 440, minHeight: "100svh", background: C.bg, color: C.ink, display: "flex", flexDirection: "column", padding: "20px 18px 36px" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 26 }}>
          <Link href="/programme" aria-label="Retour" style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 999, border: `2px solid ${C.ink}`, display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}>
              <Ic name="arrow" col={C.ink} sw={2} s={19} />
            </span>
          </Link>
          <span style={{ fontFamily: "var(--label)", fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.soft }}>Ton profil</span>
        </div>

        {/* Identité */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <span style={{ flexShrink: 0, width: 64, height: 64, borderRadius: 999, background: C.terra, color: C.bg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--heading)", fontWeight: 600, fontSize: 28 }}>{initial}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--heading)", fontWeight: 700, fontSize: 27, letterSpacing: "-0.015em", lineHeight: 1.05, color: C.ink }}>{prenom}</div>
            <div style={{ fontSize: 14, color: C.soft, marginTop: 3 }}>{email}</div>
          </div>
        </div>

        {/* Repères pour Laurent */}
        <div style={{ background: C.surface, border: `1.5px solid ${C.line}`, borderRadius: 18, padding: "20px 18px 18px", marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--heading)", fontWeight: 600, fontSize: 19, letterSpacing: "-0.01em", color: C.ink, marginBottom: 6 }}>Tes repères pour Laurent</div>
          <p style={{ margin: "0 0 18px", fontSize: 13.5, lineHeight: 1.55, color: C.soft }}>
            Ils restent entre toi et lui — ça l'aide à ajuster ton programme. Rien ne s'affiche ailleurs dans l'app.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 4 }}>
            {/* Âge */}
            <div>
              <label htmlFor="pf-age" style={{ fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: C.soft, marginBottom: 8, display: "block" }}>Ton âge</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `2px solid ${C.ink}`, borderRadius: 12, padding: "12px 14px" }}>
                <input
                  id="pf-age" type="number" inputMode="numeric" min={16} max={99} placeholder="—"
                  value={age} onChange={e => { setAge(e.target.value); setSaved(false) }}
                  style={{ flex: 1, width: "100%", minWidth: 0, border: "none", background: "transparent", outline: "none", color: C.ink, fontFamily: "var(--label)", fontSize: 16, fontWeight: 700 }}
                />
                <span style={{ flexShrink: 0, fontFamily: "var(--label)", fontSize: 12, fontWeight: 500, color: C.soft }}>ans</span>
              </div>
            </div>
            {/* Poids */}
            <div>
              <label htmlFor="pf-poids" style={{ fontFamily: "var(--label)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: C.soft, marginBottom: 8, display: "block" }}>Ton poids</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `2px solid ${C.ink}`, borderRadius: 12, padding: "12px 14px" }}>
                <input
                  id="pf-poids" type="number" inputMode="decimal" min={30} max={250} step={0.5} placeholder="—"
                  value={poids} onChange={e => { setPoids(e.target.value); setSaved(false) }}
                  style={{ flex: 1, width: "100%", minWidth: 0, border: "none", background: "transparent", outline: "none", color: C.ink, fontFamily: "var(--label)", fontSize: 16, fontWeight: 700 }}
                />
                <span style={{ flexShrink: 0, fontFamily: "var(--label)", fontSize: 12, fontWeight: 500, color: C.soft }}>kg</span>
              </div>
            </div>
          </div>

          {!saved ? (
            <button onClick={handleSave} style={{ width: "100%", cursor: infosReady ? "pointer" : "default", border: "none", background: C.leaf, color: "#fff", fontFamily: "var(--label)", fontWeight: 700, fontSize: 14.5, letterSpacing: "0.02em", padding: "14px 18px", borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, opacity: infosReady ? 1 : 0.55, transition: "opacity 0.15s", marginTop: 10 }}>
              Enregistrer <Ic name="check" col="#fff" sw={2.4} s={17} />
            </button>
          ) : (
            <div style={{ display: "flex", gap: 11, background: rgba(C.leaf, 0.1), border: `1.5px solid ${rgba(C.leaf, 0.4)}`, borderRadius: 12, padding: "13px 15px", marginTop: 10 }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}><Ic name="check" col={C.leaf} sw={2.4} s={20} /></span>
              <div style={{ fontSize: 13.5, lineHeight: 1.5, color: C.ink }}>Noté — transmis à Laurent.</div>
            </div>
          )}
        </div>

        {/* Aide */}
        <div style={{ textAlign: "center", fontSize: 13, color: C.soft, marginBottom: 24 }}>
          Un souci avec ton compte ?{" "}
          <Link href="/chat" style={{ color: C.leaf, fontWeight: 600 }}>Écris à Laurent, il te répond.</Link>
        </div>

        <div style={{ flex: 1 }} />

        {/* Déconnexion */}
        <button onClick={handleSignOut} style={{ textDecoration: "none", textAlign: "center", border: `1.5px solid ${rgba(C.ink, 0.35)}`, color: C.ink, background: "transparent", fontFamily: "var(--label)", fontWeight: 700, fontSize: 13.5, padding: "13px 18px", borderRadius: 999, cursor: "pointer" }}>
          Me déconnecter
        </button>
        <div style={{ marginTop: 14, textAlign: "center", fontFamily: "var(--label)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: C.soft }}>
          backtoenergy · programme 21 jours
        </div>
      </div>
    </div>
  )
}
