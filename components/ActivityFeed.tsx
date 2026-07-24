"use client";

import { ActivityEntry } from "@/lib/mock-data";

type Props = { entries: ActivityEntry[] };

const COLORS: Record<ActivityEntry["type"], string> = {
  detection:  "#888",
  alert:      "#d4a017",
  dispatch:   "#888",
  collection: "#22c55e",
  conversion: "#22c55e",
  info:       "#555",
};

function timeAgo(ts: string) {
  const diff  = Date.now() - new Date(ts).getTime();
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  if (days >= 1)  return `${days}d ago`;
  if (hours >= 1) return `${hours}h ago`;
  if (mins >= 1)  return `${mins}m ago`;
  return "just now";
}

function portName(id: string) {
  return id === "baku" ? "Baku Port" : id === "sumgait" ? "Sumgait Port" : "Alyat Port";
}

export default function ActivityFeed({ entries }: Props) {
  return (
    <div>
        {entries.map((entry, i) => {
          const dotColor = COLORS[entry.type] ?? "#555";
          return (
            <div
              key={i}
              className="row-hover"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "12px 16px",
                borderBottom: i < entries.length - 1 ? "1px solid #222" : "none",
              }}
            >
              {/* Dot */}
              <div style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: dotColor,
                flexShrink: 0,
                marginTop: "5px",
              }} />

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: "#ccc", lineHeight: 1.4 }}>
                  {entry.event}
                </div>
                <div style={{ fontSize: "11px", color: "#555", marginTop: "3px" }}>
                  {portName(entry.portId)} · {timeAgo(entry.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
