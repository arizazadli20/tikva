"use client";

type Stage = {
  id: number;
  label: string;
  sub: string;
  icon: React.ReactNode;
};

const stages: Stage[] = [
  {
    id: 1,
    label: "Detection",
    sub: "Sentinel-1 SAR + AI",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <circle cx="12" cy="12" r="7" strokeOpacity="0.4"/>
        <line x1="12" y1="2" x2="12" y2="5"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="5" y2="12"/>
        <line x1="19" y1="12" x2="22" y2="12"/>
      </svg>
    ),
  },
  {
    id: 2,
    label: "Collection",
    sub: "Bio-sorbent boom",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
  },
  {
    id: 3,
    label: "Conversion",
    sub: "Pyrolysis output",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23,4 23,10 17,10"/>
        <polyline points="1,20 1,14 7,14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
    ),
  },
];

export default function StageTracker() {
  const activeStage = 3; // all stages complete in this demo

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        padding: "22px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.055)",
      }}
    >
      {stages.map((stage, i) => {
        const isDone   = stage.id < activeStage;
        const isActive = stage.id === activeStage;
        const isPending = stage.id > activeStage;

        const iconColor = isPending
          ? "rgba(255,255,255,0.20)"
          : isActive
          ? "rgba(92,224,198,0.90)"
          : "rgba(255,255,255,0.65)";

        const labelColor = isPending
          ? "rgba(255,255,255,0.22)"
          : isActive
          ? "#FFFFFF"
          : "rgba(255,255,255,0.65)";

        const subColor = isPending
          ? "rgba(255,255,255,0.14)"
          : "rgba(255,255,255,0.32)";

        return (
          <div key={stage.id} style={{ display: "flex", alignItems: "center" }}>
            {/* Stage item */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                position: "relative",
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive
                    ? "rgba(92,224,198,0.08)"
                    : isDone
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.02)",
                  border: isActive
                    ? "1px solid rgba(92,224,198,0.25)"
                    : "1px solid rgba(255,255,255,0.07)",
                  color: iconColor,
                  flexShrink: 0,
                }}
              >
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.2" strokeLinecap="round">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                ) : (
                  stage.icon
                )}
              </div>

              {/* Labels */}
              <div>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: labelColor,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}>
                  {stage.label}
                </div>
                <div style={{
                  fontSize: "10.5px",
                  fontWeight: 400,
                  color: subColor,
                  letterSpacing: "0.01em",
                  marginTop: "1px",
                }}>
                  {stage.sub}
                </div>
              </div>
            </div>

            {/* Connector line */}
            {i < stages.length - 1 && (
              <div
                style={{
                  width: "80px",
                  height: "1px",
                  margin: "0 20px",
                  background: isDone
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.07)",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                {isDone && (
                  <div style={{
                    position: "absolute",
                    right: 0,
                    top: "-3px",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.20)",
                  }}/>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
