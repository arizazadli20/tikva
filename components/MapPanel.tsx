"use client";

import { useEffect, useRef, useState } from "react";
import { Detection, Port } from "@/lib/mock-data";

type Props = {
  port: Port;
  detections: Detection[];
};

function spillPolygon(det: Detection): [number, number][] {
  const r = Math.sqrt(det.areaKm2) * 0.0044;
  return [
    [det.lat + r * 0.55, det.lng - r * 0.95],
    [det.lat + r * 0.95, det.lng + r * 0.25],
    [det.lat + r * 0.30, det.lng + r * 1.05],
    [det.lat - r * 0.50, det.lng + r * 0.85],
    [det.lat - r * 0.95, det.lng - r * 0.15],
    [det.lat - r * 0.20, det.lng - r * 1.10],
  ];
}

function fmtUTC(ts: string) {
  const d = new Date(ts);
  return d.toUTCString().slice(5, 22) + " UTC";
}

function createIcon(L: any, isActive: boolean) {
  const color = isActive ? "#22c55e" : "#888";
  const size  = isActive ? 10 : 7;
  const html  = `
    <div style="position:relative;width:${size * 4}px;height:${size * 4}px;display:flex;align-items:center;justify-content:center;">
      ${isActive ? `
        <div style="
          position:absolute;top:50%;left:50%;
          width:${size * 3.5}px;height:${size * 3.5}px;
          border-radius:50%;
          border:1px solid ${color}44;
          transform:translate(-50%,-50%);
          animation:markerRing 2s ease-out infinite;
        "></div>
      ` : ""}
      <div style="
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:${color};
        border:2px solid ${isActive ? "#fff" : "#555"};
        ${isActive ? "animation:markerPulse 2s ease-out infinite;" : ""}
      "></div>
    </div>
  `;
  return L.divIcon({ html, className: "", iconSize: [size * 4, size * 4], iconAnchor: [size * 2, size * 2] });
}

function makePopup(det: Detection) {
  const conf = Math.round(det.confidenceScore * 100);
  const statusLabel = det.status.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase());
  return `
    <div style="padding:16px;font-family:Inter,-apple-system,sans-serif;min-width:240px;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:14px;">
        <div style="width:6px;height:6px;border-radius:50%;background:#22c55e;flex-shrink:0;"></div>
        <span style="font-size:12px;font-weight:600;color:#e5e5e5;">Active Spill · ${det.id.toUpperCase()}</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div>
          <div style="font-size:11px;color:#666;margin-bottom:3px;">Confidence</div>
          <div style="font-size:28px;font-weight:700;color:${conf >= 90 ? "#22c55e" : "#e5e5e5"};line-height:1;font-variant-numeric:tabular-nums;">${conf}%</div>
        </div>
        <div>
          <div style="font-size:11px;color:#666;margin-bottom:3px;">Est. Area</div>
          <div style="font-size:28px;font-weight:700;color:#e5e5e5;line-height:1;font-variant-numeric:tabular-nums;">${det.areaKm2}</div>
          <div style="font-size:11px;color:#666;">km²</div>
        </div>
      </div>

      <div style="background:#1a1a1a;border:1px solid #2e2e2e;border-radius:6px;padding:10px;margin-bottom:10px;">
        <div style="font-size:11px;color:#666;margin-bottom:3px;">Detected</div>
        <div style="font-size:12px;color:#ccc;font-family:monospace;">${fmtUTC(det.timestamp)}</div>
      </div>

      <div style="background:#0f2318;border:1px solid #1a3828;border-radius:6px;padding:10px;">
        <div style="font-size:11px;color:#4ade80;margin-bottom:2px;">Response time</div>
        <div style="font-size:13px;color:#e5e5e5;">Alert sent <strong style="color:#22c55e;">+${det.alertLatencyMin} min</strong> after image acquisition</div>
      </div>

      <div style="margin-top:10px;font-size:11px;color:#888;">Status: <span style="color:#e5e5e5;">${statusLabel}</span></div>
    </div>
  `;
}

export default function MapPanel({ port, detections }: Props) {
  const mapRef  = useRef<HTMLDivElement>(null);
  const mapInst = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const polys   = useRef<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInst.current) return;
    let mounted = true;
    import("leaflet").then(({ default: L }) => {
      if (!mounted || !mapRef.current) return;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      const map = L.map(mapRef.current!, {
        center: [port.lat, port.lng],
        zoom: 13,
        zoomControl: true,
      });
      L.tileLayer(
        "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
        { attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>', maxZoom: 19 }
      ).addTo(map);
      mapInst.current = map;
      if (mounted) setLoaded(true);
    });
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInst.current || !loaded) return;
    const map = mapInst.current;
    markers.current.forEach(m => map.removeLayer(m));
    polys.current.forEach(p   => map.removeLayer(p));
    markers.current = [];
    polys.current   = [];
    map.setView([port.lat, port.lng], 13, { animate: true, duration: 0.6 });

    import("leaflet").then(({ default: L }) => {
      detections.filter(d => d.portId === port.id).forEach((det, idx) => {
        const isActive = idx === 0;

        const poly = L.polygon(spillPolygon(det), {
          color:       isActive ? "#22c55e" : "#555",
          fillColor:   isActive ? "#22c55e" : "#333",
          fillOpacity: isActive ? 0.08 : 0.04,
          weight:      isActive ? 1.5 : 0.8,
          dashArray:   isActive ? undefined : "4 6",
        }).addTo(map);
        polys.current.push(poly);

        const marker = L.marker([det.lat, det.lng], { icon: createIcon(L, isActive) });
        marker.bindPopup(L.popup({ maxWidth: 300, minWidth: 260 }).setContent(makePopup(det)));
        marker.addTo(map);
        markers.current.push(marker);

        if (isActive) setTimeout(() => marker.openPopup(), 400);
      });
    });
  }, [port, detections, loaded]);

  return (
    <div style={{ position: "relative", borderBottom: "1px solid #2e2e2e" }}>
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          background: "#111", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        }}>
          <div className="spinner" style={{
            width: "16px", height: "16px",
            borderRadius: "50%",
            border: "2px solid #2e2e2e",
            borderTopColor: "#888",
          }}/>
          <span style={{ fontSize: "13px", color: "#666" }}>Loading map…</span>
        </div>
      )}
      <div ref={mapRef} style={{ width: "100%", height: "480px" }} />

      {/* Coords overlay */}
      <div style={{
        position: "absolute", bottom: "12px", left: "12px", zIndex: 500,
        background: "#161616",
        border: "1px solid #2e2e2e",
        borderRadius: "6px",
        padding: "6px 12px",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        fontSize: "11px",
        color: "#666",
        fontFamily: "monospace",
      }}>
        <span>{port.lat.toFixed(4)}°N</span>
        <span style={{ color: "#2e2e2e" }}>|</span>
        <span>{port.lng.toFixed(4)}°E</span>
        <span style={{ color: "#2e2e2e" }}>|</span>
        <span style={{ color: "#888" }}>Sentinel-1 SAR</span>
      </div>

      <style>{`
        @keyframes markerPulse {
          0%  { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          70% { box-shadow: 0 0 0 12px rgba(34,197,94,0); }
          100%{ box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        @keyframes markerRing {
          0%  { transform: translate(-50%,-50%) scale(1); opacity: 0.5; }
          100%{ transform: translate(-50%,-50%) scale(2.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
