"use client";

import { useState } from "react";
import { mockData, Port } from "@/lib/mock-data";
import Header         from "@/components/Header";
import StageTracker   from "@/components/StageTracker";
import MapPanel       from "@/components/MapPanel";
import KpiCards       from "@/components/KpiCards";
import ActivityFeed   from "@/components/ActivityFeed";
import ConversionTracker from "@/components/ConversionTracker";
import HistoryTable   from "@/components/HistoryTable";

export default function Dashboard() {
  const [selectedPort, setSelectedPort] = useState<Port>(mockData.ports[0]);

  const sortedDetections = [...mockData.detections].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const sortedActivity = [...mockData.activityLog].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>

      {/* ── Navigation ── */}
      <Header
        ports={mockData.ports}
        selectedPort={selectedPort}
        onPortChange={setSelectedPort}
      />

      {/* ── Pipeline Progress ── */}
      <StageTracker />

      {/* ── Map — edge-to-edge ── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.055)" }}>
        <MapPanel port={selectedPort} detections={sortedDetections} />
      </div>

      {/* ── Main content ── */}
      <main style={{ maxWidth: "1600px", margin: "0 auto", padding: "40px 32px 64px" }}>

        {/* KPI Cards */}
        <section style={{ marginBottom: "48px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}>
              Mission Performance
            </h2>
          </div>
          <KpiCards kpis={mockData.kpis} />
        </section>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "48px" }} />

        {/* Two-column: Activity + Conversion */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.65fr",
          gap: "24px",
          marginBottom: "48px",
        }}>
          <ActivityFeed entries={sortedActivity} />
          <ConversionTracker entries={mockData.conversionLog} />
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "48px" }} />

        {/* Detection History */}
        <HistoryTable detections={sortedDetections} />

        {/* Footer */}
        <div style={{
          marginTop: "64px",
          paddingTop: "24px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.18)", fontWeight: 400 }}>
            TIKVA Mission Control — Pilot Phase — Data is synthetic for demonstration
          </span>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.18)", fontWeight: 400, fontFamily: "monospace" }}>
            Replace{" "}
            <code style={{
              color: "rgba(92,224,198,0.45)",
              background: "rgba(92,224,198,0.05)",
              padding: "1px 5px",
              borderRadius: "4px",
            }}>
              lib/mock-data.ts
            </code>{" "}
            → live API
          </span>
        </div>
      </main>
    </div>
  );
}
