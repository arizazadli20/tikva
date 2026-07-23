"use client";

import { KPIs } from "@/lib/mock-data";

type Props = { kpis: KPIs };

function Card({
  id, label, value, unit, target, targetLabel, met, fillPct
}: {
  id: string; label: string; value: string; unit?: string;
  target: string; targetLabel: string; met: boolean; fillPct: number;
}) {
  return (
    <div id={id} style={{
      background: "#1a1a1a",
      border: "1px solid #2e2e2e",
      borderRadius: "8px",
      padding: "20px",
    }}>
      {/* Label + target */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "13px", color: "#888" }}>{label}</span>
        <span style={{
          fontSize: "11px",
          color: met ? "#22c55e" : "#888",
          background: met ? "#0f2318" : "#1e1e1e",
          border: `1px solid ${met ? "#1a3828" : "#2e2e2e"}`,
          borderRadius: "4px",
          padding: "2px 7px",
        }}>
          {targetLabel}
        </span>
      </div>

      {/* Big number */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "14px" }}>
        <span style={{
          fontSize: "40px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: met ? "#e5e5e5" : "#e5e5e5",
          fontVariantNumeric: "tabular-nums",
        }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: "16px", color: "#666", fontWeight: 500 }}>{unit}</span>}
      </div>

      {/* Progress bar */}
      <div style={{ background: "#2a2a2a", borderRadius: "2px", height: "4px", overflow: "hidden" }}>
        <div
          className="bar-grow"
          style={{
            height: "100%",
            width: `${Math.min(100, fillPct)}%`,
            background: met ? "#22c55e" : "#555",
            borderRadius: "2px",
          }}
        />
      </div>
      <div style={{ marginTop: "6px", fontSize: "11px", color: met ? "#22c55e" : "#888" }}>
        {met ? "Target met" : "Below target"} · {targetLabel}
      </div>
    </div>
  );
}

export default function KpiCards({ kpis }: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
      <Card
        id="kpi-accuracy"
        label="Detection Accuracy"
        value={`${Math.round(kpis.detectionAccuracy * 100)}%`}
        target="85%"
        targetLabel="≥ 85%"
        met={kpis.detectionAccuracy >= 0.85}
        fillPct={(kpis.detectionAccuracy / 1) * 100}
      />
      <Card
        id="kpi-latency"
        label="Avg. Alert Latency"
        value={`${kpis.avgAlertLatencyMin}`}
        unit="min"
        target="30"
        targetLabel="< 30 min"
        met={kpis.avgAlertLatencyMin <= 30}
        fillPct={((30 - kpis.avgAlertLatencyMin) / 30) * 100}
      />
      <Card
        id="kpi-conversion"
        label="Conversion Rate"
        value={`${Math.round(kpis.conversionRate * 100)}%`}
        target="60%"
        targetLabel="≥ 60%"
        met={kpis.conversionRate >= 0.60}
        fillPct={(kpis.conversionRate / 1) * 100}
      />
    </div>
  );
}
