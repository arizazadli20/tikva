"use client";

import { ConversionEntry } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

type Props = { entries: ConversionEntry[] };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(12,12,15,0.95)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "14px",
      padding: "12px 16px",
      boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
      backdropFilter: "blur(24px)",
    }}>
      <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.30)", marginBottom: "8px" }}>
        {label}
      </div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginBottom: "3px" }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{p.name}</span>
          <span style={{ fontSize: "12px", fontWeight: 600, color: p.fill }}>{p.value} kg</span>
        </div>
      ))}
    </div>
  );
};

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

export default function ConversionTracker({ entries }: Props) {
  const totals = entries.reduce(
    (a, e) => ({ col: a.col + e.sorbentCollectedKg, conv: a.conv + e.convertedKg, bit: a.bit + e.bitumenModifierKg, ac: a.ac + e.activatedCarbonKg }),
    { col: 0, conv: 0, bit: 0, ac: 0 }
  );
  const pct = Math.round((totals.conv / totals.col) * 100);

  const chartData = entries.map(e => ({
    date:              fmtDate(e.date),
    "Bitumen Modifier": e.bitumenModifierKg,
    "Activated Carbon": e.activatedCarbonKg,
    "Pending":          e.sorbentCollectedKg - e.convertedKg,
  }));

  return (
    <section>
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.80)", letterSpacing: "-0.01em" }}>
          Circular Recovery
        </h2>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.30)", marginTop: "2px", fontWeight: 400 }}>
          Sorbent collected → pyrolysis outputs
        </p>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.020)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "18px",
        padding: "24px",
      }}>
        {/* Summary row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0",
          marginBottom: "24px",
          paddingBottom: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          {[
            { label: "Collected",         value: `${totals.col.toLocaleString()} kg`, color: "rgba(255,255,255,0.65)" },
            { label: "Converted",         value: `${totals.conv.toLocaleString()} kg`, color: "rgba(92,224,198,0.80)" },
            { label: "Bitumen Modifier",  value: `${totals.bit.toLocaleString()} kg`, color: "rgba(255,255,255,0.50)" },
            { label: "Activated Carbon",  value: `${totals.ac.toLocaleString()} kg`,  color: "rgba(180,180,255,0.60)" },
          ].map((s, i) => (
            <div key={s.label} style={{
              paddingLeft: i > 0 ? "20px" : 0,
              borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}>
              <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "4px" }}>
                {s.label}
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em", color: s.color, fontVariantNumeric: "tabular-nums" }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -16, bottom: 0 }} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="1 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "Inter" }}
              axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "Inter" }}
              axisLine={false}
              tickLine={false}
              unit=" kg"
              width={48}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Legend
              wrapperStyle={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)", paddingTop: "14px", fontFamily: "Inter", letterSpacing: "0.02em" }}
            />
            <Bar dataKey="Bitumen Modifier" stackId="a" fill="rgba(255,255,255,0.45)" radius={[0,0,0,0]} />
            <Bar dataKey="Activated Carbon" stackId="a" fill="rgba(140,140,255,0.50)" radius={[0,0,0,0]} />
            <Bar dataKey="Pending"          stackId="a" fill="rgba(255,255,255,0.07)" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Caption */}
        <div style={{
          marginTop: "16px",
          padding: "10px 14px",
          background: "rgba(92,224,198,0.04)",
          border: "1px solid rgba(92,224,198,0.10)",
          borderRadius: "10px",
          fontSize: "12px",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.5,
        }}>
          <span style={{ color: "rgba(92,224,198,0.75)", fontWeight: 600 }}>{totals.col.toLocaleString()} kg</span> recovered →{" "}
          <span style={{ color: "rgba(255,255,255,0.60)", fontWeight: 500 }}>{totals.bit.toLocaleString()} kg bitumen</span> +{" "}
          <span style={{ color: "rgba(180,180,255,0.70)", fontWeight: 500 }}>{totals.ac.toLocaleString()} kg activated carbon</span>{" "}
          <span style={{ color: "rgba(92,224,198,0.60)", fontWeight: 600 }}>— {pct}% conversion rate</span>
        </div>
      </div>
    </section>
  );
}
