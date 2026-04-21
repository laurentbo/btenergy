"use client"

export default function RitualCard({ matin, soir }: { matin: string; soir: string }) {
  return (
    <div className="card p-5 fade-up">
      <h3 className="font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Rituels du jour
      </h3>
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-base"
            style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.25)" }}>
            🌅
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "#f59e0b" }}>Rituel matin</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>{matin}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-base"
            style={{ background: "rgba(129, 140, 248, 0.12)", border: "1px solid rgba(129, 140, 248, 0.25)" }}>
            🌙
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "#818cf8" }}>Rituel soir</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>{soir}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
