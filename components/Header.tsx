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
      const now = new Date();
      setTime(
        now.toUTCString().slice(17, 25) + " UTC"
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>{time}</span>
  );
}

export default function Header({ ports, selectedPort, onPortChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        height: "58px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.055)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        background: "rgba(10,10,12,0.88)",
        padding: "0 32px",
      }}
    >
      {/* ── Logo ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
        {/* Icon mark */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          <circle cx="12" cy="12" r="5" stroke="rgba(92,224,198,0.8)" strokeWidth="1.2"/>
          <circle cx="12" cy="12" r="1.5" fill="rgba(92,224,198,0.9)"/>
          <line x1="12" y1="2" x2="12" y2="6" stroke="rgba(92,224,198,0.5)" strokeWidth="1"/>
          <line x1="12" y1="18" x2="12" y2="22" stroke="rgba(92,224,198,0.5)" strokeWidth="1"/>
          <line x1="2" y1="12" x2="6" y2="12" stroke="rgba(92,224,198,0.5)" strokeWidth="1"/>
          <line x1="18" y1="12" x2="22" y2="12" stroke="rgba(92,224,198,0.5)" strokeWidth="1"/>
        </svg>
        <div>
          <div style={{
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "#FFFFFF",
          }}>
            TIKVA
          </div>
          <div style={{
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.05em",
            color: "rgba(255,255,255,0.35)",
            marginTop: "-1px",
          }}>
            Mission Control
          </div>
        </div>
      </div>

      {/* ── Right controls ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

        {/* Live badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div
            className="anim-live-dot"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "rgba(92,224,198,0.9)",
              flexShrink: 0,
            }}
          />
          <span style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "rgba(92,224,198,0.85)",
          }}>
            Live
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.08)" }} />

        {/* UTC Clock */}
        <div style={{
          fontSize: "12px",
          fontWeight: 400,
          letterSpacing: "0.03em",
          color: "rgba(255,255,255,0.40)",
          fontVariantNumeric: "tabular-nums",
        }}>
          <UTCClock />
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.08)" }} />

        {/* Port selector */}
        <div style={{ position: "relative" }}>
          <button
            id="port-selector"
            onClick={() => setOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
              color: "rgba(255,255,255,0.80)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="10" r="3"/>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
            <span style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "-0.01em" }}>
              {selectedPort.name}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.30)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                transform: open ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.2s ease",
              }}
            >
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </button>

          {open && (
            <div
              className="glass"
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                minWidth: "190px",
                borderRadius: "14px",
                overflow: "hidden",
                zIndex: 300,
              }}
            >
              {ports.map((port, i) => (
                <button
                  key={port.id}
                  id={`port-${port.id}`}
                  onClick={() => { onPortChange(port); setOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "11px 16px",
                    background: "transparent",
                    border: "none",
                    borderBottom: i < ports.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    color: selectedPort.id === port.id ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: selectedPort.id === port.id ? 500 : 400,
                    textAlign: "left",
                    letterSpacing: "-0.01em",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {port.name}
                  {selectedPort.id === port.id && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(92,224,198,0.8)" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
