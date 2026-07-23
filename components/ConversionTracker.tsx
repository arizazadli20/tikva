"use client";

import { ConversionEntry } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

type Props = { entries: ConversionEntry[] };

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1c1c1c",
      border: "1px solid #2e2e2e",
      borderRadius: "6px",
      padding: "10px 14px",
      fontSize: "12px",
    }}>
      <div style={{ color: "#888", marginBottom: "6px", fontWeight: 500 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: "16px", color: "#ccc", marginBottom: "2px" }}>
          <span style={{ color: "#888" }}>{p.name}</span>
          <span style={{ color: "#e5e5e5", fontWeight: 600 }}>{p.value} kg</span>
        </div>
      ))}
    </div>
  );
};

export default function ConversionTracker({ entries }: Props) {
  const totals = entries.reduce(
    (a, e) => ({ col: a.col + e.sorbentCollectedKg, conv: a.conv + e.convertedKg, bit: a.bit + e.bitumenModifierKg, ac: a.ac + e.activatedCarbonKg }),
    { col: 0, conv: 0, bit: 0, ac: 0 }
  );
  const pct = Math.round((totals.conv / totals.col) * 100);

  const data = entries.map(e => ({
    date: new Date(e.date).toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
    "Bitumen": e.bitumenModifierKg,
    "Activated Carbon": e.activatedCarbonKg,
    "Pending": e.sorbentCollectedKg - e.convertedKg,
  }));

  return (
    <div>
      <div style={{ marginBottom: "12px" }}>
        <h2 style={{ fontSize: "13px", fontWeight: 600, color: "#e5e5e5" }}>Circular Recovery</h2>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>Sorbent collected → pyrolysis outputs</p>
      </div>

      <div style={{ background: "#1a1a1a", border: "1px solid #2e2e2e", borderRadius: "8px", padding: "20px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0", marginBottom: "20px" }}>
          {[
            { l: "Collected",  v: `${totals.col.toLocaleString()} kg`, c: "#ccc" },
            { l: "Converted",  v: `${totals.conv.toLocaleString()} kg`, c: "#22c55e" },
            { l: "Bitumen",    v: `${totals.bit.toLocaleString()} kg`, c: "#ccc" },
            { l: "Activated C", v: `${totals.ac.toLocaleString()} kg`, c: "#ccc" },
          ].map((s, i) => (
            <div key={s.l} style={{ paddingLeft: i > 0 ? "16px" : 0, borderLeft: i > 0 ? "1px solid #2e2e2e" : "none" }}>
              <div style={{ fontSize: "11px", color: "#666", marginBottom: "3px" }}>{s.l}</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: s.c, fontVariantNumeric: "tabular-nums" }}>{s.v}</div>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="2 4" stroke="#222" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "#555", fontSize: 10 }} axisLine={{ stroke: "#2e2e2e" }} tickLine={false} />
            <YAxis tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} unit="kg" width={44} />
            <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#666", paddingTop: "12px" }} />
            <Bar dataKey="Bitumen"          stackId="a" fill="#3b82f6" radius={[0,0,0,0]} />
            <Bar dataKey="Activated Carbon" stackId="a" fill="#6366f1" radius={[0,0,0,0]} />
            <Bar dataKey="Pending"          stackId="a" fill="#2a2a2a" radius={[2,2,0,0]} />
          </BarChart>
        </ResponsiveContainer>

        <div style={{
          marginTop: "14px",
          fontSize: "12px",
          color: "#666",
          background: "#141414",
          border: "1px solid #2a2a2a",
          borderRadius: "6px",
          padding: "8px 12px",
        }}>
          {totals.col.toLocaleString()} kg recovered → {totals.bit.toLocaleString()} kg bitumen + {totals.ac.toLocaleString()} kg activated carbon · <span style={{ color: "#22c55e" }}>{pct}% conversion rate</span>
        </div>
      </div>
    </div>
  );
}
