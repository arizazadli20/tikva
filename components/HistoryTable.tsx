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
  return new Date(ts).toUTCString().slice(17, 25) + " UTC";
}

const STATUS_MAP: Record<string, { label: string; pillClass: string }> = {
  detected:   { label: "Detected",   pillClass: "pill pill-detected" },
  alert_sent: { label: "Alert Sent", pillClass: "pill pill-alert" },
  collected:  { label: "Collected",  pillClass: "pill pill-collected" },
  converted:  { label: "Converted",  pillClass: "pill pill-converted" },
};

export default function HistoryTable({ detections }: Props) {
  return (
    <section>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
      }}>
        <div>
          <h2 style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.80)", letterSpacing: "-0.01em" }}>
            Detection History
          </h2>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.30)", marginTop: "2px", fontWeight: 400 }}>
            Pilot phase — all events
          </p>
        </div>
        <span style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
          padding: "4px 10px",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "6px",
        }}>
          {detections.length} events
        </span>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.020)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "18px",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1.3fr 90px 90px 90px 120px",
          padding: "11px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.015)",
        }}>
          {["Date / Time", "Port", "Confidence", "Area (km²)", "Alert", "Status"].map(h => (
            <span key={h} style={{
              fontSize: "9.5px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.22)",
            }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {detections.map((det, i) => {
          const conf = Math.round(det.confidenceScore * 100);
          const sm   = STATUS_MAP[det.status] ?? STATUS_MAP.detected;
          return (
            <div
              key={det.id}
              className="hover-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1.6fr 1.3fr 90px 90px 90px 120px",
                padding: "13px 20px",
                borderBottom: i < detections.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.72)", letterSpacing: "-0.01em" }}>
                  {fmtDate(det.timestamp)}
                </div>
                <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.25)", marginTop: "2px", fontFamily: "monospace" }}>
                  {fmtTime(det.timestamp)}
                </div>
              </div>

              <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)", fontWeight: 400 }}>
                {portName(det.portId)}
              </div>

              <div style={{
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: conf >= 90 ? "rgba(92,224,198,0.85)"
                     : conf >= 80 ? "rgba(255,255,255,0.75)"
                     :              "rgba(255,196,100,0.75)",
                fontVariantNumeric: "tabular-nums",
              }}>
                {conf}%
              </div>

              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums" }}>
                {det.areaKm2}
              </div>

              <div style={{
                fontSize: "13px",
                fontWeight: 600,
                color: det.alertLatencyMin <= 15 ? "rgba(92,224,198,0.80)"
                     : det.alertLatencyMin <= 25 ? "rgba(255,255,255,0.55)"
                     :                              "rgba(255,196,100,0.75)",
                fontVariantNumeric: "tabular-nums",
              }}>
                +{det.alertLatencyMin} min
              </div>

              <div>
                <span className={sm.pillClass}>{sm.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
