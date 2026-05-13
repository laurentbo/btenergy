"use client"
import { useState } from "react"

const PRINCIPES = [
  { num: 1, icon: "🌅", titre: "L'eau citronnée à jeun", corps: "Chaque matin, avant tout aliment : un grand verre d'eau tiède avec le jus d'un demi-citron. Active le foie, stimule la bile, alcalinise le sang. Puis 5 à 10 minutes d'étirements ou de marche.", couleur: "#f59e0b" },
  { num: 2, icon: "🍽️", titre: "Cinq moments de repas", corps: "Petit-déjeuner · collation si faim · déjeuner · collation si faim · dîner. Les collations ne sont pas obligatoires — écoute ta faim. Respecter 4 à 5 heures entre chaque repas.", couleur: "var(--green)" },
  { num: 3, icon: "🍎", titre: "Les fruits seuls", corps: "Les fruits se consomment toujours à jeun ou entre les repas — jamais en fin de repas. En dehors des repas, ils se digèrent seuls en 20-30 min. Mélangés aux autres aliments, ils fermentent et gonflent.", couleur: "var(--accent-cyan)" },
  { num: 4, icon: "🌿", titre: "Commencer par le cru", corps: "Chaque dîner commence par des crudités. Les enzymes des aliments crus activent la digestion et préparent l'intestin à absorber le cuit. Ne jamais commencer par quelque chose de chaud.", couleur: "var(--accent-mint)" },
  { num: 5, icon: "🚫", titre: "Zéro gluten, zéro lactose, zéro sucre raffiné", corps: "Pendant 21 jours : pas de blé, pas de produits laitiers animaux, pas de sucre blanc. Les céréales autorisées sont le riz, quinoa, millet, sarrasin. Le miel brut et les dattes sont les seuls sucrants.", couleur: "#f87171" },
  { num: 6, icon: "⏱️", titre: "Respecter les fenêtres", corps: "Dîner avant 20h. Jeûne nocturne de 12h minimum. Le corps détoxifie, répare et synthétise ses hormones la nuit — à condition d'arrêter de manger assez tôt.", couleur: "#818cf8" },
  { num: 7, icon: "🐓", titre: "La volaille bio en semaine 3 seulement", corps: "Les semaines 1 et 2 sont 100% végétaliennes. À partir du jour 16, la volaille bio (poulet, canard, pintade) peut être introduite au dîner — 2 à 3 fois maximum sur la semaine 3. Qualité label rouge ou bio impérative.", couleur: "#a78bfa" },
]

const ASSOCIATIONS = [
  { groupe: "Protéines animales", proteines: "❌", cereales: "❌", legumes: "✅", fruits: "❌", graisses: "⚠️" },
  { groupe: "Céréales / Amidons", proteines: "❌", cereales: "✅", legumes: "✅", fruits: "❌", graisses: "✅" },
  { groupe: "Légumes", proteines: "✅", cereales: "✅", legumes: "✅", fruits: "⚠️", graisses: "✅" },
  { groupe: "Fruits", proteines: "❌", cereales: "❌", legumes: "⚠️", fruits: "✅", graisses: "❌" },
  { groupe: "Graisses", proteines: "⚠️", cereales: "✅", legumes: "✅", fruits: "❌", graisses: "✅" },
]

const SUCRES_CACHES = [
  { categorie: "Boissons", exemples: ["Jus de fruits industriels", "Sodas light (faux ami)", "Smoothies en bouteille", "Laits végétaux sucrés", "Café capsule aromatisé"] },
  { categorie: "Céréales du matin", exemples: ["Müesli 'healthy'", "Granola bio", "Flocons aromatisés", "Barres céréales"] },
  { categorie: "Sauces & condiments", exemples: ["Ketchup", "Sauce barbecue", "Vinaigrette industrielle", "Sauce tomate en bocal"] },
  { categorie: "Produits 'sans graisse'", exemples: ["Yaourts 0%", "Fromages allégés", "Biscuits 'light'"] },
  { categorie: "Sucres raffinés directs", exemples: ["Sucre blanc", "Sucre de canne", "Sirop d'agave (≠ brut)", "Miel industriel chauffé"] },
]

const BLE_AVANT_APRES = [
  { aspect: "Teneur en gluten", avant: "8–10 %", apres: "40–80 % (blé modifié)" },
  { aspect: "Modifications", avant: "Blé ancestral épeautre/kamut", apres: "Hybridations répétées depuis 1950" },
  { aspect: "Effet digestif", avant: "Digestion lente, fermentation faible", apres: "Passage rapide, fermentation élevée" },
  { aspect: "Index glycémique", avant: "IG moyen ~50–55", apres: "IG élevé ~70–85 (pain blanc)" },
  { aspect: "Protéines", avant: "Structure protéique complexe, stable", apres: "Protéines modifiées, pro-inflammatoires" },
  { aspect: "Effet sur l'intestin", avant: "Muqueuse préservée", apres: "Perméabilité intestinale augmentée" },
]

export default function LearnTab() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const toggleAccordion = (key: string) => {
    setOpenAccordion(prev => prev === key ? null : key)
  }

  return (
    <div className="space-y-6">

      {/* Associations alimentaires */}
      <div>
        <p className="section-title">🔗 Associations alimentaires</p>
        <div className="card-dark rounded-2xl p-4">
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
            ✅ Compatible · ⚠️ Modéré · ❌ Éviter
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px 6px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap" }}>
                    Groupe
                  </th>
                  {["Protéines", "Céréales", "Légumes", "Fruits", "Graisses"].map(h => (
                    <th key={h} style={{ padding: "8px 6px", textAlign: "center", color: "var(--text-muted)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ASSOCIATIONS.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "8px 6px", color: "var(--text-primary)", fontWeight: 600, whiteSpace: "nowrap" }}>{row.groupe}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", fontSize: "15px" }}>{row.proteines}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", fontSize: "15px" }}>{row.cereales}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", fontSize: "15px" }}>{row.legumes}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", fontSize: "15px" }}>{row.fruits}</td>
                    <td style={{ padding: "8px 6px", textAlign: "center", fontSize: "15px" }}>{row.graisses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 7 principes */}
      <div>
        <p className="section-title">⚡ Les 7 règles d'or du Pari</p>
        <div className="card-dark rounded-2xl overflow-hidden">
          {PRINCIPES.map((p, i) => (
            <div key={p.num}
              style={{ borderBottom: i < PRINCIPES.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div className="flex items-start gap-3 px-4 py-3.5">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background: `${p.couleur}18`, border: `1px solid ${p.couleur}28` }}>
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-black" style={{ color: p.couleur }}>#{p.num}</span>
                    <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{p.titre}</p>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{p.corps}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sucres raffinés — accordéon */}
      <div>
        <p className="section-title">🍬 Sucres raffinés & cachés</p>
        <div className="card-dark rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleAccordion("sucres")}
            className="w-full flex items-center justify-between px-4 py-3.5 transition-all"
            style={{ background: openAccordion === "sucres" ? "rgba(255,255,255,0.04)" : "transparent" }}>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: "18px" }}>🔍</span>
              <p className="font-bold text-sm text-left" style={{ color: "var(--text-primary)" }}>
                Identifier les sucres cachés dans vos aliments
              </p>
            </div>
            <span style={{
              color: "var(--text-muted)", fontSize: "12px",
              transform: openAccordion === "sucres" ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              display: "inline-block",
              flexShrink: 0,
            }}>▾</span>
          </button>
          {openAccordion === "sucres" && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="px-4 py-4 space-y-4">
                <p className="text-xs" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
                  Le sucre raffiné perturbe l'équilibre glycémique, épuise le foie et entretient l'inflammation. Voici où il se cache, même dans les produits qui semblent sains.
                </p>
                {SUCRES_CACHES.map((cat, i) => (
                  <div key={i}>
                    <p className="text-xs font-bold mb-1.5" style={{ color: "var(--accent-lime)" }}>{cat.categorie}</p>
                    <div className="flex flex-wrap gap-1">
                      {cat.exemples.map((ex, k) => (
                        <span key={k} className="rounded-lg px-2 py-0.5 text-xs"
                          style={{ background: "rgba(248,113,113,0.08)", color: "#f87171", border: "1px solid rgba(248,113,113,0.18)" }}>
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="rounded-xl p-3" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}>
                  <p className="text-xs font-bold mb-1" style={{ color: "#f87171" }}>Pendant la cure</p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Zéro sucre raffiné. Uniquement miel brut, dattes et fruits entiers.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blé moderne — accordéon */}
      <div>
        <p className="section-title">🌾 Le blé moderne</p>
        <div className="card-dark rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleAccordion("ble")}
            className="w-full flex items-center justify-between px-4 py-3.5 transition-all"
            style={{ background: openAccordion === "ble" ? "rgba(255,255,255,0.04)" : "transparent" }}>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: "18px" }}>⚗️</span>
              <p className="font-bold text-sm text-left" style={{ color: "var(--text-primary)" }}>
                Blé ancestral vs blé moderne — ce qui a changé
              </p>
            </div>
            <span style={{
              color: "var(--text-muted)", fontSize: "12px",
              transform: openAccordion === "ble" ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              display: "inline-block",
              flexShrink: 0,
            }}>▾</span>
          </button>
          {openAccordion === "ble" && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="px-4 py-4">
                <p className="text-xs mb-4" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
                  Le blé que nous consommons aujourd'hui n'a plus grand chose à voir avec le blé d'il y a 70 ans. Les hybridations intensives ont profondément modifié sa composition.
                </p>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead>
                      <tr>
                        <th style={{ padding: "8px 6px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Aspect</th>
                        <th style={{ padding: "8px 6px", textAlign: "left", color: "var(--green)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Blé ancestral</th>
                        <th style={{ padding: "8px 6px", textAlign: "left", color: "#f87171", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Blé moderne</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BLE_AVANT_APRES.map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "8px 6px", color: "var(--text-muted)", fontWeight: 500 }}>{row.aspect}</td>
                          <td style={{ padding: "8px 6px", color: "var(--text-secondary)" }}>{row.avant}</td>
                          <td style={{ padding: "8px 6px", color: "rgba(248,113,113,0.9)" }}>{row.apres}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="rounded-xl p-3 mt-4" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}>
                  <p className="text-xs" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
                    <strong style={{ color: "#f87171" }}>Alternatives pendant et après la cure :</strong> Épeautre, kamut, sarrasin, riz thaï, quinoa, millet. Ces grains sont naturellement moins modifiés et mieux tolérés.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
