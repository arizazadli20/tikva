"use client";

import { ConversionEntry } from "@/lib/mock-data";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type Props = { entries: ConversionEntry[] };

export default function ConversionTracker({ entries }: Props) {
  const totals = entries.reduce(
    (a, e) => ({ col: a.col + e.sorbentCollectedKg, conv: a.conv + e.convertedKg, bit: a.bit + e.bitumenModifierKg, ac: a.ac + e.activatedCarbonKg }),
    { col: 0, conv: 0, bit: 0, ac: 0 }
  );
  const pct = Math.round((totals.conv / totals.col) * 100);

  const data = [
    { name: "Converted", value: pct, color: "var(--text-primary)" },
    { name: "Pending", value: 100 - pct, color: "var(--glass-border-light)" }
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "12px 16px" }}>
      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0", marginBottom: "8px", background: "var(--glass-bg)", borderRadius: "8px", padding: "10px", border: "1px solid var(--glass-border)", flexShrink: 0 }}>
        {[
          { l: "Collected",  v: `${totals.col.toLocaleString()} kg`, c: "var(--text-primary)" },
          { l: "Converted",  v: `${totals.conv.toLocaleString()} kg`, c: "var(--text-primary)" },
          { l: "Bitumen",    v: `${totals.bit.toLocaleString()} kg`, c: "var(--text-secondary)" },
          { l: "Activated C", v: `${totals.ac.toLocaleString()} kg`, c: "var(--text-secondary)" },
        ].map((s, i) => (
          <div key={s.l} style={{ paddingLeft: i > 0 ? "12px" : 0, borderLeft: i > 0 ? "1px solid var(--glass-border)" : "none" }}>
            <div style={{ fontSize: "10px", color: "var(--text-secondary)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.l}</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: s.c, fontVariantNumeric: "tabular-nums" }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Radial Gauge */}
      <div style={{ flex: 1, position: "relative", minHeight: "120px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="95%"
              startAngle={180}
              endAngle={0}
              innerRadius="75%"
              outerRadius="100%"
              dataKey="value"
              stroke="none"
              cornerRadius={4}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: "var(--bg-base)", border: "1px solid var(--glass-border)", borderRadius: "8px", color: "var(--text-primary)" }} 
              itemStyle={{ color: "var(--text-secondary)" }} 
              formatter={(val: any) => [`${val}%`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div style={{ position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{ fontSize: "38px", fontWeight: 300, color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.02em", textShadow: "0 0 16px rgba(177, 178, 181, 0.2)" }}>
            {pct}%
          </div>
          <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "6px" }}>
            Recovery Rate
          </div>
        </div>
      </div>
    </div>
  );
}
