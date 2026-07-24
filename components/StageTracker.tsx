"use client";

const stages = [
  { id: 1, label: "Detection",  sub: "Sentinel-1 SAR + AI" },
  { id: 2, label: "Collection", sub: "Bio-sorbent boom" },
  { id: 3, label: "Conversion", sub: "Pyrolysis output" },
];

export default function StageTracker() {
  const active = 3;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0",
    }}>
      {stages.map((s, i) => {
        const done   = s.id < active;
        const isNow  = s.id === active;

        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Step circle */}
              <div style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                border: `1px solid ${isNow ? "var(--color-low)" : done ? "var(--glass-border-light)" : "var(--glass-border)"}`,
                background: isNow ? "rgba(34, 197, 94, 0.1)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {done ? (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: isNow ? "var(--color-low)" : "var(--text-secondary)",
                  }}>{s.id}</span>
                )}
              </div>

              {/* Labels */}
              <div>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: isNow ? "var(--text-primary)" : done ? "var(--text-secondary)" : "var(--text-secondary)",
                }}>
                  {s.label}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", opacity: 0.8 }}>
                  {s.sub}
                </div>
              </div>
            </div>

            {/* Connector */}
            {i < stages.length - 1 && (
               <div style={{
                width: "48px",
                height: "1px",
                background: done ? "var(--glass-border-light)" : "var(--glass-border)",
                margin: "0 16px",
                flexShrink: 0,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
