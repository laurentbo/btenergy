import Link from "next/link"

export default function AccueilPublic() {
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL ?? ""

  return (
    <div style={{
      background: "var(--bg)", color: "var(--text)",
      fontFamily: "var(--sans)", minHeight: "100vh",
    }}>

      {/* Header */}
      <header style={{
        padding: "0 28px",
        borderBottom: "1px solid var(--line-soft)",
      }}>
        <div style={{
          maxWidth: 760, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 60,
        }}>
          {logoUrl
            ? <img src={logoUrl} alt="Back to Energy" style={{ height: 28, width: "auto" }} />
            : <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17, color: "var(--text)" }}>Back to Energy</span>
          }
          <Link href="/login" style={{
            fontSize: 13, color: "var(--text-dim)", textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            Connexion <span style={{ color: "var(--text-faint)" }}>→</span>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 28px 100px" }}>

        {/* Héro */}
        <section style={{ padding: "80px 0 64px" }}>
          <div style={{
            fontSize: 10.5, fontWeight: 500, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "var(--text-mute)", marginBottom: 20,
          }}>Programme 21 jours · méthode Verissimo</div>
          <h1 style={{
            fontFamily: "var(--serif)", fontWeight: 400,
            fontSize: "clamp(38px, 7vw, 60px)", lineHeight: 1.05,
            letterSpacing: "-0.02em", color: "var(--text)",
            margin: "0 0 24px",
          }}>
            Retrouver ton<br />
            <em style={{ fontStyle: "italic", color: "var(--brand)" }}>énergie naturelle.</em>
          </h1>
          <p style={{
            fontSize: 16, color: "var(--text-dim)", lineHeight: 1.7,
            maxWidth: "46ch", margin: "0 0 40px",
          }}>
            Pas un régime. Une manière de manger qui respecte ton corps — associations simples, aliments bruts, accompagnement personnalisé.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--brand)", color: "#fff",
              fontFamily: "var(--sans)", fontWeight: 500, fontSize: 14,
              padding: "13px 24px", borderRadius: 999,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(92,181,81,0.25)",
            }}>
              Accéder à mon programme →
            </Link>
            <Link href="/login/coach" style={{
              display: "inline-flex", alignItems: "center",
              background: "transparent", color: "var(--text-mute)",
              fontFamily: "var(--sans)", fontSize: 13,
              padding: "13px 20px", borderRadius: 999,
              border: "1px solid var(--line)",
              textDecoration: "none",
            }}>
              Espace coach
            </Link>
          </div>
        </section>

        {/* Séparateur */}
        <hr style={{ border: 0, borderTop: "1px solid var(--line-soft)", margin: 0 }} />

        {/* Méthode */}
        <section style={{ padding: "64px 0 56px" }}>
          <div style={{
            fontSize: 10.5, fontWeight: 500, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "var(--text-mute)", marginBottom: 14,
          }}>La méthode</div>
          <h2 style={{
            fontFamily: "var(--serif)", fontWeight: 400, fontSize: 30,
            lineHeight: 1.15, letterSpacing: "-0.015em",
            color: "var(--text)", margin: "0 0 40px",
          }}>
            Ce que tu vas vivre <em style={{ fontStyle: "italic", color: "var(--accent)" }}>en 21 jours</em>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              {
                days: "Jours 1 – 7",
                name: "Détox",
                body: "Le corps ralentit, évacue. Tu manges simple, tu bois beaucoup. La fatigue peut monter avant de passer.",
              },
              {
                days: "Jours 8 – 14",
                name: "Énergie",
                body: "Le brouillard se lève. L'énergie remonte. Les associations alimentaires prennent sens dans ton quotidien.",
              },
              {
                days: "Jours 15 – 21",
                name: "Ancrage",
                body: "Les habitudes s'installent d'elles-mêmes. Tu n'as plus besoin d'y penser — c'est ta façon de manger.",
              },
            ].map((ch, i) => (
              <div key={ch.name} style={{
                display: "flex", gap: 28, alignItems: "flex-start",
                padding: "28px 0",
                borderTop: i > 0 ? "1px solid var(--line-soft)" : "none",
              }}>
                <div style={{ width: 76, flexShrink: 0 }}>
                  <div style={{
                    fontFamily: "var(--serif)", fontStyle: "italic",
                    fontSize: 22, color: "var(--brand)", lineHeight: 1,
                  }}>{ch.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 5 }}>{ch.days}</div>
                </div>
                <p style={{
                  margin: 0, fontSize: 14, color: "var(--text-dim)",
                  lineHeight: 1.7, flex: 1,
                }}>{ch.body}</p>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ border: 0, borderTop: "1px solid var(--line-soft)", margin: 0 }} />

        {/* Principes clés */}
        <section style={{ padding: "64px 0 56px" }}>
          <div style={{
            fontSize: 10.5, fontWeight: 500, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "var(--text-mute)", marginBottom: 14,
          }}>Les repères</div>
          <h2 style={{
            fontFamily: "var(--serif)", fontWeight: 400, fontSize: 30,
            lineHeight: 1.15, letterSpacing: "-0.015em",
            color: "var(--text)", margin: "0 0 36px",
          }}>
            Pas de règles — des <em style={{ fontStyle: "italic", color: "var(--accent)" }}>points d'appui</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {[
              { title: "Associations simples", body: "Protéines et légumes, ou féculents et légumes — jamais les deux ensemble." },
              { title: "Aliments bruts", body: "Ce qui sort du sol ou de l'animal, sans transformation industrielle." },
              { title: "Manger sans stress", body: "L'état dans lequel tu manges compte autant que ce que tu manges." },
              { title: "Bouger chaque jour", body: "30 minutes d'activité physique — pas négociable, ça fait partie du programme." },
            ].map(p => (
              <div key={p.title} style={{
                padding: "22px 20px",
                background: "var(--bg-lift)",
                border: "1px solid var(--line)",
                borderRadius: 14,
              }}>
                <div style={{
                  fontSize: 14, fontWeight: 500, color: "var(--text)",
                  marginBottom: 8,
                }}>{p.title}</div>
                <p style={{
                  margin: 0, fontSize: 13, color: "var(--text-dim)", lineHeight: 1.65,
                }}>{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ border: 0, borderTop: "1px solid var(--line-soft)", margin: 0 }} />

        {/* Coach */}
        <section style={{ padding: "64px 0" }}>
          <div style={{
            padding: "32px 28px",
            background: "var(--bg-lift)",
            border: "1px solid var(--line)",
            borderRadius: 18,
          }}>
            <div style={{
              fontSize: 10.5, fontWeight: 500, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "var(--text-mute)", marginBottom: 16,
            }}>Ton accompagnement</div>
            <p style={{
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 20, lineHeight: 1.55, color: "var(--coach)",
              margin: "0 0 16px",
            }}>
              « Je réponds dans le journal tous les jours. Tu n'es jamais seul·e face à une question. »
            </p>
            <p style={{ fontSize: 13, color: "var(--text-mute)", margin: "0 0 24px" }}>— Camille, coach Back to Energy</p>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "transparent", color: "var(--brand)",
              fontFamily: "var(--sans)", fontSize: 13,
              padding: "10px 18px", borderRadius: 999,
              border: "1px solid rgba(92,181,81,0.35)",
              textDecoration: "none",
            }}>
              Démarrer mon programme →
            </Link>
          </div>
        </section>

      </main>

      <footer style={{
        borderTop: "1px solid var(--line-soft)",
        padding: "24px 28px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 12, color: "var(--text-faint)", margin: 0 }}>
          Back to Energy · Programme 21 jours · backtoenergy.fr
        </p>
      </footer>
    </div>
  )
}
