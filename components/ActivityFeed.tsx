"use client";

import { ActivityEntry } from "@/lib/mock-data";

type Props = { entries: ActivityEntry[] };

const TYPE_CONFIG: Record<ActivityEntry["type"], { dot: string; label: string }> = {
  detection:  { dot: "rgba(255,255,255,0.80)", label: "Detection" },
  alert:      { dot: "rgba(255,196,100,0.75)", label: "Alert" },
  dispatch:   { dot: "rgba(255,255,255,0.50)", label: "Dispatch" },
  collection: { dot: "rgba(92,224,198,0.65)",  label: "Collection" },
  conversion: { dot: "rgba(92,224,198,0.85)",  label: "Conversion" },
  info:       { dot: "rgba(255,255,255,0.25)",  label: "Info" },
};

function timeAgo(ts: string) {
  const diff  = Date.now() - new Date(ts).getTime();
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days >= 1) return `${days}d ago`;
  if (hours >= 1) return `${hours}h ago`;
  return "Just now";
}

function portLabel(id: string) {
  return id === "baku" ? "Baku Port" : id === "sumgait" ? "Sumgait Port" : "Alyat Port";
}

export default function ActivityFeed({ entries }: Props) {
  return (
    <section>
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "rgba(255,255,255,0.80)",
          letterSpacing: "-0.01em",
        }}>
          Activity Log
        </h2>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.30)", marginTop: "2px", fontWeight: 400 }}>
          Reverse chronological
        </p>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.020)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "18px",
        overflow: "hidden",
      }}>
        {entries.map((entry, i) => {
          const cfg = TYPE_CONFIG[entry.type] ?? TYPE_CONFIG.info;
          return (
            <div
              key={i}
              className="hover-row"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                padding: "14px 18px",
                borderBottom: i < entries.length - 1
                  ? "1px solid rgba(255,255,255,0.045)"
                  : "none",
              }}
            >
              {/* Timeline dot + line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "4px", flexShrink: 0 }}>
                <div style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: cfg.dot,
                  flexShrink: 0,
                }}/>
                {i < entries.length - 1 && (
                  <div style={{ width: "1px", flex: 1, background: "rgba(255,255,255,0.04)", marginTop: "6px", minHeight: "10px" }}/>
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.4,
                  letterSpacing: "-0.005em",
                }}>
                  {entry.event}
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "5px",
                }}>
                  <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.22)", fontFamily: "monospace" }}>
                    {portLabel(entry.portId)}
                  </span>
                  <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.12)" }}>•</span>
                  <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.22)" }}>
                    {timeAgo(entry.timestamp)}
                  </span>
                </div>
              </div>

              {/* Type label */}
              <span style={{
                fontSize: "9.5px",
                fontWeight: 600,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: cfg.dot,
                flexShrink: 0,
                paddingTop: "3px",
                opacity: 0.85,
              }}>
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
