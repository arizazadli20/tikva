"use client";

import { Detection } from "@/lib/mock-data";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

type Props = { detections: Detection[] };

const COLORS = {
  High:   "#ef4444",
  Medium: "#f59e0b",
  Low:    "#22c55e",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div style={{
      background: "#1c1c1c",
      border: "1px solid #2e2e2e",
      borderRadius: "6px",
      padding: "8px 12px",
      fontSize: "12px",
    }}>
      <span style={{ color: COLORS[name as keyof typeof COLORS] }}>{name} Risk</span>
      <span style={{ color: "#e5e5e5", marginLeft: "10px", fontWeight: 600 }}>{value} incident{value !== 1 ? "s" : ""}</span>
    </div>
  );
};

const CenterLabel = ({ cx, cy, total }: { cx: number; cy: number; total: number }) => (
  <g>
    <text x={cx} y={cy - 6}  textAnchor="middle" fill="#e5e5e5" fontSize={26} fontWeight={700} fontFamily="Inter, sans-serif">
      {total}
    </text>
    <text x={cx} y={cy + 12} textAnchor="middle" fill="#666"    fontSize={11} fontFamily="Inter, sans-serif">
      total
    </text>
  </g>
);

export default function RiskZoneWidget({ detections }: Props) {
  const high   = detections.filter(d => d.confidenceScore >= 0.90).length;
  const medium = detections.filter(d => d.confidenceScore >= 0.75 && d.confidenceScore < 0.90).length;
  const low    = detections.filter(d => d.confidenceScore < 0.75).length;
  const total  = detections.length;

  const data = [
    { name: "High",   value: high   },
    { name: "Medium", value: medium },
    { name: "Low",    value: low    },
  ].filter(d => d.value > 0);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "8px 4px" }}>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={78}
            paddingAngle={3}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            labelLine={false}
          >
            {data.map(entry => (
              <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {/* SVG center label */}
          <g>
            <CenterLabel cx={0} cy={0} total={total} />
          </g>
        </PieChart>
      </ResponsiveContainer>

      {/* Legend rows */}
      <div style={{ padding: "0 16px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {[
          { label: "High Risk",   count: high,   color: COLORS.High,   desc: "conf ≥ 90%" },
          { label: "Medium Risk", count: medium, color: COLORS.Medium, desc: "conf 75–89%" },
          { label: "Low Risk",    count: low,    color: COLORS.Low,    desc: "conf < 75%" },
        ].map(row => (
          <div key={row.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: row.color, flexShrink: 0 }} />
            <span style={{ fontSize: "12px", color: "#888", flex: 1 }}>{row.label}</span>
            <span style={{ fontSize: "12px", color: "#555" }}>{row.desc}</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: row.color, fontVariantNumeric: "tabular-nums", minWidth: "20px", textAlign: "right" }}>{row.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
