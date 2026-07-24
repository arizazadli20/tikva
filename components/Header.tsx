"use client";

import { useState, useEffect } from "react";
import { Globe, ChevronDown, LayoutTemplate, Maximize, Layers, Check } from "lucide-react";
import { Port } from "@/lib/mock-data";
import StageTracker from "@/components/StageTracker";

export type LayoutMode = 'grid' | 'immersive';

type Props = {
  ports: Port[];
  selectedPort: Port;
  onPortChange: (port: Port) => void;
  layoutMode?: LayoutMode;
  onLayoutModeChange?: (mode: LayoutMode) => void;
  mapTheme?: 'dark' | 'light' | 'satellite';
  onThemeChange?: (theme: 'dark' | 'light' | 'satellite') => void;
};

function LiveStatusWidget() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);

      const opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
      setDate(d.toLocaleDateString('en-GB', opts));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: "var(--glass-bg)",
      border: "1px solid var(--glass-border)",
      borderRadius: "20px",
      padding: "4px 12px 4px 6px",
      backdropFilter: "blur(8px)"
    }}>
      <div style={{
        background: "rgba(34, 197, 94, 0.1)",
        border: "1px solid rgba(34, 197, 94, 0.2)",
        borderRadius: "16px",
        padding: "4px 8px",
        display: "flex",
        alignItems: "center",
        gap: "6px"
      }}>
        <div className="live-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-low)" }} />
        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-low)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Live</span>
      </div>
      
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
        <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{time}</span>
        <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{date} <span style={{ color: "var(--text-secondary)", opacity: 0.7 }}>UTC</span></span>
      </div>
    </div>
  );
}

export default function Header({ 
  ports, 
  selectedPort, 
  onPortChange, 
  layoutMode = 'grid', 
  onLayoutModeChange,
  mapTheme,
  onThemeChange
}: Props) {
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <header className="glass-panel" style={{
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      borderBottom: "1px solid var(--glass-border)",
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      borderRadius: 0,
      boxShadow: "none",
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(26, 29, 41, 0.6)"
    }}>
      {/* Logo */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "32px",
          height: "32px",
          background: "var(--text-primary)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--bg-base)"
        }}>
          <Globe size={18} strokeWidth={2.5} />
        </div>
        <span style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", letterSpacing: "0.05em" }}>
          PEYKGÖZ
        </span>
        <span style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "0 4px" }}>/</span>
        <span style={{ color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500 }}>Global Ops</span>
      </div>

      {/* Middle: Stepper Bar */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <StageTracker />
      </div>

      {/* Right side */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "20px" }}>
        
        {/* Layout Toggle */}
        {onLayoutModeChange && (
          <div style={{
            display: "flex",
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: "6px",
            padding: "2px"
          }}>
            <button
              onClick={() => onLayoutModeChange('grid')}
              title="Grid Layout"
              style={{
                background: layoutMode === 'grid' ? "var(--glass-border-light)" : "transparent",
                color: layoutMode === 'grid' ? "var(--text-primary)" : "var(--text-secondary)",
                border: "none",
                borderRadius: "4px",
                padding: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
              }}
            >
              <LayoutTemplate size={16} />
            </button>
            <button
              onClick={() => onLayoutModeChange('immersive')}
              title="Immersive Layout"
              style={{
                background: layoutMode === 'immersive' ? "var(--glass-border-light)" : "transparent",
                color: layoutMode === 'immersive' ? "var(--text-primary)" : "var(--text-secondary)",
                border: "none",
                borderRadius: "4px",
                padding: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
              }}
            >
              <Maximize size={16} />
            </button>
          </div>
        )}

        {/* Theme Switcher */}
        {onThemeChange && mapTheme && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              style={{
                width: "32px",
                height: "32px",
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s"
              }}
              onMouseOver={e => e.currentTarget.style.background = "var(--glass-bg-hover)"}
              onMouseOut={e => e.currentTarget.style.background = "var(--glass-bg)"}
              title="Map Layers"
            >
              <Layers size={16} />
            </button>

            {showThemeMenu && (
              <div style={{
                position: "absolute",
                top: "40px",
                right: 0,
                width: "160px",
                background: "var(--bg-base)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                padding: "4px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                zIndex: 1000
              }}>
                {[
                  { id: 'dark', label: 'Dark Map' },
                  { id: 'light', label: 'Light Map' },
                  { id: 'satellite', label: 'Satellite' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onThemeChange(t.id as any);
                      setShowThemeMenu(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      background: mapTheme === t.id ? "var(--glass-bg)" : "transparent",
                      border: "none",
                      borderRadius: "6px",
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                    onMouseOver={e => {
                      if (mapTheme !== t.id) e.currentTarget.style.background = "var(--glass-bg-hover)";
                    }}
                    onMouseOut={e => {
                      if (mapTheme !== t.id) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {t.label}
                    {mapTheme === t.id && <Check size={14} color="var(--color-low)" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Status Pill Clock */}
        <LiveStatusWidget />

        <div style={{ width: "1px", height: "24px", background: "var(--glass-border)" }} />

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
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              borderRadius: "8px",
              color: "var(--text-primary)",
              fontSize: "13px",
              fontWeight: 500,
              padding: "6px 32px 6px 12px",
              cursor: "pointer",
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              transition: "border-color 0.2s, background 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "var(--glass-bg-hover)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "var(--glass-bg)")}
          >
            {ports.map(p => (
              <option key={p.id} value={p.id} style={{ background: "var(--bg-base)" }}>
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown 
            size={14} 
            color="var(--text-secondary)" 
            style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} 
          />
        </div>
      </div>
    </header>
  );
}
