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

function createMarkerIcon(L: any, isActive: boolean) {
  const color = "rgba(92,224,198,0.95)";
  const size  = isActive ? 12 : 7;
  const html  = `
    <div style="position:relative;width:${size * 4}px;height:${size * 4}px;display:flex;align-items:center;justify-content:center;">
      ${isActive ? `
        <div style="
          position:absolute;top:50%;left:50%;
          width:${size * 3.8}px;height:${size * 3.8}px;
          border-radius:50%;
          border:1px solid rgba(92,224,198,0.22);
          transform:translate(-50%,-50%);
          animation:markerRing 2.4s ease-out infinite;
        "></div>
        <div style="
          position:absolute;top:50%;left:50%;
          width:${size * 2.4}px;height:${size * 2.4}px;
          border-radius:50%;
          border:1px solid rgba(92,224,198,0.15);
          transform:translate(-50%,-50%);
          animation:markerRing 2.4s ease-out 0.8s infinite;
        "></div>
      ` : ""}
      <div style="
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:${color};
        border:${isActive ? "2px solid rgba(255,255,255,0.9)" : "1.5px solid rgba(255,255,255,0.6)"};
        box-shadow:0 0 0 0 rgba(92,224,198,0.5);
        ${isActive ? "animation:markerPulse 2.4s ease-out infinite;" : ""}
      "></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: "",
    iconSize:   [size * 4, size * 4],
    iconAnchor: [size * 2, size * 2],
  });
}

function popupContent(det: Detection) {
  const confidence = Math.round(det.confidenceScore * 100);
  const colorConf  = confidence >= 90 ? "rgba(92,224,198,0.9)" : "rgba(255,255,255,0.8)";

  return `
    <div style="padding:20px 22px;min-width:260px;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:7px;">
          <div style="width:6px;height:6px;border-radius:50%;background:rgba(92,224,198,0.9);"></div>
          <span style="font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(92,224,198,0.85);">Active Spill</span>
        </div>
        <span style="font-size:10px;font-weight:500;color:rgba(255,255,255,0.28);font-family:monospace;">${det.id.toUpperCase()}</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;">
        <div>
          <div style="font-size:9.5px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:4px;">Confidence</div>
          <div style="font-size:32px;font-weight:700;letter-spacing:-0.02em;color:${colorConf};line-height:1;font-variant-numeric:tabular-nums;">${confidence}%</div>
        </div>
        <div>
          <div style="font-size:9.5px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:4px;">Est. Area</div>
          <div style="font-size:32px;font-weight:700;letter-spacing:-0.02em;color:rgba(255,255,255,0.88);line-height:1;font-variant-numeric:tabular-nums;">${det.areaKm2}</div>
          <div style="font-size:10px;color:rgba(255,255,255,0.35);margin-top:1px;">km²</div>
        </div>
      </div>

      <div style="height:1px;background:rgba(255,255,255,0.06);margin-bottom:14px;"></div>

      <div style="margin-bottom:10px;">
        <div style="font-size:9.5px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:4px;">Detected</div>
        <div style="font-size:12px;font-weight:400;color:rgba(255,255,255,0.65);font-family:monospace;letter-spacing:0.02em;">${fmtUTC(det.timestamp)}</div>
      </div>

      <div style="background:rgba(92,224,198,0.06);border:1px solid rgba(92,224,198,0.14);border-radius:10px;padding:10px 12px;">
        <div style="font-size:9.5px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(92,224,198,0.65);margin-bottom:3px;">Response Time</div>
        <div style="font-size:13px;font-weight:500;color:rgba(255,255,255,0.80);">Alert dispatched <strong style="color:rgba(92,224,198,0.9);font-weight:700;">+${det.alertLatencyMin} min</strong> post-acquisition</div>
      </div>
    </div>
  `;
}

export default function MapPanel({ port, detections }: Props) {
  const mapRef     = useRef<HTMLDivElement>(null);
  const mapInst    = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polysRef   = useRef<any[]>([]);
  const [loaded, setLoaded]   = useState(false);

  // Init map once
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
        center:            [port.lat, port.lng],
        zoom:              13,
        zoomControl:       true,
        attributionControl: true,
        zoomSnap:          0.5,
      });

      // Dark, desaturated tiles
      L.tileLayer(
        "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      mapInst.current = map;
      if (mounted) setLoaded(true);
    });

    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when port/detections change
  useEffect(() => {
    if (!mapInst.current || !loaded) return;
    const map = mapInst.current;

    markersRef.current.forEach(m => map.removeLayer(m));
    polysRef.current.forEach(p  => map.removeLayer(p));
    markersRef.current = [];
    polysRef.current   = [];

    map.setView([port.lat, port.lng], 13, { animate: true, duration: 0.7 });

    import("leaflet").then(({ default: L }) => {
      const portDets = detections.filter(d => d.portId === port.id);

      portDets.forEach((det, idx) => {
        const isActive = idx === 0;

        // Polygon
        const poly = L.polygon(spillPolygon(det), {
          color:       isActive ? "rgba(92,224,198,0.6)" : "rgba(255,255,255,0.25)",
          fillColor:   isActive ? "rgba(92,224,198,1)"   : "rgba(255,255,255,1)",
          fillOpacity: isActive ? 0.07 : 0.03,
          weight:      isActive ? 1    : 0.5,
          dashArray:   isActive ? undefined : "3 6",
        }).addTo(map);
        polysRef.current.push(poly);

        // Marker
        const icon   = createMarkerIcon(L, isActive);
        const marker = L.marker([det.lat, det.lng], { icon });
        marker.bindPopup(
          L.popup({ maxWidth: 320, minWidth: 280, className: "" }).setContent(popupContent(det))
        );
        marker.addTo(map);
        markersRef.current.push(marker);

        if (isActive) setTimeout(() => marker.openPopup(), 500);
      });
    });
  }, [port, detections, loaded]);

  return (
    <section style={{ position: "relative" }}>
      {/* Loading state */}
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          background: "#0A0A0C",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "12px",
        }}>
          <div className="anim-spin" style={{
            width: "18px", height: "18px",
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.08)",
            borderTopColor: "rgba(92,224,198,0.7)",
          }}/>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>
            Loading satellite map…
          </span>
        </div>
      )}

      <div ref={mapRef} style={{ width: "100%", height: "520px" }} />

      {/* Coordinate readout — bottom-left overlay */}
      <div
        className="glass"
        style={{
          position: "absolute",
          bottom: "16px",
          left: "16px",
          zIndex: 500,
          borderRadius: "12px",
          padding: "8px 14px",
          display: "flex",
          gap: "14px",
          alignItems: "center",
        }}
      >
        {[
          { l: "Lat", v: `${port.lat.toFixed(4)}° N` },
          { l: "Lng", v: `${port.lng.toFixed(4)}° E` },
          { l: "Sensor", v: "Sentinel-1 SAR" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {i > 0 && <div style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.07)" }}/>}
            <div>
              <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>{item.l}</div>
              <div style={{ fontSize: "11px", fontWeight: 500, color: i === 2 ? "rgba(92,224,198,0.75)" : "rgba(255,255,255,0.65)", fontFamily: "monospace", marginTop: "1px" }}>{item.v}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend — bottom-right */}
      <div
        className="glass"
        style={{
          position: "absolute",
          bottom: "16px",
          right: "50px",
          zIndex: 500,
          borderRadius: "12px",
          padding: "8px 14px",
          display: "flex",
          gap: "14px",
          alignItems: "center",
        }}
      >
        {[
          { color: "rgba(92,224,198,0.85)", label: "Active detection" },
          { color: "rgba(255,255,255,0.30)", label: "Historical" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: item.color, flexShrink: 0 }}/>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.40)", fontWeight: 400 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* CSS for marker animations injected inline */}
      <style>{`
        @keyframes markerPulse {
          0%   { box-shadow: 0 0 0 0 rgba(92,224,198,0.50); }
          70%  { box-shadow: 0 0 0 16px rgba(92,224,198,0); }
          100% { box-shadow: 0 0 0 0 rgba(92,224,198,0); }
        }
        @keyframes markerRing {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(3.0); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
