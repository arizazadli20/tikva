"use client";

import { useState } from "react";
import { mockData, Port } from "@/lib/mock-data";

import Header             from "@/components/Header";
import StageTracker       from "@/components/StageTracker";
import MapPanel           from "@/components/MapPanel";
import WidgetGrid         from "@/components/WidgetGrid";
import IncidentKpiWidget  from "@/components/IncidentKpiWidget";
import RiskZoneWidget     from "@/components/RiskZoneWidget";
import VesselsWidget      from "@/components/VesselsWidget";
import ActivityFeed       from "@/components/ActivityFeed";
import ConversionTracker  from "@/components/ConversionTracker";
import HistoryTable       from "@/components/HistoryTable";

export default function Dashboard() {
  const [selectedPort, setSelectedPort] = useState<Port>(mockData.ports[0]);

  const detections = [...mockData.detections].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const activity = [...mockData.activityLog].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const widgets = [
    {
      id: "kpi",
      content: <IncidentKpiWidget detections={detections} />,
    },
    {
      id: "riskzone",
      content: <RiskZoneWidget detections={detections} />,
    },
    {
      id: "vessels",
      content: <VesselsWidget vessels={mockData.vessels} port={selectedPort} />,
    },
    {
      id: "activity",
      content: <ActivityFeed entries={activity} />,
    },
    {
      id: "conversion",
      content: <ConversionTracker entries={mockData.conversionLog} />,
    },
    {
      id: "history",
      content: <HistoryTable detections={detections} />,
    },
  ];

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#111", overflow: "hidden" }}>

      {/* ── Header ── */}
      <Header
        ports={mockData.ports}
        selectedPort={selectedPort}
        onPortChange={setSelectedPort}
      />

      {/* ── Stage tracker sub-header ── */}
      <StageTracker />

      {/* ── Main split: 1/3 map + 2/3 widget grid ── */}
      <div
        className="dashboard-split"
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* Left — Map panel (33%) */}
        <div
          className="dashboard-map-col"
          style={{
            width: "33.333%",
            flexShrink: 0,
            borderRight: "1px solid #2e2e2e",
            overflow: "hidden",
          }}
        >
          <MapPanel
            port={selectedPort}
            ports={mockData.ports}
            detections={detections}
            onPortChange={setSelectedPort}
          />
        </div>

        {/* Right — Widget grid (67%) */}
        <div
          className="dashboard-grid-col"
          style={{
            flex: 1,
            overflow: "auto",
            minWidth: 0,
          }}
        >
          <WidgetGrid widgets={widgets} />
        </div>
      </div>
    </div>
  );
}
