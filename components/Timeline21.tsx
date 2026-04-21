"use client"

type Props = {
  totalDays: number
  currentDay: number
  completedDays: number[]
}

export default function Timeline21({ totalDays, currentDay, completedDays }: Props) {
  return (
    <div className="card p-5 fade-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Programme 21 jours
        </h3>
        <span className="tag">{completedDays.length}/{totalDays} jours</span>
      </div>

      <div className="progress-bar mb-4">
        <div className="progress-fill" style={{ width: `${(completedDays.length / totalDays) * 100}%` }} />
      </div>

      <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1
          const isDone = completedDays.includes(day)
          const isCurrent = day === currentDay
          return (
            <div
              key={day}
              title={`Jour ${day}`}
              className="flex flex-col items-center gap-1 rounded-lg py-1.5 px-1 cursor-default transition-colors"
              style={{
                background: isCurrent ? "rgba(45, 228, 164, 0.08)" : "transparent",
                border: isCurrent ? "1px solid rgba(45, 228, 164, 0.3)" : "1px solid transparent",
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: isDone
                    ? "var(--green-dim)"
                    : isCurrent
                    ? "var(--green)"
                    : "var(--border)",
                  boxShadow: isCurrent ? "0 0 6px rgba(45, 228, 164, 0.6)" : "none",
                }}
              />
              <span className="text-center leading-none"
                style={{
                  fontSize: "9px",
                  color: isCurrent ? "var(--green)" : isDone ? "var(--text-muted)" : "var(--text-muted)",
                  fontWeight: isCurrent ? 700 : 400,
                }}>
                {day}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex gap-4 mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
        {[
          { color: "var(--green)", label: "Aujourd'hui" },
          { color: "var(--green-dim)", label: "Terminé" },
          { color: "var(--border)", label: "À venir" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
