"use client"
import { CADRES, type JourData } from "@/data/programme"

type Props = { jour: JourData }

export default function MealsBlock({ jour }: Props) {
  if (jour.type === "cure_s1" || jour.type === "cure_s2") {
    const cadre = jour.type === "cure_s1" ? CADRES.cure_s1 : CADRES.cure_s2
    return (
      <div className="space-y-4">
        {/* Jus section */}
        <div>
          <p className="section-title">🥤 Les jus du jour</p>
          <div className="space-y-3">
            {cadre.jus.map((j, i) => (
              <div key={i} className="card-dark rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: "18px" }}>{j.icon}</span>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{j.moment}</p>
                    <p className="text-xs" style={{ color: "var(--green)" }}>{j.famille}</p>
                  </div>
                </div>
                <p className="text-xs mb-2 italic" style={{ color: "var(--text-muted)" }}>{j.note}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {j.exemples.map((ex, k) => (
                    <span key={k} className="rounded-lg px-2 py-0.5 text-xs"
                      style={{ background: "rgba(159,215,109,0.1)", color: "var(--green)", border: "1px solid rgba(159,215,109,0.2)" }}>
                      {ex}
                    </span>
                  ))}
                </div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>💡 {j.conseil}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Jus raisin */}
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(191,125,44,0.08)", border: "1px solid rgba(191,125,44,0.25)" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#BF7D2C" }}>🍇 Jus de raisin dilué — toute la journée</p>
          <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>{cadre.jus_raisin}</p>
        </div>

        {/* Dîner */}
        <div>
          <p className="section-title">🌙 Dîner</p>
          <div className="space-y-3">
            {/* Entrée */}
            <div className="card-dark rounded-2xl p-4">
              <p className="font-bold text-sm mb-1" style={{ color: "var(--accent-cyan)" }}>Entrée · {cadre.diner.entree.famille}</p>
              <p className="text-xs italic mb-2" style={{ color: "var(--text-muted)" }}>{cadre.diner.entree.note}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {cadre.diner.entree.exemples.map((ex, k) => (
                  <span key={k} className="rounded-lg px-2 py-0.5 text-xs"
                    style={{ background: "rgba(38,197,206,0.1)", color: "var(--accent-cyan)", border: "1px solid rgba(38,197,206,0.2)" }}>
                    {ex}
                  </span>
                ))}
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>🫒 {cadre.diner.entree.assaisonnement}</p>
            </div>

            {/* Plat */}
            <div className="card-dark rounded-2xl p-4">
              <p className="font-bold text-sm mb-1" style={{ color: "var(--accent-mint)" }}>Plat · {cadre.diner.plat.famille}</p>
              <p className="text-xs italic mb-2" style={{ color: "var(--text-muted)" }}>{cadre.diner.plat.note}</p>
              {"cereales" in cadre.diner.plat && (
                <div className="mb-2">
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Céréales</p>
                  <div className="flex flex-wrap gap-1">
                    {cadre.diner.plat.cereales.map((c, k) => (
                      <span key={k} className="rounded-lg px-2 py-0.5 text-xs"
                        style={{ background: "rgba(98,206,157,0.1)", color: "var(--accent-mint)", border: "1px solid rgba(98,206,157,0.2)" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {"legumineuses" in cadre.diner.plat && (
                <div className="mb-2">
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Légumineuses</p>
                  <div className="flex flex-wrap gap-1">
                    {cadre.diner.plat.legumineuses.map((l, k) => (
                      <span key={k} className="rounded-lg px-2 py-0.5 text-xs"
                        style={{ background: "rgba(98,206,157,0.1)", color: "var(--accent-mint)", border: "1px solid rgba(98,206,157,0.2)" }}>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {"legumes" in cadre.diner.plat && (
                <div className="mb-2">
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Légumes</p>
                  <div className="flex flex-wrap gap-1">
                    {cadre.diner.plat.legumes.map((l, k) => (
                      <span key={k} className="rounded-lg px-2 py-0.5 text-xs"
                        style={{ background: "rgba(98,206,157,0.1)", color: "var(--accent-mint)", border: "1px solid rgba(98,206,157,0.2)" }}>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {"legumes_racines" in cadre.diner.plat && (
                <div className="mb-2">
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Légumes racines</p>
                  <div className="flex flex-wrap gap-1">
                    {cadre.diner.plat.legumes_racines.map((l, k) => (
                      <span key={k} className="rounded-lg px-2 py-0.5 text-xs"
                        style={{ background: "rgba(98,206,157,0.1)", color: "var(--accent-mint)", border: "1px solid rgba(98,206,157,0.2)" }}>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>🔥 {cadre.diner.plat.cuisson}</p>
            </div>

            {/* Dessert */}
            <div className="card-dark rounded-2xl p-4">
              <p className="font-bold text-sm mb-1" style={{ color: "#BF7D2C" }}>Dessert · {cadre.diner.dessert.famille}</p>
              <p className="text-xs italic mb-2" style={{ color: "var(--text-muted)" }}>{cadre.diner.dessert.note}</p>
              <div className="flex flex-wrap gap-1">
                {cadre.diner.dessert.exemples.map((ex, k) => (
                  <span key={k} className="rounded-lg px-2 py-0.5 text-xs"
                    style={{ background: "rgba(191,125,44,0.1)", color: "#BF7D2C", border: "1px solid rgba(191,125,44,0.2)" }}>
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (jour.type === "off") {
    const cadre = CADRES.off
    return (
      <div className="space-y-4">
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(220,224,61,0.07)", border: "1px solid rgba(220,224,61,0.2)" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--accent-lime)" }}>🌿 {cadre.label}</p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{cadre.note}</p>
        </div>
        <div className="space-y-3">
          {cadre.familles.map((f, i) => (
            <div key={i} className="card-dark rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: "20px" }}>{f.icon}</span>
                <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{f.label}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {f.exemples.map((ex, k) => (
                  <span key={k} className="rounded-lg px-2 py-0.5 text-xs"
                    style={{ background: "rgba(220,224,61,0.08)", color: "var(--accent-lime)", border: "1px solid rgba(220,224,61,0.18)" }}>
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (jour.type === "reprise") {
    const idx = "reprise_idx" in jour ? (jour.reprise_idx as number) : 0
    const repriseData = CADRES.reprise[idx]
    return (
      <div className="space-y-4">
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(107,79,160,0.08)", border: "1px solid rgba(107,79,160,0.25)" }}>
          <p className="font-bold text-sm mb-1" style={{ color: "#6B4FA0" }}>🌱 {repriseData.titre}</p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{repriseData.note}</p>
        </div>
        <div className="space-y-3">
          {repriseData.familles.map((f, i) => (
            <div key={i} className="card-dark rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: "20px" }}>{f.icon}</span>
                <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{f.label}</p>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {f.exemples.map((ex, k) => (
                  <span key={k} className="rounded-lg px-2 py-0.5 text-xs"
                    style={{ background: "rgba(107,79,160,0.1)", color: "#a78bfa", border: "1px solid rgba(107,79,160,0.25)" }}>
                    {ex}
                  </span>
                ))}
              </div>
              <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>{f.note}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
