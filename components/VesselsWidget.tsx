"use client";

import { Vessel, Port } from "@/lib/mock-data";

type Props = {
  vessels: Vessel[];
  port: Port;
};

const STATUS_STYLES: Record<Vessel["status"], { color: string; bg: string; border: string }> = {
  "In port":     { color: "#22c55e", bg: "#0c2218", border: "#1a3828" },
  "Approaching": { color: "#f59e0b", bg: "#2d2208", border: "#3d3008" },
  "Transiting":  { color: "#888",    bg: "#1e1e1e", border: "#2e2e2e" },
};

function headingArrow(deg: number): string {
  // Unicode arrow based on heading
  const dir = Math.round(deg / 45) % 8;
  return ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"][dir];
}

export default function VesselsWidget({ vessels, port }: Props) {
  const portVessels = vessels.filter(v => v.portId === port.id);

  return (
    <div>
      {/* Header row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 60px 56px 44px 80px",
        padding: "8px 14px",
        borderBottom: "1px solid #222",
        background: "#141414",
      }}>
        {["Vessel", "Dist", "Speed", "Hdg", "Status"].map(h => (
          <span key={h} style={{ fontSize: "10px", color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {h}
          </span>
        ))}
      </div>

      {portVessels.length === 0 && (
        <div style={{ padding: "24px 14px", fontSize: "12px", color: "#555", textAlign: "center" }}>
          No vessels tracked for {port.name}
        </div>
      )}

      {portVessels.map((v, i) => {
        const st = STATUS_STYLES[v.status];
        return (
          <div
            key={v.id}
            className="row-hover"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 60px 56px 44px 80px",
              padding: "10px 14px",
              alignItems: "center",
              borderBottom: i < portVessels.length - 1 ? "1px solid #1e1e1e" : "none",
            }}
          >
            {/* Name + type */}
            <div>
              <div style={{ fontSize: "12px", color: "#ccc", fontWeight: 500 }}>{v.name}</div>
              <div style={{ fontSize: "10px", color: "#555", marginTop: "1px" }}>{v.type}</div>
            </div>

            {/* Distance */}
            <div style={{ fontSize: "12px", color: "#888", fontVariantNumeric: "tabular-nums" }}>
              {v.distanceKm.toFixed(1)}
              <span style={{ fontSize: "10px", color: "#555", marginLeft: "2px" }}>km</span>
            </div>

            {/* Speed */}
            <div style={{ fontSize: "12px", color: "#888", fontVariantNumeric: "tabular-nums" }}>
              {v.speedKnots.toFixed(1)}
              <span style={{ fontSize: "10px", color: "#555", marginLeft: "2px" }}>kts</span>
            </div>

            {/* Heading */}
            <div style={{ fontSize: "14px", color: "#666" }} title={`${v.heading}°`}>
              {headingArrow(v.heading)}
            </div>

            {/* Status pill */}
            <div>
              <span style={{
                display: "inline-block",
                fontSize: "10px",
                fontWeight: 500,
                padding: "2px 7px",
                borderRadius: "4px",
                background: st.bg,
                color: st.color,
                border: `1px solid ${st.border}`,
                whiteSpace: "nowrap",
              }}>
                {v.status}
              </span>
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div style={{
        padding: "8px 14px",
        borderTop: "1px solid #1e1e1e",
        fontSize: "10px",
        color: "#444",
        display: "flex",
        justifyContent: "space-between",
      }}>
        <span>{portVessels.length} vessel{portVessels.length !== 1 ? "s" : ""} · {port.name}</span>
        <span>AIS mock data</span>
      </div>
    </div>
  );
}
