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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div>
          <h2 style={{ fontSize: "13px", fontWeight: 600, color: "#e5e5e5" }}>Detection History</h2>
          <p style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>Pilot phase — all events</p>
        </div>
        <span style={{
          fontSize: "11px",
          color: "#666",
          background: "#1e1e1e",
          border: "1px solid #2e2e2e",
          borderRadius: "4px",
          padding: "3px 8px",
        }}>
          {detections.length} events
        </span>
      </div>

      <div style={{ background: "#1a1a1a", border: "1px solid #2e2e2e", borderRadius: "8px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1.2fr 90px 90px 90px 120px",
          padding: "10px 16px",
          borderBottom: "1px solid #2e2e2e",
          background: "#141414",
        }}>
          {["Date", "Port", "Confidence", "Area km²", "Alert", "Status"].map(h => (
            <span key={h} style={{ fontSize: "11px", color: "#555", fontWeight: 500 }}>{h}</span>
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
                borderBottom: i < detections.length - 1 ? "1px solid #1e1e1e" : "none",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", color: "#ccc" }}>{fmtDate(det.timestamp)}</div>
                <div style={{ fontSize: "11px", color: "#555", fontFamily: "monospace" }}>{fmtTime(det.timestamp)}</div>
              </div>

              <div style={{ fontSize: "13px", color: "#888" }}>{portName(det.portId)}</div>

              <div style={{
                fontSize: "13px",
                fontWeight: 600,
                color: conf >= 90 ? "#22c55e" : conf >= 80 ? "#ccc" : "#d4a017",
                fontVariantNumeric: "tabular-nums",
              }}>
                {conf}%
              </div>

              <div style={{ fontSize: "13px", color: "#888", fontVariantNumeric: "tabular-nums" }}>
                {det.areaKm2} km²
              </div>

              <div style={{
                fontSize: "13px",
                fontWeight: 500,
                color: det.alertLatencyMin <= 15 ? "#22c55e" : det.alertLatencyMin <= 25 ? "#888" : "#d4a017",
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
