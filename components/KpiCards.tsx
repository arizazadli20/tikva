"use client";

import { KPIs } from "@/lib/mock-data";

type Props = { kpis: KPIs };

type Card = {
  id: string;
  label: string;
  description: string;
  value: number;
  target: number;
  targetLabel: string;
  format: (v: number) => string;
  unit?: string;
  lowerIsBetter?: boolean;
};

function MetricCard({ card }: { card: Card }) {
  const met     = card.lowerIsBetter ? card.value <= card.target : card.value >= card.target;
  const numStr  = card.format(card.value);
  const fillPct = card.lowerIsBetter
    ? Math.min(100, (card.target / card.value) * 100)
    : Math.min(100, (card.value / card.target) * 100);

  // Target marker position on track
  const targetPct = card.lowerIsBetter
    ? 100 // target is the cap
    : Math.min(100, (card.target / (card.target * 1.18)) * 100);

  return (
    <div
      id={card.id}
      className="hover-card"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.065)",
        borderRadius: "20px",
        padding: "28px 28px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top-edge accent line when target met */}
      {met && (
        <div style={{
          position: "absolute",
          top: 0, left: "20%", right: "20%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(92,224,198,0.5), transparent)",
        }}/>
      )}

      {/* Header row */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "22px",
      }}>
        <div>
          <div style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.30)",
            marginBottom: "4px",
          }}>
            {card.label}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", fontWeight: 400 }}>
            {card.description}
          </div>
        </div>
        {/* Target badge */}
        <div style={{
          padding: "3px 9px",
          borderRadius: "999px",
          background: met ? "rgba(92,224,198,0.08)" : "rgba(255,255,255,0.04)",
          border: met ? "1px solid rgba(92,224,198,0.18)" : "1px solid rgba(255,255,255,0.07)",
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.04em",
          color: met ? "rgba(92,224,198,0.75)" : "rgba(255,255,255,0.28)",
          flexShrink: 0,
          marginLeft: "12px",
          marginTop: "1px",
        }}>
          Target {card.targetLabel}
        </div>
      </div>

      {/* Big number */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "24px" }}>
        <span style={{
          fontSize: "52px",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: met ? "rgba(92,224,198,0.92)" : "rgba(255,255,255,0.88)",
          fontVariantNumeric: "tabular-nums",
        }}>
          {numStr}
        </span>
        {card.unit && (
          <span style={{
            fontSize: "18px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.30)",
            letterSpacing: "-0.01em",
          }}>
            {card.unit}
          </span>
        )}
      </div>

      {/* Progress track */}
      <div style={{ position: "relative" }}>
        <div style={{
          height: "3px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.06)",
          overflow: "visible",
          position: "relative",
        }}>
          {/* Fill */}
          <div
            className="anim-bar-fill"
            style={{
              position: "absolute",
              left: 0, top: 0, bottom: 0,
              width: `${fillPct}%`,
              borderRadius: "999px",
              background: met
                ? "rgba(92,224,198,0.7)"
                : "rgba(255,255,255,0.25)",
            }}
          />
          {/* Target tick */}
          <div style={{
            position: "absolute",
            top: "-5px",
            left: `${targetPct}%`,
            transform: "translateX(-50%)",
            width: "1px",
            height: "13px",
            background: met ? "rgba(92,224,198,0.5)" : "rgba(255,255,255,0.22)",
          }}/>
        </div>

        {/* Below track */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.20)", fontWeight: 400 }}>
            {card.lowerIsBetter ? "0" : "0%"}
          </span>
          <span style={{
            fontSize: "11px",
            fontWeight: 500,
            color: met ? "rgba(92,224,198,0.65)" : "rgba(255,196,100,0.70)",
          }}>
            {met ? "✓ Target met" : "Below target"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function KpiCards({ kpis }: Props) {
  const cards: Card[] = [
    {
      id:          "kpi-accuracy",
      label:       "Detection Accuracy",
      description: "Pilot average — SAR + AI",
      value:        kpis.detectionAccuracy,
      target:       0.85,
      targetLabel: "≥ 85%",
      format:      v => `${Math.round(v * 100)}%`,
    },
    {
      id:             "kpi-latency",
      label:          "Alert Latency",
      description:    "Acquisition → team notified",
      value:           kpis.avgAlertLatencyMin,
      target:          30,
      targetLabel:    "< 30 min",
      format:         v => `${v}`,
      unit:           "min",
      lowerIsBetter: true,
    },
    {
      id:          "kpi-conversion",
      label:       "Conversion Rate",
      description: "Sorbent → usable output",
      value:        kpis.conversionRate,
      target:       0.60,
      targetLabel: "≥ 60%",
      format:      v => `${Math.round(v * 100)}%`,
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
    }}>
      {cards.map(c => <MetricCard key={c.id} card={c} />)}
    </div>
  );
}
