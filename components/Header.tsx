"use client";

import { useState, useEffect } from "react";
import { Port } from "@/lib/mock-data";

type Props = {
  ports: Port[];
  selectedPort: Port;
  onPortChange: (port: Port) => void;
};

function UTCClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{time}</span>;
}

export default function Header({ ports, selectedPort, onPortChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header style={{
      height: "52px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      background: "#161616",
      borderBottom: "1px solid #2e2e2e",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{
          width: "28px",
          height: "28px",
          background: "#1e1e1e",
          border: "1px solid #2e2e2e",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: 700,
          color: "#e5e5e5",
          letterSpacing: "-0.02em",
        }}>
          T
        </div>
        <span style={{ fontWeight: 600, fontSize: "14px", color: "#e5e5e5" }}>
          TIKVA
        </span>
        <span style={{ color: "#444", fontSize: "14px", margin: "0 2px" }}>/</span>
        <span style={{ color: "#888", fontSize: "13px" }}>Mission Control</span>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

        {/* Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div className="live-dot" style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#22c55e",
          }} />
          <span style={{ fontSize: "12px", color: "#888" }}>Live</span>
        </div>

        <span style={{ color: "#2e2e2e" }}>|</span>

        {/* Clock */}
        <span style={{ fontSize: "12px", color: "#888", fontFamily: "monospace" }}>
          <UTCClock />
        </span>

        <span style={{ color: "#2e2e2e" }}>|</span>

        {/* Port selector */}
        <div style={{ position: "relative" }}>
          <select
            id="port-selector"
            value={selectedPort.id}
            onChange={e => {
              const port = ports.find(p => p.id === e.target.value);
              if (port) onPortChange(port);
            }}
            style={{
              background: "#1e1e1e",
              border: "1px solid #2e2e2e",
              borderRadius: "6px",
              color: "#e5e5e5",
              fontSize: "13px",
              padding: "5px 10px",
              cursor: "pointer",
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              paddingRight: "28px",
            }}
          >
            {ports.map(p => (
              <option key={p.id} value={p.id} style={{ background: "#1e1e1e" }}>
                {p.name}
              </option>
            ))}
          </select>
          {/* chevron */}
          <svg
            style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            width="10" height="10" viewBox="0 0 10 10" fill="none"
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </header>
  );
}
