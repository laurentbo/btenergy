"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ChangePasswordForm() {
  const [newPassword, setNewPassword]     = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError]   = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault()
    setError("")
    if (newPassword !== confirmPassword) {
      setError("❌ Les mots de passe ne correspondent pas")
      return
    }
    if (newPassword.length < 6) {
      setError("❌ Le mot de passe doit contenir au moins 6 caractères")
      return
    }
    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)
    if (updateError) { setError(`❌ ${updateError.message}`); return }
    setSuccess(true)
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e5e0", borderRadius: "16px", padding: "24px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: 800, color: "#2B2D2E", margin: "0 0 4px" }}>
        🔑 Changer mon mot de passe
      </h2>
      <p style={{ fontSize: "13px", color: "#9b9590", margin: "0 0 20px" }}>
        Si tu utilises un mot de passe temporaire, change-le maintenant.
      </p>

      {success ? (
        <p style={{ fontSize: "14px", color: "#2A9D8F", fontWeight: 600 }}>✅ Mot de passe mis à jour.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#6b6b6b", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e8e5e0", fontSize: "14px", color: "#2B2D2E", background: "#fff", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#6b6b6b", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e8e5e0", fontSize: "14px", color: "#2B2D2E", background: "#fff", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          {error && (
            <p style={{ fontSize: "13px", color: "#E76F51", margin: 0 }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={!newPassword || !confirmPassword || loading}
            style={{
              padding: "12px",
              borderRadius: "10px",
              background: "#2A9D8F",
              color: "#fff",
              fontWeight: 700,
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
              opacity: (!newPassword || !confirmPassword || loading) ? 0.5 : 1,
            }}>
            {loading ? "Mise à jour…" : "Changer mon mot de passe"}
          </button>
        </form>
      )}
    </div>
  )
}
