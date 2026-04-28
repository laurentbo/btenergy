"use client"

export default function RitualCard({ matin, soir }: { matin: string; soir: string }) {
  return (
    <div className="card p-5 fade-up">
      <h3 className="font-semibold mb-4 text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
        Rituels du jour
      </h3>
      <div className="space-y-4">
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}>
            🌅
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "#f59e0b" }}>Rituel matin</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.72)", lineHeight: "1.65" }}>{matin}</p>
          </div>
        </div>

        <div className="h-px" style={{ background: "rgba(255,255,255,0.08)" }} />

        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
            style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)" }}>
            🌙
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "#a78bfa" }}>Rituel soir</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.72)", lineHeight: "1.65" }}>{soir}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
