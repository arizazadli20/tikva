"use client";

import { Detection } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Minus, ShieldAlert } from "lucide-react";

type Props = { detections: Detection[] };

function StatCard({
  id, label, value, color, sublabel, trend
}: {
  id: string; label: string; value: string | number; color: string; sublabel?: string; trend?: "up" | "down" | "flat";
}) {
  return (
    <div id={id} style={{
      padding: "12px 14px",
      borderBottom: "1px solid var(--glass-border)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100%"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
        <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </div>
        {trend === "up" && <TrendingUp size={12} color="var(--color-high)" opacity={0.8} />}
        {trend === "down" && <TrendingDown size={12} color="var(--color-low)" opacity={0.8} />}
        {trend === "flat" && <Minus size={12} color="var(--text-secondary)" opacity={0.8} />}
      </div>
      <div style={{
        fontSize: "32px",
        fontWeight: 300,
        color,
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.02em",
      }}>
        {value}
      </div>
      {sublabel && (
        <div style={{ fontSize: "10px", color: "var(--text-secondary)", marginTop: "4px", fontWeight: 500 }}>{sublabel}</div>
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
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--glass-border)" }}>
        <div style={{ borderRight: "1px solid var(--glass-border)" }}>
          <StatCard id="kpi-active"  label="Active"   value={active}   color={active > 0 ? "var(--color-high)" : "var(--color-low)"} sublabel={active > 0 ? "Needs attention" : "All clear"} trend={active > 0 ? "up" : "flat"} />
        </div>
        <div>
          <StatCard id="kpi-cleaned" label="Cleaned"  value={cleaned}  color="var(--color-low)" sublabel="collected + converted" trend="up" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid var(--glass-border)" }}>
        <div style={{ borderRight: "1px solid var(--glass-border)" }}>
          <StatCard id="kpi-high"   label="High Risk"   value={high}   color="var(--color-high)" trend="up" />
        </div>
        <div style={{ borderRight: "1px solid var(--glass-border)" }}>
          <StatCard id="kpi-medium" label="Med Risk"    value={medium} color="var(--color-med)" trend="flat" />
        </div>
        <div>
          <StatCard id="kpi-total"  label="Total Logs" value={detections.length} color="var(--text-primary)" trend="up" />
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <StatCard
          id="kpi-area"
          label="Total Spill Area"
          value={`${totalArea}`}
          color="var(--text-primary)"
          sublabel="km² cumulative impact"
          trend="down"
        />
      </div>
    </div>
  );
}
