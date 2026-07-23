"use client";

import { useState } from "react";
import { mockData, Port } from "@/lib/mock-data";
import Header            from "@/components/Header";
import StageTracker      from "@/components/StageTracker";
import MapPanel          from "@/components/MapPanel";
import KpiCards          from "@/components/KpiCards";
import ActivityFeed      from "@/components/ActivityFeed";
import ConversionTracker from "@/components/ConversionTracker";
import HistoryTable      from "@/components/HistoryTable";

export default function Dashboard() {
  const [selectedPort, setSelectedPort] = useState<Port>(mockData.ports[0]);

  const detections = [...mockData.detections].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const activity = [...mockData.activityLog].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div style={{ minHeight: "100vh", background: "#111" }}>
      <Header
        ports={mockData.ports}
        selectedPort={selectedPort}
        onPortChange={setSelectedPort}
      />

      <StageTracker />

      <MapPanel port={selectedPort} detections={detections} />

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Section label */}
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Performance
          </h2>
        </div>

        <KpiCards kpis={mockData.kpis} />

        {/* Divider */}
        <div style={{ height: "1px", background: "#222", margin: "32px 0" }} />

        {/* Activity + Conversion */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: "20px", marginBottom: "32px" }}>
          <ActivityFeed entries={activity} />
          <ConversionTracker entries={mockData.conversionLog} />
        </div>

        <div style={{ height: "1px", background: "#222", margin: "32px 0" }} />

        <HistoryTable detections={detections} />

        {/* Footer */}
        <div style={{
          marginTop: "48px",
          paddingTop: "20px",
          borderTop: "1px solid #1e1e1e",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}>
          <span style={{ fontSize: "12px", color: "#444" }}>
            TIKVA Mission Control · Pilot Phase · Synthetic data for demonstration
          </span>
          <span style={{ fontSize: "12px", color: "#444", fontFamily: "monospace" }}>
            Data source: <code style={{ color: "#666", background: "#1a1a1a", padding: "1px 5px", borderRadius: "3px" }}>lib/mock-data.ts</code>
          </span>
        </div>
      </main>
    </div>
  );
}
