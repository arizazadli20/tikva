"use client";

import { Detection } from "@/lib/mock-data";

type Props = { detections: Detection[] };

function portName(id: string) {
  return id === "baku" ? "Baku Port" : id === "sumgait" ? "Sumgait Port" : "Alyat Port";
}

function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtTime(ts: string) {
  const d = new Date(ts);
  const hh = String(d.getUTCHours()).padStart(2,"0");
  const mm = String(d.getUTCMinutes()).padStart(2,"0");
  return `${hh}:${mm} UTC`;
}

const STATUS: Record<string, { label: string; cls: string }> = {
  detected:   { label: "Detected",   cls: "pill pill-detected" },
  alert_sent: { label: "Alert Sent", cls: "pill pill-alert" },
  collected:  { label: "Collected",  cls: "pill pill-collected" },
  converted:  { label: "Converted",  cls: "pill pill-converted" },
};

export default function HistoryTable({ detections }: Props) {
  return (
    <div>

      <div style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "8px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1.2fr 90px 90px 90px 120px",
          padding: "10px 16px",
          borderBottom: "1px solid var(--glass-border)",
          background: "var(--bg-base)",
        }}>
          {["Date", "Port", "Confidence", "Area km²", "Alert", "Status"].map(h => (
            <span key={h} style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 500 }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {detections.map((det, i) => {
          const conf = Math.round(det.confidenceScore * 100);
          const sm   = STATUS[det.status] ?? STATUS.detected;
          return (
            <div
              key={det.id}
              className="row-hover"
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1.2fr 90px 90px 90px 120px",
                padding: "11px 16px",
                borderBottom: i < detections.length - 1 ? "1px solid var(--glass-border-light)" : "none",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", color: "var(--text-primary)" }}>{fmtDate(det.timestamp)}</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "monospace" }}>{fmtTime(det.timestamp)}</div>
              </div>

              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{portName(det.portId)}</div>

              <div style={{
                fontSize: "13px",
                fontWeight: 600,
                color: conf >= 90 ? "var(--color-low)" : conf >= 80 ? "var(--text-primary)" : "var(--color-med)",
                fontVariantNumeric: "tabular-nums",
              }}>
                {conf}%
              </div>

              <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
                {det.areaKm2} km²
              </div>

              <div style={{
                fontSize: "13px",
                fontWeight: 500,
                color: det.alertLatencyMin <= 15 ? "var(--color-low)" : det.alertLatencyMin <= 25 ? "var(--text-secondary)" : "var(--color-med)",
                fontVariantNumeric: "tabular-nums",
              }}>
                +{det.alertLatencyMin} min
              </div>

              <span className={sm.cls}>{sm.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
