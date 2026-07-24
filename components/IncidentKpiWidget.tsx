"use client";

import { Detection } from "@/lib/mock-data";

type Props = { detections: Detection[] };

function StatCard({
  id, label, value, color, sublabel,
}: {
  id: string; label: string; value: string | number; color: string; sublabel?: string;
}) {
  return (
    <div id={id} style={{
      padding: "14px 16px",
      borderBottom: "1px solid #222",
    }}>
      <div style={{ fontSize: "11px", color: "#666", marginBottom: "6px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </div>
      <div style={{
        fontSize: "32px",
        fontWeight: 700,
        color,
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.02em",
      }}>
        {value}
      </div>
      {sublabel && (
        <div style={{ fontSize: "11px", color: "#555", marginTop: "4px" }}>{sublabel}</div>
      )}
    </div>
  );
}

export default function IncidentKpiWidget({ detections }: Props) {
  const active   = detections.filter(d => d.status === "detected" || d.status === "alert_sent").length;
  const high     = detections.filter(d => d.confidenceScore >= 0.90).length;
  const medium   = detections.filter(d => d.confidenceScore >= 0.75 && d.confidenceScore < 0.90).length;
  const cleaned  = detections.filter(d => d.status === "collected" || d.status === "converted").length;
  const totalArea = detections.reduce((sum, d) => sum + d.areaKm2, 0).toFixed(2);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #1e1e1e" }}>
        <div style={{ borderRight: "1px solid #1e1e1e" }}>
          <StatCard id="kpi-active"  label="Active"   value={active}   color={active > 0 ? "#ef4444" : "#22c55e"} sublabel={active > 0 ? "Needs attention" : "All clear"} />
        </div>
        <div>
          <StatCard id="kpi-cleaned" label="Cleaned"  value={cleaned}  color="#22c55e" sublabel="collected + converted" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #1e1e1e" }}>
        <div style={{ borderRight: "1px solid #1e1e1e" }}>
          <StatCard id="kpi-high"   label="High Risk"   value={high}   color="#ef4444" />
        </div>
        <div style={{ borderRight: "1px solid #1e1e1e" }}>
          <StatCard id="kpi-medium" label="Med Risk"    value={medium} color="#f59e0b" />
        </div>
        <div>
          <StatCard id="kpi-total"  label="Total" value={detections.length} color="#ccc" />
        </div>
      </div>

      <div>
        <StatCard
          id="kpi-area"
          label="Total Spill Area"
          value={`${totalArea}`}
          color="#ccc"
          sublabel="km² cumulative"
        />
      </div>
    </div>
  );
}
